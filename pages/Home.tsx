
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, PauseCircle, ChevronDown, ShoppingBag, Gift, Sparkles, Star } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { campaigns, highlightReels } from '../data/videoContent';
import { looks } from '../data/products';
import { bundles } from '../data/products';
import { Language, Product, Campaign, Category } from '../types';
import BrandStrip from '../components/BrandStrip';
import SmartVideo from '../components/SmartVideo';

interface HomeProps {
    onNavigate: (category: string) => void;
    onNavigateCategory: (slug: string) => void;
    onNavigateLook: () => void;
    onNavigateBundle: () => void;
    onProductClick: (product: Product) => void;
    onBrandClick: (brand: any) => void;
    language: Language;
    userInterest: string; 
}

const Home: React.FC<HomeProps> = ({ 
    onNavigate, onNavigateCategory, onNavigateLook, onNavigateBundle, 
    onProductClick, onBrandClick, language, userInterest 
}) => {
  const isRTL = language === 'AR';
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(true);
  
  const [activeCampaign, setActiveCampaign] = useState<Campaign>(campaigns[0]);

  useEffect(() => {
    let selected = campaigns.find(c => c.target_segment === userInterest && c.is_active);
    if (!selected) {
        selected = campaigns.find(c => c.is_active) || campaigns[0];
    }
    setActiveCampaign(selected);
  }, [userInterest]);

  useEffect(() => {
      const handleScroll = () => {
          if (window.scrollY > 100) setShowScrollDown(false);
          else setShowScrollDown(true);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sections Data
  const bestsellers = products.slice(0, 4); // Mock bestsellers
  const luxuryGifts = products.filter(p => p.price > 5000).slice(0, 4); // Mock gifts

  return (
    <div className={`bg-white min-h-screen font-sans selection:bg-gold-500 selection:text-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .text-shadow { text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
      `}</style>

      {/* 1. CINEMATIC VIDEO HERO (BANNER) */}
      <header className="relative h-screen w-full overflow-hidden bg-black transition-all duration-1000">
        <SmartVideo 
            key={activeCampaign.id} 
            video={activeCampaign.hero_video} 
            onProductClick={onProductClick} 
        />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-32 px-6 md:px-20 pointer-events-none">
            <div className="max-w-3xl text-white animate-fade-in-up pointer-events-auto">
                <div className="flex items-center gap-4 mb-6">
                    <span className="h-[2px] w-12 bg-gold-500 shadow-[0_0_10px_#C9A646]"></span>
                    <p className="text-gold-400 tracking-[0.4em] text-xs font-bold uppercase text-shadow">
                        {activeCampaign.title}
                    </p>
                </div>
                <h1 className="font-serif text-5xl md:text-8xl font-medium mb-8 leading-tight text-shadow">
                    {activeCampaign.description}
                </h1>
                <div className="flex gap-6">
                    <button 
                        onClick={() => onNavigate(activeCampaign.target_segment)}
                        className="bg-white text-neutral-900 px-12 py-4 font-bold tracking-widest hover:bg-gold-500 hover:text-white transition-all uppercase text-xs rounded-full shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-1"
                    >
                        {isRTL ? 'تسوق المجموعة' : 'Shop Collection'}
                    </button>
                </div>
            </div>
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2 transition-opacity duration-500 ${showScrollDown ? 'opacity-80' : 'opacity-0'}`}>
            <span className="text-[10px] uppercase tracking-widest">{isRTL ? 'تصفح' : 'Scroll'}</span>
            <ChevronDown className="animate-bounce" />
        </div>
      </header>

      {/* 2. SHOP BY CATEGORY */}
      <section className="py-20 px-6 max-w-[1920px] mx-auto">
          <div className="text-center mb-12">
              <h2 className="font-serif text-4xl text-neutral-900">{isRTL ? 'تسوق حسب الفئة' : 'Shop by Category'}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(c => !c.parent_id).slice(0, 4).map(cat => (
                  <div key={cat.id} className="relative group cursor-pointer overflow-hidden aspect-[3/4]" onClick={() => onNavigateCategory(cat.slug)}>
                      <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white font-serif text-2xl tracking-wider">{isRTL ? cat.name_ar : cat.name_en}</h3>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 3. BESTSELLERS */}
      <section className="py-20 bg-stone-50 px-6">
          <div className="max-w-[1920px] mx-auto">
              <div className="flex justify-between items-end mb-10">
                  <h2 className="font-serif text-3xl text-neutral-900">{isRTL ? 'الأكثر مبيعاً' : 'Bestsellers'}</h2>
                  <button onClick={() => onNavigate('all')} className="text-xs uppercase tracking-widest hover:text-gold-600 transition-colors border-b border-transparent hover:border-gold-600 pb-1">
                      {isRTL ? 'عرض الكل' : 'View All'}
                  </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {bestsellers.map(product => (
                      <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
                          <div className="relative aspect-[3/4] bg-white mb-4 overflow-hidden rounded-sm">
                              <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              <div className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">
                                  {isRTL ? 'الأفضل' : 'Best'}
                              </div>
                          </div>
                          <div className="text-center">
                              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-1">{product.brand}</p>
                              <h3 className="font-serif text-lg text-neutral-900 mb-1">{isRTL && product.name_ar ? product.name_ar : product.name}</h3>
                              <p className="text-gold-600 font-mono text-sm">${product.price.toLocaleString()}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. LUXURY GIFTS */}
      <section className="py-24 px-6 max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                  <span className="text-gold-600 text-xs font-bold tracking-[0.2em] uppercase">{isRTL ? 'هدية مميزة' : 'The Art of Gifting'}</span>
                  <h2 className="font-serif text-5xl text-neutral-900 leading-tight">{isRTL ? 'هدايا فاخرة لكل مناسبة' : 'Luxury Gifts for Every Occasion'}</h2>
                  <p className="text-neutral-500 font-light max-w-md">
                      {isRTL ? 'اكتشف مجموعتنا المختارة من الهدايا التي تعبر عن التقدير والحب بأسلوب لا يُنسى.' : 'Discover our curated selection of gifts that express appreciation and love in an unforgettable style.'}
                  </p>
                  <button onClick={() => onNavigate('gifts')} className="bg-neutral-900 text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors rounded-full">
                      {isRTL ? 'تسوق الهدايا' : 'Shop Gifts'}
                  </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                  {luxuryGifts.slice(0,2).map(product => (
                      <div key={product.id} className="cursor-pointer" onClick={() => onProductClick(product)}>
                          <img src={product.image} className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity" />
                          <div className="mt-2 text-center">
                              <p className="font-serif text-sm">{isRTL && product.name_ar ? product.name_ar : product.name}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 5. LOOKS */}
      <section className="py-20 bg-neutral-900 text-white overflow-hidden">
          <div className="max-w-[1920px] mx-auto px-6">
              <div className="flex justify-between items-center mb-12">
                  <h2 className="font-serif text-3xl">{isRTL ? 'إطلالات جاهزة' : 'Curated Looks'}</h2>
                  <button onClick={onNavigateLook} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-gold-500 transition-colors">
                      {isRTL ? 'شاهد الكل' : 'View All'} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                  </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {looks.slice(0, 2).map(look => (
                      <div key={look.id} className="group cursor-pointer relative" onClick={onNavigateLook}>
                          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4">
                              <img src={look.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                          </div>
                          <div className="absolute bottom-8 left-8">
                              <span className="bg-white text-neutral-900 text-[10px] px-3 py-1 uppercase tracking-widest font-bold mb-2 inline-block">{look.occasion}</span>
                              <h3 className="font-serif text-2xl">{look.title}</h3>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. GIFT BUNDLES */}
      <section className="py-24 px-6 max-w-[1920px] mx-auto">
          <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-gold-50 text-gold-600 rounded-full mb-4">
                  <Gift size={24} />
              </div>
              <h2 className="font-serif text-4xl text-neutral-900">{isRTL ? 'باقات الهدايا' : 'Signature Bundles'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map(bundle => (
                  <div key={bundle.id} className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={onNavigateBundle}>
                      <div className="aspect-square relative">
                          <img src={bundle.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                              <h3 className="font-serif text-2xl mb-1">{bundle.title}</h3>
                              <p className="text-gold-400 font-mono text-lg">${bundle.price.toLocaleString()}</p>
                          </div>
                      </div>
                      <div className="p-6 bg-white">
                          <p className="text-neutral-500 text-sm leading-relaxed mb-4">{bundle.description}</p>
                          <button className="w-full border border-neutral-900 text-neutral-900 py-3 uppercase text-xs font-bold tracking-widest hover:bg-neutral-900 hover:text-white transition-colors">
                              {isRTL ? 'عرض الباقة' : 'View Bundle'}
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 7. BRAND STRIP */}
      <BrandStrip onBrandClick={onBrandClick} />

    </div>
  );
};

export default Home;
