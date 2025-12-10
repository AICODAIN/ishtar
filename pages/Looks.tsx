import React from 'react';
import { Look, Product, Language } from '../types';

interface LooksProps {
    looks: Look[];
    products: Product[]; // Needed to resolve product IDs in looks
    language: Language;
    onProductClick: (product: Product) => void;
}

const Looks: React.FC<LooksProps> = ({ looks, products, language, onProductClick }) => {
    const isRTL = language === 'AR';

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-gold-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{isRTL ? 'مختاراتنا' : 'Curated by Ishtar'}</p>
                    <h1 className="font-serif text-5xl text-neutral-900">{isRTL ? 'إطلالات الموسم' : 'The Lookbook'}</h1>
                </div>

                <div className="space-y-24">
                    {looks.map((look, idx) => (
                        <div key={look.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                            <div className="w-full lg:w-1/2 relative group overflow-hidden shadow-2xl">
                                <img src={look.image} alt={look.title} className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="text-center lg:text-left">
                                    <span className="bg-neutral-900 text-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold mb-4 inline-block">{look.occasion}</span>
                                    <h2 className="font-serif text-4xl text-neutral-900 mb-4">{look.title}</h2>
                                    <p className="text-neutral-500 font-light max-w-md mx-auto lg:mx-0">
                                        {isRTL ? 'إطلالة متكاملة مختارة بعناية لتناسب أرقى المناسبات.' : 'A complete ensemble curated for the most exclusive occasions, featuring harmonious textures and tones.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {look.products.map(pid => {
                                        const p = products.find(prod => prod.id === pid);
                                        if(!p) return null;
                                        return (
                                            <div key={pid} className="group cursor-pointer" onClick={() => onProductClick(p)}>
                                                <div className="aspect-square bg-white mb-2 overflow-hidden border border-stone-100">
                                                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] uppercase font-bold text-neutral-400">{p.brand}</p>
                                                    <p className="font-serif text-sm truncate">{isRTL && p.name_ar ? p.name_ar : p.name}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Looks;