
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, ShoppingBag, Watch, Gem } from 'lucide-react';
import { Language, Product, Brand, Category } from '../types';
import { searchGlobal, formatPrice, getExchangeRate } from '../services/commerceService';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
    onNavigateProduct: (product: Product) => void;
    onNavigateBrand: (brand: Brand) => void;
    onNavigateCategory: (slug: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
    isOpen, onClose, language, onNavigateProduct, onNavigateBrand, onNavigateCategory 
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: Product[], brands: Brand[], categories: Category[] }>({ products: [], brands: [], categories: [] });
    const inputRef = useRef<HTMLInputElement>(null);
    const isRTL = language === 'AR';

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            setQuery('');
            setResults({ products: [], brands: [], categories: [] });
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query) {
                const res = searchGlobal(query);
                setResults(res);
            } else {
                setResults({ products: [], brands: [], categories: [] });
            }
        }, 300); // Debounce
        return () => clearTimeout(timeout);
    }, [query]);

    if (!isOpen) return null;

    const hasResults = results.products.length > 0 || results.brands.length > 0 || results.categories.length > 0;

    return (
        <div className={`fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl transition-all duration-300 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Header / Input */}
            <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-serif text-2xl text-neutral-400 italic">
                        {isRTL ? 'بحث عشتار' : 'Ishtar Search'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <X size={28} className="text-neutral-500" strokeWidth={1} />
                    </button>
                </div>
                
                <div className="relative border-b-2 border-neutral-100 focus-within:border-gold-500 transition-colors duration-500">
                    <Search className={`absolute top-4 ${isRTL ? 'right-0' : 'left-0'} text-neutral-400`} size={24} />
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder={isRTL ? "ابحث عن منتجات، ماركات، أو مجموعات..." : "Search for products, maisons, or collections..."}
                        className={`w-full bg-transparent py-4 ${isRTL ? 'pr-10' : 'pl-10'} text-3xl font-light text-neutral-900 focus:outline-none placeholder:text-neutral-300`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Area */}
            <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pb-20">
                {!query && (
                    <div className="mt-12 text-center">
                        <p className="text-neutral-400 text-sm uppercase tracking-widest mb-6">{isRTL ? 'مقترحات شائعة' : 'Popular Suggestions'}</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Rolex', 'Hermès', 'Summer Collection', 'Oud', 'Diamond Rings'].map(term => (
                                <button 
                                    key={term}
                                    onClick={() => setQuery(term)}
                                    className="px-6 py-2 border border-neutral-200 rounded-full text-sm text-neutral-600 hover:border-gold-500 hover:text-gold-600 transition-all"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {query && !hasResults && (
                    <div className="mt-20 text-center text-neutral-400">
                        <p>{isRTL ? 'لا توجد نتائج مطابقة.' : 'No results found matching your search.'}</p>
                    </div>
                )}

                {/* Categories */}
                {results.categories.length > 0 && (
                    <div className="mt-10 mb-8">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">{isRTL ? 'المجموعات' : 'Collections'}</h3>
                        <div className="flex flex-wrap gap-3">
                            {results.categories.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => { onNavigateCategory(cat.slug); onClose(); }}
                                    className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-lg hover:bg-neutral-900 hover:text-white transition-all group"
                                >
                                    <span className="font-serif italic">{isRTL ? cat.name_ar : cat.name_en}</span>
                                    <ChevronRight size={14} className={`text-neutral-300 group-hover:text-white ${isRTL ? 'rotate-180' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brands */}
                {results.brands.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">{isRTL ? 'الدور والماركات' : 'Maisons & Brands'}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {results.brands.map(brand => (
                                <button 
                                    key={brand.id}
                                    onClick={() => { onNavigateBrand(brand); onClose(); }}
                                    className="flex items-center gap-4 p-4 border border-stone-100 rounded-xl hover:border-gold-300 hover:shadow-lg transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-neutral-400 font-serif font-bold overflow-hidden">
                                        {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain p-1" /> : brand.name_en[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-neutral-900 group-hover:text-gold-600 transition-colors">{isRTL ? brand.name_ar : brand.name_en}</p>
                                        <p className="text-[10px] text-neutral-400">{brand.country}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                {results.products.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">{isRTL ? 'المنتجات' : 'Creations'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.products.map(product => (
                                <div 
                                    key={product.id} 
                                    onClick={() => { onNavigateProduct(product); onClose(); }}
                                    className="flex gap-4 p-2 cursor-pointer group hover:bg-stone-50 rounded-lg transition-colors"
                                >
                                    <div className="w-20 h-24 bg-white border border-stone-100 flex-shrink-0 overflow-hidden">
                                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mb-1">{product.brand}</p>
                                        <h4 className="font-serif text-neutral-900 mb-1 group-hover:text-gold-600 transition-colors">
                                            {isRTL && product.name_ar ? product.name_ar : product.name}
                                        </h4>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {formatPrice(product.price, product.currency as any, language === 'AR' ? 'AR' : 'EN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;
