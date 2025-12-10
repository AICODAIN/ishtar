import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Product, Language, Currency } from '../types';

interface WishlistProps {
    items: Product[];
    onRemove: (id: string) => void;
    onAddToCart: (product: Product) => void;
    language: Language;
    currency: Currency;
    formatPrice: (price: number) => string;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onRemove, onAddToCart, language, formatPrice }) => {
    const isRTL = language === 'AR';

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="font-serif text-4xl mb-12 text-center text-neutral-900">{isRTL ? 'قائمة الأمنيات' : 'Your Wishlist'}</h1>

                {items.length === 0 ? (
                    <div className="text-center text-neutral-500 py-20">
                        <p>{isRTL ? 'قائمة أمنياتك فارغة حالياً.' : 'Your wishlist is currently empty.'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.map(product => (
                            <div key={product.id} className="group relative">
                                <button 
                                    onClick={() => onRemove(product.id)}
                                    className="absolute top-2 right-2 z-10 bg-white/80 p-1 rounded-full text-neutral-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                        className="absolute bottom-0 w-full bg-neutral-900 text-white py-3 text-xs uppercase font-bold tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={14} /> {isRTL ? 'إضافة للسلة' : 'Add to Cart'}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{product.brand}</p>
                                    <h3 className="font-serif text-md text-neutral-900 mb-1">{isRTL && product.name_ar ? product.name_ar : product.name}</h3>
                                    <p className="text-gold-600 font-medium">{formatPrice(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;