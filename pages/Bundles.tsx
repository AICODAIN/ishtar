import React from 'react';
import { GiftBundle, Language, Currency } from '../types';
import { Gift, ArrowRight } from 'lucide-react';

interface BundlesProps {
    bundles: GiftBundle[];
    language: Language;
    currency: Currency;
    formatPrice: (price: number) => string;
}

const Bundles: React.FC<BundlesProps> = ({ bundles, language, formatPrice }) => {
    const isRTL = language === 'AR';

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-neutral-900 text-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 text-gold-500 mb-4">
                        <Gift size={24} />
                        <span className="uppercase tracking-widest text-xs font-bold">{isRTL ? 'أجنحة الهدايا' : 'Gifting Suites'}</span>
                    </div>
                    <h1 className="font-serif text-5xl">{isRTL ? 'باقات حصرية' : 'Exclusive Bundles'}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {bundles.map(bundle => (
                        <div key={bundle.id} className="relative group cursor-pointer border border-neutral-800 hover:border-gold-500/50 transition-colors bg-neutral-800/20">
                            <div className="aspect-video overflow-hidden">
                                <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-serif text-3xl">{bundle.title}</h3>
                                    <span className="text-gold-500 font-mono text-xl">{formatPrice(bundle.price)}</span>
                                </div>
                                <p className="text-neutral-400 font-light mb-8 leading-relaxed">
                                    {bundle.description}
                                </p>
                                <button className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-gold-500 transition-colors">
                                    {isRTL ? 'مشاهدة التفاصيل' : 'View Contents'} {isRTL ? <ArrowRight className="rotate-180" size={14} /> : <ArrowRight size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bundles;