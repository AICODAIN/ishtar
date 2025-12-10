
import { PaymentGateway, PaymentMethod, RiskLevel, Currency } from '../types';
import { paymentGateways, paymentMethods } from '../data/paymentGateways';

interface RoutingContext {
    userCountry: string;
    userCurrency: string;
    orderAmountSAR: number;
    channel?: string; // 'native', 'shopify', etc.
    riskLevel: RiskLevel;
}

// 1. Logic to Select the Best Gateway
export const selectBestGateways = (context: RoutingContext): PaymentGateway[] => {
    const candidates = paymentGateways.filter(gw => {
        if (!gw.is_active) return false;

        // Country Check (Handle 'Global' wildcard)
        const countryMatch = gw.supported_countries.includes(context.userCountry) || 
                             gw.supported_countries.includes('Global') ||
                             (context.userCountry === 'Saudi Arabia' && gw.supported_countries.includes('SA')) ||
                             (context.userCountry === 'United Arab Emirates' && gw.supported_countries.includes('AE')) ||
                             (context.userCountry === 'Kuwait' && gw.supported_countries.includes('KW'));
                             
        if (!countryMatch) return false;

        // Currency Check
        if (!gw.supported_currencies.includes(context.userCurrency)) return false;

        // Channel Check
        if (context.channel && !gw.supported_channels.includes(context.channel)) return false;

        // Amount Check (Strict)
        if (context.orderAmountSAR < gw.min_amount_sar || context.orderAmountSAR > gw.max_amount_sar) return false;

        // Risk Check for COD Gateway specifically
        // If Risk is HIGH, strictly forbid COD gateway
        if (gw.allow_cod && context.riskLevel === 'high') return false;

        return true;
    });

    // 2. Sort by Priority (Lower number = Higher priority)
    return candidates.sort((a, b) => a.priority - b.priority);
};

// 2. Logic to Get Methods for a specific Gateway
export const getMethodsForGateway = (gateway: PaymentGateway, context: RoutingContext): PaymentMethod[] => {
    // Get all methods linked to this gateway
    const methods = paymentMethods.filter(m => m.gateway_id === gateway.id && m.is_active);

    return methods.filter(m => {
        // --- COD Strict Rules ---
        if (m.code === 'cod') {
            if (!gateway.allow_cod) return false;
            
            // Rule 1: Max Limit 2000 SAR (Regardless of gateway max, enforce business rule)
            if (context.orderAmountSAR > 2000) return false; 
            
            // Rule 2: Risk Level
            if (context.riskLevel === 'high') return false;
            
            // Rule 3: Geo Restriction (Explicit)
            const allowedCOD = ['Saudi Arabia', 'SA', 'United Arab Emirates', 'AE', 'Kuwait', 'KW'];
            if (!allowedCOD.includes(context.userCountry)) return false;
        }

        // --- BNPL Strict Rules ---
        if (m.code === 'bnpl') {
            if (!gateway.allow_bnpl) return false;
            
            // Rule: Range 300 - 5000 SAR
            if (context.orderAmountSAR < 300 || context.orderAmountSAR > 5000) return false;
        }

        // --- KNET Logic (Kuwait Only) ---
        if (m.code === 'knet') {
            if (context.userCountry !== 'Kuwait' && context.userCountry !== 'KW') return false;
        }

        // --- Apple Pay Logic ---
        if (m.code === 'applepay') {
            const isAppleDevice = /iPhone|iPad|Macintosh/i.test(navigator.userAgent);
            if (!isAppleDevice) return false;
            // Apple Pay usually requires supported currencies
            if (!['SAR', 'AED', 'USD', 'GBP', 'EUR'].includes(context.userCurrency)) return false;
        }

        return true;
    });
};

// 3. Main Orchestrator: Get available methods across valid gateways
export const getSmartPaymentMethods = (context: RoutingContext): PaymentMethod[] => {
    const validGateways = selectBestGateways(context);
    
    // We want to merge methods from valid gateways.
    // If multiple gateways offer 'card' (e.g. Moyasar and Stripe), we only want the one from the HIGHEST priority gateway.
    // But we allow distinct methods like 'cod' or 'bnpl' from other gateways if valid.
    
    let combinedMethods: PaymentMethod[] = [];
    const addedCodes = new Set<string>();

    for (const gw of validGateways) {
        const gwMethods = getMethodsForGateway(gw, context);
        
        gwMethods.forEach(m => {
            // Deduplicate standard methods (card, applepay) based on code
            // So if Moyasar (Pri 1) adds 'card', Stripe (Pri 10) 'card' is ignored.
            if (['card', 'applepay', 'mada', 'knet'].includes(m.code)) {
                if (!addedCodes.has(m.code)) {
                    combinedMethods.push(m);
                    addedCodes.add(m.code);
                }
            } else {
                // Allow unique methods like COD and BNPL to be added if they pass their specific gateway checks
                if (!addedCodes.has(m.id)) { // Check by unique ID for these to be safe
                     combinedMethods.push(m);
                     addedCodes.add(m.id);
                }
            }
        });
    }

    return combinedMethods;
};
