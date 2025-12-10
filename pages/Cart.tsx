
import React from 'react';
import { Minus, Plus, X, ArrowRight, Truck, Globe, Tag } from 'lucide-react';
import { CartItem, Currency, Language } from '../types';
import { promotions } from '../data/promotions';
import { calculateCart, formatPrice } from '../services/commerceService';

interface CartProps {
  items: CartItem[];
  currency: Currency;
  language: Language;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  formatPrice: (price: number) => string; // Legacy prop, we use service now but keep for interface compat
}

const Cart: React.FC<CartProps> = ({ items, currency, language, onUpdateQty, onRemove, onCheckout }) => {
  const isRTL = language === 'AR';
  
  // Use Commerce Service for complex calculations
  const totals = calculateCart(items, currency, promotions);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-serif text-3xl mb-4 text-neutral-900">{isRTL ? 'سلة التسوق فارغة' : 'Your Shopping Bag is Empty'}</h2>
        <p className="text-neutral-500 mb-8 font-light">{isRTL ? 'تصفحي مجموعاتنا الحصرية لإيجاد ما يناسب ذوقك الرفيع.' : 'Discover our exclusive collections to find something exquisite.'}</p>
        <button onClick={() => window.scrollTo(0,0)} className="bg-neutral-900 text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors">
          {isRTL ? 'بدء التسوق' : 'Start Shopping'}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl mb-12 text-neutral-900">{isRTL ? 'حقيبة التسوق' : 'Shopping Bag'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.cartId} className="bg-white p-6 border border-stone-200 flex gap-6 relative group">
                <button 
                  onClick={() => onRemove(item.cartId)}
                  className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-neutral-300 hover:text-red-500 transition-colors`}
                >
                  <X size={18} />
                </button>
                
                <div className="w-24 h-32 bg-stone-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start pr-8">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1">{item.brand}</p>
                        <h3 className="font-serif text-lg text-neutral-900">{isRTL && item.name_ar ? item.name_ar : item.name}</h3>
                        {item.selectedVariant && (
                            <p className="text-xs text-neutral-500 mt-1">Variant: {item.selectedVariant.name}</p>
                        )}
                        {item.is_dropshipping && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-gold-600 bg-gold-50 px-2 py-1 w-fit rounded">
                                <Globe size={10} />
                                <span>{isRTL ? 'يُشحن من المورد' : 'Ships from Partner'}</span>
                            </div>
                        )}
                    </div>
                    {/* Display Price in Target Currency */}
                    <p className="font-mono text-neutral-900">{formatPrice(item.price, currency, language)}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center border border-stone-200">
                      <button onClick={() => onUpdateQty(item.cartId, -1)} className="p-2 hover:bg-stone-50 text-neutral-500"><Minus size={14}/></button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.cartId, 1)} className="p-2 hover:bg-stone-50 text-neutral-500"><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-stone-200 sticky top-32">
              <h3 className="font-serif text-xl mb-6">{isRTL ? 'ملخص الطلب' : 'Order Summary'}</h3>
              
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-neutral-600">
                  <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono">{formatPrice(totals.subtotalSAR, currency, language)}</span>
                </div>
                
                {/* Promotions Line Item */}
                {totals.discountSAR > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded">
                        <span className="flex items-center gap-2"><Tag size={14} /> {isRTL ? 'خصومات' : 'Discounts'}</span>
                        <span className="font-mono">-{formatPrice(totals.discountSAR, currency, language)}</span>
                    </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>{isRTL ? 'الشحن' : 'Shipping'}</span>
                  <span>{totals.shippingSAR === 0 ? (isRTL ? 'مجاني' : 'Free') : formatPrice(totals.shippingSAR, currency, language)}</span>
                </div>
                
                <div className="pt-4 border-t border-stone-100 flex justify-between font-bold text-lg text-neutral-900">
                  <span>{isRTL ? 'الإجمالي' : 'Total'}</span>
                  <span className="font-mono">{formatPrice(totals.totalSAR, currency, language)}</span>
                </div>
                
                {currency !== 'SAR' && (
                    <div className="text-right text-[10px] text-neutral-400">
                        {isRTL ? 'معادل لـ' : 'Equivalent to'} {formatPrice(totals.totalSAR, 'SAR', language)}
                    </div>
                )}
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-neutral-900 text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
              >
                {isRTL ? 'إتمام الشراء' : 'Checkout'} {isRTL ? <ArrowRight className="rotate-180" size={16} /> : <ArrowRight size={16} />}
              </button>

              <div className="mt-6 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <Truck size={14} />
                <span>{isRTL ? 'شحن آمن وعالمي' : 'Secure Global Shipping'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
