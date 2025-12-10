import React from 'react';
import { InfoPageType, Language } from '../types';
import { ArrowLeft } from 'lucide-react';

interface InfoPageProps {
    type: InfoPageType;
    language: Language;
    onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ type, language, onBack }) => {
    const isRTL = language === 'AR';

    const getContent = () => {
        switch (type) {
            case 'ABOUT':
                return {
                    title: isRTL ? 'عن عشتار' : 'About ISHTAR',
                    body: isRTL 
                        ? 'عشتار ليست مجرد متجر، بل هي بوابة نحو عالم من الرفاهية الرقمية. نحن نجمع بين أرقى العلامات التجارية العالمية وتقنيات الذكاء الاصطناعي لنقدم لك تجربة تسوق فريدة ومخصصة. تأسست عشتار لتكون الوجهة الأولى للباحثين عن التميز، مع التزام صارم بالأصالة والجودة.'
                        : 'ISHTAR is not merely a store; it is a gateway to digital luxury. We merge the world\'s finest maisons with cutting-edge Artificial Intelligence to curate a shopping experience that is uniquely yours. Founded to be the premier destination for connoisseurs of excellence, ISHTAR maintains an unwavering commitment to authenticity and quality.'
                };
            case 'SHIPPING':
                return {
                    title: isRTL ? 'سياسة الشحن والتوصيل' : 'Shipping Policy',
                    body: isRTL
                        ? 'نقوم بالشحن إلى جميع دول مجلس التعاون الخليجي ومعظم دول العالم. يتم توصيل الطلبات داخل المدن الرئيسية في السعودية والإمارات خلال 1-3 أيام عمل. للمناطق الأخرى والدولية، قد يستغرق التوصيل 3-7 أيام. جميع شحناتنا مؤمنة بالكامل حتى وصولها إلى باب منزلك.'
                        : 'We ship to all GCC countries and select international destinations. Deliveries within major cities in KSA and UAE typically arrive within 1-3 business days. For remote areas and international orders, please allow 3-7 business days. All shipments are fully insured until they reach your doorstep.'
                };
            case 'RETURNS':
                return {
                    title: isRTL ? 'الاسترجاع والاستبدال' : 'Returns & Exchange',
                    body: isRTL
                        ? 'نقبل طلبات الاسترجاع خلال 7 أيام من استلام الطلب، بشرط أن يكون المنتج في حالته الأصلية مع جميع البطاقات والتغليف. المنتجات المخصصة (مثل المحفورة) ومنتجات التجميل المفتوحة غير قابلة للاسترجاع لأسباب صحية. يتم فحص جميع المرتجعات بدقة قبل إعادة المبلغ.'
                        : 'Returns are accepted within 7 days of receipt, provided the item is in its original condition with all tags and packaging intact. Personalized items and opened beauty products are non-returnable for hygiene and customization reasons. All returns undergo a rigorous inspection before refunds are processed.'
                };
            case 'CONTACT':
                return {
                    title: isRTL ? 'اتصل بنا' : 'Contact Us',
                    body: isRTL
                        ? 'فريق خدمة عملاء عشتار متاح لخدمتكم يومياً من الساعة 9 صباحاً حتى 9 مساءً.\n\nالبريد الإلكتروني: concierge@ishtar.app\nالهاتف: +966 50 000 0000\nواتساب: متاح عبر الأيقونة في الموقع.'
                        : 'The Ishtar Concierge team is available to assist you daily from 9 AM to 9 PM.\n\nEmail: concierge@ishtar.app\nPhone: +966 50 000 0000\nWhatsApp: Available via the site icon.'
                };
            case 'TERMS':
                return {
                    title: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions',
                    body: isRTL
                        ? 'باستخدامك لتطبيق عشتار، فإنك توافق على الالتزام بجميع القوانين واللوائح المعمول بها. نحتفظ بالحق في تحديث الأسعار والمنتجات دون إشعار مسبق. جميع المحتويات والعلامات التجارية في هذا الموقع هي ملكية حصرية لشركة عشتار وشركائها.'
                        : 'By using the Ishtar application, you agree to comply with all applicable laws and regulations. We reserve the right to update prices and product availability without prior notice. All content and trademarks on this site are the exclusive property of Ishtar and its partners.'
                };
            case 'PRIVACY':
                return {
                    title: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
                    body: isRTL
                        ? 'نحن نولي خصوصيتك أقصى درجات الأهمية. يتم تشفير جميع بيانات الدفع والمعلومات الشخصية باستخدام أحدث التقنيات. لا نقوم بمشاركة بياناتك مع أطراف ثالثة إلا لغرض تنفيذ الطلب (مثل شركات الشحن).'
                        : 'Your privacy is of paramount importance to us. All payment data and personal information are encrypted using state-of-the-art technology. We do not share your data with third parties except for the purpose of order fulfillment (e.g., logistics partners).'
                };
            default:
                return { title: '', body: '' };
        }
    };

    const content = getContent();

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-3xl mx-auto px-6">
                <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors text-sm">
                    <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} /> {isRTL ? 'عودة' : 'Back'}
                </button>

                <h1 className="font-serif text-4xl mb-8 text-neutral-900">{content.title}</h1>
                
                <div className="prose prose-stone leading-relaxed text-neutral-600 whitespace-pre-line">
                    {content.body}
                </div>
            </div>
        </div>
    );
};

export default InfoPage;