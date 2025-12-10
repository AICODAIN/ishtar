import React, { useMemo } from 'react';
import { Brand, Product, Language, Currency } from '../types';
import { products } from '../data/products';
import { ArrowLeft, MapPin } from 'lucide-react';

interface BrandDetailProps {
    brand: Brand;
    language: Language;
    currency: Currency;
    onBack: () => void;
    onProductClick: (product: Product) => void;
}

const BrandDetail: React.FC<BrandDetailProps> = ({ brand, language, currency, onBack, onProductClick }) => {
    const isRTL = language === 'AR';

    const brandProducts = useMemo(() => {
        // Filter products by brand name (simple string match)
        return products.filter(p => p.brand.toLowerCase() === brand.id.toLowerCase() || p.brand.toLowerCase() === brand.name_en.toLowerCase());
    }, [brand]);

    return (
        <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Hero Header */}
            <div className="relative h-[60vh]">
                <img src={brand.cover_image} className="w-full h-full object-cover" alt={brand.name_en} />
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="absolute top-8 left-8 z-10">
                    <button onClick={onBack} className="text-white hover:text-gold-400 flex items-center gap-2 transition-colors">
                        <ArrowLeft className={isRTL ? "rotate-180" : ""} /> {isRTL ? 'عودة' : 'Back'}
                    </button>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-4 mb-6 shadow-2xl">
                         {brand.logo ? (
                            <img src={brand.logo} className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="font-serif font-bold text-2xl text-neutral-900">{brand.name_en[0]}</span>
                        )}
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl mb-4">{isRTL ? brand.name_ar : brand.name_en}</h1>
                    <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-widest mb-6">
                        <MapPin size={14} />
                        <span>{brand.country}</span>
                        <span>•</span>
                        <span>{brand.group}</span>
                    </div>
                    <p className="max-w-2xl text-lg font-light text-neutral-200 leading-relaxed">
                        {isRTL ? brand.description_ar : brand.description_en}
                    </p>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex justify-between items-end mb-12 border-b border-stone-100 pb-4">
                    <h2 className="font-serif text-3xl text-neutral-900">
                        {isRTL ? `مجموعات ${brand.name_ar}` : `${brand.name_en} Collections`}
                    </h2>
                    <span className="text-neutral-400 text-xs uppercase tracking-widest">{brandProducts.length} {isRTL ? 'منتجات' : 'Creations'}</span>
                </div>

                {brandProducts.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400">
                        {isRTL ? 'لا تتوفر منتجات لهذا البراند حالياً.' : 'No collections currently available for this maison.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {brandProducts.map(product => (
                            <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
                                <div className="relative aspect-[3/4] bg-stone-50 mb-6 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-serif text-lg text-neutral-900 mb-2">{isRTL && product.name_ar ? product.name_ar : product.name}</h3>
                                    <p className="text-gold-600 font-mono text-sm">{product.price.toLocaleString()} {currency}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandDetail;