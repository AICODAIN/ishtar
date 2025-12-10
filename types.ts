
export enum AppMode {
    SHOPPER = 'SHOPPER',
    ADMIN = 'ADMIN'
}

export type Currency = 'SAR' | 'USD' | 'AED' | 'KWD' | 'QAR' | 'EUR' | 'GBP' | 'BHD' | 'OMR';
export type Language = 'EN' | 'AR';
export type Role = 'super_admin' | 'admin' | 'operations_manager' | 'marketing_manager' | 'finance_manager' | 'risk_officer' | 'supplier' | 'view_only_analyst' | 'customer';
export type ViewState = 'HOME' | 'LOGIN' | 'ADMIN_DASHBOARD' | 'SUPPLIER_PORTAL' | 'CATALOG' | 'CATEGORIES' | 'COLLECTIONS' | 'PRODUCT' | 'BRAND' | 'BRANDS_LIST' | 'LOOKS' | 'BUNDLES' | 'CART' | 'CHECKOUT' | 'ACCOUNT' | 'WISHLIST' | 'INFO';
export type InfoPageType = 'ABOUT' | 'SHIPPING' | 'RETURNS' | 'CONTACT' | 'TERMS' | 'PRIVACY';
export type RiskLevel = 'low' | 'medium' | 'high';
export type DateRange = 'today' | '7days' | '30days' | 'month' | 'all';
export type DataClassification = 'PUBLIC' | 'BUSINESS_CONFIDENTIAL' | 'SENSITIVE_PII' | 'HIGHLY_SENSITIVE';

export interface UserPreferences {
    language: Language;
    currency: Currency;
    country: string;
    notify_order_status: boolean;
    notify_promotions: boolean;
}

export interface Address {
    id: string;
    type: string;
    country: string;
    city: string;
    street: string;
    is_default?: boolean;
}

export interface Loyalty {
    points: number;
    tier: string;
}

export interface UserProfile {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    preferences: UserPreferences;
    loyalty: Loyalty;
    addresses: Address[];
    supplierId?: number | string;
    is_active?: boolean;
    language?: Language;
    currency?: Currency;
    country?: string;
}

export interface AdminUser extends UserProfile {
}

export interface PricingRule {
    id: number;
    name: string;
    applies_to_category_id?: string;
    applies_to_brand_id?: string;
    country: string;
    margin_percent: number;
    is_active: boolean;
    min_base_price_sar?: number;
    max_base_price_sar?: number;
}

export interface Variant {
    id?: string;
    name?: string;
    sku: string;
    price: number | string;
    inventory_quantity?: number;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    name_en: string;
    name_ar: string;
    brand: string;
    category: string;
    sub_category?: string;
    price: number;
    currency: string;
    final_price_sar?: number;
    supplier_currency_code?: string;
    supplier_base_cost?: number;
    shipping_cost_supplier_currency?: number;
    customs_fees_supplier_currency?: number;
    total_cost_sar?: number;
    margin_percent?: number;
    image: string;
    images: string[];
    description: string;
    description_en?: string;
    description_ar?: string;
    specs: Record<string, string>;
    channelSource?: string;
    status: 'active' | 'draft' | 'archived';
    is_dropshipping: boolean;
    supplierId: number | string;
    channelId: number | string;
    stock_quantity?: number;
    avg_fulfillment_days?: number;
    weight_kg?: number;
    variants?: Variant[];
    brand_tier?: string;
    risk_score?: string;
    authenticity_verified?: boolean;
    movement?: string;
    case_material?: string;
    water_resistance?: string;
    gender?: string;
    shopify_product_id?: string | number;
    shopify_handle?: string;
}

export interface CartItem extends Product {
    quantity: number;
    cartId: string;
    selectedVariant?: Variant;
}

export interface Brand {
    id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    logo: string;
    cover_image: string;
    group: 'LUXURY' | 'ISHTAR' | 'REGIONAL' | string;
    category: string;
    country: string;
    is_featured?: boolean;
    supplier_id?: number | string;
}

