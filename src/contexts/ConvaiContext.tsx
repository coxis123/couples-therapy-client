import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useConvaiClient, AudioRenderer, AudioContext as ConvaiAudioContext } from '@convai/web-sdk/react';

// Configuration for the couples Convai setup
interface CouplesConvaiConfig {
  apiKey: string;
  robertCharId: string;
  lindaCharId: string;
  endUserId?: string;
}

// Shared context between the two characters
interface SharedContext {
  robertLastSaid: string;
  lindaLastSaid: string;
  lastSpeaker: 'robert' | 'linda' | null;
  therapistLastSaid: string;
}

// Message from a character
interface CharacterMessage {
  id: string;
  speaker: 'robert' | 'linda' | 'therapist';
  content: string;
  timestamp: Date;
  emotion?: string;
}

interface ConvaiContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;

  // Character states
  robertState: {
    agentState: string;
    isSpeaking: boolean;
    isReady: boolean;
  };
  lindaState: {
    agentState: string;
    isSpeaking: boolean;
    isReady: boolean;
  };

  // Messages
  messages: CharacterMessage[];
  userTranscription: string;

  // Shared context
  sharedContext: SharedContext;

  // Audio state
  currentSpeaker: 'robert' | 'linda' | null;
  isAudioMuted: boolean;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTherapistMessage: (text: string) => void;
  triggerCoupleInteraction: (speaker?: 'robert' | 'linda') => void;
  toggleMute: () => void;
  unmute: () => void;
  mute: () => void;
}

const ConvaiContext = createContext<ConvaiContextType | undefined>(undefined);

interface ConvaiProviderProps {
  children: ReactNode;
  config: CouplesConvaiConfig;
}

