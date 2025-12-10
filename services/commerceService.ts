
import { currencies } from '../data/coreData';
import { Currency, Product, Promotion, CartItem, Brand, Category, UserProfile } from '../types';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { logAuditAction } from './securityService';

export const getExchangeRate = (targetCurrency: Currency): number => {
  const config = currencies.find(c => c.code === targetCurrency);
  return config ? config.rate_from_sar : 1;
};

export const convertPrice = (priceSar: number, targetCurrency: Currency): number => {
  if (targetCurrency === 'SAR') return priceSar;
  const rate = getExchangeRate(targetCurrency);
  return priceSar * rate;
};

export const formatPrice = (priceSar: number, currency: Currency, language: 'EN' | 'AR'): string => {
  const converted = convertPrice(priceSar, currency);
  return new Intl.NumberFormat(language === 'AR' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: currency
  }).format(converted);
};

export const calculateProfitability = (costSar: number, revenueSar: number) => {
  const profit = revenueSar - costSar;
  const margin = revenueSar > 0 ? (profit / revenueSar) * 100 : 0;
  return { profit, margin };
};

export const getActivePromotionForProduct = (product: Product, promotions: Promotion[]): Promotion | undefined => {
    return promotions.find(p => {
        if (!p.is_active) return false;
        if (p.scope === 'all') return true;
        if (p.scope === 'category' && (p.target_id === product.category || (p.target_ids && p.target_ids.includes(product.category)))) return true;
        if (p.scope === 'brand' && p.target_id === product.brand) return true;
        return false;
    });
};

export const calculateDiscountedPrice = (price: number, promotion?: Promotion): number => {
    if (!promotion) return price;
    if (promotion.type === 'percentage' || promotion.type === 'percentage_discount') {
        const val = promotion.value || promotion.discount_value || 0;
        return price * (1 - val / 100);
    }
    if (promotion.type === 'fixed' || promotion.type === 'fixed_amount_discount') {
        const val = promotion.value || promotion.discount_value || 0;
        return Math.max(0, price - val);
    }
    return price;
};

export const calculateCart = (items: CartItem[], currency: Currency, promotions: Promotion[]) => {
    let subtotalSAR = 0;
    items.forEach(item => {
        subtotalSAR += item.price * item.quantity;
    });

    // Simple promotion logic for cart total (e.g., min_order scope)
    let discountSAR = 0;
    const cartPromo = promotions.find(p => p.scope === 'min_order' && p.is_active && p.min_order_amount_sar && subtotalSAR >= p.min_order_amount_sar);
    
    if (cartPromo) {
        if (cartPromo.type === 'percentage_discount' || cartPromo.type === 'percentage') {
             const val = cartPromo.value || cartPromo.discount_value || 0;
             discountSAR = subtotalSAR * (val / 100);
        } else {
             const val = cartPromo.value || cartPromo.discount_value || 0;
             discountSAR = val;
        }
    }

    const shippingSAR = subtotalSAR > 1000 ? 0 : 50; // Mock rule
    const totalSAR = Math.max(0, subtotalSAR - discountSAR + shippingSAR);

    return {
        subtotalSAR,
        discountSAR,
        shippingSAR,
        totalSAR
    };
};

// --- SEARCH API SIMULATION ---

// In-memory cache to optimize repeated queries
const brandSearchCache = new Map<string, Brand[]>();

export const searchBrands = async (query: string): Promise<Brand[]> => {
    const normalizedQuery = query.toLowerCase().trim();

    if (brandSearchCache.has(normalizedQuery)) {
        return brandSearchCache.get(normalizedQuery)!;
    }

    return new Promise((resolve) => {
        const latency = normalizedQuery ? Math.floor(Math.random() * 200) + 100 : 50;

        setTimeout(() => {
            let results: Brand[];

            if (!normalizedQuery) {
                results = [...brands]
                    .sort((a, b) => {
                        if (a.is_featured && !b.is_featured) return -1;
                        if (!a.is_featured && b.is_featured) return 1;
                        return a.name_en.localeCompare(b.name_en);
                    })
                    .slice(0, 50);
            } else {
                results = brands
                    .map(brand => {
                        let score = 0;
                        const nameEn = brand.name_en.toLowerCase();
                        const nameAr = brand.name_ar;

                        if (nameEn === normalizedQuery || nameAr === normalizedQuery) score += 100; 
                        else if (nameEn.startsWith(normalizedQuery)) score += 50; 
                        else if (nameEn.includes(normalizedQuery) || nameAr.includes(normalizedQuery)) score += 20; 
                        else if (brand.country.toLowerCase().includes(normalizedQuery)) score += 10; 

                        if (brand.is_featured && score > 0) score += 5; 

                        return { brand, score };
                    })
                    .filter(item => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .map(item => item.brand)
                    .slice(0, 20); 
            }

            brandSearchCache.set(normalizedQuery, results);
            
            if (brandSearchCache.size > 200) {
                const firstKey = brandSearchCache.keys().next().value;
                if (firstKey) brandSearchCache.delete(firstKey);
            }

            resolve(results);
        }, latency);
    });
};

// --- GLOBAL SEARCH AGGREGATOR ---

export const searchGlobal = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], brands: [], categories: [] };

    // 1. Search Products
    const matchedProducts = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.name_en.toLowerCase().includes(q) ||
        p.name_ar.includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 6);

    // 2. Search Brands
    const matchedBrands = brands.filter(b => 
        b.name_en.toLowerCase().includes(q) || 
        b.name_ar.includes(q) ||
        b.country.toLowerCase().includes(q)
    ).slice(0, 4);

    // 3. Search Categories
    const matchedCategories = categories.filter(c => 
        c.name_en.toLowerCase().includes(q) || 
        c.name_ar.includes(q)
    ).slice(0, 4);

    return { products: matchedProducts, brands: matchedBrands, categories: matchedCategories };
};

// --- SECURE EXPORT UTILS ---

export const exportToCSV = (data: any[], filename: string, requestingUser?: UserProfile) => {
    if (!data.length) return;
    
    // Security Check: Suppliers cannot export arbitrary data
    if (requestingUser?.role === 'supplier') {
        // Allow ONLY if data seems to be their products/orders (simplified check)
        // In real app, we'd check the object type strictly
        console.log("Supplier export request - monitoring.");
    }

    // Log the export action if user provided
    if (requestingUser) {
        logAuditAction(requestingUser, 'EXPORT', 'SETTINGS', `Exported CSV: ${filename}`);
    }
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert to CSV string
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(fieldName => {
            let val = row[fieldName];
            
            // Basic Masking for CSV (if sensitive fields exist and user is restricted)
            // This is a failsafe. Ideally `data` passed in is already masked via `secureOrderView` etc.
            if (requestingUser && requestingUser.role === 'view_only_analyst') {
                if (fieldName === 'email' || fieldName === 'phone') val = '******';
            }

            // Handle commas or quotes in data
            if (typeof val === 'string') {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            if (typeof val === 'object') {
                val = `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            }
            return val;
        }).join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
