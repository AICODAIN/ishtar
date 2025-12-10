
import React, { useState, useMemo, useEffect } from 'react';
import { 
    LayoutDashboard, Package, Bot, BrainCircuit, Server, ShieldAlert, Calculator, Tag, Users, Truck, 
    ShieldCheck, Link2, Building, DollarSign, Video, Sparkles, Globe, Activity, FileText, Settings, 
    Home, Zap, PlayCircle, RefreshCw, DownloadCloud, Loader2, ChevronRight, Terminal, AlertTriangle, ScrollText 
} from 'lucide-react';
import { Product, ImportStats, LuxurySupplier, Campaign, UserProfile, Role, AuditLog, Channel, Supplier, DateRange, AISetting, PricingRule, SystemLog, FraudCheck, AdminOrder } from '../types';
import { secureOrderView, secureCustomerView, enforceOrderRLS, enforceProductRLS, logAuditAction } from '../services/securityService';
import { adminOrders } from '../data/coreData';
import { products as initialProducts } from '../data/products';
import { logs as initialLogs, initialFraudChecks, aiSettings, smartBots, initialPricingRules } from '../data/adminData';
import { channels } from '../data/coreData';
import { suppliers } from '../data/coreData';
import { luxurySuppliers } from '../data/luxurySuppliers';
import { campaigns } from '../data/videoContent';
import { categories } from '../data/categories';
import { brands as coreBrands } from '../data/brands';
import { users as coreUsers } from '../data/coreData';
import { syncProductsFromShopify } from '../services/shopifyService';
import { exportToCSV, formatPrice } from '../services/commerceService';
import { runWatchImport } from '../services/watchImportService';
import { generateMarketingVideo, generateLuxuryImage, generateThinkingResponse } from '../services/geminiService';
import LiveVoice from '../components/LiveVoice';
import { SalesDashboard, OperationsDashboard, CampaignsDashboard, RiskDashboard, SystemHealthDashboard, CustomersDashboard, FinanceDashboard, SettingsDashboard, AutomationDashboard, ChannelsDashboard, TrustedNetworkDashboard, SuppliersDashboard, ProductsAdminDashboard, AiManagementDashboard, PricingRulesDashboard, SystemLogsDashboard, FraudManagementDashboard } from '../components/AdminDashboards';
import { OrderDetail } from '../components/OrderDetail';

type AdminView = 'overview' | 'orders' | 'logistics' | 'trusted_network' | 'campaigns' | 'ai_studio' | 'risk' | 'health' | 'finance' | 'customers' | 'settings' | 'audit_logs' | 'channels' | 'suppliers_management' | 'products_admin' | 'automation' | 'ai_management' | 'pricing' | 'logs' | 'fraud_management';

interface AdminProps {
    user?: UserProfile;
}

const PERMISSIONS: Record<string, string[]> = {
    super_admin: ['all'],
    admin: ['all'],
    operations_manager: ['orders', 'logistics', 'trusted_network', 'health', 'channels', 'products_admin', 'automation', 'fraud_management', 'suppliers_management'],
    marketing_manager: ['overview', 'campaigns', 'ai_studio', 'products_admin'],
    finance_manager: ['finance', 'overview', 'pricing'],
    risk_officer: ['risk', 'orders', 'audit_logs', 'fraud_management'],
    supplier: ['orders', 'trusted_network'],
    view_only_analyst: ['overview', 'orders', 'campaigns', 'risk', 'health']
};

