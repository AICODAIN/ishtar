
import { PaymentGateway, PaymentMethod } from '../types';

// --- PAYMENT GATEWAYS ---
export const paymentGateways: PaymentGateway[] = [
    // 1. SAUDI ARABIA (Moyasar - Primary for Mada/Visa)
    {
        id: 'gw_sa_moyasar',
        name_ar: 'بوابة الدفع السعودية',
        name_en: 'KSA Payment Gateway (Moyasar)',
        provider: 'Moyasar',
        supported_currencies: ['SAR'],
        supported_countries: ['Saudi Arabia', 'SA'],
        supported_channels: ['native', 'shopify'],
        min_amount_sar: 1,
        max_amount_sar: 100000,
        allow_cod: false,
        allow_bnpl: false,
        is_active: true,
        priority: 1,
        fee_fixed_sar: 1.0,
        fee_percent: 1.5 // Standard Mada/Visa rate
    },
    // 2. UAE (Checkout.com)
    {
        id: 'gw_ae_checkout',
        name_ar: 'الدفع الآمن (الإمارات)',
        name_en: 'Checkout.com UAE',
        provider: 'Checkout',
        supported_currencies: ['AED', 'USD'],
        supported_countries: ['United Arab Emirates', 'AE'],
        supported_channels: ['native'],
        min_amount_sar: 50,
        max_amount_sar: 500000,
        allow_cod: false,
        allow_bnpl: false,
        is_active: true,
        priority: 1,
        fee_fixed_sar: 1.5,
        fee_percent: 2.9
    },
    // 3. KUWAIT (Tap Payments - Primary for KNET)
    {
        id: 'gw_kw_tap',
        name_ar: 'تاب للمدفوعات',
        name_en: 'Tap Payments',
        provider: 'Tap',
        supported_currencies: ['KWD', 'SAR', 'BHD'],
        supported_countries: ['Kuwait', 'KW', 'Bahrain', 'BH'],
        supported_channels: ['native'],
        min_amount_sar: 50,
        max_amount_sar: 50000,
        allow_cod: false,
        allow_bnpl: false,
        is_active: true,
        priority: 1,
        fee_fixed_sar: 2.0,
        fee_percent: 2.5
    },
    // 4. BNPL (Tabby - Regional)
    {
        id: 'gw_regional_tabby',
        name_ar: 'تابي (تقسيط)',
        name_en: 'Tabby BNPL',
        provider: 'Tabby',
        supported_currencies: ['SAR', 'AED', 'KWD', 'BHD'],
        supported_countries: ['Saudi Arabia', 'SA', 'United Arab Emirates', 'AE', 'Kuwait', 'KW', 'Bahrain', 'BH'],
        supported_channels: ['native', 'shopify'],
        min_amount_sar: 300, // Enforced min
        max_amount_sar: 5000, // Enforced max
        allow_cod: false,
        allow_bnpl: true,
        is_active: true,
        priority: 2,
        fee_fixed_sar: 1.0,
        fee_percent: 6.5 // Higher merchant fee for BNPL
    },
    // 5. GLOBAL (Stripe)
    {
        id: 'gw_global_stripe',
        name_ar: 'الدفع الدولي',
        name_en: 'Stripe Global',
        provider: 'Stripe',
        supported_currencies: ['USD', 'EUR', 'GBP', 'QAR', 'OMR'],
        supported_countries: ['Global', 'Qatar', 'QA', 'Oman', 'OM', 'USA'], 
        supported_channels: ['native'],
        min_amount_sar: 50,
        max_amount_sar: 500000,
        allow_cod: false,
        allow_bnpl: false,
        is_active: true,
        priority: 10,
        fee_fixed_sar: 1.5,
        fee_percent: 3.5 // International cards
    },
    // 6. COD (Internal Logic)
    {
        id: 'gw_internal_cod',
        name_ar: 'الدفع عند الاستلام',
        name_en: 'Cash on Delivery Service',
        provider: 'Internal_COD',
        supported_currencies: ['SAR', 'AED', 'KWD'],
        supported_countries: ['Saudi Arabia', 'SA', 'United Arab Emirates', 'AE', 'Kuwait', 'KW'],
        supported_channels: ['native'],
        min_amount_sar: 0,
        max_amount_sar: 2000, // Strict limit
        allow_cod: true,
        allow_bnpl: false,
        is_active: true,
        priority: 5,
        fee_fixed_sar: 25, // COD Surcharge cost
        fee_percent: 0
    }
];

