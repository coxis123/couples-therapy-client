import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useWebSocket, WebSocketMessage } from '../hooks/useWebSocket';
import { useVoice } from '../hooks/useVoice';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  actor: 'trainee' | 'partner_a' | 'partner_b' | 'system';
  content: string;
  timestamp: Date;
  emotion?: string;
  isInterim?: boolean;
  characterName?: string; // Actual name of the character (e.g., "Robert Chen")
}

interface SessionState {
  phase: 'opening' | 'exploration' | 'working' | 'closing';
  emotionalTemperature: number;
  activeTopics: string[];
  lastSpeaker: string | null;
  interventionCount: number;
}

interface SessionContextType {
  // Session state
  sessionId: string | null;
  isSessionActive: boolean;
  sessionState: SessionState;
  messages: Message[];
  
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  
  // Voice state
  isRecording: boolean;
  isMuted: boolean;
  audioLevel: number;
  
  // Current transcript (interim)
  currentTranscript: string;
  
  // Actions
  startSession: (coupleId: string) => Promise<void>;
  endSession: () => Promise<void>;
  sendTextMessage: (text: string) => void;
  toggleMicrophone: () => void;
  triggerCoupleInteraction: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [sessionState, setSessionState] = useState<SessionState>({
    phase: 'opening',
    emotionalTemperature: 5,
    activeTopics: [],
    lastSpeaker: null,
    interventionCount: 0,
  });

  // Ref to track pending session that needs to be started once WebSocket connects
  const pendingSessionRef = useRef<string | null>(null);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'session_ready':
        setIsSessionActive(true);
        break;
        
      case 'transcript':
        if (message.isFinal) {
          // Final transcript - add to messages
          if (message.text.trim()) {
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              actor: 'trainee',
              content: message.text,
              timestamp: new Date(),
            }]);
          }
          setCurrentTranscript('');
        } else {
          // Interim transcript
          setCurrentTranscript(message.text);
        }
        break;
        
      case 'agent_response':
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          actor: message.characterId?.includes('partner-a') ? 'partner_a' : 'partner_b',
          content: message.text,
          timestamp: new Date(),
          emotion: message.emotion,
          characterName: message.characterName, // Store actual name from server
        }]);
        
        // Update session state
        setSessionState(prev => ({
          ...prev,
          lastSpeaker: message.characterName,
          interventionCount: prev.interventionCount + 1,
        }));
        break;
        
      case 'session_state':
        setSessionState(prev => ({ ...prev, ...message.state }));
        break;
        
      case 'error':
        console.error('[Session] Error:', message.message);
        break;
    }
  }, []);

  // WebSocket connection
  const wsUrl = import.meta.env.VITE_WS_URL
    ? `${import.meta.env.VITE_WS_URL}/ws`
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
  const {
    isConnected,
    isConnecting,
    sendMessage: wsSendMessage,
    sendBinary,
    connect: wsConnect,
    disconnect: wsDisconnect,
  } = useWebSocket(wsUrl, {
    onMessage: handleWebSocketMessage,
    autoConnect: false,
  });

  // Voice handling
  const {
    isRecording,
    isMuted,
    audioLevel,
    startRecording,
    stopRecording,
    toggleMute,
  } = useVoice({
    onAudioData: (data) => {
      if (isConnected && !isMuted) {
        sendBinary(data);
      }
    },
  });

  // Effect to send session_start when WebSocket connects (fixes timing issue)
  useEffect(() => {
    if (isConnected && pendingSessionRef.current) {
      console.log('[Session] WebSocket connected, sending session_start for:', pendingSessionRef.current);
      wsSendMessage({
        type: 'session_start',
        sessionId: pendingSessionRef.current,
      });
      startRecording();
      pendingSessionRef.current = null; // Clear pending session
    }
  }, [isConnected, wsSendMessage, startRecording]);

  // Start a new therapy session
  const startSession = useCallback(async (coupleId: string) => {
    try {
      // Create session via REST API
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: user?.id || 'anonymous',
          coupleId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const session = await response.json();
      setSessionId(session.id);
      setMessages([]);
      setCurrentTranscript('');

      // Store session ID for when WebSocket connects
      pendingSessionRef.current = session.id;
      console.log('[Session] Created session, connecting WebSocket:', session.id);

      // Connect WebSocket - useEffect will send session_start when connected
      wsConnect();
    } catch (error) {
      console.error('[Session] Failed to start:', error);
      throw error;
    }
  }, [user, wsConnect]);

  // End the current session
  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      // Stop recording
      stopRecording();

      // Notify server
      wsSendMessage({ type: 'session_end' });

      // End session via REST API
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await fetch(`${apiUrl}/api/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcomes: {
            summary: 'Session completed',
          },
        }),
      });

      // Clean up
      wsDisconnect();
      setSessionId(null);
      setIsSessionActive(false);
    } catch (error) {
      console.error('[Session] Failed to end:', error);
    }
  }, [sessionId, stopRecording, wsSendMessage, wsDisconnect]);

  // Send a text message (for typing instead of speaking)
  const sendTextMessage = useCallback((text: string) => {
    if (!isConnected || !text.trim()) return;

    // Add to messages immediately
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      actor: 'trainee',
      content: text,
      timestamp: new Date(),
    }]);

    // Send via WebSocket
    wsSendMessage({
      type: 'text_message',
      text,
    });
  }, [isConnected, wsSendMessage]);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  // Trigger couple interaction (let them talk to each other)
  const triggerCoupleInteraction = useCallback(() => {
    if (!isConnected) return;
    
    wsSendMessage({
      type: 'trigger',
      trigger: 'couple_interaction',
    });
  }, [isConnected, wsSendMessage]);

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        isSessionActive,
        sessionState,
        messages,
        isConnected,
        isConnecting,
        isRecording,
        isMuted,
        audioLevel,
        currentTranscript,
        startSession,
        endSession,
        sendTextMessage,
        toggleMicrophone,
        triggerCoupleInteraction,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
