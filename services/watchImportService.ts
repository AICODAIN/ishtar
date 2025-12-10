
import { Product, LuxurySupplier, ImportStats } from '../types';
import { luxurySuppliers } from '../data/luxurySuppliers';
import { currencies } from '../data/currencies';
import { notifyHighRiskImport } from './notificationService';

// --- MOCK RAW DATA ---
// Simulating raw feeds from different suppliers with "dirty" data
const MOCK_RAW_FEEDS = [
    {
        supplier_id: 'sup_brandsgateway',
        items: [
            { sku: 'BG-ROLEX-SUB-01', name: 'Rolex Submariner Date Steel', category: 'Watches > Men', price: 11000, currency: 'USD', brand: 'ROLEX', desc: 'Automatic movement, sapphire crystal.', material: 'Oystersteel', gender: 'Men', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800' },
            { sku: 'BG-HUBLOT-BB', name: 'Hublot Big Bang', category: 'Timepieces', price: 8500, currency: 'USD', brand: 'Hublot', desc: 'Ceramic case, rubber strap.', material: 'Ceramic', gender: 'Unisex', image: 'https://images.unsplash.com/photo-1612177344077-94321362934c?q=80&w=800' },
            { sku: 'BG-STRAP-01', name: 'Leather Watch Strap 22mm', category: 'Accessories > Watch Parts', price: 50, currency: 'USD', brand: 'Generic', desc: 'Calf leather.', material: 'Leather', gender: 'Unisex', image: '' } // Should be filtered out
        ]
    },
    {
        supplier_id: 'sup_luxury_dist',
        items: [
            { sku: 'LD-10022', name: 'Rolex Submariner Date', category: 'Luxury Watches', price: 10500, currency: 'EUR', brand: 'Rolex', desc: 'Diver watch 300m.', material: 'Steel', gender: 'Male', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800' }, // Duplicate of BG item
            { sku: 'LD-99321', name: 'Patek Philippe Nautilus', category: 'Watches', price: 95000, currency: 'EUR', brand: 'Patek Philippe', desc: 'Rose gold, brown dial.', material: 'Rose Gold', gender: 'Men', image: 'https://images.unsplash.com/photo-1639037466107-1601a4bc5759?q=80&w=800' },
            { sku: 'LD-MK-123', name: 'Michael Kors Bradshaw', category: 'Fashion Watches', price: 150, currency: 'EUR', brand: 'Michael Kors', desc: 'Quartz chronograph.', material: 'Gold Plated', gender: 'Women', image: 'https://images.unsplash.com/photo-1591942203799-a86d222234aa?q=80&w=800' }
        ]
    }
];

// --- 1. FILTER ---
const isWatch = (rawItem: any): boolean => {
    const cat = rawItem.category.toLowerCase();
    const name = rawItem.name.toLowerCase();
    
    // Explicit Inclusion
    if (cat.includes('watch') || cat.includes('timepiece')) {
        // Explicit Exclusion
        if (cat.includes('parts') || cat.includes('strap') || cat.includes('tool') || name.includes('strap')) {
            return false;
        }
        return true;
    }
    return false;
};

// --- 2. NORMALIZE ---
const normalizeBrand = (raw: string): string => {
    const r = raw.trim().toLowerCase();
    if (r === 'rolex') return 'Rolex';
    if (r === 'hublot') return 'Hublot';
    if (r === 'patek philippe' || r === 'patek') return 'Patek Philippe';
    if (r === 'michael kors') return 'Michael Kors';
    if (r === 'audemars piguet' || r === 'ap') return 'Audemars Piguet';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const normalizeGender = (raw: string): 'Men' | 'Women' | 'Unisex' | 'Kids' => {
    const r = raw.toLowerCase();
    if (r.includes('men') || r === 'male') return 'Men';
    if (r.includes('women') || r === 'female' || r === 'ladies') return 'Women';
    return 'Unisex';
};

const detectMovement = (desc: string): 'Automatic' | 'Quartz' | 'Manual' | 'Unknown' => {
    const d = desc.toLowerCase();
    if (d.includes('automatic') || d.includes('self-winding')) return 'Automatic';
    if (d.includes('quartz') || d.includes('battery')) return 'Quartz';
    if (d.includes('manual') || d.includes('hand-wound')) return 'Manual';
    return 'Unknown';
};

// --- 3. PRICING ---
const calculatePricing = (rawPrice: number, currencyCode: string, brand: string) => {
    // 1. Convert to SAR
    const currency = currencies.find(c => c.code === currencyCode);
    const rate = currency ? currency.exchange_rate_to_sar : 3.75; // Default USD
    const costSar = rawPrice * rate;

    // 2. Margin Logic based on Tier
    let margin = 25; // Default Premium
    const brandLower = brand.toLowerCase();
    
    if (brandLower === 'patek philippe' || brandLower === 'audemars piguet') margin = 15; // Ultra Lux (lower margin, high value)
    else if (brandLower === 'rolex') margin = 20;
    else if (brandLower === 'michael kors') margin = 50; // Fashion (high margin)

    const finalPrice = costSar * (1 + margin / 100);

    return { total_cost_sar: Math.round(costSar), margin_percent: margin, final_price_sar: Math.round(finalPrice) };
};

// --- 4. CLASSIFICATION ---
const classifyProduct = (product: Product): Product => {
    const p = { ...product };
    const nameLower = p.name.toLowerCase();

    // Sub-Category
    if (nameLower.includes('submariner') || nameLower.includes('diver') || (p.water_resistance && p.water_resistance.includes('300m'))) {
        p.sub_category = 'Dive Watch';
    } else if (nameLower.includes('chronograph') || nameLower.includes('speedmaster') || nameLower.includes('daytona')) {
        p.sub_category = 'Chronograph';
    } else if (nameLower.includes('dress') || p.case_material?.toLowerCase().includes('gold')) {
        p.sub_category = 'Dress Watch';
    } else {
        p.sub_category = 'Classic Watch';
    }

    // Tier
    const b = p.brand.toLowerCase();
    if (['patek philippe', 'audemars piguet', 'vacheron constantin', 'richard mille'].includes(b)) p.brand_tier = 'Ultra Luxury';
    else if (['rolex', 'omega', 'cartier', 'hublot', 'iwc'].includes(b)) p.brand_tier = 'Luxury';
    else if (['michael kors', 'diesel', 'fossil', 'guess'].includes(b)) p.brand_tier = 'Fashion';
    else p.brand_tier = 'Premium';

    // Risk Score
    if (p.brand_tier === 'Ultra Luxury' && p.final_price_sar < 50000) p.risk_score = 'High'; // Suspiciously cheap
    else if (p.brand_tier === 'Luxury' && p.final_price_sar < 10000) p.risk_score = 'Medium';
    else p.risk_score = 'Low';

    return p;
};

// --- MAIN ENGINE ---
export const runWatchImport = async (): Promise<{ products: Product[], stats: ImportStats }> => {
    console.log("Starting Watch Import Engine...");
    
    // Simulate Fetch Delay
    await new Promise(r => setTimeout(r, 2000));

    let processedProducts: Product[] = [];
    let stats: ImportStats = {
        totalFetched: 0,
        filteredOut: 0,
        normalized: 0,
        deduplicatedRemoved: 0,
        finalImported: 0,
        brandsCount: 0,
        totalValueSar: 0
    };

    // 1. Process Feeds
    for (const feed of MOCK_RAW_FEEDS) {
        for (const raw of feed.items) {
            stats.totalFetched++;

            // Filter
            if (!isWatch(raw)) {
                stats.filteredOut++;
                continue;
            }

            // Normalize
            const brand = normalizeBrand(raw.brand);
            const gender = normalizeGender(raw.gender);
            const pricing = calculatePricing(raw.price, raw.currency, brand);

            // Water Resistance Logic (Mock)
            let waterRes = '30m';
            if(raw.desc.includes('300m')) waterRes = '300m';
            if(raw.desc.includes('100m')) waterRes = '100m';

            const product: Product = {
                id: `imp-${feed.supplier_id}-${raw.sku}`,
                sku: raw.sku,
                name: raw.name,
                name_en: raw.name,
                name_ar: raw.name, // Placeholder for translation
                description: raw.desc,
                description_en: raw.desc,
                description_ar: raw.desc,
                brand: brand,
                category: 'Watches', // Main Category
                price: pricing.final_price_sar,
                currency: 'SAR',
                supplier_currency_code: raw.currency,
                supplier_base_cost: raw.price,
                total_cost_sar: pricing.total_cost_sar,
                final_price_sar: pricing.final_price_sar,
                margin_percent: pricing.margin_percent,
                shipping_cost_supplier_currency: 0,
                customs_fees_supplier_currency: 0,
                status: 'active',
                is_dropshipping: true,
                supplierId: feed.supplier_id,
                channelId: 1,
                image: raw.image,
                images: [raw.image],
                specs: { 
                    Movement: detectMovement(raw.desc), 
                    Material: raw.material,
                    'Water Resistance': waterRes
                },
                weight_kg: 0.5,
                // Watch Specifics
                gender: gender,
                movement: detectMovement(raw.desc),
                case_material: raw.material,
                water_resistance: waterRes,
                authenticity_verified: true // Assuming approved suppliers
            };

            const classified = classifyProduct(product);
            
            // Notification Trigger
            if (classified.risk_score === 'High') {
                await notifyHighRiskImport(classified);
            }

            processedProducts.push(classified);
            stats.normalized++;
        }
    }

    // 2. Deduplicate
    // Strategy: Create a unique key based on Normalized Brand + Substring of Name (Model)
    const uniqueMap = new Map<string, Product>();
    
    processedProducts.forEach(p => {
        // Simple key generation: "ROLEX-SUBMARINER"
        // Remove spaces, take first 15 chars of model name
        const modelKey = p.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 15);
        const key = `${p.brand.toUpperCase()}-${modelKey}`;

        if (uniqueMap.has(key)) {
            const existing = uniqueMap.get(key)!;
            // Logic: Keep the one with lower cost (better margin) or preferred supplier
            if (p.total_cost_sar < existing.total_cost_sar) {
                uniqueMap.set(key, p); // Replace with cheaper option
            }
            stats.deduplicatedRemoved++;
        } else {
            uniqueMap.set(key, p);
        }
    });

    const finalProducts = Array.from(uniqueMap.values());
    stats.finalImported = finalProducts.length;
    stats.brandsCount = new Set(finalProducts.map(p => p.brand)).size;
    stats.totalValueSar = finalProducts.reduce((acc, p) => acc + p.final_price_sar, 0);

    return { products: finalProducts, stats };
};