// --- PAYMENT METHODS MAPPING ---
export const paymentMethods: PaymentMethod[] = [
    // SA Methods (Moyasar)
    {
        id: 'pm_mada',
        code: 'mada',
        gateway_id: 'gw_sa_moyasar',
        name_en: 'Mada',
        name_ar: 'مدى',
        description_en: 'Local debit card payment.',
        description_ar: 'بطاقة الصراف الآلي المحلية.',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_card_sa',
        code: 'card',
        gateway_id: 'gw_sa_moyasar',
        name_en: 'Credit Card',
        name_ar: 'بطاقة ائتمانية',
        description_en: 'Visa / Mastercard',
        description_ar: 'فيزا / ماستركارد',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_applepay_sa',
        code: 'applepay',
        gateway_id: 'gw_sa_moyasar',
        name_en: 'Apple Pay',
        name_ar: 'Apple Pay',
        description_en: 'Secure payment with FaceID.',
        description_ar: 'دفع آمن ببصمة الوجه.',
        is_active: true,
        icon: 'smartphone'
    },

    // AE Methods (Checkout.com)
    {
        id: 'pm_card_ae',
        code: 'card',
        gateway_id: 'gw_ae_checkout',
        name_en: 'Credit Card',
        name_ar: 'بطاقة ائتمانية',
        description_en: 'Visa / Mastercard / Amex',
        description_ar: 'فيزا / ماستركارد / أمريكان إكسبريس',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_applepay_ae',
        code: 'applepay',
        gateway_id: 'gw_ae_checkout',
        name_en: 'Apple Pay',
        name_ar: 'Apple Pay',
        description_en: 'Secure payment.',
        description_ar: 'دفع آمن.',
        is_active: true,
        icon: 'smartphone'
    },

    // KW Methods (Tap)
    {
        id: 'pm_knet',
        code: 'knet',
        gateway_id: 'gw_kw_tap',
        name_en: 'KNET',
        name_ar: 'كي نت',
        description_en: 'Kuwait Local Debit',
        description_ar: 'بطاقة الصراف المحلية بالكويت',
        is_active: true,
        icon: 'credit-card'
    },
    {
        id: 'pm_card_kw',
        code: 'card',
        gateway_id: 'gw_kw_tap',
        name_en: 'Credit Card',
        name_ar: 'بطاقة ائتمانية',
        description_en: 'Visa / Mastercard',
        description_ar: 'فيزا / ماستركارد',
        is_active: true,
        icon: 'credit-card'
    },

    // BNPL (Tabby)
    {
        id: 'pm_tabby_4',
        code: 'bnpl',
        gateway_id: 'gw_regional_tabby',
        name_en: 'Tabby - 4 Payments',
        name_ar: 'تابي - 4 دفعات',
        description_en: 'Split into 4 interest-free payments.',
        description_ar: 'قسم فاتورتك على 4 دفعات بدون فوائد.',
        is_active: true,
        icon: 'calendar-clock'
    },

    // COD (Internal)
    {
        id: 'pm_cod_cash',
        code: 'cod',
        gateway_id: 'gw_internal_cod',
        name_en: 'Cash on Delivery',
        name_ar: 'الدفع عند الاستلام',
        description_en: 'Pay cash upon receipt.',
        description_ar: 'ادفع نقداً عند استلام الطلب.',
        is_active: true,
        icon: 'banknote',
        surcharge_sar: 25
    },

    // Global (Stripe)
    {
        id: 'pm_card_global',
        code: 'card',
        gateway_id: 'gw_global_stripe',
        name_en: 'Credit Card (Intl)',
        name_ar: 'بطاقة ائتمان دولية',
        description_en: 'Secure International Payment',
        description_ar: 'دفع دولي آمن',
        is_active: true,
        icon: 'credit-card'
    }
];
