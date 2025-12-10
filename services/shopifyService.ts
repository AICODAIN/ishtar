
import { Channel, Product, AdminOrder } from '../types';
import { products as initialProducts } from '../data/products';

// Mock Data Generators for Simulation
const generateShopifyProduct = (id: number, channel: Channel) => ({
    id: `shopify_${channel.id}_${id}`,
    title: `Imported Luxury Item ${id} (${channel.country_code})`,
    body_html: `<p>This is a premium item imported from ${channel.name}.</p>`,
    vendor: 'Ishtar Global',
    product_type: 'Accessories',
    variants: [
        { 
            price: (Math.random() * 500 + 100).toFixed(2), 
            sku: `ISH-${channel.country_code}-${id}`,
            inventory_quantity: Math.floor(Math.random() * 20)
        }
    ],
    images: [
        { src: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400' }
    ]
});

// --- API Service Simulation ---

/**
 * Simulates calling a Google Apps Script Web App that acts as middleware for Shopify APIs.
 * In production, this would be: await fetch(GAS_WEB_APP_URL, { method: 'POST', body: JSON.stringify({ action: 'sync_products', store: ... }) });
 */
export const syncProductsFromShopify = async (channel: Channel): Promise<Product[]> => {
    console.log(`[ShopifyService] Syncing products from ${channel.store_domain}...`);
    
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate response from Shopify
    const mockCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 new products
    const newProducts: Product[] = [];

    for (let i = 0; i < mockCount; i++) {
        const raw = generateShopifyProduct(Date.now() + i, channel);
        const price = parseFloat(raw.variants[0].price);

        // Map Shopify Data to ISHTAR Product
        const p: Product = {
            id: `imp-${raw.id}`,
            sku: raw.variants[0].sku,
            name: raw.title,
            name_en: raw.title,
            name_ar: raw.title, // Placeholder
            brand: 'Maison Ishtar', // Default or parse from vendor
            category: 'Accessories',
            price: price,
            currency: channel.default_currency_code || 'SAR',
            supplier_currency_code: channel.default_currency_code || 'SAR',
            supplier_base_cost: price * 0.6, // Estimate cost
            shipping_cost_supplier_currency: 0,
            customs_fees_supplier_currency: 0,
            total_cost_sar: price * 0.6, // Approximate
            margin_percent: 40,
            final_price_sar: price,
            image: raw.images[0].src,
            images: raw.images.map(img => img.src),
            description: raw.body_html.replace(/<[^>]*>?/gm, ''), // Strip HTML
            description_en: raw.body_html.replace(/<[^>]*>?/gm, ''),
            description_ar: raw.body_html.replace(/<[^>]*>?/gm, ''),
            specs: { Origin: channel.country_code || 'Global' },
            is_dropshipping: true,
            supplierId: 1, // Default supplier ID for imported items
            channelId: channel.id,
            channelSource: 'SHOPIFY',
            status: 'draft', // Imported as draft for review
            stock_quantity: raw.variants[0].inventory_quantity,
            shopify_product_id: raw.id,
            shopify_handle: raw.title.toLowerCase().replace(/\s/g, '-'),
            weight_kg: 1
        };
        newProducts.push(p);
    }

    return newProducts;
};

/**
 * Simulates receiving a Webhook payload from Shopify for a created order.
 */
export const simulateIncomingWebhook = (type: 'orders/create' | 'orders/paid', channel: Channel): AdminOrder => {
    const orderId = Math.floor(Math.random() * 90000) + 10000;
    const amount = Math.floor(Math.random() * 2000) + 500;
    
    return {
        id: `SH-${channel.country_code}-${orderId}`,
        customer: `Shopify Customer ${orderId}`,
        email: `customer${orderId}@example.com`,
        phone: '+966500000000',
        shipping_address: `Imported Address from ${channel.name}`,
        payment_method: 'Shopify Payments',
        total: amount,
        status: 'processing',
        fraud_score: 0,
        date: new Date().toISOString().split('T')[0],
        items_count: 1,
        items: [
            {
                id: `line-${orderId}`,
                product_name: 'Imported Shopify Item',
                sku: `ISH-IMP-${orderId}`,
                quantity: 1,
                price: amount,
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200',
                supplier_status: 'pending',
                supplier_id: 1 // Default supplier
            }
        ],
        channel_id: channel.id,
        shopify_order_id: String(orderId)
    };
};
