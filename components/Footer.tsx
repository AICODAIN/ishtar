
import React, { useState } from 'react';
import { InfoPageType, Language } from '../types';

interface FooterProps {
    onNavigateInfo: (type: InfoPageType) => void;
    language: Language;
}

const Footer: React.FC<FooterProps> = ({ onNavigateInfo, language }) => {
    const isRTL = language === 'AR';

    return (
        <footer className={`bg-neutral-900 text-neutral-400 py-16 text-sm ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                {/* Brand */}
                <div>
                    <h3 className="text-white font-serif text-2xl tracking-widest mb-4">ISHTAR𒀭</h3>
                    <p className="text-xs leading-relaxed max-w-xs mb-6">
                        {isRTL 
                         ? 'الوجهة الأولى للرفاهية الرقمية. نجمع بين الحرفية التراثية والذكاء الاصطناعي.' 
                         : 'The premier destination for digital luxury. Merging heritage craftsmanship with artificial intelligence.'}
                    </p>
                    <p className="text-[10px] text-neutral-600">© 2024 Ishtar. All rights reserved.</p>
                </div>

                {/* About */}
                <div>
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">{isRTL ? 'عشتار' : 'The Maison'}</h4>
                    <ul className="space-y-3 text-xs">
                        <li><button onClick={() => onNavigateInfo('ABOUT')} className="hover:text-gold-500 transition-colors">{isRTL ? 'قصتنا' : 'Our Story'}</button></li>
                        <li><button onClick={() => onNavigateInfo('CONTACT')} className="hover:text-gold-500 transition-colors">{isRTL ? 'اتصل بنا' : 'Contact Us'}</button></li>
                        <li><button className="hover:text-gold-500 transition-colors">{isRTL ? 'الوظائف' : 'Careers'}</button></li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">{isRTL ? 'خدمة العملاء' : 'Customer Care'}</h4>
                    <ul className="space-y-3 text-xs">
                        <li><button onClick={() => onNavigateInfo('SHIPPING')} className="hover:text-gold-500 transition-colors">{isRTL ? 'الشحن والتوصيل' : 'Shipping & Delivery'}</button></li>
                        <li><button onClick={() => onNavigateInfo('RETURNS')} className="hover:text-gold-500 transition-colors">{isRTL ? 'الاسترجاع' : 'Returns & Exchanges'}</button></li>
                        <li><button onClick={() => onNavigateInfo('TERMS')} className="hover:text-gold-500 transition-colors">{isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}</button></li>
                        <li><button onClick={() => onNavigateInfo('PRIVACY')} className="hover:text-gold-500 transition-colors">{isRTL ? 'الخصوصية' : 'Privacy Policy'}</button></li>
                    </ul>
                </div>

                {/* Social / Newsletter */}
                <div>
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">{isRTL ? 'تواصل معنا' : 'Connect'}</h4>
                    <div className="flex gap-4 mb-6">
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                    <p className="text-[10px] italic">{isRTL ? 'اشترك في نشرتنا البريدية للحصول على دعوات حصرية.' : 'Subscribe for exclusive invitations.'}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
