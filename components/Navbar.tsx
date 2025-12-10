
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Mic, User, Heart, Crown, LogIn, ChevronDown, Search, Sparkles, Video, Home } from 'lucide-react';
import { AppMode, Currency, Language, Brand, Product, UserProfile } from '../types';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';

interface NavbarProps {
  toggleChat: () => void;
  toggleLive: () => void;
  onOpenVideoGen?: () => void;
  onOpenStylist?: () => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onNavigate: (category: string) => void;
  onBrands: () => void;
  onHome: () => void;
  onCart: () => void;
  onAccount: () => void;
  onWishlist: () => void;
  onLoginClick: () => void;
  currency: Currency;
  language: Language;
  cartCount: number;
  currentUser: UserProfile | null;
}

const Navbar: React.FC<NavbarProps> = ({ 
    toggleChat, toggleLive, onOpenVideoGen, onOpenStylist, onNavigate, onBrands, onHome, onCart, onAccount, onWishlist, onLoginClick,
    currency, language, cartCount, currentUser 
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isRTL = language === 'AR';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
      { id: 'home', label_en: 'HOME', label_ar: 'الرئيسية' }, // Added Explicit Home
      { id: 'shop', label_en: 'SHOP', label_ar: 'تسوق' },
      { id: 'brands', label_en: 'MAISONS', label_ar: 'الماركات' },
      { id: 'logo', label_en: '', label_ar: '' }, // Central Logo Placeholder
      { id: 'collections', label_en: 'COLLECTIONS', label_ar: 'المجموعات' },
      { id: 'offers', label_en: 'OFFERS', label_ar: 'العروض', highlight: true }
  ];

  return (
    <>
    <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${isRTL ? 'rtl' : ''} ${
            isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-stone-200 py-2 shadow-sm' 
            : 'bg-transparent border-transparent py-4'
        }`} 
        dir={isRTL ? 'rtl' : 'ltr'}
        onMouseLeave={() => setActiveMenu(null)}
    >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center relative">
            
            {/* LEFT: Exclusive Button */}
            <div className="flex-1 flex items-center justify-start gap-4">
                <button 
                    onClick={() => onNavigate('exclusive')}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-[#C9A646] text-white text-[10px] font-bold tracking-[0.15em] uppercase rounded-full shadow-lg shadow-gold-500/20 hover:bg-[#D4B875] hover:scale-105 transition-all transform"
                >
                    <Crown size={12} fill="currentColor" className="group-hover:animate-pulse" />
                    {isRTL ? 'عشتار حصري' : 'ISHTAR EXCLUSIVE'}
                </button>
            </div>

            {/* CENTER: Navigation & Logo */}
            <div className="flex-[2] flex items-center justify-center relative">
                {/* Menu Items */}
                <div className={`hidden lg:flex items-center gap-8 xl:gap-10`}>
                    {navItems.map((item, idx) => {
                        if (item.id === 'logo') {
                            return (
                                <div key="logo" onClick={onHome} className="cursor-pointer px-4 group">
                                    <h1 className={`font-serif font-bold tracking-[0.2em] transition-all duration-500 ${isScrolled ? 'text-2xl text-neutral-900' : 'text-3xl text-neutral-900'}`}>
                                        𝐈𝐒𝐇𝐓𝐀𝐑𒀭
                                    </h1>
                                </div>
                            );
                        }
                        const isActive = activeMenu === item.id;
                        return (
                            <button 
                                key={item.id}
                                onMouseEnter={() => setActiveMenu(item.id)}
                                onClick={() => { 
                                    if(item.id === 'home') onHome();
                                    else if(item.id === 'brands') onBrands(); 
                                    else onNavigate(item.id); 
                                    setActiveMenu(null); 
                                }}
                                className={`relative text-[11px] tracking-[0.15em] uppercase transition-all py-2 group ${
                                    item.highlight 
                                    ? 'text-[#C73434] font-bold hover:text-red-700' 
                                    : isActive 
                                        ? 'text-[#C9A646] font-bold scale-105' 
                                        : 'text-neutral-800 font-medium hover:text-[#C9A646] hover:font-bold'
                                }`}
                            >
                                {isRTL ? item.label_ar : item.label_en}
                                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C9A646] transform transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex-1 flex items-center justify-end gap-3 text-neutral-800">
                {/* Currency */}
                <button className="text-[10px] font-bold tracking-widest hover:text-[#C9A646] transition-colors hidden md:block mr-2">
                    {currency} <ChevronDown size={10} className="inline ml-1" />
                </button>

                <div className="h-4 w-[1px] bg-neutral-300 hidden md:block"></div>

                {/* Global Search */}
                <button 
                    onClick={() => setIsSearchOpen(true)} 
                    className="hover:text-[#C9A646] hover:scale-110 transition-all p-1.5" 
                    title="Search"
                >
                    <Search size={20} strokeWidth={1.5} />
                </button>

                {/* AI Video Generator */}
                <button 
                    onClick={onOpenVideoGen} 
                    className="hover:text-[#C9A646] hover:scale-110 transition-all p-1.5" 
                    title="AI Video Generator"
                >
                    <Video size={20} strokeWidth={1.5} />
                </button>

                {/* Live Styling Assistant */}
                <button 
                    onClick={toggleLive} 
                    className="hover:text-[#C9A646] hover:scale-110 transition-all p-1.5" 
                    title="Live Styling Assistant"
                >
                    <Mic size={20} strokeWidth={1.5} />
                </button>

                {/* AI Concierge (Stylist) */}
                <button 
                    onClick={onOpenStylist || toggleChat} 
                    className="group relative hover:text-[#C9A646] hover:scale-110 transition-all p-1.5" 
                    title="AI Stylist"
                >
                    <Sparkles size={20} strokeWidth={1.5} className="group-hover:fill-gold-100" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse"></span>
                </button>

                <button onClick={onWishlist} className="hover:text-[#C9A646] hover:scale-110 transition-all hidden md:block p-1.5">
                    <Heart size={20} strokeWidth={1.5} />
                </button>

                {currentUser ? (
                    <button onClick={onAccount} className="hover:text-[#C9A646] hover:scale-110 transition-all p-1.5">
                        <User size={20} strokeWidth={1.5} />
                    </button>
                ) : (
                    <button onClick={onLoginClick} className="flex items-center gap-2 hover:text-[#C9A646] transition-all group p-1.5">
                        <LogIn size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}

                <button onClick={onCart} className="hover:text-[#C9A646] hover:scale-110 transition-all relative p-1.5">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#C9A646] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </div>

        {/* Mega Menu Overlay */}
        <MegaMenu 
            activeMenu={activeMenu}
            language={language}
            onNavigate={onNavigate}
            onBrandClick={(b) => { onBrands(); setActiveMenu(null); }}
            onProductClick={() => setActiveMenu(null)}
            closeMenu={() => setActiveMenu(null)}
        />
    </nav>

    {/* Search Overlay */}
    <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        onNavigateProduct={(p) => { 
            // Navigation handled by parent via props
            if(p.category) onNavigate(p.category); 
        }}
        onNavigateBrand={(b) => { onBrands(); }} 
        onNavigateCategory={(c) => onNavigate(c)}
    />
    </>
  );
};

export default Navbar;
