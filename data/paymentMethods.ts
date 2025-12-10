import { PaymentMethod, PaymentRule } from '../types';

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'pm_card',
        code: 'card',
        gateway_id: 'gw_moyasar',
        name_en: 'Credit / Debit Card',
        name_ar: 'بطاقة ائتمان / مدى',
        description_en: 'Secure payment via Visa, Mastercard, or Amex.',
        description_ar: 'دفع آمن عبر فيزا، ماستركارد، أو أمريكان إكسبريس.',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_applepay',
        code: 'applepay',
        gateway_id: 'gw_moyasar',
        name_en: 'Apple Pay',
        name_ar: 'Apple Pay',
        description_en: 'Fast and secure payment with FaceID.',
        description_ar: 'دفع سريع وآمن باستخدام بصمة الوجه.',
        is_active: true,
        icon: 'smartphone'
    },
    {
        id: 'pm_mada',
        code: 'mada',
        gateway_id: 'gw_moyasar',
        name_en: 'Mada',
        name_ar: 'مدى',
        description_en: 'Local debit card payment (Saudi Arabia).',
        description_ar: 'بطاقة الصراف الآلي المحلية.',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_bnpl',
        code: 'bnpl',
        gateway_id: 'gw_tabby',
        name_en: 'Buy Now, Pay Later',
        name_ar: 'تقسيط (تارا / تابي)',
        description_en: 'Split your payment into 4 interest-free installments.',
        description_ar: 'قسم فاتورتك على 4 دفعات بدون فوائد.',
        is_active: true,
        icon: 'calendar-clock'
    },
    {
        id: 'pm_cod',
        code: 'cod',
        gateway_id: 'gw_cod_service',
        name_en: 'Cash on Delivery',
        name_ar: 'الدفع عند الاستلام',
        description_en: 'Pay in cash when you receive your order.',
        description_ar: 'ادفع نقداً عند استلام طلبك.',
        is_active: true,
        icon: 'banknote'
    },
    {
        id: 'pm_bank',
        code: 'bank_transfer',
        gateway_id: 'gw_stripe',
        name_en: 'Bank Transfer',
        name_ar: 'تحويل بنكي',
        description_en: 'Direct transfer for high-value orders.',
        description_ar: 'تحويل مباشر للطلبات ذات القيمة العالية.',
        is_active: true,
        icon: 'landmark'
    }
];

export const paymentRules: PaymentRule[] = [
    // 1. Credit Card: Always available, global
    {
        method_id: 'pm_card',
        allowed_countries: ['Global'],
        allowed_risk_levels: ['low', 'medium', 'high']
    },
    // 2. Apple Pay: Global
    {
        method_id: 'pm_applepay',
        allowed_countries: ['Global'],
        allowed_risk_levels: ['low', 'medium', 'high']
    },
    // 3. Mada: SA Only
    {
        method_id: 'pm_mada',
        allowed_countries: ['SA', 'Saudi Arabia'],
        allowed_risk_levels: ['low', 'medium', 'high']
    },
    // 4. BNPL: SA, AE Only, Value Range 300 - 5000
    {
        method_id: 'pm_bnpl',
        allowed_countries: ['SA', 'Saudi Arabia', 'AE', 'United Arab Emirates'],
        min_order_amount: 300,
        max_order_amount: 5000,
        allowed_risk_levels: ['low', 'medium'] // No high risk allowed for credit
    },
    // 5. COD: GCC Only, Max 2500, Surcharge applies
    {
        method_id: 'pm_cod',
        allowed_countries: ['SA', 'Saudi Arabia', 'AE', 'United Arab Emirates', 'KW', 'Kuwait', 'BH', 'Bahrain'],
        max_order_amount: 2500, // Too risky for high value items
        allowed_risk_levels: ['low', 'medium'], // High fraud risk users cannot use COD
        surcharge: 25,
        surcharge_label_en: 'COD Fee',
        surcharge_label_ar: 'رسوم الدفع عند الاستلام'
    },
    // 6. Bank Transfer: High Value Only (> 5000)
    {
        method_id: 'pm_bank',
        allowed_countries: ['Global'],
        min_order_amount: 5000,
        allowed_risk_levels: ['low', 'medium', 'high']
    }
];