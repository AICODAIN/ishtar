
import React from 'react';
import { Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface CollectionsProps {
    language: Language;
    onNavigate: (path: string) => void;
}

const Collections: React.FC<CollectionsProps> = ({ language, onNavigate }) => {
    const isRTL = language === 'AR';

    // Mock Collections Data
    const collections = [
        {
            id: 'col_summer',
            title_en: 'Summer Solstice',
            title_ar: 'انقلاب الصيف',
            desc_en: 'Vibrant hues and light textures for the season.',
            desc_ar: 'ألوان نابضة بالحياة وقوام خفيف للموسم.',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600',
            link: 'timepieces' // Map to category slug for now
        },
        {
            id: 'col_eid',
            title_en: 'Eid Elegance',
            title_ar: 'أناقة العيد',
            desc_en: 'Curated looks for celebration and gathering.',
            desc_ar: 'إطلالات مختارة للاحتفال والتجمعات.',
            image: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=1600',
            link: 'jewelry'
        },
        {
            id: 'col_essentials',
            title_en: 'The Essentials',
            title_ar: 'الأساسيات',
            desc_en: 'Timeless pieces that define a wardrobe.',
            desc_ar: 'قطع خالدة تحدد خزانة الملابس.',
            image: 'https://images.unsplash.com/photo-1490481651871-32d2e7de2c9c?q=80&w=1600',
            link: 'bags'
        },
        {
            id: 'col_gifts',
            title_en: 'Gifting Suite',
            title_ar: 'جناح الهدايا',
            desc_en: 'Perfect tokens of appreciation.',
            desc_ar: 'رموز مثالية للتقدير.',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600',
            link: 'gifts'
        }
    ];

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl text-neutral-900 mb-4">{isRTL ? 'المجموعات' : 'Collections'}</h1>
                    <p className="text-neutral-500 font-light max-w-lg mx-auto">
                        {isRTL ? 'قصص منسقة بعناية لتناسب كل لحظة.' : 'Carefully curated stories for every moment.'}
                    </p>
                </div>

                <div className="space-y-24">
                    {collections.map((col, idx) => (
                        <div key={col.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                            <div className="w-full lg:w-3/5 overflow-hidden rounded-lg shadow-xl cursor-pointer" onClick={() => onNavigate(col.link)}>
                                <img 
                                    src={col.image} 
                                    alt={isRTL ? col.title_ar : col.title_en} 
                                    className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                            </div>
                            <div className="w-full lg:w-2/5 space-y-6 text-center lg:text-left">
                                <span className="text-gold-600 text-xs font-bold tracking-[0.2em] uppercase">2024</span>
                                <h2 className="font-serif text-4xl text-neutral-900">{isRTL ? col.title_ar : col.title_en}</h2>
                                <p className="text-neutral-500 font-light text-lg leading-relaxed">
                                    {isRTL ? col.desc_ar : col.desc_en}
                                </p>
                                <button 
                                    onClick={() => onNavigate(col.link)}
                                    className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-neutral-900 hover:text-gold-600 transition-colors border-b border-neutral-200 pb-1"
                                >
                                    {isRTL ? 'اكتشف المجموعة' : 'Discover Collection'} {isRTL ? <ArrowRight size={14} className="rotate-180" /> : <ArrowRight size={14} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collections;
