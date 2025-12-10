
import React, { useState } from 'react';
import { User, Package, Heart, LogOut, Gift, Award, Bell, ExternalLink, Truck } from 'lucide-react';
import { UserProfile, Language, Currency, AdminOrder } from '../types';
import { getTrackingUrl, getCarrierById } from '../services/shippingService';

interface AccountProps {
  user: UserProfile;
  orders: AdminOrder[];
  language: Language;
  currency: Currency;
  setLanguage: (l: Language) => void;
  setCurrency: (c: Currency) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Account: React.FC<AccountProps> = ({ user, orders, language, currency, setLanguage, setCurrency, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  // Local state for toggles (mocking API update)
  const [notifications, setNotifications] = useState(user.preferences);
  const isRTL = language === 'AR';

  const toggleNotification = (key: keyof typeof notifications) => {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto px-6">
            <h1 className="font-serif text-4xl mb-12 text-neutral-900">{isRTL ? 'حسابي' : 'My Account'}</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="space-y-2">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left p-3 flex items-center gap-3 text-sm ${activeTab === 'profile' ? 'bg-neutral-900 text-white' : 'hover:bg-stone-50 text-neutral-600'}`}
                    >
                        <User size={16} /> {isRTL ? 'الملف الشخصي' : 'Profile & Settings'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`w-full text-left p-3 flex items-center gap-3 text-sm ${activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'hover:bg-stone-50 text-neutral-600'}`}
                    >
                        <Package size={16} /> {isRTL ? 'طلباتي' : 'My Orders'}
                    </button>
                    <button 
                        onClick={() => onNavigate('WISHLIST')}
                        className={`w-full text-left p-3 flex items-center gap-3 text-sm hover:bg-stone-50 text-neutral-600`}
                    >
                        <Heart size={16} /> {isRTL ? 'المفضلة' : 'Wishlist'}
                    </button>
                    <button 
                        onClick={onLogout}
                        className={`w-full text-left p-3 flex items-center gap-3 text-sm hover:bg-red-50 text-red-600 mt-8`}
                    >
                        <LogOut size={16} /> {isRTL ? 'تسجيل خروج' : 'Logout'}
                    </button>
                </aside>

                {/* Content */}
                <div className="md:col-span-3">
                    {/* Loyalty Card - Always Visible Top */}
                    <div className="bg-neutral-900 text-white p-6 rounded-lg mb-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500 rounded-full blur-3xl opacity-20 translate-x-10 -translate-y-10"></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gold-500 mb-1">{isRTL ? 'برنامج الولاء' : 'Ishtar Loyalty'}</p>
                                <h3 className="font-serif text-2xl">{user.loyalty.tier} Member</h3>
                            </div>
                            <div className="text-right">
                                <span className="block text-3xl font-bold font-mono text-gold-400">{user.loyalty.points.toLocaleString()}</span>
                                <span className="text-xs text-neutral-400">{isRTL ? 'نقطة' : 'Points Balance'}</span>
                            </div>
                        </div>
                        <div className="mt-6 w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gold-500 h-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-2">{isRTL ? 'أنت قريب من المستوى التالي' : 'You are close to the next tier'}</p>
                    </div>

                    {activeTab === 'profile' && (
                        <div className="bg-stone-50 p-8 border border-stone-200">
                            <h3 className="font-serif text-xl mb-6">{isRTL ? 'المعلومات الشخصية' : 'Personal Information'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-1">{isRTL ? 'اسم المستخدم' : 'Username'}</label>
                                    <div className="font-medium text-neutral-900">{user.username || '-'}</div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-1">{isRTL ? 'الاسم' : 'Name'}</label>
                                    <div className="font-medium">{user.name}</div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                                    <div className="font-medium">{user.email}</div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                                    <div className="font-medium">{user.phone}</div>
                                </div>
                            </div>

                            <h3 className="font-serif text-xl mb-6 pt-6 border-t border-stone-200">{isRTL ? 'تفضيلات التطبيق' : 'App Preferences'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-2">{isRTL ? 'اللغة' : 'Language'}</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setLanguage('EN')} className={`px-4 py-2 border text-xs ${language === 'EN' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>English</button>
                                        <button onClick={() => setLanguage('AR')} className={`px-4 py-2 border text-xs ${language === 'AR' ? 'bg-neutral-900 text-white' : 'bg-white'}`}>العربية</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-400 mb-2">{isRTL ? 'العملة' : 'Currency'}</label>
                                    <select 
                                        className="p-2 border border-stone-300 bg-white text-sm w-32"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as Currency)}
                                    >
                                        {['SAR', 'USD', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <h3 className="font-serif text-xl mb-6 pt-6 border-t border-stone-200 flex items-center gap-2"><Bell size={20}/> {isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{isRTL ? 'حالة الطلب والشحن' : 'Order Status & Shipping'}</span>
                                    <button 
                                        onClick={() => toggleNotification('notify_order_status')}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${notifications.notify_order_status ? 'bg-green-500' : 'bg-neutral-300'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${notifications.notify_order_status ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{isRTL ? 'العروض الحصرية والمنتجات الجديدة' : 'Exclusive Offers & New Arrivals'}</span>
                                    <button 
                                        onClick={() => toggleNotification('notify_promotions')}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${notifications.notify_promotions ? 'bg-green-500' : 'bg-neutral-300'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${notifications.notify_promotions ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <p className="text-neutral-500 italic">{isRTL ? 'ليس لديك طلبات سابقة.' : 'No orders found.'}</p>
                            ) : (
                                orders.map(order => {
                                    const carrier = order.carrier_id ? getCarrierById(order.carrier_id) : null;
                                    const trackingUrl = getTrackingUrl(order.carrier_id, order.tracking_number);

                                    return (
                                    <div key={order.id} className="bg-white border border-stone-200 p-6 rounded-lg relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-stone-100 pb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-lg">{order.id}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-neutral-500">{order.date} • {order.items_count} Items</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-bold text-lg">{order.total.toLocaleString()} {currency}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Tracking & Logistics Info */}
                                        {order.status !== 'pending' && order.status !== 'processing' && (
                                            <div className="bg-stone-50 p-4 rounded mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Truck size={18} className="text-neutral-600" />
                                                    <div>
                                                        <p className="text-xs font-bold uppercase text-neutral-500">{isRTL ? 'شركة الشحن' : 'Carrier'}</p>
                                                        <p className="text-sm font-medium">{carrier ? carrier.name : 'Logistics Partner'}</p>
                                                    </div>
                                                </div>
                                                {trackingUrl && (
                                                    <a 
                                                        href={trackingUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-xs bg-white border border-stone-200 px-3 py-2 rounded font-bold hover:bg-neutral-900 hover:text-white transition-colors"
                                                    >
                                                        {isRTL ? 'تتبع الشحنة' : 'Track Order'} <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Gifting & Loyalty Meta */}
                                        <div className="flex gap-6 text-xs mt-4">
                                            {order.points_earned && (
                                                <div className="flex items-center gap-2 text-gold-600 font-bold">
                                                    <Award size={14} />
                                                    <span>+{order.points_earned} Points</span>
                                                </div>
                                            )}
                                            {order.is_gift && (
                                                <div className="flex items-center gap-2 text-purple-600 font-bold">
                                                    <Gift size={14} />
                                                    <span>Gift Wrapped</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )})
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Account;