export function ConvaiProvider({ children, config }: ConvaiProviderProps) {
  // Shared context state
  const [sharedContext, setSharedContext] = useState<SharedContext>({
    robertLastSaid: '',
    lindaLastSaid: '',
    lastSpeaker: null,
    therapistLastSaid: '',
  });

  // Messages from both characters
  const [messages, setMessages] = useState<CharacterMessage[]>([]);

  // Current speaker for UI
  const [currentSpeaker, setCurrentSpeaker] = useState<'robert' | 'linda' | null>(null);

  // Initialize Robert's client
  const robertClient = useConvaiClient({
    apiKey: config.apiKey,
    characterId: config.robertCharId,
    endUserId: config.endUserId,
    startWithAudioOn: false,
  });

  // Initialize Linda's client
  const lindaClient = useConvaiClient({
    apiKey: config.apiKey,
    characterId: config.lindaCharId,
    endUserId: config.endUserId,
    startWithAudioOn: false,
  });

  // Track previous message counts to detect new messages
  const prevRobertMessagesRef = useRef<number>(0);
  const prevLindaMessagesRef = useRef<number>(0);

  // Note: Context sharing between characters is handled via sendUserTextMessage()
  // when triggerCoupleInteraction is called, not via automatic syncing.
  // This prevents infinite response loops.

  // Process Robert's messages
  useEffect(() => {
    const robertMessages = robertClient.chatMessages || [];
    const newMessageCount = robertMessages.length;

    if (newMessageCount > prevRobertMessagesRef.current) {
      // Get new messages
      const newMessages = robertMessages.slice(prevRobertMessagesRef.current);

      for (const msg of newMessages) {
        // Only process bot responses (LLM text)
        if (msg.type === 'bot-llm-text' && msg.content) {
          const characterMessage: CharacterMessage = {
            id: msg.id || crypto.randomUUID(),
            speaker: 'robert',
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          };

          setMessages(prev => [...prev, characterMessage]);

          // Update shared context
          setSharedContext(prev => ({
            ...prev,
            robertLastSaid: msg.content,
            lastSpeaker: 'robert',
          }));
        }
      }

      prevRobertMessagesRef.current = newMessageCount;
    }
  }, [robertClient.chatMessages]);

  // Process Linda's messages
  useEffect(() => {
    const lindaMessages = lindaClient.chatMessages || [];
    const newMessageCount = lindaMessages.length;

    if (newMessageCount > prevLindaMessagesRef.current) {
      // Get new messages
      const newMessages = lindaMessages.slice(prevLindaMessagesRef.current);

      for (const msg of newMessages) {
        // Only process bot responses (LLM text)
        if (msg.type === 'bot-llm-text' && msg.content) {
          const characterMessage: CharacterMessage = {
            id: msg.id || crypto.randomUUID(),
            speaker: 'linda',
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          };

          setMessages(prev => [...prev, characterMessage]);

          // Update shared context
          setSharedContext(prev => ({
            ...prev,
            lindaLastSaid: msg.content,
            lastSpeaker: 'linda',
          }));
        }
      }

      prevLindaMessagesRef.current = newMessageCount;
    }
  }, [lindaClient.chatMessages]);

  // Track who is currently speaking for audio queue management
  useEffect(() => {
    if (robertClient.state.isSpeaking) {
      setCurrentSpeaker('robert');
    } else if (lindaClient.state.isSpeaking) {
      setCurrentSpeaker('linda');
    } else {
      setCurrentSpeaker(null);
    }
  }, [robertClient.state.isSpeaking, lindaClient.state.isSpeaking]);

  // Connect both clients
  const connect = useCallback(async () => {
    try {
      await Promise.all([
        robertClient.connect(),
        lindaClient.connect(),
      ]);

      // Reset message counters
      prevRobertMessagesRef.current = 0;
      prevLindaMessagesRef.current = 0;
    } catch (error) {
      console.error('[Convai] Failed to connect:', error);
      throw error;
    }
  }, [robertClient, lindaClient]);

  // Disconnect both clients
  const disconnect = useCallback(async () => {
    try {
      await Promise.all([
        robertClient.disconnect(),
        lindaClient.disconnect(),
      ]);
      setMessages([]);
      setSharedContext({
        robertLastSaid: '',
        lindaLastSaid: '',
        lastSpeaker: null,
        therapistLastSaid: '',
      });
    } catch (error) {
      console.error('[Convai] Failed to disconnect:', error);
    }
  }, [robertClient, lindaClient]);

  // Send message from therapist to both characters
  const sendTherapistMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add therapist message to UI
    const therapistMessage: CharacterMessage = {
      id: crypto.randomUUID(),
      speaker: 'therapist',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, therapistMessage]);

    // Update shared context
    setSharedContext(prev => ({
      ...prev,
      therapistLastSaid: text,
    }));

    // Send to the character who should respond
    // Alternate or based on last speaker
    const targetClient = sharedContext.lastSpeaker === 'robert' ? lindaClient : robertClient;

    if (targetClient.state.isConnected) {
      targetClient.sendUserTextMessage(text);
    }
  }, [robertClient, lindaClient, sharedContext.lastSpeaker]);

  // Trigger couple interaction (one partner responds to the other)
  const triggerCoupleInteraction = useCallback((speaker?: 'robert' | 'linda') => {
    // Determine who should speak next
    let nextSpeaker = speaker;
    if (!nextSpeaker) {
      // If Robert last spoke, Linda responds, and vice versa
      nextSpeaker = sharedContext.lastSpeaker === 'robert' ? 'linda' : 'robert';
    }

    const targetClient = nextSpeaker === 'robert' ? robertClient : lindaClient;
    const partnerName = nextSpeaker === 'robert' ? 'Linda' : 'Robert';
    const partnerLastSaid = nextSpeaker === 'robert' ? sharedContext.lindaLastSaid : sharedContext.robertLastSaid;

    if (targetClient.state.isConnected && partnerLastSaid) {
      // Send context about what partner said via user message (documented API)
      const contextMessage = `[Your partner ${partnerName} just said: "${partnerLastSaid}"] How do you respond to that?`;
      targetClient.sendUserTextMessage(contextMessage);
    }
  }, [robertClient, lindaClient, sharedContext]);

  // Audio controls
  const toggleMute = useCallback(() => {
    robertClient.audioControls.toggleAudio();
    lindaClient.audioControls.toggleAudio();
  }, [robertClient, lindaClient]);

  const unmute = useCallback(() => {
    robertClient.audioControls.unmuteAudio();
    lindaClient.audioControls.unmuteAudio();
  }, [robertClient, lindaClient]);

  const mute = useCallback(() => {
    robertClient.audioControls.muteAudio();
    lindaClient.audioControls.muteAudio();
  }, [robertClient, lindaClient]);

  // Computed states
  const isConnected = robertClient.state.isConnected && lindaClient.state.isConnected;
  const isConnecting = robertClient.state.isConnecting || lindaClient.state.isConnecting;
  const isAudioMuted = robertClient.isAudioMuted && lindaClient.isAudioMuted;

  // Combined user transcription (from whichever client is capturing)
  const userTranscription = robertClient.userTranscription || lindaClient.userTranscription || '';

  const value: ConvaiContextType = {
    isConnected,
    isConnecting,
    robertState: {
      agentState: robertClient.state.agentState || 'disconnected',
      isSpeaking: robertClient.state.isSpeaking || false,
      isReady: robertClient.isBotReady || false,
    },
    lindaState: {
      agentState: lindaClient.state.agentState || 'disconnected',
      isSpeaking: lindaClient.state.isSpeaking || false,
      isReady: lindaClient.isBotReady || false,
    },
    messages,
    userTranscription,
    sharedContext,
    currentSpeaker,
    isAudioMuted,
    connect,
    disconnect,
    sendTherapistMessage,
    triggerCoupleInteraction,
    toggleMute,
    unmute,
    mute,
  };

  return (
    <ConvaiContext.Provider value={value}>
      {/* Audio renderers for both characters - CRITICAL for playback */}
      {robertClient.room && (
        <ConvaiAudioContext.Provider value={robertClient.room}>
          <AudioRenderer />
        </ConvaiAudioContext.Provider>
      )}
      {lindaClient.room && (
        <ConvaiAudioContext.Provider value={lindaClient.room}>
          <AudioRenderer />
        </ConvaiAudioContext.Provider>
      )}
      {children}
    </ConvaiContext.Provider>
  );
}

export function useConvai() {
  const context = useContext(ConvaiContext);
  if (context === undefined) {
    throw new Error('useConvai must be used within a ConvaiProvider');
  }
  return context;
}

// Export types
export type { CouplesConvaiConfig, SharedContext, CharacterMessage, ConvaiContextType };