export interface Category {
    id: string;
    name_en: string;
    name_ar: string;
    slug: string;
    parent_id: string | null;
    image?: string;
}

export interface Campaign {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    target_segment: string;
    hero_video: VideoAsset;
}

export interface VideoAsset {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    category_tags: string[];
    duration_sec: number;
    hotspots: ProductHotspot[];
    is_highlight?: boolean;
}

export interface ProductHotspot {
    id: string;
    productId: string;
    timestamp_start: number;
    timestamp_end: number;
    x_position: number;
    y_position: number;
    label?: string;
}

export interface ImportStats {
    totalFetched: number;
    filteredOut: number;
    normalized: number;
    deduplicatedRemoved: number;
    finalImported: number;
    brandsCount: number;
    totalValueSar: number;
}

export interface LuxurySupplier {
    supplier_id: string;
    supplier_name: string;
    website_url: string;
    region: string;
    country: string;
    hq_country: string;
    supported_markets: string[];
    main_categories: string[];
    is_dropshipping: boolean;
    authenticity_claim: string;
    integration_type: string;
    status: string;
}

export interface Supplier {
    id: number | string;
    name: string;
    type: string;
    country: string;
    contact_email: string;
    contact_phone: string;
    default_channel_id: number;
    status: string;
    payment_terms?: string;
    supported_zones?: string[];
    shipping_policy?: {
        type: string;
        base_fee_sar: number;
        free_threshold_sar?: number;
    };
    performance?: {
        score: number;
        avg_fulfillment_days: number;
        cancel_rate: number;
    };
    service_regions?: string[];
}

export interface Channel {
    id: number | string;
    name: string;
    type: string;
    status: string;
    default_currency_code?: string;
    country_code?: string;
    api_base_url?: string;
    role?: string;
    store_domain?: string;
    last_sync_at?: string;
    api_key?: string;
    api_secret?: string;
    webhook_url_orders?: string;
    webhook_url_products?: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    actor_id: string;
    actor_role: string;
    action_type: 'UPDATE' | 'CREATE' | 'DELETE' | 'EXPORT' | 'SYNC' | 'VIEW';
    entity_type: 'SETTINGS' | 'ORDER' | 'FINANCE' | 'SUPPLIER' | 'PRODUCT';
    entity_id?: string;
    details: string;
    ip_address: string;
}

export interface AISetting {
    id: string;
    feature_key: string;
    name: string;
    description: string;
    is_enabled: boolean;
    last_updated: string;
    model_used: string;
}

export interface SmartBot {
    id: string;
    name: string;
    icon: string;
    trigger: string;
    description: string;
    steps: string[];
    isActive: boolean;
    stats: {
        runs: number;
        successRate: string;
        lastRun: string;
    };
}

export interface OrderItem {
    id: string;
    product_name: string;
    product_id?: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
    supplier_id: number | string;
    supplier_status: string;
    unit_cost_sar?: number;
    unit_price_sar?: number;
    supplier_tracking_number?: string;
}

export interface AdminOrder {
    id: string;
    customer: string;
    email: string;
    phone: string;
    date: string;
    status: string;
    payment_method: string;
    payment_status?: string;
    payment_gateway?: string;
    total: number;
    items_count: number;
    items: OrderItem[];
    shipping_address: string;
    shipping_carrier_id?: string;
    shipping_method?: string;
    tracking_number?: string;
    fraud_score: number;
    channel_id: number | string;
    
    user_id?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    
    currency_code?: string;
    
    total_products_sar?: number;
    shipping_cost_charged_sar?: number;
    shipping_cost_actual_sar?: number;
    payment_fees_sar?: number;
    total_revenue_sar?: number;
    total_cost_sar?: number;
    net_profit_sar?: number;
    
    is_gift?: boolean;
    points_earned?: number;
    carrier_id?: string;
    gift_message?: string;
    gift_wrap_fee?: number;
    payment_total?: number;
    shopify_order_id?: string;
    
    // Internal Bot flags
    processed_by_bot?: boolean;
    bot_action_log?: string[];
}

