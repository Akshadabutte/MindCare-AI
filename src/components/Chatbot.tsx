import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChatMessage, AgeGroup } from '../types';
import { Send, Sparkles, Languages, Check, Download, Mic, Volume2, Search, ArrowRight, Skull } from 'lucide-react';

interface ChatbotProps {
  ageGroup: AgeGroup;
  userName: string;
  language: string;
  onNavigateToSOS: () => void;
}

export default function Chatbot({ ageGroup, userName, language, onNavigateToSOS }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeLang, setActiveLang] = useState(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const presetsByAge = {
    teen: [
      'I am really stressed about high school tests.',
      'How do I handle peer bullying or fake online friends?',
      'Help me practice a 5-minute breathing break.',
      'I feel like I am letting my family down.'
    ],
    young: [
      'How can I handle severe job interview stress and career imposter feelings?',
      'I had a bad relationship breakup and feel incredibly lonely.',
      'Can you suggest general Ayurvedic diet tips for higher energy?',
      'What are the best methods to tackle post-college life burnout?'
    ],
    professional: [
      'My laptop posture is causing back and shoulder pain. Help!',
      'I feel constantly overwhelmed trying to balance family duties with work hours.',
      'Give me quick office chair stretches I can complete in 3 minutes.',
      'I feel highly reactive and angry at team challenges.'
    ],
    mature: [
      'How does Vedic philosophy view aging and peaceful acceptance?',
      'I suffer from insomnia and joints inflammation. What can help?',
      'How can I build meaningful family connection with my adult children?',
      'I want to write a personal gratitude journal today.'
    ]
  };

  useEffect(() => {
    // Initial friendly greeting message matching chosen age group
    let initialText = `Hello ${userName}! I am MindCare Mitra, your wise counseling and health guide. `;
    if (ageGroup === 'teen') {
      initialText += `Ready to tackle school tests or chill out? I'm here for you! Tell me what's bothering you, or choose a prompt below. 😊`;
    } else if (ageGroup === 'young') {
      initialText += `Let's discuss career paths, relationship stress, or physical balance. What's unfolding in your journey today?`;
    } else if (ageGroup === 'professional') {
      initialText += `Ready to decompress from screen-time stresses? Let's implement postural offsets and daily IKS wellness boundaries.`;
    } else {
      initialText += `Welcome. I am honored to walk beside you. Let's cultivate warm Santosha (contentment) and physical ease in your golden years.`;
    }

    setMessages([
      {
        id: 'init',
        role: 'model',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Check API Key immediately inside preview
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!data.hasApiKey) {
          setApiKeyError("The Gemini API Key is missing. Please add your GEMINI_API_KEY in the Secrets panel in the sidebar.");
        }
      })
      .catch(() => {});
  }, [ageGroup, userName]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          ageGroup,
          language: activeLang
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        if (data.crisisDetected) {
          // Immediately notify or escalate
          setTimeout(() => {
            onNavigateToSOS();
          }, 3500);
        }
      } else {
        throw new Error(data.error || "Failed to receive response");
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Ah, it looks like I couldn't establish a mental pathway right now. Make sure your internet is working! (Error: ${err.message || 'Server timeout'})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechInputSimulate = () => {
    setIsRecording(true);
    const recordings = {
      teen: "I feel so stressed about my final semester rankings.",
      young: "I want to resolve career confusion and feel more confident.",
      professional: "My neck is very stiff from coding all weekend.",
      mature: "How can I start a gentle morning stretching routine?"
    };

    setTimeout(() => {
      setIsRecording(false);
      setInput(recordings[ageGroup] || "Hello!");
    }, 2000);
  };

  const exportConversation = () => {
    const formatted = messages
      .map(m => `[${m.timestamp}] ${m.role === 'user' ? 'CLIENT' : 'BOT'}: ${m.text}`)
      .join('\n\n');

    const element = document.createElement("a");
    const file = new Blob([formatted], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `MindCare_Backup_${userName}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  // Chat Filter
  const filteredMessages = messages.filter(m =>
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold font-mono">
            📿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 leading-none">MindCare Mitra</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold">● Server Live</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Age Vibe Customizer: <span className="font-semibold text-slate-700 capitalize">{ageGroup}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Back key warning if any */}
          {apiKeyError && (
            <div className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg text-xs leading-none flex items-center gap-1.5 border border-amber-100 max-w-xs truncate">
              ⚠️ <span className="truncate">{apiKeyError}</span>
            </div>
          )}

          {/* Search History */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pr-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-48 text-slate-700"
            />
          </div>

          <button
            onClick={exportConversation}
            title="Export for Counselor Review"
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-650 transition"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Lang Selector */}
          <div className="flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2.5 py-1.5 rounded-xl text-xs font-medium">
            <Languages className="w-3.5 h-3.5" />
            <select
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value)}
              className="bg-transparent focus:outline-none font-sans font-medium"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredMessages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex ${isModel ? 'justify-start' : 'justify-end'} items-end gap-2`}
            >
              {isModel && (
                <div className="w-8 h-8 rounded-full bg-indigo-150 flex items-center justify-center text-sm border shadow-sm">
                  🕉️
                </div>
              )}
              <div className="max-w-[80%] pr-1">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                    isModel
                      ? 'bg-white border border-slate-100 text-slate-800 rounded-bl-none leading-relaxed whitespace-pre-line'
                      : 'bg-indigo-650 text-white rounded-br-none'
                  }`}
                >
                  {msg.text}
                </div>
                <p className={`text-[10px] mt-1 pr-1 font-mono text-slate-400 ${!isModel ? 'text-right' : ''}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-150 flex items-center justify-center text-sm border shadow-sm animate-pulse">
              🕉️
            </div>
            <div className="bg-white border border-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-bl-none text-sm shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 py-2 bg-slate-100/50 border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {presetsByAge[ageGroup].map((phrase, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(phrase)}
            className="px-3.5 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-900 text-xs border border-slate-200 text-slate-700 rounded-full transition flex items-center gap-1 focus:outline-none"
          >
            <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate max-w-xs">{phrase}</span>
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={handleSpeechInputSimulate}
          disabled={isRecording}
          className={`p-3 rounded-xl transition ${
            isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title={isRecording ? "Simulating Voice-to-text..." : "Speech to Text Input"}
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
          placeholder={isRecording ? "Listening and capturing..." : `Ask MindCare AI... (System configured for ${activeLang})`}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-sm"
        />

        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim()}
          className="p-3 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
