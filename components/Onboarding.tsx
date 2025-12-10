
import React, { useState } from 'react';
import { Globe, Check, ArrowRight, X, MapPin } from 'lucide-react';
import { Currency, Language } from '../types';

interface OnboardingProps {
    onComplete: (lang: Language, curr: Currency) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState<Language>('EN');
    const [currency, setCurrency] = useState<Currency>('SAR');
    const [detecting, setDetecting] = useState(false);

    const handleComplete = () => {
        onComplete(language, currency);
    };

    const handleSkip = () => {
        onComplete('EN', 'SAR');
    };

    const detectLocation = () => {
        setDetecting(true);
        // Simulate detection
        setTimeout(() => {
            setDetecting(false);
            setCurrency('SAR'); // Default mock
            alert(language === 'AR' ? 'تم تحديد موقعك: السعودية' : 'Location Detected: Saudi Arabia');
        }, 1500);
    };

    const supportedCurrencies: Currency[] = ['SAR', 'AED', 'KWD', 'BHD', 'QAR', 'OMR', 'USD'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur to see the Home Screen Video behind */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-1000"></div>

            <div className="relative bg-neutral-900/80 border border-gold-500/30 text-white max-w-lg w-full p-10 rounded-2xl shadow-2xl animate-fade-in-up backdrop-blur-xl">
                
                {/* Skip Button */}
                <button 
                    onClick={handleSkip} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors text-xs uppercase tracking-widest flex items-center gap-1"
                >
                    Skip <X size={14} />
                </button>

                <div className="text-center mb-10">
                    <p className="font-serif text-4xl mb-3 tracking-[0.2em] text-gold-500">ISHTAR𒀭</p>
                    <p className="text-xs uppercase tracking-widest text-neutral-400">Luxury Personalized</p>
                </div>

                {/* Step 1: Language */}
                {step === 1 && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-serif mb-2">Select Language</h2>
                            <p className="text-neutral-400 text-sm font-light">Choose your preferred language for the boutique.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setLanguage('EN')}
                                className={`group relative p-6 border transition-all duration-300 ${language === 'EN' ? 'border-gold-500 bg-gold-500/10' : 'border-neutral-700 hover:border-neutral-500'}`}
                            >
                                <span className="text-lg font-bold block mb-1">English</span>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">International</span>
                                {language === 'EN' && <div className="absolute top-2 right-2 text-gold-500"><Check size={16} /></div>}
                            </button>
                            <button 
                                onClick={() => setLanguage('AR')}
                                className={`group relative p-6 border transition-all duration-300 ${language === 'AR' ? 'border-gold-500 bg-gold-500/10' : 'border-neutral-700 hover:border-neutral-500'}`}
                            >
                                <span className="text-xl font-serif block mb-1">العربية</span>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">الشرق الأوسط</span>
                                {language === 'AR' && <div className="absolute top-2 right-2 text-gold-500"><Check size={16} /></div>}
                            </button>
                        </div>

                        <button 
                            onClick={() => setStep(2)} 
                            className="w-full bg-white text-neutral-900 py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-gold-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
                        >
                            Next Step <ArrowRight size={14} />
                        </button>
                    </div>
                )}

                {/* Step 2: Currency & Region */}
                {step === 2 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="text-center">
                            <h2 className="text-2xl font-serif mb-2">{language === 'AR' ? 'المنطقة والعملة' : 'Regional Settings'}</h2>
                            <p className="text-neutral-400 text-sm font-light">
                                {language === 'AR' ? 'حدد عملتك المحلية لعرض الأسعار بدقة.' : 'Select your local currency for accurate pricing.'}
                            </p>
                        </div>

                        {/* Detect Location Button */}
                        <button 
                            onClick={detectLocation}
                            className="w-full border border-gold-500/50 text-gold-400 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-500/10 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            {detecting ? (
                                <span className="animate-pulse">{language === 'AR' ? 'جاري التحديد...' : 'Detecting...'}</span>
                            ) : (
                                <>
                                    <MapPin size={16} /> {language === 'AR' ? 'اكتشاف موقعي تلقائياً' : 'Detect My Location'}
                                </>
                            )}
                        </button>

                        <div className="grid grid-cols-4 gap-3">
                            {supportedCurrencies.map((curr) => (
                                <button 
                                    key={curr}
                                    onClick={() => setCurrency(curr as Currency)}
                                    className={`py-3 border transition-all duration-300 rounded ${currency === curr ? 'border-gold-500 bg-gold-500 text-neutral-900 font-bold' : 'border-neutral-700 hover:border-neutral-500 text-neutral-400'}`}
                                >
                                    <span className="block text-xs">{curr}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-neutral-800/50 p-4 rounded border border-neutral-700 flex items-center gap-4">
                            <div className="p-2 bg-gold-500/20 rounded-full text-gold-500">
                                <Globe size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-white font-bold mb-1">{language === 'AR' ? 'شحن عالمي' : 'Global Shipping'}</p>
                                <p className="text-[10px] text-neutral-400">
                                    {language === 'AR' ? 'نشحن لمنطقتك عبر DHL Express' : 'We ship to your selected region via DHL Express.'}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleComplete} 
                            className="w-full bg-gold-600 text-white py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-gold-500 transition-all duration-300 shadow-[0_0_20px_rgba(201,166,70,0.3)] rounded-sm"
                        >
                            {language === 'AR' ? 'دخول المتجر' : 'Enter Boutique'}
                        </button>
                        
                        <button onClick={() => setStep(1)} className="text-xs text-neutral-500 hover:text-white transition-colors underline w-full">
                            {language === 'AR' ? 'العودة للغة' : 'Back to Language'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
