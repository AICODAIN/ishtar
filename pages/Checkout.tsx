
import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, ShieldCheck, Banknote, Smartphone, CalendarClock, Landmark, AlertTriangle, Truck, Clock, Gift, Plane, Loader2, CheckCircle, Globe } from 'lucide-react';
import { Currency, Language, PaymentMethod, RiskLevel, CalculatedShippingOption, CartItem } from '../types';
import { calculateShippingOptions } from '../services/shippingService';
import { getSmartPaymentMethods } from '../services/paymentService';
import { getBestSupplierForRegion } from '../services/supplierService';
import { logs } from '../data/adminData';
import { notifyOrderStatusChange } from '../services/notificationService';

interface CheckoutProps {
  total: number;
  currency: Currency;
  language: Language;
  cartItems: CartItem[]; // Required for routing simulation
  onPlaceOrder: (details: any) => void;
  formatPrice: (price: number) => string;
}

const Checkout: React.FC<CheckoutProps> = ({ total, currency, language, cartItems, onPlaceOrder, formatPrice }) => {
  const [loading, setLoading] = useState(false);
  
  // Simulation State
  const [simulationStep, setSimulationStep] = useState<string>('');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const [details, setDetails] = useState({
      name: '',
      email: '',
      address: '',
      city: '',
      country: 'Saudi Arabia' // Default
  });
  
  // States
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);
  
  // Smart Payment State
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);
  
  // Gifting States
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const GIFT_WRAP_FEE = 35; // SAR
  
  // Simulated Risk Level
  const [currentRiskLevel, setCurrentRiskLevel] = useState<RiskLevel>('low'); 
  
  const isRTL = language === 'AR';

  // --- Shipping Logic (Using Service) ---

  const calculatedShippingOptions: CalculatedShippingOption[] = useMemo(() => {
      return calculateShippingOptions(details.country, details.city, total, cartItems);
  }, [details.country, details.city, total, cartItems]);

  // Set default shipping
  useEffect(() => {
      if (calculatedShippingOptions.length > 0 && !selectedShippingMethodId) {
          setSelectedShippingMethodId(calculatedShippingOptions[0].id);
      }
  }, [calculatedShippingOptions, selectedShippingMethodId]);

  // Get selected shipping cost
  const shippingCost = useMemo(() => {
      const option = calculatedShippingOptions.find(o => o.id === selectedShippingMethodId);
      return option ? option.cost : 0;
  }, [calculatedShippingOptions, selectedShippingMethodId]);

  // Multi-Supplier / Split Shipment Check
  const hasSplitShipment = useMemo(() => {
      // Basic check: if items have different hardcoded supplier IDs or simulated routing implies splits
      return cartItems.length > 1; 
  }, [cartItems]);

  // --- Smart Payment Routing Effect ---
  
  useEffect(() => {
      let risk: RiskLevel = 'low';
      if (total > 5000) risk = 'medium';
      if (total > 10000 && details.country !== 'Saudi Arabia') risk = 'high';
      setCurrentRiskLevel(risk);

      const methods = getSmartPaymentMethods({
          userCountry: details.country,
          userCurrency: currency,
          orderAmountSAR: total,
          channel: 'native',
          riskLevel: risk
      });
      setAvailableMethods(methods);
      
      if (selectedMethodId && !methods.find(m => m.id === selectedMethodId)) {
          setSelectedMethodId(null);
      }
  }, [details.country, currency, total, selectedMethodId]);

  const paymentSurcharge = useMemo(() => {
      const method = availableMethods.find(m => m.id === selectedMethodId);
      return method?.surcharge_sar || 0;
  }, [selectedMethodId, availableMethods]);

  const giftCost = isGift ? GIFT_WRAP_FEE : 0;
  const finalTotal = total + paymentSurcharge + shippingCost + giftCost;

  // --- SIMULATION LOGIC ---
  const addLog = (msg: string) => setSimulationLogs(prev => [...prev, msg]);

  const runSimulation = async () => {
    setLoading(true);
    setSimulationLogs([]);
    setSimulationStep('init');

    // 1. Fraud Check
    addLog(`[AI Guardian] Scanning transaction for fraud patterns...`);
    await new Promise(r => setTimeout(r, 800));
    addLog(`[AI Guardian] Risk Score: ${currentRiskLevel === 'high' ? '85/100 (Manual Review)' : '12/100 (Safe)'}. Status: Approved.`);

    // 2. Geo Routing per Item
    setSimulationStep('routing');
    addLog(`[Geo-Routing] Analyzing ${cartItems.length} items for best fulfillment center based on '${details.country}'...`);
    await new Promise(r => setTimeout(r, 1000));
    
    for (const item of cartItems) {
        // Resolve best supplier based on category and country
        const bestSupplier = getBestSupplierForRegion(
            details.country === 'Saudi Arabia' ? 'SA' : details.country === 'United Arab Emirates' ? 'AE' : 'US', // Simple map
            item.category
        );
        addLog(`[Item: ${item.name}] -> Routing to: ${bestSupplier?.supplier_name || 'Global Hub'} (${bestSupplier?.region})`);
        await new Promise(r => setTimeout(r, 400));
    }
    
    // 3. Payment
    setSimulationStep('payment');
    const methodInfo = availableMethods.find(m => m.id === selectedMethodId);
    addLog(`[Payment Gateway] Processing ${formatPrice(finalTotal)} via ${methodInfo?.name_en}...`);
    await new Promise(r => setTimeout(r, 1000));
    addLog(`[Payment] Transaction Verified. Auth ID: ${Math.floor(Math.random()*1000000)}.`);

    // 4. Finalize
    setSimulationStep('complete');
    addLog(`[System] Order Placed Successfully.`);
    await new Promise(r => setTimeout(r, 800));

    // Finish
    finishOrder(methodInfo);
  };

  const finishOrder = (methodInfo: any) => {
      const shipInfo = calculatedShippingOptions.find(s => s.id === selectedShippingMethodId);

      // Log Payment Attempt
      logs.push({
          id: Date.now(),
          type: 'payment',
          message: `Payment captured via ${methodInfo?.gateway_id}`,
          created_at: new Date().toISOString(),
          details: { amount: finalTotal, currency: currency, method: methodInfo?.code }
      });

      onPlaceOrder({
          ...details,
          payment_method: methodInfo?.code,
          payment_gateway: methodInfo?.gateway_id,
          shipping_method: shipInfo?.type,
          carrier_id: shipInfo?.carrier_id,
          payment_total: finalTotal,
          is_gift: isGift,
          gift_message: isGift ? giftMessage : undefined,
          gift_wrap_fee: isGift ? GIFT_WRAP_FEE : 0,
          points_earned: Math.floor(finalTotal * 0.1)
      });
      
      const tempOrder = {
          id: 'PENDING',
          customer: details.name,
          email: details.email,
          phone: '', 
          carrier_id: shipInfo?.carrier_id,
          tracking_number: ''
      };
      notifyOrderStatusChange(tempOrder as any, 'pending');
      setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedMethodId) {
          alert(isRTL ? "الرجاء اختيار طريقة الدفع" : "Please select a payment method");
          return;
      }
      runSimulation();
  };

  const renderIcon = (iconName: string | undefined) => {
      switch (iconName) {
          case 'credit-card': return <CreditCard size={20} />;
          case 'smartphone': return <Smartphone size={20} />;
          case 'banknote': return <Banknote size={20} />;
          case 'calendar-clock': return <CalendarClock size={20} />;
          case 'landmark': return <Landmark size={20} />;
          default: return <CreditCard size={20} />;
      }
  }

  // --- OVERLAY RENDER ---
  const renderSimulationOverlay = () => {
      if (!loading) return null;

      return (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center text-white">
              <div className="max-w-lg w-full p-8 border border-neutral-800 bg-neutral-950 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-neutral-800">
                      <div className="h-full bg-gold-500 animate-pulse w-2/3"></div>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                      {simulationStep === 'complete' ? <CheckCircle size={32} className="text-green-500" /> : <Loader2 size={32} className="animate-spin text-gold-500" />}
                      <div>
                          <h3 className="font-serif text-2xl">{isRTL ? 'جاري معالجة الطلب' : 'Processing Order'}</h3>
                          <p className="text-xs text-neutral-400 font-mono mt-1">AI-Powered Fulfillment Engine Active</p>
                      </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-neutral-300 max-h-60 overflow-y-auto custom-scrollbar p-4 bg-neutral-900 rounded border border-neutral-800">
                      {simulationLogs.map((log, i) => (
                          <div key={i} className="animate-fade-in-up border-l-2 border-neutral-700 pl-2 py-1">
                              {log}
                          </div>
                      ))}
                      <div className="animate-pulse">_</div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className={`min-h-screen pt-32 pb-20 bg-stone-50 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {renderSimulationOverlay()}
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-3xl mb-8 text-center text-neutral-900">{isRTL ? 'إتمام الطلب' : 'Secure Checkout'}</h1>

        <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Address Section */}
                <div>
                    <h3 className="font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <span className="bg-neutral-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        {isRTL ? 'عنوان الشحن' : 'Shipping Address'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder={isRTL ? "الاسم الكامل" : "Full Name"} className="p-3 border border-stone-200 text-sm w-full" onChange={e => setDetails({...details, name: e.target.value})} />
                        <input required placeholder={isRTL ? "البريد الإلكتروني" : "Email"} type="email" className="p-3 border border-stone-200 text-sm w-full" onChange={e => setDetails({...details, email: e.target.value})} />
                        
                        <select 
                            className="p-3 border border-stone-200 text-sm w-full bg-white" 
                            value={details.country}
                            onChange={e => setDetails({...details, country: e.target.value})}
                        >
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Oman">Oman</option>
                            <option value="USA">USA</option>
                            <option value="UK">United Kingdom</option>
                            <option value="France">France</option>
                            <option value="Germany">Germany</option>
                        </select>

                        <input required placeholder={isRTL ? "المدينة" : "City"} className="p-3 border border-stone-200 text-sm w-full" onChange={e => setDetails({...details, city: e.target.value})} />
                        <input required placeholder={isRTL ? "العنوان" : "Address Line 1"} className="md:col-span-2 p-3 border border-stone-200 text-sm w-full" onChange={e => setDetails({...details, address: e.target.value})} />
                    </div>
                </div>

                {/* 2. Shipping Options (Dynamic) */}
                <div className="pt-2">
                    <h3 className="font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <span className="bg-neutral-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        {isRTL ? 'خيارات الشحن' : 'Shipping Options'}
                    </h3>

                    {hasSplitShipment && (
                        <div className="mb-4 bg-stone-50 border border-stone-200 p-3 flex items-start gap-3 text-xs text-neutral-600 rounded">
                            <Truck className="flex-shrink-0 text-neutral-400" size={16} />
                            <p>
                                {isRTL 
                                ? 'يحتوي طلبك على منتجات من موردين متعددين. سيتم شحنها تلقائياً من أقرب مخزن.' 
                                : 'AI Routing Active: Your order contains items from multiple global partners. They will be automatically routed for fastest delivery.'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {calculatedShippingOptions.length > 0 ? calculatedShippingOptions.map(option => (
                            <div 
                                key={option.id}
                                onClick={() => setSelectedShippingMethodId(option.id)}
                                className={`border p-4 flex items-center justify-between cursor-pointer transition-all rounded-sm ${
                                    selectedShippingMethodId === option.id 
                                    ? 'border-neutral-900 bg-stone-50' 
                                    : 'border-stone-200 hover:border-neutral-400'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedShippingMethodId === option.id ? 'border-neutral-900' : 'border-stone-300'}`}>
                                        {selectedShippingMethodId === option.id && <div className="w-2 h-2 rounded-full bg-neutral-900"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {/* Carrier Label */}
                                            <span className="text-[10px] font-bold uppercase bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                                                {option.carrier_name}
                                            </span>
                                            <span className="font-bold text-sm text-neutral-900">{isRTL ? option.name_ar : option.name_en}</span>
                                        </div>
                                        <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                                            <Clock size={10} />
                                            {option.est_min_days}-{option.est_max_days} {isRTL ? 'أيام عمل' : 'business days'}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-mono text-sm font-bold">
                                    {option.is_free ? (
                                        <span className="text-green-600">{isRTL ? 'مجاني' : 'FREE'}</span>
                                    ) : (
                                        formatPrice(option.cost)
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-red-500 p-3 bg-red-50 border border-red-100 rounded flex items-center gap-2">
                                <Plane className="rotate-45" size={16} />
                                {isRTL ? 'نعتذر، لا يتوفر شحن لهذه المنطقة حالياً.' : 'Sorry, no shipping methods available for this location.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gifting Section */}
                <div className="pt-2">
                    <h3 className="font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <span className="bg-neutral-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                        {isRTL ? 'خيارات الإهداء' : 'Gifting Options'}
                    </h3>
                    <div className={`border p-4 rounded-sm transition-colors ${isGift ? 'bg-gold-50 border-gold-300' : 'bg-white border-stone-200'}`}>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isGift} 
                                onChange={(e) => setIsGift(e.target.checked)}
                                className="w-4 h-4 accent-neutral-900"
                            />
                            <div className="flex items-center gap-2">
                                <Gift size={18} className={isGift ? 'text-gold-600' : 'text-neutral-400'} />
                                <span className="font-bold text-sm text-neutral-800">{isRTL ? 'إضافة تغليف هدية فاخر' : 'Add Signature Gift Wrapping'}</span>
                                <span className="text-xs text-neutral-500">({formatPrice(GIFT_WRAP_FEE)})</span>
                            </div>
                        </label>
                        
                        {isGift && (
                            <div className="mt-4 pl-7 animate-fade-in-up">
                                <textarea 
                                    className="w-full p-3 border border-gold-200 rounded-sm text-sm focus:outline-none focus:border-gold-500 bg-white"
                                    placeholder={isRTL ? "اكتب رسالتك هنا..." : "Type your message here..."}
                                    rows={3}
                                    value={giftMessage}
                                    onChange={(e) => setGiftMessage(e.target.value)}
                                ></textarea>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Smart Payment Section */}
                <div className="pt-2">
                    <h3 className="font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <span className="bg-neutral-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span>
                        {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    
                    {availableMethods.length > 0 ? (
                        <div className="space-y-3">
                            {availableMethods.map(method => {
                                const isSelected = selectedMethodId === method.id;
                                
                                return (
                                    <div 
                                        key={method.id}
                                        onClick={() => setSelectedMethodId(method.id)}
                                        className={`border p-4 flex items-start gap-4 cursor-pointer transition-all ${
                                            isSelected 
                                            ? 'border-gold-500 bg-gold-50/30 ring-1 ring-gold-500' 
                                            : 'border-stone-200 hover:border-neutral-400 bg-white'
                                        }`}
                                    >
                                        <div className={`mt-1 ${isSelected ? 'text-gold-600' : 'text-neutral-400'}`}>
                                            {renderIcon(method.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className={`text-sm font-bold ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                                    {isRTL ? method.name_ar : method.name_en}
                                                </h4>
                                                {method.surcharge_sar && (
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                                        +{formatPrice(method.surcharge_sar)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {isRTL ? method.description_ar : method.description_en}
                                            </p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${isSelected ? 'border-gold-600' : 'border-stone-300'}`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-gold-600"></div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-600 p-4 text-sm flex items-start gap-2 border border-red-100 rounded">
                            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">{isRTL ? 'لا توجد طرق دفع متاحة' : 'No Payment Methods Available'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Summary & Action */}
                <div className="pt-6 mt-6 border-t border-stone-100">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-sm text-neutral-500">
                            <span>{isRTL ? 'قيمة الطلب' : 'Order Value'}</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-neutral-500">
                            <span>{isRTL ? 'الشحن' : 'Shipping'}</span>
                            <span>{shippingCost === 0 ? (isRTL ? 'مجاني' : 'Free') : formatPrice(shippingCost)}</span>
                        </div>
                        {isGift && (
                            <div className="flex justify-between items-center text-sm text-gold-600">
                                <span>{isRTL ? 'تغليف هدية' : 'Gift Wrapping'}</span>
                                <span>+{formatPrice(GIFT_WRAP_FEE)}</span>
                            </div>
                        )}
                        {paymentSurcharge > 0 && (
                            <div className="flex justify-between items-center text-sm text-red-600">
                                <span>{isRTL ? 'رسوم الدفع' : 'Payment Fee'}</span>
                                <span>+{formatPrice(paymentSurcharge)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                            <span className="text-lg font-serif">{isRTL ? 'المبلغ الإجمالي' : 'Total to Pay'}</span>
                            <span className="text-2xl font-bold font-mono">{formatPrice(finalTotal)}</span>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || availableMethods.length === 0 || calculatedShippingOptions.length === 0}
                        className="w-full bg-neutral-900 text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                        {isRTL ? `دفع ${formatPrice(finalTotal)}` : `Pay ${formatPrice(finalTotal)}`}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                        <ShieldCheck size={12} />
                        <span>Protected by 256-bit SSL Encryption. AI Fraud Protection Enabled.</span>
                    </div>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