const Admin: React.FC<AdminProps> = ({ user }) => {
    const getDefaultView = (): AdminView => {
        if (!user) return 'overview';
        if (user.role === 'supplier') return 'orders';
        if (user.role === 'finance_manager') return 'finance';
        return 'overview';
    };

    const [activeView, setActiveView] = useState<AdminView>(getDefaultView());
    const [dateRange, setDateRange] = useState<DateRange>('30days');
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [exportStatus, setExportStatus] = useState<'idle' | 'exporting'>('idle');
    
    // Data State
    const [orders, setOrders] = useState(user ? enforceOrderRLS(adminOrders, user).map(o => secureOrderView(o, user)) : []);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    const [allProducts, setAllProducts] = useState(user ? enforceProductRLS(initialProducts, user) : []);
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>(initialLogs);
    const [fraudCheckList, setFraudCheckList] = useState<FraudCheck[]>(initialFraudChecks);
    
    const [allChannels, setAllChannels] = useState<Channel[]>(channels);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    
    const [operationalSuppliers, setOperationalSuppliers] = useState<Supplier[]>(suppliers);
    const [selectedOpSupplier, setSelectedOpSupplier] = useState<Supplier | null>(null);

    const [selectedAdminProduct, setSelectedAdminProduct] = useState<Product | null>(null);
    const [productFilters, setProductFilters] = useState({
        category: 'All',
        supplier: 'All',
        channel: 'All',
        search: '',
        minPrice: '',
        maxPrice: ''
    });

    const [logFilter, setLogFilter] = useState<'all' | 'api_call' | 'sync_job' | 'error' | 'order_status_change'>('all');

    const [aiFeatures, setAiFeatures] = useState<AISetting[]>(aiSettings);
    const [selectedAiSetting, setSelectedAiSetting] = useState<AISetting | null>(null);

    const [pricingRules, setPricingRules] = useState<PricingRule[]>(initialPricingRules); 

    const [allSuppliers, setAllSuppliers] = useState(
        user?.role === 'supplier' && user.supplierId 
        ? luxurySuppliers.filter(s => String(s.supplier_id) === String(user.supplierId)) 
        : luxurySuppliers
    );

    const [allCampaigns, setAllCampaigns] = useState(campaigns);
    
    const [customers, setCustomers] = useState(
        user?.role === 'supplier' 
        ? [] 
        : coreUsers.filter(u => u.role === 'customer').map(c => secureCustomerView(c, user!) as UserProfile)
    );

    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showSimulateModal, setShowSimulateModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<LuxurySupplier | null>(null);
    const [campaignTab, setCampaignTab] = useState<'general' | 'media' | 'offers'>('general');
    
    const [aiTab, setAiTab] = useState<'video' | 'image' | 'text' | 'live'>('video');
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isLiveTestOpen, setIsLiveTestOpen] = useState(false);

    const [importStatus, setImportStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [importStats, setImportStats] = useState<ImportStats | null>(null);
    const [importedProducts, setImportedProducts] = useState<Product[]>([]);

    const canAccess = (view: AdminView): boolean => {
        if (!user) return false;
        const allowed = PERMISSIONS[user.role] || [];
        return allowed.includes('all') || allowed.includes(view);
    };

    const handleSync = async () => {
        setSyncStatus('syncing');
        try {
            // [BOT 1: ISHTAR IMPORT ENGINE] Logic Simulation
            const newProds = await syncProductsFromShopify(channels[1]);
            
            // Enrich with AI (Simulation for speed, usually async job)
            const enrichedProds = await Promise.all(newProds.map(async (p) => {
                // 1. Generate EN/AR Descriptions
                const aiDesc = await generateThinkingResponse(`Write a luxury marketing description for ${p.name}. Provide strict format: "EN: [Description] AR: [Description]"`);
                const parts = aiDesc.split('AR:');
                const descEn = parts[0]?.replace('EN:', '').trim() || p.description;
                const descAr = parts[1]?.trim() || p.description_ar;

                // 2. Apply Pricing Rules
                // Logic: If cost > 1000 SAR, Margin 20%, else 30%
                const margin = p.total_cost_sar && p.total_cost_sar > 1000 ? 1.2 : 1.3;
                const finalPrice = Math.round((p.total_cost_sar || p.price) * margin);

                return {
                    ...p,
                    description_en: descEn,
                    description_ar: descAr,
                    final_price_sar: finalPrice,
                    price: finalPrice // Update display price
                };
            }));

            // 4. Notify Admin (System Log)
            setSystemLogs(prev => [{
                id: Date.now(),
                type: 'info',
                message: `[Bot: Ishtar Import Engine] Processed ${enrichedProds.length} items. AI Enrichment & Pricing Rules applied.`,
                created_at: new Date().toISOString()
            }, ...prev]);

            setAllProducts(prev => [...prev, ...enrichedProds]);
            setSyncStatus('success');
        } catch (e) { setSyncStatus('error'); } 
        finally { setTimeout(() => setSyncStatus('idle'), 3000); }
    };

    const handleExport = () => {
        setExportStatus('exporting');
        setTimeout(() => {
            exportToCSV(orders, 'admin_export', user);
            setExportStatus('idle');
        }, 1000);
    };

    const handleOrderStatusChange = (orderId: string, newStatus: string) => {
        if (!user) return;
        
        // Optimistic Update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        
        // Add log
        setSystemLogs(prev => [{
            id: Date.now(),
            type: 'info',
            message: `Order ${orderId} status updated to ${newStatus} by ${user.name}`,
            created_at: new Date().toISOString(),
            related_order_id: orderId
        }, ...prev]);

        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }

        logAuditAction(user, 'UPDATE', 'ORDER', `Order ${orderId} status changed to ${newStatus}`);
    };

    const handleFraudRecheck = (orderId: string) => {
        if (!user) return;
        
        // Smarter simulation: toggle between risk levels to show UI changes
        const existingOrder = orders.find(o => o.id === orderId);
        const currentScore = existingOrder?.fraud_score || 0;
        
        // If high, make low. If low, make high.
        const newScore = currentScore > 50 ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 40) + 60;
        const riskLevel = newScore > 50 ? 'high' : newScore > 20 ? 'medium' : 'low';
        const riskFactors = newScore > 50 ? ['IP Address mismatch', 'High Value Item', 'Velocity check failed'] : ['Safe IP', 'Verified User'];
        
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, fraud_score: newScore } : o));
        
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, fraud_score: newScore } : null);
        }

        // Add Fraud Check Record
        setFraudCheckList(prev => [{
            id: Date.now(),
            order_id: orderId,
            score: newScore,
            risk_level: riskLevel,
            checked_at: new Date().toISOString(),
            status: 'manual_recheck',
            risk_factors: riskFactors
        }, ...prev]);

        // Log
        setSystemLogs(prev => [{
            id: Date.now(),
            type: 'info',
            message: `Manual Fraud Recheck for Order ${orderId}. New Score: ${newScore}`,
            created_at: new Date().toISOString(),
            related_order_id: orderId
        }, ...prev]);

        alert(`Fraud Score Rechecked: ${newScore}/100`);
    };

    const handleProductAction = async (action: string, product: Product) => {
        if (!user) return;

        switch (action) {
            case 'ai_enrich':
                // Simulate AI Call
                const prompt = `Enhance the product description for ${product.name}. Provide a sophisticated English description and a professional Arabic translation.`;
                const aiResponse = await generateThinkingResponse(prompt);
                // Update product (simulated)
                setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, description: aiResponse.slice(0, 150) + "..." } : p));
                alert("AI Enrichment Complete: Product descriptions updated.");
                logAuditAction(user, 'UPDATE', 'PRODUCT', `AI Enriched product ${product.id}`);
                break;
            case 'apply_pricing':
                // Simple margin logic
                setAllProducts(prev => prev.map(p => {
                    if (p.id !== product.id) return p;
                    const cost = p.total_cost_sar || (p.price * 0.7);
                    const newPrice = cost * 1.3; // 30% margin
                    return { ...p, price: Math.round(newPrice), final_price_sar: Math.round(newPrice) };
                }));
                alert("Pricing Rules Applied: 30% Standard Margin.");
                break;
            case 'duplicate':
                const newProd = { ...product, id: `copy-${Date.now()}`, name: `${product.name} (Copy)`, sku: `COPY-${product.sku}` };
                setAllProducts(prev => [newProd, ...prev]);
                alert("Product Duplicated.");
                break;
            case 'deactivate':
                setAllProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'archived' } : p));
                alert("Product Deactivated.");
                break;
        }
    };

    // [BOT 3: STOCK SENTINEL] Logic
    // Runs effectively whenever products change, checking for low stock
    useEffect(() => {
        const lowStockItems = allProducts.filter(p => (p.stock_quantity || 0) < 5 && p.status === 'active');
        if (lowStockItems.length > 0) {
            // In a real app, this would throttle alerts. 
            // Here we just log it to system logs once if not present.
            const existingLog = systemLogs.find(l => l.message.includes('Low Stock Alert'));
            if (!existingLog) {
                setSystemLogs(prev => [{
                    id: Date.now(),
                    type: 'warning',
                    message: `[Bot: Inventory Sentinel] Low Stock Alert for ${lowStockItems.length} items. Please review.`,
                    created_at: new Date().toISOString()
                }, ...prev]);
            }
        }
    }, [allProducts]);

    // [BOT: AUTO-HOLD HIGH RISK ORDERS] Logic
    // Monitors Orders State for changes. Fixes infinite loop by checking processed flag.
    useEffect(() => {
        // Find orders that are high risk (>80) AND NOT PROCESSED BY BOT
        const riskyOrders = orders.filter(o => 
            o.fraud_score >= 80 && 
            !['on_hold', 'cancelled', 'delivered'].includes(o.status.toLowerCase()) &&
            !o.processed_by_bot
        );

        if (riskyOrders.length > 0) {
            const updatedOrders = orders.map(o => {
                if (o.fraud_score >= 80 && !['on_hold', 'cancelled', 'delivered'].includes(o.status.toLowerCase()) && !o.processed_by_bot) {
                    return { ...o, status: 'on_hold', processed_by_bot: true };
                }
                return o;
            });

            // Update State
            setOrders(updatedOrders);

            // Log Actions
            const newLogs = riskyOrders.map(o => ({
                id: Date.now() + Math.random(),
                type: 'warning',
                message: `[Bot: Auto-Hold] Order ${o.id} placed ON HOLD due to High Fraud Score (${o.fraud_score}).`,
                created_at: new Date().toISOString(),
                related_order_id: o.id
            }));
            
            setSystemLogs(prev => [...newLogs, ...prev]);
        }
    }, [orders]);

    const handleDashboardAction = (action: string, payload: any) => {
        if (action === 'view_supplier_details') {
            const match = allSuppliers.find(ls => 
                ls.supplier_name.toLowerCase().includes(payload.name.toLowerCase()) || 
                payload.name.toLowerCase().includes(ls.supplier_name.toLowerCase()) ||
                String(ls.supplier_id) === String(payload.id)
            );
            
            if (match) {
                setSelectedSupplier(match);
                setActiveView('trusted_network');
            } else {
                setActiveView('trusted_network');
            }
        } else if (['ai_enrich', 'apply_pricing', 'duplicate', 'deactivate'].includes(action)) {
            handleProductAction(action, payload);
        } else if (action === 'toggle_ai_feature') {
            const setting = payload as AISetting;
            const newStatus = !setting.is_enabled;
            setAiFeatures(prev => prev.map(f => f.id === setting.id ? { ...f, is_enabled: newStatus } : f));
            
            setSystemLogs(prev => [{
                id: Date.now(),
                type: 'info',
                message: `[Bot: AI_Config_Update] Feature '${setting.feature_key}' ${newStatus ? 'ENABLED' : 'DISABLED'}. Configuration deployed to edge nodes.`,
                created_at: new Date().toISOString()
            }, ...prev]);
            
            alert(`Feature ${setting.name} has been ${newStatus ? 'enabled' : 'disabled'}.`);
        } else if (action === 'apply_pricing_rules_global') {
            if (!user) return;
            
            const updatedProducts = allProducts.map(p => {
                const matchingRule = pricingRules
                    .filter(r => r.is_active)
                    .find(r => 
                        (r.applies_to_category_id === p.category || r.applies_to_category_id === undefined) &&
                        (r.applies_to_brand_id === p.brand || r.applies_to_brand_id === undefined) &&
                        (r.min_base_price_sar === undefined || (p.total_cost_sar || p.price) >= r.min_base_price_sar)
                    );

                if (matchingRule) {
                    const baseCost = p.total_cost_sar || (p.price * 0.7); 
                    const newPrice = Math.round(baseCost * (1 + matchingRule.margin_percent / 100));
                    return { ...p, final_price_sar: newPrice, price: newPrice, margin_percent: matchingRule.margin_percent };
                }
                return p;
            });

            setAllProducts(updatedProducts);
            setSystemLogs(prev => [{
                id: Date.now(),
                type: 'info',
                message: `[Bot: Daily Pricing Sync] Rules applied to ${updatedProducts.length} products. Catalog updated.`,
                created_at: new Date().toISOString()
            }, ...prev]);
            
            logAuditAction(user, 'UPDATE', 'SETTINGS', 'Applied global pricing rules');
            alert('Pricing rules applied successfully to catalog.');
        } else if (action === 'mark_fraud_reviewed') {
            if (!user) return;
            const check = payload as FraudCheck;
            
            setFraudCheckList(prev => prev.map(c => c.id === check.id ? { ...c, status: 'reviewed' } : c));
            setSystemLogs(prev => [{
                id: Date.now(),
                type: 'info',
                message: `Fraud Check for Order ${check.order_id} marked as REVIEWED by ${user.name}`,
                created_at: new Date().toISOString(),
                related_order_id: check.order_id
            }, ...prev]);
            
            alert(`Fraud Check for Order ${check.order_id} marked as Reviewed.`);
        } else if (action === 'clear_logs') {
            setSystemLogs([]);
            alert('System logs cleared.');
        } else if (action === 'export_logs') {
            exportToCSV(systemLogs, 'system_logs', user);
        }
    };

    const handleSimulateSpike = async () => {
        if (!user) return;
        
        const baseOrder = adminOrders[0] || {};
        
        const newOrders: AdminOrder[] = Array.from({ length: 1 }).map((_, i) => {
            const idVal = Math.floor(Math.random() * 90000) + 10000;
            const isHighRisk = Math.random() > 0.8;
            
            const fraudScore = isHighRisk ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 20);
            
            return {
                ...baseOrder,
                id: `SIM-${idVal}`,
                customer: `Simulated User ${idVal}`,
                email: `sim.user${idVal}@example.com`,
                phone: `+9665${Math.floor(Math.random() * 100000000)}`,
                date: new Date().toISOString(),
                status: 'pending',
                total: Math.floor(Math.random() * 8000) + 500,
                payment_status: 'paid',
                payment_method: Math.random() > 0.5 ? 'card' : 'applepay',
                fraud_score: fraudScore,
                shipping_address: 'Riyadh, Saudi Arabia',
                channel_id: Math.random() > 0.5 ? 1 : 2,
                items_count: Math.floor(Math.random() * 3) + 1,
                processed_by_bot: false // Critical for bot to pick it up
            } as AdminOrder;
        });

        // Add matching fraud check entry
        const order = newOrders[0];
        setFraudCheckList(prev => [{
            id: Date.now(),
            order_id: order.id,
            score: order.fraud_score,
            risk_level: order.fraud_score >= 80 ? 'high' : 'low',
            checked_at: new Date().toISOString(),
            status: 'pending_review',
            risk_factors: order.fraud_score >= 80 ? ['Simulated High Risk Pattern', 'Velocity Check'] : []
        }, ...prev]);

        setSystemLogs(prev => [{
            id: Date.now(),
            type: 'info',
            message: `[Bot: Order Guardian] Processed Order ${order.id}. Fraud Score: ${order.fraud_score}. Sent alert to CX.TV@HOTMAIL.COM`,
            created_at: new Date().toISOString()
        }, ...prev]);

        setOrders(prev => [...newOrders, ...prev]);
        logAuditAction(user, 'CREATE', 'ORDER', 'Simulated Spike: 1 Order Injected via Order Guardian Bot');
        alert("Bot Execution: Order Created, Fraud Checked, Supplier Routed, Admin Notified.");
    };

    const renderContent = () => {
        switch(activeView) {
            case 'overview': return <SalesDashboard orders={orders} channels={allChannels} products={allProducts} range={dateRange} onDateRangeChange={setDateRange} />;
            case 'orders': return (
                selectedOrder ? (
                    <OrderDetail 
                        order={selectedOrder} 
                        fraudChecks={fraudCheckList}
                        logs={systemLogs}
                        onClose={() => setSelectedOrder(null)} 
                        onUpdateStatus={(id, status) => handleOrderStatusChange(id, status)}
                        onReroute={(id, itemId) => {
                            if(user) logAuditAction(user, 'UPDATE', 'ORDER', `Rerouted Item ${itemId} in Order ${id}`);
                            alert(`Item ${itemId} rerouted to backup supplier.`);
                        }}
                        onResendNotif={(id) => {
                            if(user) logAuditAction(user, 'UPDATE', 'ORDER', `Resent Notifications for Order ${id}`);
                            alert(`Notifications resent to customer.`);
                        }}
                        onRecheckFraud={(id) => handleFraudRecheck(id)}
                    />
                ) : (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                                <h3 className="font-serif text-lg text-neutral-900">Orders Admin</h3>
                                <span className="text-xs text-neutral-500 uppercase tracking-widest">{orders.length} Records</span>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-stone-50 text-neutral-500 font-medium border-b border-stone-200">
                                    <tr>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Risk</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={7} className="p-8 text-center text-neutral-400">No orders found.</td></tr>
                                    ) : orders.map(order => (
                                        <tr key={order.id} className="hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                            <td className="p-4 font-bold text-neutral-900">{order.id}</td>
                                            <td className="p-4">
                                                <div className="font-medium text-neutral-800">{order.customer}</div>
                                                <div className="text-xs text-neutral-400">{order.email}</div>
                                            </td>
                                            <td className="p-4 text-neutral-500">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-mono">{formatPrice(order.total, 'SAR', 'EN')}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    order.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-1 font-bold ${order.fraud_score > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {order.fraud_score > 50 && <AlertTriangle size={12} />}
                                                    {order.fraud_score}/100
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button className="text-gold-600 hover:text-gold-700 font-bold text-xs uppercase tracking-wider">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            );
            case 'campaigns': return <CampaignsDashboard campaigns={allCampaigns} onAction={() => {}} range={dateRange} />;
            case 'risk': return <RiskDashboard orders={orders} fraudChecks={fraudCheckList} range={dateRange} />;
            case 'health': return <SystemHealthDashboard logs={systemLogs} range={dateRange} />;
            case 'finance': return <FinanceDashboard orders={orders} range={dateRange} />;
            case 'customers': return <CustomersDashboard users={customers} range={dateRange} />;
            case 'settings': return <SettingsDashboard />;
            case 'automation': return <AutomationDashboard smartBots={smartBots} range={dateRange} />;
            case 'logistics': return <OperationsDashboard orders={orders} suppliers={operationalSuppliers} range={dateRange} onAction={handleDashboardAction} />;
            case 'channels': return <ChannelsDashboard channels={allChannels} range={dateRange} />;
            case 'trusted_network': return <TrustedNetworkDashboard suppliers={allSuppliers} selectedSupplier={selectedSupplier} onBack={() => setSelectedSupplier(null)} onSelect={(s) => setSelectedSupplier(s)} />;
            case 'suppliers_management': return <SuppliersDashboard suppliers={operationalSuppliers} products={allProducts} orders={orders} range={dateRange} />;
            case 'products_admin': return <ProductsAdminDashboard products={allProducts} suppliers={operationalSuppliers} channels={allChannels} onAction={handleDashboardAction} />;
            case 'ai_management': return <AiManagementDashboard aiSettings={aiFeatures} onAction={handleDashboardAction} />;
            case 'pricing': return <PricingRulesDashboard pricingRules={pricingRules} categories={categories} brands={coreBrands} onAction={handleDashboardAction} />;
            case 'logs': return <SystemLogsDashboard logs={systemLogs} onAction={handleDashboardAction} />;
            case 'fraud_management': return <FraudManagementDashboard fraudChecks={fraudCheckList} onAction={handleDashboardAction} />;
            default: return <div>View not implemented</div>;
        }
    };

    const navItems = [
      { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
      { id: 'orders', icon: Package, label: 'Orders & Fulfillment' },
      { id: 'products_admin', icon: Tag, label: 'Products Admin', restricted: true }, 
      { id: 'pricing', icon: Calculator, label: 'Pricing Management', restricted: true }, 
      { id: 'ai_management', icon: BrainCircuit, label: 'AI Management', restricted: true }, 
      { id: 'channels', icon: Link2, label: 'Channels Management' },
      { id: 'trusted_network', icon: ShieldCheck, label: 'Trusted Network' },
      ...(user?.role === 'super_admin' ? [{ id: 'suppliers_management', icon: Users, label: 'Suppliers Management' }] : []), 
      { id: 'automation', icon: Bot, label: 'Automation & Bots' }, 
      { id: 'risk', icon: Globe, label: 'Risk & Fraud' },
      { id: 'fraud_management', icon: ShieldAlert, label: 'Fraud Management', restricted: true }, 
      { id: 'health', icon: Activity, label: 'System Health' },
      { id: 'logs', icon: ScrollText, label: 'System Logs', restricted: true }, 
      { id: 'finance', icon: DollarSign, label: 'Finance' },
      { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className="flex min-h-screen bg-stone-100 font-sans">
            <LiveVoice isOpen={isLiveTestOpen} onClose={() => setIsLiveTestOpen(false)} />
            <aside className="w-64 bg-neutral-900 text-neutral-400 flex flex-col fixed h-full z-20 shadow-xl overflow-y-auto">
                <div className="p-6 border-b border-neutral-800" onClick={() => setActiveView('overview')}>
                    <h1 className="text-white font-serif text-xl tracking-widest">ISHTAR Admin</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        // Logic Update: Super Admin sees EVERYTHING. 
                        // Restricted items are hidden for normal roles unless specifically allowed.
                        
                        let isVisible = true;
                        
                        if (user?.role === 'super_admin') {
                            isVisible = true;
                        } else if (item.restricted) {
                            // Check specific overrides for roles
                            if (item.id === 'fraud_management' && user?.role === 'operations_manager') isVisible = true;
                            else if (item.id === 'products_admin' && user?.role === 'marketing_manager') isVisible = true;
                            else isVisible = false;
                        }

                        if (!isVisible) return null;
                        
                        return (
                            <button 
                                key={item.id}
                                onClick={() => { setActiveView(item.id as AdminView); setSelectedOrder(null); setSelectedSupplier(null); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeView === item.id ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800'}`}
                            >
                                <item.icon size={18} /> {item.label}
                            </button>
                        )
                    })}
                </nav>
            </aside>
            <main className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                    <h2 className="text-2xl font-serif text-neutral-900 capitalize">{activeView.replace('_', ' ')}</h2>
                    <div className="flex gap-2">
                        {/* Simulate Spike Button */}
                        <button 
                            onClick={handleSimulateSpike}
                            className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                            title="Inject Fake Order & Trigger Bots"
                        >
                            <Zap size={14} className="fill-current" /> Trigger Order Bot
                        </button>

                        <button onClick={handleSync} className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded text-xs uppercase font-bold hover:bg-stone-50 transition-colors">
                            <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} /> Sync & AI Enrich
                        </button>
                        <button onClick={handleExport} className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded text-xs uppercase font-bold hover:bg-gold-600 transition-colors">
                            <DownloadCloud size={14} /> Export
                        </button>
                    </div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
