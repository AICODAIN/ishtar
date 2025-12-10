
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronDown, Search, ChevronRight, Watch, SlidersHorizontal, ArrowDown, ArrowUp, Droplets } from 'lucide-react';
import { products as coreProducts } from '../data/products';
import { categories } from '../data/categories';
import { Product, Language } from '../types';

interface CatalogProps {
  initialCategory?: string | null;
  onProductClick: (product: Product) => void;
  language: Language;
}

const Catalog: React.FC<CatalogProps> = ({ initialCategory, onProductClick, language }) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategory || 'all');
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  
  // Watch Specific Filters
  const [watchMovement, setWatchMovement] = useState<string>('All');
  const [watchMaterial, setWatchMaterial] = useState<string>('All');
  const [watchWater, setWatchWater] = useState<string>('All');

  const isRTL = language === 'AR';
  
  // Sync prop to state when navigation changes from outside
  useEffect(() => {
      if (initialCategory) {
          setSelectedCategorySlug(initialCategory);
          setSelectedSubCategorySlug('all');
      }
  }, [initialCategory]);

  const rootCategories = categories.filter(c => c.parent_id === null);
  const currentRootCategory = categories.find(c => c.slug === selectedCategorySlug);
  const subCategories = currentRootCategory 
    ? categories.filter(c => c.parent_id === currentRootCategory.id)
    : [];

  const isTimepiecesView = selectedCategorySlug === 'watches' || selectedCategorySlug === 'timepieces' || selectedCategorySlug === 'luxury-watches';

  // Merge products (In a real app, this would be from state/context including imported ones)
  // For demo, we use coreProducts. 
  const allProducts = coreProducts; 

  const brands = ['All', ...Array.from(new Set(allProducts.map(p => p.brand)))];

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    if (selectedCategorySlug !== 'all') {
        const mapping: Record<string, string> = {
            'timepieces': 'Watches',
            'luxury-watches': 'Watches',
            'womens-watches': 'Watches',
            'mens-watches': 'Watches',
            'bags': 'Bags',
            'tote-bags': 'Bags',
            'jewelry': 'Jewelry',
            'rings': 'Jewelry',
            'beauty': 'Beauty',
            'makeup': 'Beauty',
            'fragrances': 'Beauty',
            'gifts': 'Gifts'
        };
        
        const mappedCat = mapping[selectedCategorySlug] || selectedCategorySlug;
        
        result = result.filter(p => 
            p.category.toLowerCase() === mappedCat.toLowerCase() || 
            (selectedCategorySlug === 'gifts' && p.price < 5000)
        );
    }

    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Watch Specific Filters
    if (isTimepiecesView) {
        if (watchMovement !== 'All') {
            result = result.filter(p => p.movement === watchMovement);
        }
        if (watchMaterial !== 'All') {
            result = result.filter(p => p.case_material?.includes(watchMaterial));
        }
        if (watchWater !== 'All') {
            result = result.filter(p => p.water_resistance?.includes(watchWater));
        }
    }
    
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // Default order
    });
  }, [selectedCategorySlug, selectedBrand, sortBy, selectedSubCategorySlug, watchMovement, watchMaterial, watchWater, allProducts]);

  return (
    <div className={`bg-white min-h-screen pb-20 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Dynamic Header */}
      {isTimepiecesView ? (
          <div className="relative h-[60vh] bg-black mb-12 overflow-hidden">
              <video 
                src="https://videos.pexels.com/video-files/3205915/3205915-uhd_2560_1440_25fps.mp4" 
                className="w-full h-full object-cover opacity-60" 
                autoPlay loop muted playsInline 
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                  <span className="text-gold-500 border border-gold-500 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] mb-6 animate-fade-in-up">
                      {isRTL ? 'معرض الساعات' : 'The Watch Gallery'}
                  </span>
                  <h1 className="font-serif text-5xl md:text-7xl mb-4 animate-fade-in-up delay-100">
                      {isRTL ? 'فن الوقت' : 'The Art of Time'}
                  </h1>
                  <p className="max-w-xl text-neutral-300 font-light animate-fade-in-up delay-200">
                      {isRTL 
                        ? 'مجموعة مختارة من أرقى الساعات العالمية. تم فحص أصالتها وتجهيزها خصيصاً لك.' 
                        : 'A curated selection of the world\'s finest complications. Authenticated and sourced from our global luxury network.'}
                  </p>
              </div>
          </div>
      ) : (
          <div className="pt-32 max-w-7xl mx-auto px-6 mb-12 text-center">
            <p className="text-gold-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">{isRTL ? 'دار عشتار' : 'Maison Ishtar'}</p>
            <h1 className="font-serif text-5xl text-neutral-900 mb-6 capitalize">
                {currentRootCategory ? (isRTL ? currentRootCategory.name_ar : currentRootCategory.name_en) : (isRTL ? 'المجموعة الكاملة' : 'The Collection')}
            </h1>
          </div>
      )}

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div className="flex items-center gap-2 font-serif text-xl border-b border-neutral-100 pb-4">
                <SlidersHorizontal size={20} />
                <h3>{isRTL ? 'تصفية' : 'Filters'}</h3>
            </div>

            {/* Department Filter */}
            <div className="border-b border-neutral-100 pb-6">
                <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">{isRTL ? 'القسم' : 'Department'}</h3>
                <ul className="space-y-3">
                    <li key="all">
                        <button 
                            onClick={() => setSelectedCategorySlug('all')}
                            className={`text-sm transition-colors w-full text-left ${selectedCategorySlug === 'all' ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-gold-600'}`}
                        >
                            {isRTL ? 'الكل' : 'All Departments'}
                        </button>
                    </li>
                    {rootCategories.map(cat => (
                        <li key={cat.id}>
                            <button 
                                onClick={() => setSelectedCategorySlug(cat.slug)}
                                className={`text-sm transition-colors w-full text-left ${selectedCategorySlug === cat.slug ? 'text-neutral-900 font-bold text-gold-600' : 'text-neutral-500 hover:text-gold-600'}`}
                            >
                                {isRTL ? cat.name_ar : cat.name_en}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Watch Specific Filters */}
            {isTimepiecesView && (
                <div className="animate-fade-in-up">
                    <div className="border-b border-neutral-100 pb-6 mb-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                            <Watch size={14} /> {isRTL ? 'نوع الحركة' : 'Movement'}
                        </h3>
                        <ul className="space-y-2">
                            {['All', 'Automatic', 'Quartz', 'Manual'].map(m => (
                                <li key={m}>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-600 hover:text-neutral-900">
                                        <input 
                                            type="radio" 
                                            name="movement" 
                                            className="accent-gold-500" 
                                            checked={watchMovement === m} 
                                            onChange={() => setWatchMovement(m)} 
                                        />
                                        {m}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="border-b border-neutral-100 pb-6 mb-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">{isRTL ? 'مادة الهيكل' : 'Case Material'}</h3>
                        <select 
                            className="w-full p-2 border border-stone-200 text-sm rounded bg-stone-50"
                            value={watchMaterial}
                            onChange={(e) => setWatchMaterial(e.target.value)}
                        >
                            <option value="All">All Materials</option>
                            <option value="Steel">Steel</option>
                            <option value="Gold">Gold</option>
                            <option value="Ceramic">Ceramic</option>
                            <option value="Titanium">Titanium</option>
                        </select>
                    </div>

                    <div className="border-b border-neutral-100 pb-6 mb-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                            <Droplets size={14} /> {isRTL ? 'مقاومة الماء' : 'Water Resistance'}
                        </h3>
                        <select 
                            className="w-full p-2 border border-stone-200 text-sm rounded bg-stone-50"
                            value={watchWater}
                            onChange={(e) => setWatchWater(e.target.value)}
                        >
                            <option value="All">All Levels</option>
                            <option value="30m">30m (Splash)</option>
                            <option value="50m">50m (Swim)</option>
                            <option value="100m">100m (Snorkel)</option>
                            <option value="300m">300m (Dive)</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Designers */}
            <div className="border-b border-neutral-100 pb-6">
                <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-500 mb-4">{isRTL ? 'المصممين' : 'Designers'}</h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {brands.map(brand => (
                        <li key={brand}>
                            <button 
                                onClick={() => setSelectedBrand(brand)}
                                className={`text-sm transition-colors w-full text-left flex justify-between ${selectedBrand === brand ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-gold-600'}`}
                            >
                                {brand}
                                {selectedBrand === brand && <ChevronRight size={12} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-neutral-400 uppercase tracking-widest">{isRTL ? `عرض ${filteredProducts.length} نتيجة` : `Showing ${filteredProducts.length} Results`}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 hidden md:inline">{isRTL ? 'ترتيب حسب:' : 'Sort by:'}</span>
                    <select 
                        className="p-2 text-sm border border-neutral-200 focus:outline-none focus:border-gold-500 bg-white rounded-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="newest">{isRTL ? 'الأحدث' : 'New Arrivals'}</option>
                        <option value="price-asc">{isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                        <option value="price-desc">{isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
                        <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden rounded-sm">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.sub_category && (
                                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 text-[9px] uppercase font-bold tracking-widest">
                                    {product.sub_category}
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                            <button className="absolute bottom-0 w-full bg-white/95 backdrop-blur py-3 text-xs uppercase font-bold tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                {isRTL ? 'عرض التفاصيل' : 'View Details'}
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{product.brand}</p>
                            <h3 className="font-serif text-lg text-neutral-900 mb-1 leading-snug">{isRTL && product.name_ar ? product.name_ar : product.name}</h3>
                            <p className="text-gold-600 font-medium font-mono">${product.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <div className="py-20 text-center border-t border-stone-100 mt-10">
                    <p className="font-serif text-xl text-neutral-400">{isRTL ? 'لا توجد منتجات تطابق اختيارك.' : 'No items found matching your criteria.'}</p>
                    <button onClick={() => {setSelectedCategorySlug('all'); setSelectedBrand('All')}} className="mt-4 text-gold-600 underline text-sm">
                        {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
