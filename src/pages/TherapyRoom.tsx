import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Phone, MessageSquare, Users,
  Send, ArrowLeft, ChevronRight, X,
  Lightbulb, Heart
} from 'lucide-react';
import { useConvai } from '../contexts/ConvaiContext';

export default function TherapyRoom() {
  const { coupleId } = useParams<{ coupleId: string }>();
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isConnecting,
    isAudioMuted,
    messages: convaiMessages,
    userTranscription,
    robertState,
    lindaState,
    currentSpeaker,
    connect,
    disconnect,
    sendTherapistMessage,
    triggerCoupleInteraction,
    toggleMute,
    unmute,
  } = useConvai();

  // Session state for UI (simplified)
  const [sessionState, setSessionState] = useState({
    phase: 'opening' as const,
    emotionalTemperature: 5,
    activeTopics: [] as string[],
    interventionCount: 0,
  });

  // Transform Convai messages to UI format
  const messages = convaiMessages.map((msg) => ({
    id: msg.id,
    actor: msg.speaker === 'therapist' ? 'trainee' as const :
           msg.speaker === 'robert' ? 'partner_a' as const : 'partner_b' as const,
    content: msg.content,
    timestamp: msg.timestamp,
    emotion: msg.emotion,
    characterName: msg.speaker === 'robert' ? 'Robert Chen' :
                   msg.speaker === 'linda' ? 'Linda Chen' : undefined,
  }));

  // Connect to Convai when the page loads
  useEffect(() => {
    if (coupleId && !sessionStarted) {
      setSessionStarted(true);
      connect().catch((err) => {
        console.error('[TherapyRoom] Failed to connect:', err);
      });
    }
  }, [coupleId, sessionStarted, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, userTranscription]);

  // Update intervention count when therapist sends a message
  useEffect(() => {
    const therapistMessages = convaiMessages.filter((m) => m.speaker === 'therapist');
    setSessionState((prev) => ({
      ...prev,
      interventionCount: therapistMessages.length,
    }));
  }, [convaiMessages]);

  const handleEndSession = async () => {
    await disconnect();
    navigate('/couples');
  };

  const handleSendText = () => {
    if (textInput.trim()) {
      sendTherapistMessage(textInput);
      setTextInput('');
    }
  };

  const handleToggleMicrophone = () => {
    if (isAudioMuted) {
      unmute();
    } else {
      toggleMute();
    }
  };

  // Determine if either character is currently speaking
  const isSomeoneSpeaking = robertState.isSpeaking || lindaState.isSpeaking;

  // Simulated audio level based on speaking state
  const audioLevel = isSomeoneSpeaking ? 0.6 : 0;

  const getPhaseClass = (phase: string) => {
    switch (phase) {
      case 'opening': return 'phase-opening';
      case 'exploration': return 'phase-exploration';
      case 'working': return 'phase-working';
      case 'closing': return 'phase-closing';
      default: return 'phase-opening';
    }
  };

  const getEmotionClass = (emotion?: string) => {
    if (!emotion) return 'emotion-neutral';
    const emotionMap: Record<string, string> = {
      happy: 'emotion-happy',
      sad: 'emotion-sad',
      angry: 'emotion-angry',
      anxious: 'emotion-anxious',
      hurt: 'emotion-hurt',
    };
    return emotionMap[emotion] || 'emotion-neutral';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-warm overflow-hidden">
      {/* Minimal Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left: Back + Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/couples')}
              className="p-2 rounded-xl bg-sanctuary-50/80 backdrop-blur-sm border border-earth-200
                         hover:bg-sanctuary-100 transition-all shadow-warm"
            >
              <ArrowLeft size={20} className="text-earth-600" />
            </button>

            <div className="px-3 py-1.5 rounded-full bg-sanctuary-50/80 backdrop-blur-sm border border-earth-200 shadow-warm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  isConnected ? 'status-connected' : isConnecting ? 'status-recording' : 'status-disconnected'
                }`} />
                <span className="text-sm text-earth-600 font-medium">
                  {isConnecting ? 'Connecting...' : isConnected ? 'Live Session' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Info toggle + End */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl bg-sanctuary-50/80 backdrop-blur-sm border border-earth-200
                         hover:bg-sanctuary-100 transition-all shadow-warm lg:hidden"
              title="Session info"
            >
              <ChevronRight size={20} className="text-earth-600" />
            </button>

            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                         bg-terracotta-50/90 backdrop-blur-sm border border-terracotta-200
                         text-terracotta-700 hover:bg-terracotta-100 transition-all shadow-warm"
            >
              <Phone size={18} />
              <span className="hidden sm:inline font-medium">End</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Conversation Area */}
      <main className="flex-1 flex overflow-hidden pt-16">
        {/* Messages Panel */}
        <div className="flex-1 flex flex-col relative">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6 pb-48">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Empty State */}
              {messages.length === 0 && isConnected && (
                <div className="text-center py-16 animate-message-appear">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-earth-100
                                  flex items-center justify-center">
                    <Heart size={32} className="text-earth-400" />
                  </div>
                  <h3 className="font-serif text-xl text-earth-700 mb-2">
                    Session Started
                  </h3>
                  <p className="text-earth-500 max-w-sm mx-auto">
                    Begin speaking or tap the microphone to start the conversation
                    with the couple.
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.actor === 'trainee' ? 'justify-end' : 'justify-start'}
                              animate-message-appear`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="max-w-[85%] sm:max-w-md">
                    {/* Actor Label */}
                    <div className={`flex items-center gap-2 mb-1.5 ${
                      message.actor === 'trainee' ? 'justify-end' : 'justify-start'
                    }`}>
                      {message.actor !== 'trainee' && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          message.actor === 'partner_a'
                            ? 'bg-speaker-partnerA-accent text-white'
                            : 'bg-speaker-partnerB-accent text-white'
                        }`}>
                          {message.actor === 'partner_a' ? 'A' : 'B'}
                        </div>
                      )}
                      <span className="text-xs font-medium text-earth-500">
                        {message.actor === 'trainee' ? 'You' :
                         message.characterName || (message.actor === 'partner_a' ? 'Partner A' : 'Partner B')}
                      </span>
                      {message.emotion && (
                        <span className={`w-2 h-2 rounded-full ${getEmotionClass(message.emotion)}`}
                              title={message.emotion} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`${
                      message.actor === 'trainee'
                        ? 'bubble-trainee'
                        : message.actor === 'partner_a'
                          ? 'bubble-partner-a'
                          : 'bubble-partner-b'
                    }`}>
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Current Transcript (Interim) */}
              {userTranscription && (
                <div className="flex justify-end animate-message-appear">
                  <div className="max-w-[85%] sm:max-w-md">
                    <div className="flex items-center gap-2 mb-1.5 justify-end">
                      <span className="text-xs font-medium text-earth-400">
                        You (speaking...)
                      </span>
                      <div className="audio-wave">
                        <span style={{ height: `${6 + audioLevel * 16}px` }} />
                        <span style={{ height: `${10 + audioLevel * 12}px` }} />
                        <span style={{ height: `${8 + audioLevel * 14}px` }} />
                      </div>
                    </div>
                    <div className="bubble-trainee opacity-70">
                      <p className="leading-relaxed italic">{userTranscription}</p>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Floating Voice Controls */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            {/* Gradient Fade */}
            <div className="h-32 bg-gradient-to-t from-sanctuary-50 via-sanctuary-50/80 to-transparent" />

            <div className="bg-sanctuary-50 pb-6 pt-2 pointer-events-auto">
              {showTextInput ? (
                /* Text Input Mode */
                <div className="max-w-xl mx-auto px-4">
                  <div className="flex items-center gap-3 bg-sanctuary-100 rounded-2xl p-2
                                  border border-earth-200 shadow-warm">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-transparent text-earth-800 placeholder-earth-400
                                 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSendText}
                      disabled={!textInput.trim()}
                      className="p-3 bg-terracotta-500 text-white rounded-xl
                                 hover:bg-terracotta-600 disabled:opacity-40
                                 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={20} />
                    </button>
                    <button
                      onClick={() => setShowTextInput(false)}
                      className="p-3 text-earth-500 hover:text-earth-700
                                 hover:bg-earth-100 rounded-xl transition-all"
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Voice Mode */
                <div className="flex items-center justify-center gap-6">
                  {/* Text Toggle */}
                  <button
                    onClick={() => setShowTextInput(true)}
                    className="p-3 rounded-xl bg-earth-100 text-earth-500
                               hover:bg-earth-200 hover:text-earth-700 transition-all"
                    title="Type instead"
                  >
                    <MessageSquare size={22} />
                  </button>

                  {/* Microphone Button */}
                  <button
                    onClick={handleToggleMicrophone}
                    className={`mic-button w-16 h-16 ${
                      isAudioMuted ? 'mic-button-idle' : 'mic-button-recording'
                    }`}
                  >
                    {isAudioMuted ? <MicOff size={28} /> : <Mic size={28} />}

                    {/* Breathing Ring */}
                    {!isAudioMuted && (
                      <div className="breathing-ring" />
                    )}

                    {/* Audio Level Ring */}
                    {!isAudioMuted && (
                      <div
                        className="absolute inset-0 rounded-full border-4 border-terracotta-400
                                   transition-all duration-100"
                        style={{
                          transform: `scale(${1 + audioLevel * 0.3})`,
                          opacity: audioLevel * 0.6
                        }}
                      />
                    )}
                  </button>

                  {/* Couple Interaction */}
                  <button
                    onClick={() => triggerCoupleInteraction()}
                    className="p-3 rounded-xl bg-earth-100 text-earth-500
                               hover:bg-earth-200 hover:text-earth-700 transition-all"
                    title="Let them talk to each other"
                  >
                    <Users size={22} />
                  </button>
                </div>
              )}

              {/* Recording Status */}
              {!isAudioMuted && !showTextInput && (
                <p className="text-center text-sm text-earth-500 mt-3 animate-pulse">
                  {isSomeoneSpeaking
                    ? `${currentSpeaker === 'robert' ? 'Robert' : 'Linda'} is speaking...`
                    : 'Listening...'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-sanctuary-50 border-l border-earth-200
                          overflow-y-auto flex-shrink-0">
          <SessionInfoPanel
            sessionState={sessionState}
            getPhaseClass={getPhaseClass}
          />
        </aside>
      </main>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="drawer-backdrop lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`drawer-panel lg:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transition: isDrawerOpen ? undefined : 'transform 0.3s ease-out' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-earth-200">
          <h2 className="font-serif text-lg font-semibold text-earth-800">
            Session Info
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-earth-100 transition-colors"
          >
            <X size={20} className="text-earth-500" />
          </button>
        </div>
        <SessionInfoPanel
          sessionState={sessionState}
          getPhaseClass={getPhaseClass}
        />
      </aside>
    </div>
  );
}

/* Session Info Panel Component */
function SessionInfoPanel({
  sessionState,
  getPhaseClass
}: {
  sessionState: {
    phase: string;
    emotionalTemperature: number;
    activeTopics: string[];
    interventionCount: number;
  };
  getPhaseClass: (phase: string) => string;
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Temperature Gauge */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-earth-600">
            Emotional Temperature
          </span>
          <span className="text-sm font-semibold text-earth-800">
            {sessionState.emotionalTemperature}/10
          </span>
        </div>
        <div className="temperature-bar">
          <div
            className="temperature-bar-fill"
            style={{ width: `${sessionState.emotionalTemperature * 10}%` }}
          />
        </div>
        <p className="text-xs text-earth-500 mt-1.5">
          {sessionState.emotionalTemperature <= 3
            ? 'Calm and regulated'
            : sessionState.emotionalTemperature <= 6
              ? 'Moderate activation'
              : 'High emotional intensity'}
        </p>
      </div>

      {/* Phase Badge */}
      <div>
        <span className="text-sm font-medium text-earth-600 block mb-2">
          Session Phase
        </span>
        <span className={`phase-badge ${getPhaseClass(sessionState.phase)}`}>
          {sessionState.phase.charAt(0).toUpperCase() + sessionState.phase.slice(1)}
        </span>
      </div>

      {/* Partner Cards */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-earth-600">The Couple</span>

        <div className="p-4 rounded-xl bg-speaker-partnerA-bg border-l-4 border-speaker-partnerA-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-speaker-partnerA-accent
                            flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-speaker-partnerA-text">Partner A</p>
              <p className="text-xs text-earth-500">Primary presenter</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-speaker-partnerB-bg border-l-4 border-speaker-partnerB-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-speaker-partnerB-accent
                            flex items-center justify-center text-white font-bold">
              B
            </div>
            <div>
              <p className="font-medium text-speaker-partnerB-text">Partner B</p>
              <p className="text-xs text-earth-500">Secondary presenter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Topics */}
      <div>
        <span className="text-sm font-medium text-earth-600 block mb-2">
          Active Topics
        </span>
        <div className="flex flex-wrap gap-2">
          {sessionState.activeTopics.length > 0 ? (
            sessionState.activeTopics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-earth-100 text-earth-600 text-xs
                           rounded-full border border-earth-200"
              >
                {topic}
              </span>
            ))
          ) : (
            <span className="text-sm text-earth-400 italic">
              Topics will appear as they emerge...
            </span>
          )}
        </div>
      </div>

      {/* Intervention Tips */}
      <div className="pt-4 border-t border-earth-200">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-terracotta-500" />
          <span className="text-sm font-medium text-earth-600">
            Intervention Tips
          </span>
        </div>
        <ul className="space-y-2 text-sm text-earth-500">
          <li className="flex items-start gap-2">
            <span className="text-terracotta-400 mt-1">•</span>
            <span>Reflect feelings before offering solutions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-terracotta-400 mt-1">•</span>
            <span>Address the speaker directly by name</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-terracotta-400 mt-1">•</span>
            <span>Use "I notice..." to share observations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-terracotta-400 mt-1">•</span>
            <span>Ask about underlying needs and fears</span>
          </li>
        </ul>
      </div>

      {/* Session Stats */}
      <div className="p-4 bg-earth-100 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-earth-500">Interventions</span>
          <span className="font-semibold text-earth-700">
            {sessionState.interventionCount}
          </span>
        </div>
      </div>
    </div>
  );
}
