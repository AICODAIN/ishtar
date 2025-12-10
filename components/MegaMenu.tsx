
import React, { useState, useEffect, useRef } from 'react';
import { Language, Brand, Product } from '../types';
import { ChevronRight, Search, Loader2, X, Watch, Gem, ShoppingBag } from 'lucide-react';
import { searchBrands } from '../services/commerceService';

interface MegaMenuProps {
  language: Language;
  onNavigate: (path: string) => void;
  closeMenu: () => void;
  activeMenu: string | null;
  onBrandClick?: (brand: Brand) => void;
  onProductClick?: (product: Product) => void;
  onWishlist?: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ 
    language, onNavigate, closeMenu, activeMenu, 
    onBrandClick, onProductClick 
}) => {
  const isRTL = language === 'AR';
  
  const [brandQuery, setBrandQuery] = useState('');
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Use a ref to track the latest query to handle race conditions
  const latestQueryRef = useRef(brandQuery);

  // Update ref whenever query changes
  useEffect(() => {
    latestQueryRef.current = brandQuery;
  }, [brandQuery]);

  // Robust Search with Debounce and Race Condition Handling
  useEffect(() => {
      if (activeMenu !== 'brands') return;

      let isMounted = true;
      
      // Define the fetch logic
      const fetchBrands = async () => {
          setIsSearching(true);
          try {
              // Simulate API Call
              const currentQ = brandQuery;
              const results = await searchBrands(currentQ);
              
              // Only update state if component is mounted AND query hasn't changed since we started
              // (This handles the "race condition" where a slow previous request finishes after a new fast one)
              if (isMounted && currentQ === latestQueryRef.current) {
                  setBrandsList(results);
              }
          } catch (e) {
              console.error("Brand search failed", e);
          } finally {
              if (isMounted && brandQuery === latestQueryRef.current) {
                  setIsSearching(false);
              }
          }
      };

      // Optimize Debounce: Instant for initial load (empty query), delayed for typing
      const timeoutDuration = brandQuery === '' ? 0 : 300;
      
      const debounceTimer = setTimeout(() => {
          fetchBrands();
      }, timeoutDuration);

      // Cleanup
      return () => {
          isMounted = false;
          clearTimeout(debounceTimer);
      };
  }, [brandQuery, activeMenu]);

  // Reset state when menu closes
  useEffect(() => {
      if (!activeMenu) {
          setBrandQuery('');
          setBrandsList([]);
          setIsSearching(false);
      }
  }, [activeMenu]);

  if (!activeMenu) return null;

  // Visual feedback: Font Normal -> Font Bold on hover.
  // The 'transform' and 'origin' props ensure it pops out towards the user.
  const listItemClass = `block py-2 px-4 -mx-4 rounded-lg text-neutral-500 hover:text-neutral-900 font-medium hover:font-bold transition-all duration-200 cursor-pointer hover:bg-stone-50 hover:shadow-sm hover:scale-105 ${isRTL ? 'origin-right' : 'origin-left'}`;

  const renderShop = () => (
    <div className="grid grid-cols-4 gap-6 p-8">
      <div>
        <h4 className="font-bold mb-4 flex items-center gap-2 select-none text-neutral-900 uppercase tracking-widest text-xs">
            <Watch size={14} className="text-gold-500" />
            {isRTL ? 'الساعات' : 'Timepieces'}
        </h4>
        <ul className="space-y-1 text-sm">
          <li className={listItemClass} onClick={() => onNavigate('timepieces')}>{isRTL ? 'الكل' : 'All Watches'}</li>
          <li className={listItemClass} onClick={() => onNavigate('luxury-watches')}>{isRTL ? 'فاخرة' : 'Luxury'}</li>
          <li className={listItemClass} onClick={() => onNavigate('womens-watches')}>{isRTL ? 'نسائية' : 'Women\'s'}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 flex items-center gap-2 select-none text-neutral-900 uppercase tracking-widest text-xs">
            <Gem size={14} className="text-gold-500" />
            {isRTL ? 'المجوهرات' : 'Jewelry'}
        </h4>
        <ul className="space-y-1 text-sm">
          <li className={listItemClass} onClick={() => onNavigate('rings')}>{isRTL ? 'خواتم' : 'Rings'}</li>
          <li className={listItemClass} onClick={() => onNavigate('bracelets')}>{isRTL ? 'أساور' : 'Bracelets'}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 flex items-center gap-2 select-none text-neutral-900 uppercase tracking-widest text-xs">
            <ShoppingBag size={14} className="text-gold-500" />
            {isRTL ? 'الحقائب' : 'Bags'}
        </h4>
        <ul className="space-y-1 text-sm">
          <li className={listItemClass} onClick={() => onNavigate('tote-bags')}>{isRTL ? 'توت' : 'Totes'}</li>
          <li className={listItemClass} onClick={() => onNavigate('clutches')}>{isRTL ? 'كلاتش' : 'Clutches'}</li>
        </ul>
      </div>
      <div 
        className="bg-stone-50 p-4 rounded-xl group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-gold-200" 
        onClick={() => onNavigate('looks')}
      >
        <h4 className="font-bold mb-2 text-gold-600 flex items-center justify-between text-xs uppercase tracking-widest">
            {isRTL ? 'مختارات' : 'Editor\'s Pick'}
            <ChevronRight size={14} className={`text-gold-400 group-hover:text-gold-600 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
        </h4>
        <div className="w-full h-32 bg-neutral-200 mb-2 overflow-hidden rounded-lg shadow-inner">
            <img src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Editor Pick" />
        </div>
        <p className="text-xs text-neutral-500 group-hover:text-neutral-900 font-medium transition-colors">{isRTL ? 'اكتشف أحدث صيحات الموسم' : 'Discover the season\'s trends.'}</p>
      </div>
    </div>
  );

  const renderBrands = () => (
    <div className="p-8">
        <div className="max-w-md mx-auto mb-8 relative">
            <input 
                type="text"
                className="w-full p-3 pl-10 border-b border-stone-300 focus:border-gold-500 focus:outline-none bg-transparent placeholder:text-stone-400 font-sans transition-colors"
                placeholder={isRTL ? "ابحث عن الماركة..." : "Search for a Maison..."}
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                autoFocus
            />
            <Search className={`absolute top-3 text-stone-400 ${isRTL ? 'right-0' : 'left-0'}`} size={20} />
            {isSearching && <Loader2 className={`absolute top-3 animate-spin text-gold-500 ${isRTL ? 'left-0' : 'right-0'}`} size={20} />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-1">
            {brandsList.map(brand => (
                <button 
                    key={brand.id}
                    onClick={() => { if(onBrandClick) onBrandClick(brand); closeMenu(); }}
                    className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all duration-300 group text-left border border-transparent hover:border-stone-100 hover:shadow-md hover:scale-[1.02]"
                >
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white border border-stone-100 flex items-center justify-center overflow-hidden shadow-sm transition-all duration-300 group-hover:border-gold-200">
                        {brand.logo ? (
                            <img 
                                src={brand.logo} 
                                alt={brand.name_en} 
                                className="w-full h-full object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" 
                            />
                        ) : (
                            <span className="font-serif font-bold text-lg text-stone-300 group-hover:text-neutral-900 transition-colors">{brand.name_en.charAt(0)}</span>
                        )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors">
                        {isRTL ? brand.name_ar : brand.name_en}
                    </span>
                </button>
            ))}
            {!isSearching && brandsList.length === 0 && (
                <div className="col-span-full text-center text-stone-400 py-12 flex flex-col items-center">
                    <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p>{isRTL ? 'لا توجد نتائج مطابقة.' : 'No maisons found matching your search.'}</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className={`absolute top-full left-0 w-full bg-white border-t border-stone-200 shadow-2xl z-50 animate-fade-in-up min-h-[400px] ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto relative min-h-[400px]">
        <button 
            onClick={closeMenu} 
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10 hover:rotate-90 duration-300 hover:scale-110`}
        >
            <X size={20} />
        </button>

        {activeMenu === 'shop' && renderShop()}
        {activeMenu === 'brands' && renderBrands()}
        {activeMenu === 'offers' && (
            <div className="flex items-center justify-center h-[400px] flex-col gap-4 text-center">
                <h2 className="text-red-600 font-serif text-4xl animate-pulse">{isRTL ? 'عروض حصرية' : 'Exclusive Offers'}</h2>
                <p className="text-neutral-500 max-w-md">{isRTL ? 'سجل دخولك لتصفح العروض الخاصة بالأعضاء.' : 'Sign in to view member-only privileges and seasonal sales.'}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
