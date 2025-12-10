
import { ShippingZone, ShippingMethod, ShippingZoneRule, ShippingCarrier } from '../types';

// --- CARRIERS ---
export const shippingCarriers: ShippingCarrier[] = [
    {
        id: 'cr_aramex',
        name: 'Aramex',
        tracking_url_pattern: 'https://www.aramex.com/track/results?ShipmentNumber=TRACKING_NUMBER',
        is_active: true
    },
    {
        id: 'cr_smsa',
        name: 'SMSA Express',
        tracking_url_pattern: 'http://track.smsaexpress.com/Details.aspx?TrackNO=TRACKING_NUMBER',
        is_active: true
    },
    {
        id: 'cr_dhl',
        name: 'DHL Express',
        tracking_url_pattern: 'https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=TRACKING_NUMBER',
        is_active: true
    },
    {
        id: 'cr_ishtar',
        name: 'Ishtar Private Logistics',
        tracking_url_pattern: 'https://ishtar.app/track?id=TRACKING_NUMBER',
        is_active: true
    }
];

// --- ZONES ---
export const shippingZones: ShippingZone[] = [
    {
        code: 'SA_MAIN',
        name_en: 'Saudi Arabia - Main Cities',
        name_ar: 'السعودية - المدن الرئيسية',
        countries: ['Saudi Arabia', 'SA'],
        cities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Mecca', 'Medina']
    },
    {
        code: 'SA_REMOTE',
        name_en: 'Saudi Arabia - Remote',
        name_ar: 'السعودية - مناطق أخرى',
        countries: ['Saudi Arabia', 'SA'],
        // Cities is empty implies "All other cities in SA" logic
    },
    {
        code: 'GCC_MAIN',
        name_en: 'GCC Countries',
        name_ar: 'دول الخليج',
        countries: ['United Arab Emirates', 'UAE', 'AE', 'Kuwait', 'KW', 'Qatar', 'QA', 'Bahrain', 'BH', 'Oman', 'OM']
    },
    {
        code: 'GLOBAL',
        name_en: 'International',
        name_ar: 'دولي',
        countries: ['USA', 'UK', 'France'] // simplified for demo
    }
];

// --- METHODS LINKED TO CARRIERS ---
export const shippingMethods: ShippingMethod[] = [
    {
        id: 'sm_smsa_standard',
        carrier_id: 'cr_smsa',
        name_en: 'SMSA Standard',
        name_ar: 'سمسا عادي',
        type: 'standard',
        est_min_days: 3,
        est_max_days: 5,
        base_fee_sar: 0,
        per_kg_fee_sar: 0
    },
    {
        id: 'sm_aramex_priority',
        carrier_id: 'cr_aramex',
        name_en: 'Aramex Priority',
        name_ar: 'أرامكس أولوية',
        type: 'express',
        est_min_days: 1,
        est_max_days: 3,
        base_fee_sar: 0,
        per_kg_fee_sar: 0
    },
    {
        id: 'sm_dhl_global',
        carrier_id: 'cr_dhl',
        name_en: 'DHL Express Worldwide',
        name_ar: 'دي إتش إل إكسبرس',
        type: 'express',
        est_min_days: 3,
        est_max_days: 5,
        base_fee_sar: 0,
        per_kg_fee_sar: 0
    },
    {
        id: 'sm_ishtar_vip',
        carrier_id: 'cr_ishtar',
        name_en: 'White Glove VIP Service',
        name_ar: 'خدمة كبار الشخصيات',
        type: 'vip',
        est_min_days: 1,
        est_max_days: 1,
        base_fee_sar: 0,
        per_kg_fee_sar: 0
    }
];

// --- RULES WITH PER KG FEES ---
export const shippingRules: ShippingZoneRule[] = [
    // --- SA MAIN ---
    {
        zone_code: 'SA_MAIN',
        method_id: 'sm_smsa_standard',
        base_fee_sar: 25,
        per_kg_fee_sar: 2, // 2 SAR per extra KG
        free_shipping_threshold: 500, 
        is_active: true
    },
    {
        zone_code: 'SA_MAIN',
        method_id: 'sm_aramex_priority',
        base_fee_sar: 45,
        per_kg_fee_sar: 5,
        is_active: true
    },
    {
        zone_code: 'SA_MAIN',
        method_id: 'sm_ishtar_vip',
        base_fee_sar: 150, 
        per_kg_fee_sar: 0, // Flat fee for VIP
        is_active: true
    },

    // --- SA REMOTE ---
    {
        zone_code: 'SA_REMOTE',
        method_id: 'sm_smsa_standard',
        base_fee_sar: 45,
        per_kg_fee_sar: 5,
        free_shipping_threshold: 1000,
        is_active: true
    },

    // --- GCC ---
    {
        zone_code: 'GCC_MAIN',
        method_id: 'sm_aramex_priority',
        base_fee_sar: 60,
        per_kg_fee_sar: 15, // Higher international weight fee
        free_shipping_threshold: 2000,
        is_active: true
    },
    {
        zone_code: 'GCC_MAIN',
        method_id: 'sm_dhl_global',
        base_fee_sar: 120,
        per_kg_fee_sar: 25,
        is_active: true
    },

    // --- GLOBAL ---
    {
        zone_code: 'GLOBAL',
        method_id: 'sm_dhl_global',
        base_fee_sar: 180,
        per_kg_fee_sar: 40,
        is_active: true
    }
];
