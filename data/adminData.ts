
import { SmartBot, AISetting, SystemLog, AuditLog, FraudCheck, PricingRule } from '../types';

export const smartBots: SmartBot[] = [
    {
        id: 'bot_import_engine',
        name: 'Ishtar Import Engine',
        icon: 'import', 
        trigger: 'On Product Created',
        description: 'AI-driven pipeline for ingesting new luxury products. It automatically enriches content and sets financial rules.',
        steps: [
            'Generate Premium EN/AR Descriptions (Gemini)', 
            'Auto-Detect Category & Tags', 
            'Apply Tier-Based Pricing Rules', 
            'Notify Admin (Dashboard)'
        ],
        isActive: true,
        stats: { runs: 142, successRate: '98%', lastRun: 'Just now' }
    },
    {
        id: 'bot_order_guardian',
        name: 'Order Guardian',
        icon: 'order',
        trigger: 'On Order Created',
        description: 'Orchestrates the fulfillment process while protecting against fraud.',
        steps: [
            'Calculate Fraud Score (AI)', 
            'Route to Best Supplier (Geo-Matching)', 
            'Send WhatsApp Confirmation to Client', 
            'Email Alert: CX.TV@HOTMAIL.COM'
        ],
        isActive: true,
        stats: { runs: 850, successRate: '100%', lastRun: '5 mins ago' }
    },
    {
        id: 'bot_auto_hold',
        name: 'Auto-Hold High Risk',
        icon: 'shield',
        trigger: 'Fraud Score ≥ 80',
        description: 'Automatically places orders with critical fraud scores on hold to prevent chargebacks.',
        steps: [
            'Monitor Fraud Score Updates',
            'If Score ≥ 80: Set Status = On Hold',
            'Log Security Incident',
            'Notify Risk Officer'
        ],
        isActive: true,
        stats: { runs: 15, successRate: '100%', lastRun: '10 mins ago' }
    },
    {
        id: 'bot_stock_sentinel',
        name: 'Inventory Sentinel',
        icon: 'stock',
        trigger: 'Stock Quantity < 5',
        description: 'Monitors inventory levels across all global warehouses to prevent stockouts on high-velocity items.',
        steps: [
            'Monitor Real-time Stock Levels', 
            'If < 5: Flag as "Low Stock"', 
            'Trigger Re-order Protocol',
            'Send Admin Alert'
        ],
        isActive: true,
        stats: { runs: 45, successRate: '100%', lastRun: '1 hour ago' }
    },
    {
        id: 'bot_ai_config',
        name: 'AI_Config_Update',
        icon: 'settings',
        trigger: 'On Config Change',
        description: 'Synchronizes AI feature flags and model parameters across the edge network immediately upon admin update.',
        steps: [
            'Detect Setting Change',
            'Validate API Keys',
            'Deploy Config to Edge Nodes',
            'Log Audit Trail'
        ],
        isActive: true,
        stats: { runs: 12, successRate: '100%', lastRun: '2 days ago' }
    },
    {
        id: 'bot_pricing_sync',
        name: 'Daily Pricing Sync',
        icon: 'finance',
        trigger: 'Every 24 Hours',
        description: 'Ensures product prices reflect the latest currency exchange rates and margin rules automatically.',
        steps: [
            'Fetch Live FX Rates (SAR Base)',
            'Fetch Supplier Base Costs',
            'Apply Pricing Rules Logic',
            'Update Catalog Prices'
        ],
        isActive: true,
        stats: { runs: 365, successRate: '100%', lastRun: '4 hours ago' }
    }
];

export const aiSettings: AISetting[] = [
    { 
        id: 'ai_1', 
        feature_key: 'catalog_enrichment', 
        name: 'Catalog Enrichment (تحسين الوصف)', 
        description: 'Uses Gemini Pro Vision to analyze product images and generate luxury marketing copy in Arabic and English automatically.', 
        is_enabled: true, 
        last_updated: '2024-03-01', 
        model_used: 'Gemini 1.5 Pro' 
    },
    { 
        id: 'ai_2', 
        feature_key: 'ai_search', 
        name: 'AI Search (بحث ذكي)', 
        description: 'Semantic vector search engine that understands user intent beyond keywords (e.g., "watch for a gala dinner").', 
        is_enabled: true, 
        last_updated: '2024-03-01', 
        model_used: 'Gemini 1.5 Flash' 
    },
    { 
        id: 'ai_3', 
        feature_key: 'ai_chat', 
        name: 'Shopping Assistant (مساعد التسوق)', 
        description: 'Real-time conversational agent acting as a personal stylist and concierge.', 
        is_enabled: true, 
        last_updated: '2024-03-05', 
        model_used: 'Gemini Live' 
    },
    { 
        id: 'ai_4', 
        feature_key: 'ai_recommendation', 
        name: 'Product Recommendations (توصيات)', 
        description: 'Personalized product feeds based on browsing history and visual similarity analysis.', 
        is_enabled: false, 
        last_updated: '2024-03-10', 
        model_used: 'Gemini 1.5 Flash' 
    }
];

export const initialPricingRules: PricingRule[] = [
    {
        id: 1,
        name: 'Standard Retail Margin',
        country: 'Global',
        margin_percent: 30,
        is_active: true,
        min_base_price_sar: 0,
        max_base_price_sar: 10000
    },
    {
        id: 2,
        name: 'High Value Luxury Tax',
        applies_to_category_id: 'watches',
        country: 'Saudi Arabia',
        margin_percent: 20, // Lower margin for expensive items to remain competitive
        is_active: true,
        min_base_price_sar: 10000,
        max_base_price_sar: 500000
    },
    {
        id: 3,
        name: 'Regional KSA Promotion',
        applies_to_brand_id: 'Maison Ishtar',
        country: 'Saudi Arabia',
        margin_percent: 45, // Higher margin on private label
        is_active: true,
        min_base_price_sar: 0
    },
    {
        id: 4,
        name: 'Beauty Clearance',
        applies_to_category_id: 'fragrances',
        country: 'Global',
        margin_percent: 15,
        is_active: false,
        min_base_price_sar: 0
    }
];

// Mock Logs Generation
const generateLogs = (): SystemLog[] => {
    const baseLogs: SystemLog[] = [];
    const types = ['api_call', 'sync_job', 'error', 'order_status_change', 'info'];
    const msgs = [
        'Sync successful for BrandsGateway',
        'Failed to fetch exchange rates',
        'Order #10293 status changed to Shipped',
        'API Latency Warning: Shopify Connection',
        'User login: super_abdul',
        'Product import started: 50 items',
        'Payment Gateway Timeout: Moyasar',
        'Order #10294 fraud check passed',
        'Stock update: Low inventory alert'
    ];

    for(let i=0; i<60; i++) {
        const type = i % 10 === 0 ? 'error' : types[Math.floor(Math.random() * types.length)];
        baseLogs.push({
            id: `log_${Date.now() - i*100000}`,
            type: type,
            message: msgs[Math.floor(Math.random() * msgs.length)],
            created_at: new Date(Date.now() - i * 3600000).toISOString(),
            details: i % 5 === 0 ? { error_code: 500, region: 'us-east' } : undefined
        });
    }
    return baseLogs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const logs: SystemLog[] = generateLogs();
export const auditLogs: AuditLog[] = [];
export const initialFraudChecks: FraudCheck[] = [];
export const initialLogs: SystemLog[] = logs;
