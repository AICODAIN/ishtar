
import { CalculatedShippingOption, ShippingZone, CartItem } from '../types';
import { shippingZones, shippingMethods, shippingRules, shippingCarriers } from '../data/shipping';

// 1. Resolve Zone based on Country & City
export const resolveZoneCode = (country: string, city: string): string => {
    // 1. Check Specific Zones (Main Cities)
    const mainZone = shippingZones.find(z => 
        z.countries.includes(country) && z.cities?.some(c => city.toLowerCase().includes(c.toLowerCase()))
    );
    if (mainZone) return mainZone.code;

    // 2. Check Country General Zone
    const countryZone = shippingZones.find(z => 
        z.countries.includes(country) && !z.cities // Fallback zone for country
    );
    if (countryZone) return countryZone.code;

    // 3. Check GCC
    const gccCountries = ['United Arab Emirates', 'UAE', 'AE', 'Kuwait', 'KW', 'Qatar', 'QA', 'Bahrain', 'BH', 'Oman', 'OM'];
    if (gccCountries.includes(country)) return 'GCC_MAIN';

    // 4. Default Global
    return 'GLOBAL';
};

// 2. Calculate Total Weight of Cart
export const calculateTotalWeight = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        const itemWeight = item.weight_kg || 1; // Default to 1kg if missing
        return total + (itemWeight * item.quantity);
    }, 0);
};

// 3. Main Calculation Logic
export const calculateShippingOptions = (
    country: string, 
    city: string, 
    cartTotalSAR: number, 
    cartItems: CartItem[]
): CalculatedShippingOption[] => {
    
    const zoneCode = resolveZoneCode(country, city);
    const totalWeight = calculateTotalWeight(cartItems);

    // Get rules for this zone
    const activeRules = shippingRules.filter(r => r.zone_code === zoneCode && r.is_active);

    return activeRules.map(rule => {
        const method = shippingMethods.find(m => m.id === rule.method_id);
        if (!method) return null;

        const carrier = shippingCarriers.find(c => c.id === method.carrier_id);
        if (!carrier) return null;

        // Cost Calculation: Base + (Weight * PerKG)
        // If free shipping threshold met, cost is 0
        let cost = rule.base_fee_sar + (totalWeight * rule.per_kg_fee_sar);
        
        const isFree = rule.free_shipping_threshold !== undefined && cartTotalSAR >= rule.free_shipping_threshold;
        if (isFree) cost = 0;

        return {
            ...method,
            cost: Math.round(cost), // Round to nearest integer
            is_free: isFree,
            carrier_name: carrier.name
        };
    }).filter(Boolean) as CalculatedShippingOption[];
};

// 4. Tracking URL Generator
export const getTrackingUrl = (carrierId: string | undefined, trackingNumber: string | undefined): string | null => {
    if (!carrierId || !trackingNumber) return null;
    
    const carrier = shippingCarriers.find(c => c.id === carrierId);
    if (!carrier) return null;

    return carrier.tracking_url_pattern.replace('TRACKING_NUMBER', trackingNumber);
};

// 5. Get Carrier Info
export const getCarrierById = (id: string) => shippingCarriers.find(c => c.id === id);
