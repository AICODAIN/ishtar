
import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { login } from '../services/authService';
import { UserProfile, Language } from '../types';

interface LoginProps {
    onLoginSuccess: (user: UserProfile) => void;
    onGuestAccess: () => void;
    language: Language;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onGuestAccess, language }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const isRTL = language === 'AR';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(email, password);
            if (user) {
                onLoginSuccess(user);
            } else {
                setError(isRTL ? 'بيانات الدخول غير صحيحة' : 'Invalid email or password');
            }
        } catch (err) {
            setError(isRTL ? 'حدث خطأ في النظام' : 'System error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-stone-50 p-6 ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="bg-white max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-sm overflow-hidden border border-stone-200">
                
                {/* Left: Image/Brand */}
                <div className="hidden md:block relative">
                    <img 
                        src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" 
                        alt="Luxury" 
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-neutral-900/40 flex flex-col justify-center items-center text-white p-8 text-center">
                        <h2 className="font-serif text-4xl mb-4 tracking-widest">ISHTAR𒀭</h2>
                        <p className="text-sm font-light leading-relaxed max-w-xs">
                            {isRTL 
                             ? 'بوابة نحو عالم من الرفاهية الرقمية. تفضل بالدخول لتجربة مصممة خصيصاً لك.' 
                             : 'A gateway to digital luxury. Enter for a curated experience tailored exclusively to you.'}
                        </p>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-12 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <h1 className="font-serif text-2xl text-neutral-900 mb-2">{isRTL ? 'تسجيل الدخول' : 'Sign In'}</h1>
                        <p className="text-neutral-500 text-xs uppercase tracking-widest">{isRTL ? 'مرحباً بعودتك' : 'Welcome Back'}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
                            <div className="relative">
                                <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-neutral-400`} size={18} />
                                <input 
                                    type="email" 
                                    required
                                    className={`w-full bg-stone-50 border border-stone-200 p-3 ${isRTL ? 'pr-10' : 'pl-10'} text-sm focus:outline-none focus:border-gold-500 transition-colors`}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">{isRTL ? 'كلمة المرور' : 'Password'}</label>
                            <div className="relative">
                                <Lock className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} text-neutral-400`} size={18} />
                                <input 
                                    type="password" 
                                    required
                                    className={`w-full bg-stone-50 border border-stone-200 p-3 ${isRTL ? 'pr-10' : 'pl-10'} text-sm focus:outline-none focus:border-gold-500 transition-colors`}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-neutral-900 text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (isRTL ? 'دخول' : 'Sign In')}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-stone-100 pt-6">
                        <button 
                            onClick={onGuestAccess}
                            className="text-xs text-neutral-500 hover:text-gold-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            {isRTL ? 'متابعة كزائر' : 'Continue as Guest'} <ArrowRight size={12} className={isRTL ? 'rotate-180' : ''} />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                        <ShieldCheck size={12} />
                        <span>{isRTL ? 'اتصال آمن ومشفّر' : 'Secure Encrypted Connection'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
