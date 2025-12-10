
import { UserProfile, Product, Supplier, Channel, CurrencyConfig, Category, Brand, Promotion, AdminOrder } from '../types';

// --- CURRENCIES ---
export const currencies: CurrencyConfig[] = [
  { code: 'SAR', exchange_rate_to_sar: 1, rate_to_sar: 1, rate_from_sar: 1, symbol: 'SAR', name_en: 'Saudi Riyal', name_ar: 'ريال سعودي' },
  { code: 'USD', exchange_rate_to_sar: 3.75, rate_to_sar: 3.75, rate_from_sar: 0.266, symbol: '$', name_en: 'US Dollar', name_ar: 'دولار أمريكي' },
  { code: 'AED', exchange_rate_to_sar: 1.02, rate_to_sar: 1.02, rate_from_sar: 0.98, symbol: 'AED', name_en: 'UAE Dirham', name_ar: 'درهم إماراتي' },
  { code: 'KWD', exchange_rate_to_sar: 12.2, rate_to_sar: 12.2, rate_from_sar: 0.082, symbol: 'KWD', name_en: 'Kuwaiti Dinar', name_ar: 'دينار كويتي' },
  { code: 'EUR', exchange_rate_to_sar: 4.05, rate_to_sar: 4.05, rate_from_sar: 0.247, symbol: '€', name_en: 'Euro', name_ar: 'يورو' },
];

// --- USERS ---
export const users: UserProfile[] = [
  {
    id: 'usr_super_admin',
    username: 'super_abdul',
    name: 'ABDULRAHMAN',
    email: 'CX.TV@HOTMAIL.COM', // Target Super Admin
    phone: '+966558816638',
    role: 'super_admin', // Full Permissions
    preferences: { language: 'EN', currency: 'SAR', country: 'Saudi Arabia', notify_order_status: true, notify_promotions: true },
    loyalty: { points: 99999, tier: 'Platinum' },
    addresses: []
  },
  {
    id: 'usr_supplier_1',
    username: 'riyadh_watches',
    name: 'Riyadh Watches Manager',
    email: 'supplier@ishtar.app',
    phone: '+966500000000',
    role: 'supplier',
    supplierId: 1,
    preferences: { language: 'AR', currency: 'SAR', country: 'Saudi Arabia', notify_order_status: true, notify_promotions: false },
    loyalty: { points: 0, tier: 'Silver' },
    addresses: []
  },
  {
    id: 'usr_customer_1',
    username: 'sarah_c',
    name: 'Sarah Customer',
    email: 'sarah@example.com',
    phone: '+966551112222',
    role: 'customer',
    preferences: { language: 'EN', currency: 'SAR', country: 'Saudi Arabia', notify_order_status: true, notify_promotions: true },
    loyalty: { points: 500, tier: 'Gold' },
    addresses: [
      { id: 'addr_1', type: 'Home', country: 'Saudi Arabia', city: 'Riyadh', street: 'Olaya St', is_default: true }
    ]
  }
];

// --- SUPPLIERS ---
export const suppliers: Supplier[] = [
  { 
      id: 1, name: 'Riyadh Luxury Watches', contact_email: 'watches@riyadh.com', country: 'Saudi Arabia', status: 'active',
      type: 'external_api', contact_phone: '+966500000000', default_channel_id: 1,
      performance: { score: 98, avg_fulfillment_days: 1.2, cancel_rate: 0 }
  },
  { 
      id: 2, name: 'Dubai Premium Bags', contact_email: 'bags@dubai.com', country: 'UAE', status: 'active',
      type: 'external_api', contact_phone: '+971500000000', default_channel_id: 3,
      performance: { score: 95, avg_fulfillment_days: 2.5, cancel_rate: 1.0 }
  },
  { 
      id: 3, name: 'Paris Fragrance Lab', contact_email: 'scents@paris.com', country: 'France', status: 'active',
      type: 'external_api', contact_phone: '+33100000000', default_channel_id: 1,
      performance: { score: 92, avg_fulfillment_days: 4.0, cancel_rate: 0.5 }
  },
];

// --- CHANNELS ---
export const channels: Channel[] = [
  { id: 1, name: 'Ishtar Native', type: 'native', status: 'connected', default_currency_code: 'SAR', country_code: 'SA' },
  { id: 2, name: 'Shopify Global', type: 'shopify', status: 'connected', store_domain: 'ishtar-global.myshopify.com', default_currency_code: 'USD', country_code: 'US' },
];

