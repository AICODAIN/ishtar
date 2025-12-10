
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import SupplierPortal from './pages/SupplierPortal';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Categories from './pages/Categories';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import BrandDetail from './pages/BrandDetail';
import ShopByBrand from './pages/ShopByBrand';
import Looks from './pages/Looks';
import Bundles from './pages/Bundles';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import InfoPage from './pages/InfoPage';
import Onboarding from './components/Onboarding';
import ChatDrawer from './components/ChatDrawer';
import LiveVoice from './components/LiveVoice';
import { AppMode, ViewState, Product, Currency, Language, CartItem, UserProfile, Brand, InfoPageType } from './types';
import { products, looks, bundles } from './data/products';
import { adminOrders } from './data/coreData';
import { formatPrice } from './services/commerceService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('EN');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Navigation State
  const [view, setView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageType>('ABOUT');
  
  // AI Personalization State
  const [userInterest, setUserInterest] = useState<string>('default');

  // UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [chatTrigger, setChatTrigger] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'stylist' | 'search' | 'design' | 'video'>('stylist');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // --- Handlers ---

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setLanguage(user.preferences.language);
    setCurrency(user.preferences.currency);
    
    // Role Based Routing
    if (user.role === 'admin' || user.role === 'super_admin' || user.role.includes('manager') || user.role === 'risk_officer' || user.role === 'view_only_analyst') {
      setView('ADMIN_DASHBOARD');
    } else if (user.role === 'supplier') {
      setView('SUPPLIER_PORTAL');
    } else {
      setView('HOME');
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        setCart(prev => prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
        const item: CartItem = { ...product, quantity, cartId: Date.now().toString() };
        setCart(prev => [...prev, item]);
    }
  };

  const removeFromCart = (cartId: string) => {
      setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateCartQty = (cartId: string, delta: number) => {
      setCart(prev => prev.map(i => {
          if (i.cartId === cartId) {
              const newQty = Math.max(1, i.quantity + delta);
              return { ...i, quantity: newQty };
          }
          return i;
      }));
  };

  const toggleWishlist = (product: Product) => {
      setWishlist(prev => {
          if (prev.find(p => p.id === product.id)) {
              return prev.filter(p => p.id !== product.id);
          }
          return [...prev, product];
      });
  };

  // --- Navigation & Tracking Handlers ---

  const trackInterest = (categoryOrTag: string) => {
      // Simple logic to map navigation to broad interest segments for personalization
      const lower = categoryOrTag.toLowerCase();
      if (lower.includes('watch') || lower.includes('time')) setUserInterest('watches');
      else if (lower.includes('bag') || lower.includes('tot') || lower.includes('clutch')) setUserInterest('bags');
      else if (lower.includes('beauty') || lower.includes('scent') || lower.includes('frag')) setUserInterest('beauty');
      else if (lower.includes('jewelry') || lower.includes('ring')) setUserInterest('jewelry');
  };

  const handleProductClick = (product: Product) => {
      trackInterest(product.category);
      setSelectedProduct(product);
      setView('PRODUCT');
      window.scrollTo(0, 0);
  };

  const handleCategoryNav = (categorySlug: string) => {
      trackInterest(categorySlug);
      setActiveCategory(categorySlug);
      setView('CATALOG');
      window.scrollTo(0, 0);
  };

  const handleBrandClick = (brand: Brand) => {
      trackInterest(brand.category || 'fashion');
      setActiveBrand(brand);
      setView('BRAND');
      window.scrollTo(0, 0);
  };

  const handleInfoNav = (type: InfoPageType) => {
      setActiveInfoPage(type);
      setView('INFO');
      window.scrollTo(0, 0);
  };

  const handleAskStylist = (msg: string) => {
      setChatMode('stylist');
      setChatTrigger(msg);
      setIsChatOpen(true);
  };

  const handleGenerateVideo = (product: Product) => {
      setChatMode('video');
      setChatTrigger(`Create a cinematic, high-luxury marketing video for ${product.name}, emphasizing its elegance and premium materials.`);
      setIsChatOpen(true);
  };

  // --- Render Routing ---

  const renderContent = () => {
    if (view === 'LOGIN') {
      return <Login onLoginSuccess={handleLoginSuccess} onGuestAccess={() => setView('HOME')} language={language} />;
    }

    if (view === 'ADMIN_DASHBOARD') {
      // Basic check, detailed RBAC is inside Admin component
      if (!currentUser || currentUser.role === 'customer') return <div className="p-20 text-center">Access Denied</div>;
      return <Admin user={currentUser} />;
    }

    if (view === 'SUPPLIER_PORTAL') {
      if (currentUser?.role !== 'supplier') return <div className="p-20 text-center">Access Denied</div>;
      return <SupplierPortal supplierId={currentUser.supplierId!} supplierName={currentUser.name} onLogout={() => setView('LOGIN')} />;
    }

    return (
      <div className={language === 'AR' ? 'font-sans-ar' : 'font-sans'}>
        <Navbar 
          language={language}
          currency={currency}
          cartCount={cart.length}
          currentUser={currentUser}
          onNavigate={(path) => {
              if (path === 'shop') handleCategoryNav('all');
              else if (path === 'collections') setView('COLLECTIONS');
              else if (path === 'categories') setView('CATEGORIES');
              else if (path === 'looks') setView('LOOKS');
              else if (path === 'brands') setView('BRANDS_LIST');
              else if (path === 'gifts') setView('BUNDLES');
              else if (path === 'exclusive') handleCategoryNav('luxury-watches');
              else handleCategoryNav(path);
          }}
          onBrands={() => setView('BRANDS_LIST')}
          onHome={() => setView('HOME')}
          onCart={() => setView('CART')}
          onLoginClick={() => setView('LOGIN')}
          onAccount={() => setView('ACCOUNT')}
          onWishlist={() => setView('WISHLIST')}
          toggleChat={() => setIsChatOpen(!isChatOpen)}
          toggleLive={() => setIsLiveOpen(!isLiveOpen)}
          onOpenVideoGen={() => {
              setChatMode('video');
              setChatTrigger('Create a luxury marketing video for a new watch collection, emphasizing elegance and exclusivity. Aspect ratio 16:9.');
              setIsChatOpen(true);
          }}
          onOpenStylist={() => {
              setChatMode('stylist');
              setChatTrigger('Suggest a luxury outfit for a gala event in Dubai for someone who likes watches and gold jewelry');
              setIsChatOpen(true);
          }}
          mode={AppMode.SHOPPER}
          setMode={() => {}}
        />
        
        <div className="pt-0">
          {view === 'HOME' && (
            <Home 
                language={language} 
                onNavigate={handleCategoryNav} 
                onNavigateCategory={(slug) => handleCategoryNav(slug)}
                onNavigateLook={() => setView('LOOKS')}
                onNavigateBundle={() => setView('BUNDLES')}
                onBrandClick={handleBrandClick}
                onProductClick={handleProductClick}
                userInterest={userInterest} 
            />
          )}
          
          {view === 'CATEGORIES' && (
              <Categories 
                  language={language} 
                  onNavigateCategory={(slug) => handleCategoryNav(slug)} 
              />
          )}

          {view === 'COLLECTIONS' && (
              <Collections 
                  language={language} 
                  onNavigate={(path) => handleCategoryNav(path)} // Simplify to category nav for demo
              />
          )}
          
          {view === 'CATALOG' && (
            <Catalog 
                initialCategory={activeCategory} 
                onProductClick={handleProductClick} 
                language={language} 
            />
          )}

          {view === 'BRANDS_LIST' && (
              <ShopByBrand language={language} onBrandClick={handleBrandClick} />
          )}

          {view === 'BRAND' && activeBrand && (
              <BrandDetail 
                  brand={activeBrand} 
                  language={language} 
                  currency={currency} 
                  onBack={() => setView('BRANDS_LIST')} 
                  onProductClick={handleProductClick} 
              />
          )}

          {view === 'LOOKS' && (
              <Looks 
                  looks={looks} 
                  products={products} 
                  language={language} 
                  onProductClick={handleProductClick} 
              />
          )}

          {view === 'BUNDLES' && (
              <Bundles 
                  bundles={bundles} 
                  language={language} 
                  currency={currency} 
                  formatPrice={(p) => formatPrice(p, currency, language)} 
              />
          )}
          
          {view === 'PRODUCT' && selectedProduct && (
              <ProductDetail 
                  product={selectedProduct} 
                  onBack={() => setView('CATALOG')} 
                  onChatClick={() => setIsChatOpen(true)}
                  onAskStylist={handleAskStylist}
                  onGenerateVideo={() => handleGenerateVideo(selectedProduct)}
              />
          )}
          
          {view === 'CART' && (
            <Cart 
                items={cart} 
                language={language} 
                currency={currency} 
                onCheckout={() => setView('CHECKOUT')} 
                onRemove={removeFromCart} 
                onUpdateQty={updateCartQty} 
                formatPrice={(p) => formatPrice(p, currency, language)} 
            />
          )}
          
          {view === 'CHECKOUT' && (
            <Checkout 
                total={cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)} 
                language={language} 
                currency={currency} 
                cartItems={cart}
                onPlaceOrder={(d) => { console.log(d); setCart([]); setView('ACCOUNT'); }} 
                formatPrice={(p) => formatPrice(p, currency, language)} 
            />
          )}

          {view === 'ACCOUNT' && currentUser && (
              <Account 
                  user={currentUser} 
                  orders={adminOrders.filter(o => o.email === currentUser.email)}
                  language={language}
                  currency={currency}
                  setLanguage={setLanguage}
                  setCurrency={setCurrency}
                  onLogout={() => { setCurrentUser(null); setView('HOME'); }}
                  onNavigate={(v) => { if(v === 'WISHLIST') setView('WISHLIST'); }}
              />
          )}

          {view === 'WISHLIST' && (
              <Wishlist 
                  items={wishlist} 
                  language={language} 
                  currency={currency}
                  formatPrice={(p) => formatPrice(p, currency, language)} 
                  onRemove={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
                  onAddToCart={addToCart}
              />
          )}

          {view === 'INFO' && (
              <InfoPage 
                  type={activeInfoPage} 
                  language={language} 
                  onBack={() => setView('HOME')} 
              />
          )}
        </div>

        {view !== 'HOME' && view !== 'PRODUCT' && view !== 'BRAND' && <div className="pt-20"></div>}

        <Footer language={language} onNavigateInfo={handleInfoNav} />
        
        {/* Global Overlays */}
        <ChatDrawer 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            triggerMessage={chatTrigger}
            triggerMode={chatMode}
            onMessageHandled={() => setChatTrigger(null)} 
        />
        <LiveVoice isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} />
      </div>
    );
  };

  return (
    <div dir={language === 'AR' ? 'rtl' : 'ltr'}>
      {!hasOnboarded && <Onboarding onComplete={(l, c) => { setLanguage(l); setCurrency(c); setHasOnboarded(true); }} />}
      {renderContent()}
    </div>
  );
};

export default App;