export interface Review {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Look {
    id: string;
    title: string;
    image: string;
    products: string[];
    occasion: string;
}

export interface GiftBundle {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
}

export interface CurrencyConfig {
    code: Currency;
    name_en: string;
    name_ar: string;
    exchange_rate_to_sar: number;
    rate_to_sar: number;
    rate_from_sar: number;
    symbol: string;
    is_enabled?: boolean;
}

export interface Promotion {
    id: string;
    name_en: string;
    name_ar: string;
    type: 'percentage' | 'fixed' | 'percentage_discount' | 'fixed_amount_discount';
    value?: number;
    discount_value?: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    scope: 'category' | 'min_order' | 'brand' | 'all';
    target_id?: string;
    target_ids?: string[];
    min_order_amount_sar?: number;
    description?: string;
}

export interface PaymentGateway {
    id: string;
    name_ar: string;
    name_en: string;
    provider: string;
    supported_currencies: string[];
    supported_countries: string[];
    supported_channels: string[];
    min_amount_sar: number;
    max_amount_sar: number;
    allow_cod: boolean;
    allow_bnpl: boolean;
    is_active: boolean;
    priority: number;
    fee_fixed_sar: number;
    fee_percent: number;
}

export interface PaymentMethod {
    id: string;
    code: string;
    gateway_id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    is_active: boolean;
    icon: string;
    surcharge_sar?: number;
}

export interface PaymentRule {
    method_id: string;
    allowed_countries: string[];
    allowed_risk_levels: string[];
    min_order_amount?: number;
    max_order_amount?: number;
    surcharge?: number;
    surcharge_label_en?: string;
    surcharge_label_ar?: string;
}

export interface ShippingCarrier {
    id: string;
    name: string;
    tracking_url_pattern: string;
    is_active: boolean;
}

export interface ShippingZone {
    code: string;
    name_en: string;
    name_ar: string;
    countries: string[];
    cities?: string[];
}

export interface ShippingMethod {
    id: string;
    carrier_id: string;
    name_en: string;
    name_ar: string;
    type: 'standard' | 'express' | 'vip';
    est_min_days: number;
    est_max_days: number;
    base_fee_sar: number;
    per_kg_fee_sar: number;
}

export interface ShippingZoneRule {
    zone_code: string;
    method_id: string;
    base_fee_sar: number;
    per_kg_fee_sar: number;
    free_shipping_threshold?: number;
    is_active: boolean;
}

export interface CalculatedShippingOption extends ShippingMethod {
    cost: number;
    is_free: boolean;
    carrier_name: string;
}

export interface FraudCheck {
    id: number | string;
    order_id: string;
    score: number;
    risk_level: string;
    checked_at: string;
    status: string;
    risk_factors?: string[];
}

export interface SystemLog {
    id: number | string;
    type: string;
    message: string;
    created_at: string;
    related_order_id?: string;
    details?: any;
}

export interface ApiKey {
    id: string;
    name: string;
    owner_type: string;
    key_prefix: string;
    scopes: string[];
    created_at: string;
    status: string;
    owner_id?: string;
}

export interface FeatureFlag {
    key: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface CustomerSegment {
    id: string;
    name: string;
    count: number;
    avg_ltv: number;
    growth: number;
}

export interface FinanceStat {
    id: string;
    period: string;
    gross_revenue: number;
    net_profit: number;
    marketing_spend: number;
    supplier_payouts: number;
    margin_percent: number;
}

export interface Payout {
    id: string;
    supplier_id: string;
    supplier_name: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
}

export interface Workflow {
    id: number;
    name: string;
    trigger_event: string;
    actions: string[];
    is_active: boolean;
}

export interface OrderProfit {
    order_id: string;
    calculated_at: string;
    total_revenue_sar: number;
    total_cost_sar: number;
    net_profit_sar: number;
    profit_margin_percent: number;
    breakdown: {
        product_cost_sar: number;
        shipping_cost_actual_sar: number;
        payment_fees_sar: number;
        shipping_revenue_sar: number;
    };
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    attachment?: { type: 'image' | 'video', url: string };
    groundingUrls?: { title: string; uri: string }[];
}
