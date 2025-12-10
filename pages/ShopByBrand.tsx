
import React, { useState, useMemo } from 'react';
import { brands } from '../data/brands';
import { Brand, Language } from '../types';
import { Search, Filter, Sparkles } from 'lucide-react';

interface ShopByBrandProps {
    language: Language;
    onBrandClick: (brand: Brand) => void;
}

type BrandCategory = 'Watches' | 'Bags' | 'Jewelry' | 'Beauty' | 'Fashion';

const ShopByBrand: React.FC<ShopByBrandProps> = ({ language, onBrandClick }) => {
    const isRTL = language === 'AR';
    const [selectedGroup, setSelectedGroup] = useState<'ALL' | 'ISHTAR' | 'LUXURY' | 'REGIONAL'>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<BrandCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesGroup = selectedGroup === 'ALL' || brand.group === selectedGroup;
            const matchesCategory = selectedCategory === 'ALL' || brand.category === selectedCategory;
            const matchesSearch = 
                brand.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                brand.name_ar.includes(searchQuery);
            return matchesGroup && matchesCategory && matchesSearch;
        });
    }, [selectedGroup, selectedCategory, searchQuery]);

    const groups = [
        { id: 'ALL', label_en: 'All Maisons', label_ar: 'كل الدور' },
        { id: 'ISHTAR', label_en: 'Ishtar Private', label_ar: 'دار عشتار' },
        { id: 'LUXURY', label_en: 'Global Luxury', label_ar: 'ماركات عالمية' },
        { id: 'REGIONAL', label_en: 'Regional & Niche', label_ar: 'ماركات إقليمية' }
    ];

    const categories: {id: BrandCategory | 'ALL', en: string, ar: string}[] = [
        { id: 'ALL', en: 'All Categories', ar: 'جميع الأقسام' },
        { id: 'Watches', en: 'Watches', ar: 'ساعات' },
        { id: 'Bags', en: 'Bags', ar: 'حقائب' },
        { id: 'Jewelry', en: 'Jewelry', ar: 'مجوهرات' },
        { id: 'Beauty', en: 'Beauty', ar: 'جمال' },
        { id: 'Fashion', en: 'Fashion', ar: 'أزياء' }
    ];

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <p className="text-gold-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{isRTL ? 'التراث والتميز' : 'Heritage & Excellence'}</p>
                    <h1 className="font-serif text-5xl text-neutral-900 mb-4">{isRTL ? 'الماركات' : 'The Maisons'}</h1>
                    <p className="text-neutral-500 font-light max-w-lg mx-auto">
                        {isRTL ? 'اكتشفي أرقى العلامات التجارية العالمية في وجهة واحدة.' : 'Discover the world\'s finest luxury brands in one exclusive destination.'}
                    </p>
                </div>

                {/* Main Filter Toolbar */}
                <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-stone-100 py-4 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        
                        {/* Groups (Top Level) */}
                        <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                            {groups.map(group => (
                                <button 
                                    key={group.id}
                                    onClick={() => setSelectedGroup(group.id as any)}
                                    className={`text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${selectedGroup === group.id ? 'text-neutral-900 border-b-2 border-gold-500 pb-1' : 'text-neutral-400 hover:text-gold-600'}`}
                                >
                                    {isRTL ? group.label_ar : group.label_en}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <input 
                                type="text" 
                                placeholder={isRTL ? "بحث عن ماركة..." : "Search brands..."}
                                className="w-full bg-stone-50 border border-stone-200 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-gold-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5 text-neutral-400`} size={16} />
                        </div>
                    </div>

                    {/* Categories (Sub Level) */}
                    <div className="flex gap-4 mt-6 overflow-x-auto hide-scrollbar pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs border transition-all whitespace-nowrap ${
                                    selectedCategory === cat.id 
                                    ? 'bg-neutral-900 text-white border-neutral-900' 
                                    : 'bg-white text-neutral-500 border-stone-200 hover:border-gold-400'
                                }`}
                            >
                                {isRTL ? cat.ar : cat.en}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredBrands.map(brand => (
                        <div 
                            key={brand.id} 
                            onClick={() => onBrandClick(brand)}
                            className={`group cursor-pointer bg-white border border-stone-100 hover:border-gold-300 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden flex flex-col items-center justify-between h-[280px] p-6`}
                        >
                            {/* Logo Area */}
                            <div className="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-radial-gradient from-stone-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                {brand.logo ? (
                                    <img 
                                        src={brand.logo} 
                                        alt={brand.name_en} 
                                        className="max-w-[120px] max-h-[80px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLElement).parentElement!.innerHTML = `<span class="font-serif text-3xl font-bold text-stone-300">${brand.name_en[0]}</span>`;
                                        }}
                                    />
                                ) : (
                                    <span className="font-serif text-4xl font-bold text-stone-300 group-hover:text-gold-600 transition-colors transform group-hover:scale-110 duration-500 inline-block">{brand.name_en[0]}</span>
                                )}
                            </div>
                            
                            {/* Info Area */}
                            <div className="w-full text-center border-t border-stone-50 pt-4 mt-2 relative">
                                <h3 className="font-serif text-lg text-neutral-900 mb-1 group-hover:text-gold-600 transition-colors">{isRTL ? brand.name_ar : brand.name_en}</h3>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-widest">{brand.category} • {brand.country}</p>
                                {brand.group === 'ISHTAR' && (
                                    <div className="absolute -top-10 right-0 bg-gold-500 text-white p-1 rounded-full shadow-lg">
                                        <Sparkles size={12} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBrands.length === 0 && (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-400">
                            <Filter size={24} />
                        </div>
                        <p className="text-neutral-400 font-light text-lg">
                            {isRTL ? 'لم يتم العثور على ماركات مطابقة.' : 'No maisons found matching your criteria.'}
                        </p>
                        <button 
                            onClick={() => { setSelectedGroup('ALL'); setSelectedCategory('ALL'); setSearchQuery(''); }}
                            className="mt-4 text-gold-600 underline text-sm hover:text-gold-700"
                        >
                            {isRTL ? 'عرض الكل' : 'View All Brands'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopByBrand;
