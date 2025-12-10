
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MapPin, Search as SearchIcon, Loader2, Volume2, BrainCircuit, Wand2, Video, Globe } from 'lucide-react';
import { generateChatResponse, generateThinkingResponse, speakText, generateLuxuryImage, generateMarketingVideo } from '../services/geminiService';
import { Message } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerMessage?: string | null;
  triggerMode?: 'stylist' | 'search' | 'design' | 'video';
  onMessageHandled?: () => void;
}

type ChatMode = 'stylist' | 'search' | 'design' | 'video';

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, triggerMessage, triggerMode, onMessageHandled }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'Bonjour. I am Ishtar, your elite personal stylist. I utilize advanced reasoning to provide deep fashion insights and curated recommendations. How may I assist you with your style today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>('stylist');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle triggered messages
  useEffect(() => {
    if (isOpen && triggerMessage && !isLoading) {
        const targetMode = triggerMode || 'stylist';
        setMode(targetMode); // Switch mode based on trigger
        processMessage(triggerMessage, targetMode);
        if (onMessageHandled) onMessageHandled();
    }
  }, [isOpen, triggerMessage, triggerMode]);

  const processMessage = async (text: string, overrideMode?: ChatMode) => {
    const activeMode = overrideMode || mode;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (activeMode === 'design') {
          // Image Generation Mode
          const imageUrl = await generateLuxuryImage(text, "1:1", "1K");
          setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              role: 'model', 
              content: "I have designed this exclusive piece for you.",
              attachment: imageUrl ? { type: 'image', url: imageUrl } : undefined
          }]);
      } else if (activeMode === 'video') {
          // Veo Video Generation Mode
          const videoUrl = await generateMarketingVideo(text, '16:9');
          setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              role: 'model', 
              content: "Here is the cinematic visualization you requested.",
              attachment: videoUrl ? { type: 'video', url: videoUrl } : undefined
          }]);
      } else if (activeMode === 'stylist') {
          // Thinking Mode (Complex Reasoning via Gemini 3 Pro)
          const response = await generateThinkingResponse(text);
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: response }]);
      } else {
          // Search/Maps Mode (Grounding)
          const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
          const useMaps = text.toLowerCase().includes('where') || text.toLowerCase().includes('store');
          const { text: responseText, urls } = await generateChatResponse(history, text, true, useMaps);
          
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'model', 
            content: responseText || "", 
            groundingUrls: urls.length > 0 ? urls : undefined 
          }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "My apologies, I encountered a momentary disruption." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    processMessage(inputValue);
    setInputValue('');
  };

  const handleSpeak = (text: string) => {
    speakText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-neutral-950 shadow-2xl z-50 flex flex-col border-l border-neutral-800 transform transition-transform duration-500">
      {/* Luxury Header */}
      <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
        <div>
          <h2 className="font-serif text-2xl text-gold-500 tracking-widest">ISHTAR𒀭</h2>
          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mt-1">Concierge AI</p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-gold-500 transition-colors">
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 p-4 bg-neutral-900 border-b border-neutral-800 overflow-x-auto hide-scrollbar">
          {[
              { id: 'stylist', icon: BrainCircuit, label: 'Stylist' },
              { id: 'search', icon: Globe, label: 'Trends' },
              { id: 'design', icon: Wand2, label: 'Design' },
              { id: 'video', icon: Video, label: 'Campaign' }
          ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as ChatMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                    mode === m.id 
                    ? 'bg-gold-500 text-neutral-950 shadow-lg shadow-gold-500/20' 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                  <m.icon size={12} /> {m.label}
              </button>
          ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-950" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gold-500 text-neutral-900 rounded-br-none' 
                : 'bg-neutral-900 text-neutral-100 border border-neutral-800 rounded-bl-none'
            }`}>
              <p className="font-light">{msg.content}</p>
              
              {/* Attachments */}
              {msg.attachment && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-neutral-700">
                      {msg.attachment.type === 'image' ? (
                          <img src={msg.attachment.url} alt="Generated" className="w-full h-auto" />
                      ) : (
                          <video src={msg.attachment.url} controls autoPlay muted loop className="w-full h-auto" />
                      )}
                  </div>
              )}

              {/* Grounding Sources */}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-3 border-t border-neutral-800/50">
                  <p className="text-[10px] uppercase tracking-wider text-gold-500 mb-2">References</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, idx) => (
                      <a key={idx} href={url.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-neutral-300 bg-neutral-800 px-3 py-1.5 rounded hover:bg-neutral-700 transition-colors">
                        {url.uri.includes('google.com/maps') ? <MapPin size={10} /> : <SearchIcon size={10} />}
                        <span className="truncate max-w-[120px]">{url.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {msg.role === 'model' && (
                <div className="flex justify-end mt-2">
                    <button onClick={() => handleSpeak(msg.content)} className="text-neutral-500 hover:text-gold-500 transition-colors">
                    <Volume2 size={14} />
                    </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 flex items-center gap-3">
                    <Loader2 className="animate-spin text-gold-500" size={18} />
                    <span className="text-xs text-neutral-400 font-serif italic tracking-wide">
                        {mode === 'stylist' ? 'Analyzing fashion trends and deep reasoning...' : 
                         mode === 'design' ? 'Sketching your vision...' : 
                         mode === 'video' ? 'Rendering cinematic preview...' : 'Consulting database...'}
                    </span>
                 </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-neutral-800 bg-neutral-950">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-600 font-light"
            placeholder={
                mode === 'stylist' ? "Ask for complex styling advice..." : 
                mode === 'design' ? "Describe a luxury item to design..." : 
                mode === 'video' ? "Describe a scene to animate..." : "Search for trends..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gold-500 rounded-full text-neutral-950 hover:bg-gold-400 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-600 transition-all"
          >
            {mode === 'stylist' ? <BrainCircuit size={18} /> : 
             mode === 'design' ? <Wand2 size={18} /> : 
             mode === 'video' ? <Video size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