// --- CATEGORIES ---
export const categories: Category[] = [
  { id: 'cat_watches', name_en: 'Timepieces', name_ar: 'ساعات', slug: 'watches', parent_id: null },
  { id: 'cat_bags', name_en: 'Bags', name_ar: 'حقائب', slug: 'bags', parent_id: null },
  { id: 'cat_perfume', name_en: 'Fragrances', name_ar: 'عطور', slug: 'fragrances', parent_id: null },
];

// --- BRANDS ---
export const brands: Brand[] = [
  { id: 'br_ishtar', name_en: 'Maison Ishtar', name_ar: 'دار عشتار', group: 'ISHTAR', cover_image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800', description_en: 'Private Label', description_ar: 'علامة خاصة', country: 'France', category: 'Fashion', logo: '' },
  { id: 'br_rolex', name_en: 'Rolex', name_ar: 'رولكس', group: 'LUXURY', cover_image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800', description_en: 'Swiss Watches', description_ar: 'ساعات سويسرية', country: 'Switzerland', category: 'Watches', logo: '' },
];

// --- PRODUCTS (With Costing) ---
export const products: Product[] = [
  {
    id: 'prod_1', sku: 'RLX-SUB-001', 
    name: 'Submariner Date',
    name_en: 'Submariner Date', name_ar: 'صبمارينر ديت',
    description_en: 'Oystersteel, 41mm', description_ar: 'فولاذ، 41 مم',
    description: 'The archetype of the diver\'s watch. The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert.',
    brand: 'Rolex', category: 'watches',
    status: 'active', is_dropshipping: true, supplierId: 1, channelId: 1,
    supplier_currency_code: 'USD', supplier_base_cost: 11000, shipping_cost_supplier_currency: 100, customs_fees_supplier_currency: 500,
    total_cost_sar: 43500, margin_percent: 25, final_price_sar: 54375,
    price: 54375, currency: 'SAR',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800', images: [],
    specs: { material: 'Steel' }, weight_kg: 0.5
  },
  {
    id: 'prod_2', sku: 'ISH-OUD-001', 
    name: 'Royal Oud',
    name_en: 'Royal Oud', name_ar: 'عود ملكي',
    description_en: 'Signature Scent', description_ar: 'رائحة مميزة',
    description: 'A rich, woody fragrance featuring rare oud, sandalwood, and spices.',
    brand: 'Maison Ishtar', category: 'fragrances',
    status: 'active', is_dropshipping: false, supplierId: 3, channelId: 1,
    supplier_currency_code: 'EUR', supplier_base_cost: 50, shipping_cost_supplier_currency: 5, customs_fees_supplier_currency: 0,
    total_cost_sar: 225, margin_percent: 200, final_price_sar: 675,
    price: 675, currency: 'SAR',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800', images: [],
    specs: { volume: '100ml' }, weight_kg: 0.4
  }
];

// --- ORDERS (For Admin/Supplier) ---
export const adminOrders: AdminOrder[] = [
  {
    id: 'ORD-1001', user_id: 'usr_customer_1', customer_name: 'Sarah Customer', customer_email: 'sarah@example.com', customer_phone: '+966551112222', 
    customer: 'Sarah Customer', email: 'sarah@example.com', phone: '+966551112222', date: '2024-03-10',
    status: 'processing', payment_status: 'paid', payment_method: 'card',
    shipping_address: 'Riyadh, Olaya St', shipping_carrier_id: 'DHL', tracking_number: '123456789',
    total_products_sar: 54375, shipping_cost_charged_sar: 50, shipping_cost_actual_sar: 40, payment_fees_sar: 815,
    total_revenue_sar: 54425, total_cost_sar: 44355, net_profit_sar: 10070,
    items: [
      { id: 'item_1', product_id: 'prod_1', product_name: 'Submariner Date', sku: 'RLX-SUB-001', quantity: 1, unit_cost_sar: 43500, unit_price_sar: 54375, price: 54375, supplier_id: 1, supplier_status: 'pending', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800' }
    ],
    currency_code: 'SAR', fraud_score: 5, total: 54425, items_count: 1, channel_id: 1
  }
];

export const promotions: Promotion[] = [
  { id: 'promo_1', name_en: 'Summer Sale', name_ar: 'عروض الصيف', type: 'percentage', value: 15, start_date: '2024-01-01', end_date: '2024-12-31', scope: 'category', target_id: 'watches', is_active: true }
];
