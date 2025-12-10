
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { LiveClient } from '../services/geminiService';

interface LiveVoiceProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveVoice: React.FC<LiveVoiceProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [transcription, setTranscription] = useState<{text: string, isUser: boolean}[]>([]);
    const [barHeights, setBarHeights] = useState<number[]>(new Array(7).fill(20));
    const clientRef = useRef<LiveClient | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const visualizerInterval = useRef<number | null>(null);

    // Audio Visualizer Animation
    useEffect(() => {
        if (status === 'connected') {
            visualizerInterval.current = window.setInterval(() => {
                setBarHeights(prev => prev.map(() => Math.random() * 60 + 20));
            }, 100);
        } else {
            if (visualizerInterval.current) clearInterval(visualizerInterval.current);
            setBarHeights(new Array(7).fill(20));
        }
        return () => {
            if (visualizerInterval.current) clearInterval(visualizerInterval.current);
        };
    }, [status]);

    useEffect(() => {
        if (isOpen) {
            const init = async () => {
                try {
                    setStatus('connecting');
                    clientRef.current = new LiveClient();
                    await clientRef.current.connect((text, isUser) => {
                        setTranscription(prev => {
                            const newHistory = [...prev];
                            if (newHistory.length > 0 && newHistory[newHistory.length - 1].isUser === isUser) {
                                newHistory[newHistory.length - 1].text += text;
                            } else {
                                newHistory.push({ text, isUser });
                            }
                            return newHistory.slice(-5); // Keep last 5 turns
                        });
                    });
                    setStatus('connected');
                } catch (e) {
                    console.error(e);
                    setStatus('error');
                }
            };
            init();
        } else {
            if (clientRef.current) {
                clientRef.current.disconnect();
                clientRef.current = null;
            }
            setTranscription([]);
            setStatus('connecting');
        }

        return () => {
             if (clientRef.current) {
                clientRef.current.disconnect();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcription]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center">
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md p-8 relative overflow-hidden shadow-2xl animate-fade-in-up">
                <button onClick={onClose} className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="text-center mb-10">
                    <h3 className="font-serif text-3xl text-gold-500 mb-2">Live Stylist</h3>
                    <p className="text-neutral-400 text-sm font-light">Speak naturally. I am listening.</p>
                </div>

                {/* Audio Visualizer */}
                <div className="h-32 flex items-center justify-center mb-10 relative">
                    {status === 'connected' ? (
                         <div className="flex gap-1.5 items-center h-20">
                             {barHeights.map((h, i) => (
                                 <div 
                                    key={i} 
                                    className="w-1.5 bg-gold-500 rounded-full transition-all duration-100 ease-in-out" 
                                    style={{ height: `${h}px`, opacity: 0.8 + (h/100) * 0.2 }} 
                                 />
                             ))}
                         </div>
                    ) : (
                        <div className="text-gold-500/50 animate-pulse flex flex-col items-center gap-2">
                            <Activity size={64} strokeWidth={1} />
                            <span className="text-xs tracking-widest uppercase">Connecting...</span>
                        </div>
                    )}
                </div>

                {/* Live Transcription */}
                <div className="h-40 overflow-y-auto mb-8 space-y-4 px-4 text-center custom-scrollbar" ref={scrollRef}>
                    {transcription.map((t, i) => (
                        <p key={i} className={`text-sm leading-relaxed ${t.isUser ? 'text-neutral-500' : 'text-neutral-200 font-medium'}`}>
                            {t.text}
                        </p>
                    ))}
                    {transcription.length === 0 && status === 'connected' && (
                        <p className="text-neutral-600 italic text-xs">Try saying "Show me the latest watch trends" or "Design a red dress"</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <div className={`p-6 rounded-full transition-all duration-500 ${status === 'connected' ? 'bg-gold-600 shadow-[0_0_30px_rgba(201,166,70,0.3)]' : 'bg-neutral-800'}`}>
                         {status === 'connected' ? <Mic size={32} className="text-neutral-950" /> : <MicOff size={32} className="text-neutral-500" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveVoice;
