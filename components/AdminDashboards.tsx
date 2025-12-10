import React, { useMemo } from 'react';
import { AdminOrder, Product, Supplier, Channel, Promotion, FraudCheck, SystemLog, Campaign, UserProfile, DateRange, SmartBot, LuxurySupplier, AISetting, PricingRule, Category, Brand } from '../types';
import { formatPrice } from '../services/commerceService';
import { calculateOrderProfit } from '../services/financeService';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, CheckCircle, Clock, ShieldAlert, ShoppingBag, CreditCard, Truck, RefreshCw, ArrowLeft, ExternalLink, Globe, Sparkles, Copy, Ban, ShieldCheck, BrainCircuit, FileText, Fingerprint, Trash2, DownloadCloud, DollarSign, PieChart, Bot, ToggleLeft, ToggleRight, Zap } from 'lucide-react';

export interface DashboardProps {
    orders?: AdminOrder[];
    products?: Product[];
    suppliers?: Supplier[];
    channels?: Channel[];
    promotions?: Promotion[];
    fraudChecks?: FraudCheck[];
    logs?: SystemLog[];
    campaigns?: Campaign[];
    users?: UserProfile[];
    smartBots?: SmartBot[];
    aiSettings?: AISetting[];
    pricingRules?: PricingRule[];
    categories?: Category[];
    brands?: Brand[];
    range?: DateRange;
    onDateRangeChange?: (range: DateRange) => void;
    onAction?: (action: string, payload?: any) => void;
}

const filterByDate = (items: any[], range: DateRange = 'all', dateField: string = 'date') => {
    const now = new Date();
    return items.filter(o => {
        const d = new Date(o[dateField] || o.created_at);
        if (range === 'all') return true;
        if (range === 'today') return d.toDateString() === now.toDateString();
        if (range === '7days') return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 7;
        if (range === '30days') return (now.getTime() - d.getTime()) / (1000 * 3600 * 24) <= 30;
        if (range === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        return true;
    });
};

const MetricCard = ({ title, value, subtext, trend, icon: Icon, colorClass, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start justify-between ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
        <div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-serif text-neutral-900">{value}</h3>
            {subtext && <p className="text-xs text-neutral-400 mt-1">{subtext}</p>}
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(trend)}% vs last period
                </div>
            )}
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon size={20} />
        </div>
    </div>
);

const ProgressBar = ({ label, value, max, color = "bg-neutral-900", subVal, onClick }: any) => {
    const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    return (
        <div className="mb-4 cursor-pointer group" onClick={onClick}>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-neutral-700 group-hover:text-gold-600 transition-colors">{label}</span>
                <span className="text-neutral-500">{subVal || value}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

const DateRangePicker = ({ active, onChange }: { active: DateRange, onChange: (r: DateRange) => void }) => (
    <div className="flex bg-white border border-stone-200 rounded-lg p-1">
        {['today', '7days', '30days', 'month', 'all'].map((r) => (
            <button 
                key={r}
                onClick={() => onChange(r as DateRange)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${active === r ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
                {r === '7days' ? '7 Days' : r === '30days' ? '30 Days' : r}
            </button>
        ))}
    </div>
);

export const SalesDashboard: React.FC<DashboardProps> = ({ orders = [], channels = [], products = [], range = '30days' as DateRange, onDateRangeChange, onAction }) => {
    const filteredOrders = useMemo(() => filterByDate(orders, range), [orders, range]);
    
    const metrics = useMemo(() => {
        let revenue = 0;
        let profit = 0;
        const channelSales: Record<string, number> = {};
        const countrySales: Record<string, number> = {};
        const productSales: Record<string, number> = {};

        filteredOrders.forEach(o => {
            revenue += o.total;
            const financials = calculateOrderProfit(o);
            profit += financials.net_profit_sar;

            const ch = channels.find(c => c.id === o.channel_id);
            const chName = ch ? ch.name : 'Unknown';
            channelSales[chName] = (channelSales[chName] || 0) + o.total;

            const country = o.shipping_address.split(',').pop()?.trim() || 'Other';
            countrySales[country] = (countrySales[country] || 0) + o.total;

            o.items.forEach(i => {
                productSales[i.product_name] = (productSales[i.product_name] || 0) + i.quantity;
            });
        });

        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        
        return { revenue, profit, margin, channelSales, countrySales, productSales };
    }, [filteredOrders, channels]);

    const topProducts = Object.entries(metrics.productSales)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-end">
                {onDateRangeChange && <DateRangePicker active={range} onChange={onDateRangeChange} />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Revenue" value={formatPrice(metrics.revenue, 'SAR', 'EN')} icon={TrendingUp} colorClass="bg-gold-100 text-gold-600" />
                <MetricCard title="Net Profit" value={formatPrice(metrics.profit, 'SAR', 'EN')} icon={ShoppingBag} colorClass="bg-green-100 text-green-600" />
                <MetricCard title="Avg Margin" value={`${metrics.margin.toFixed(1)}%`} icon={CreditCard} colorClass="bg-blue-100 text-blue-600" />
                <MetricCard title="Total Orders" value={filteredOrders.length} icon={ShoppingBag} colorClass="bg-stone-100 text-stone-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <h3 className="font-serif text-lg mb-6 text-neutral-900">Sales by Channel</h3>
                    {Object.entries(metrics.channelSales).map(([name, val]) => (
                        <ProgressBar key={name} label={name} value={val as number} max={metrics.revenue} subVal={formatPrice(val as number, 'SAR', 'EN')} color="bg-gold-500" />
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <h3 className="font-serif text-lg mb-6 text-neutral-900">Top Performing Products</h3>
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-neutral-400 border-b border-stone-100">
                                <th className="pb-2 font-normal">Product</th>
                                <th className="pb-2 font-normal text-right">Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map(([name, qty]) => (
                                <tr key={name} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 cursor-pointer" onClick={() => onAction && onAction('view_product', name)}>
                                    <td className="py-3 font-medium text-neutral-700">{name}</td>
                                    <td className="py-3 text-right font-mono text-neutral-500">{qty as number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const OperationsDashboard: React.FC<DashboardProps> = ({ orders = [], suppliers = [] }) => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Pending" value={pending} icon={Clock} colorClass="bg-orange-100 text-orange-600" />
                <MetricCard title="Processing" value={processing} icon={RefreshCw} colorClass="bg-blue-100 text-blue-600" />
                <MetricCard title="Shipped" value={shipped} icon={Truck} colorClass="bg-purple-100 text-purple-600" />
                <MetricCard title="Delivered" value={delivered} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
            </div>
        </div>
    );
};

export const CampaignsDashboard: React.FC<DashboardProps> = ({ campaigns = [] }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h3 className="font-serif text-lg mb-6 text-neutral-900">Marketing Campaigns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(c => (
                    <div key={c.id} className="border border-stone-200 rounded-lg p-4">
                        <div className="h-32 bg-stone-100 mb-4 rounded overflow-hidden">
                            <img src={c.hero_video.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-neutral-900">{c.title}</h4>
                        <p className="text-xs text-neutral-500 mb-2">{c.description}</p>
                        <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-1 rounded ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                {c.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-neutral-400">{c.start_date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RiskDashboard: React.FC<DashboardProps> = ({ orders = [], fraudChecks = [] }) => {
    const highRisk = orders.filter(o => o.fraud_score >= 80).length;
    const mediumRisk = orders.filter(o => o.fraud_score >= 50 && o.fraud_score < 80).length;
    
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="High Risk Orders" value={highRisk} icon={ShieldAlert} colorClass="bg-red-100 text-red-600" />
                <MetricCard title="Medium Risk" value={mediumRisk} icon={AlertTriangle} colorClass="bg-yellow-100 text-yellow-600" />
                <MetricCard title="Checks Performed" value={fraudChecks.length} icon={ShieldCheck} colorClass="bg-blue-100 text-blue-600" />
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-serif text-lg mb-4 text-neutral-900">Recent Fraud Checks</h3>
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-neutral-500">
                        <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Score</th>
                            <th className="p-3">Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fraudChecks.slice(0, 5).map(c => (
                            <tr key={c.id} className="border-b border-stone-50">
                                <td className="p-3 font-medium">{c.order_id}</td>
                                <td className="p-3">{c.score}</td>
                                <td className="p-3">{c.risk_level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const CustomersDashboard: React.FC<DashboardProps> = ({ users = [] }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h3 className="font-serif text-lg mb-6 text-neutral-900">Registered Customers</h3>
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-neutral-500">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Loyalty Tier</th>
                        <th className="p-4">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50">
                            <td className="p-4 font-medium">{u.name}</td>
                            <td className="p-4 text-neutral-500">{u.email}</td>
                            <td className="p-4">{u.loyalty.tier}</td>
                            <td className="p-4 font-mono">{u.loyalty.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const FinanceDashboard: React.FC<DashboardProps> = ({ orders = [] }) => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalProfit = orders.reduce((sum, o) => sum + (o.net_profit_sar || 0), 0);
    
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard title="Gross Revenue" value={formatPrice(totalRevenue, 'SAR', 'EN')} icon={DollarSign} colorClass="bg-green-100 text-green-600" />
                <MetricCard title="Net Profit" value={formatPrice(totalProfit, 'SAR', 'EN')} icon={PieChart} colorClass="bg-blue-100 text-blue-600" />
            </div>
        </div>
    );
};

export const SettingsDashboard: React.FC<DashboardProps> = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h3 className="font-serif text-lg mb-6 text-neutral-900">Global Settings</h3>
            <p className="text-neutral-500">Settings configuration requires Super Admin access.</p>
        </div>
    );
};

export const AutomationDashboard: React.FC<DashboardProps> = ({ smartBots = [] }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {smartBots.map(bot => (
                    <div key={bot.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-neutral-100 rounded-lg">
                                <Bot size={24} className="text-neutral-700" />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bot.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {bot.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <h4 className="font-bold text-neutral-900 mb-2">{bot.name}</h4>
                        <p className="text-xs text-neutral-500 mb-4 h-10 overflow-hidden">{bot.description}</p>
                        <div className="text-xs text-neutral-400 font-mono">
                            Runs: {bot.stats.runs} | Success: {bot.stats.successRate}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ChannelsDashboard: React.FC<DashboardProps> = ({ channels = [] }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h3 className="font-serif text-lg mb-6 text-neutral-900">Sales Channels</h3>
            <div className="space-y-4">
                {channels.map(ch => (
                    <div key={ch.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-stone-50 rounded">
                                <Globe size={20} className="text-stone-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-neutral-900">{ch.name}</h4>
                                <p className="text-xs text-neutral-500">{ch.type} • {ch.country_code}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${ch.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {ch.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrustedNetworkDashboard: React.FC<DashboardProps & { selectedSupplier: LuxurySupplier | null, onBack: () => void, onSelect: (s: LuxurySupplier) => void }> = ({ suppliers = [], selectedSupplier, onBack, onSelect }) => {
    if (selectedSupplier) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
                    <ArrowLeft size={16} /> Back to Network
                </button>
                <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="font-serif text-3xl text-neutral-900">{selectedSupplier.supplier_name}</h2>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{selectedSupplier.status}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-sm text-neutral-500 uppercase tracking-widest mb-4">Overview</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between border-b border-stone-50 pb-2"><span>HQ Country:</span> <span className="font-medium">{selectedSupplier.hq_country}</span></li>
                                <li className="flex justify-between border-b border-stone-50 pb-2"><span>Region:</span> <span className="font-medium">{selectedSupplier.region}</span></li>
                                <li className="flex justify-between border-b border-stone-50 pb-2"><span>Integration:</span> <span className="font-medium">{selectedSupplier.integration_type}</span></li>
                                <li className="flex justify-between border-b border-stone-50 pb-2"><span>Markets:</span> <span className="font-medium">{selectedSupplier.supported_markets.join(', ')}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-neutral-500 uppercase tracking-widest mb-4">Categories</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedSupplier.main_categories.map(c => (
                                    <span key={c} className="bg-stone-100 text-stone-600 px-3 py-1 rounded text-xs">{c}</span>
                                ))}
                            </div>
                            <div className="mt-6">
                                <h4 className="font-bold text-sm text-neutral-500 uppercase tracking-widest mb-2">Authenticity</h4>
                                <p className="text-sm text-neutral-600 bg-stone-50 p-3 rounded italic">"{selectedSupplier.authenticity_claim}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {suppliers.map(s => (
                <div 
                    key={s.supplier_id} 
                    onClick={() => onSelect(s)}
                    className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm cursor-pointer hover:shadow-md hover:border-gold-300 transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center font-serif text-lg">
                            {s.supplier_name.charAt(0)}
                        </div>
                        <ExternalLink size={16} className="text-stone-300 group-hover:text-gold-500" />
                    </div>
                    <h4 className="font-bold text-neutral-900 mb-1">{s.supplier_name}</h4>
                    <p className="text-xs text-neutral-500 mb-4">{s.hq_country} • {s.integration_type}</p>
                    <div className="flex flex-wrap gap-1">
                        {s.main_categories.slice(0, 3).map(c => (
                            <span key={c} className="text-[10px] bg-stone-50 px-2 py-1 rounded text-stone-500">{c}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SuppliersDashboard: React.FC<DashboardProps> = ({ suppliers = [] }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h3 className="font-serif text-lg mb-6 text-neutral-900">Active Suppliers Management</h3>
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-neutral-500">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Country</th>
                        <th className="p-4">Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(s => (
                        <tr key={s.id} className="border-b border-stone-50">
                            <td className="p-4 font-medium">{s.name}</td>
                            <td className="p-4 text-xs uppercase">{s.type}</td>
                            <td className="p-4">{s.country}</td>
                            <td className="p-4">
                                <span className={`font-bold ${s.performance?.score && s.performance.score > 90 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {s.performance?.score || 0}%
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const ProductsAdminDashboard: React.FC<DashboardProps> = ({ products = [], onAction }) => {
    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b bg-stone-50 flex justify-between items-center">
                <h3 className="font-serif text-lg text-neutral-900">Product Catalog</h3>
                <span className="text-xs text-neutral-500">{products.length} Items</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-neutral-500 border-b border-stone-100">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Brand</th>
                            <th className="p-4">Price (SAR)</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-stone-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded object-cover" />
                                    <div className="max-w-[200px]">
                                        <div className="font-medium truncate">{p.name}</div>
                                        <div className="text-xs text-neutral-400 truncate">{p.sku}</div>
                                    </div>
                                </td>
                                <td className="p-4">{p.brand}</td>
                                <td className="p-4 font-mono">{formatPrice(p.final_price_sar || p.price, 'SAR', 'EN')}</td>
                                <td className="p-4">{p.stock_quantity || 0}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${p.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onAction && onAction('ai_enrich', p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="AI Enrich"><Sparkles size={14} /></button>
                                        <button onClick={() => onAction && onAction('apply_pricing', p)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Apply Pricing"><DollarSign size={14} /></button>
                                        <button onClick={() => onAction && onAction('duplicate', p)} className="p-1.5 text-stone-600 hover:bg-stone-100 rounded" title="Duplicate"><Copy size={14} /></button>
                                        <button onClick={() => onAction && onAction('deactivate', p)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Archive"><Ban size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const AiManagementDashboard: React.FC<DashboardProps> = ({ aiSettings = [], onAction }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            {aiSettings.map(setting => (
                <div key={setting.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <BrainCircuit size={24} />
                            </div>
                            <button 
                                onClick={() => onAction && onAction('toggle_ai_feature', setting)}
                                className={`text-2xl transition-colors ${setting.is_enabled ? 'text-green-500' : 'text-stone-300'}`}
                            >
                                {setting.is_enabled ? <ToggleRight /> : <ToggleLeft />}
                            </button>
                        </div>
                        <h4 className="font-bold text-neutral-900 mb-2">{setting.name}</h4>
                        <p className="text-sm text-neutral-500 mb-4">{setting.description}</p>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-4 pt-4 border-t border-stone-50 flex justify-between">
                        <span>Model: {setting.model_used}</span>
                        <span>Updated: {setting.last_updated}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PricingRulesDashboard: React.FC<DashboardProps> = ({ pricingRules = [], onAction }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-neutral-900">Pricing Rules Engine</h3>
                <button 
                    onClick={() => onAction && onAction('apply_pricing_rules_global')}
                    className="bg-neutral-900 text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gold-600 transition-colors flex items-center gap-2"
                >
                    <Zap size={14} /> Run Global Sync
                </button>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-neutral-500">
                    <tr>
                        <th className="p-4">Rule Name</th>
                        <th className="p-4">Scope</th>
                        <th className="p-4">Region</th>
                        <th className="p-4">Margin %</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {pricingRules.map(rule => (
                        <tr key={rule.id} className="border-b border-stone-50">
                            <td className="p-4 font-medium">{rule.name}</td>
                            <td className="p-4 text-xs text-neutral-500">
                                {rule.applies_to_category_id ? `Category: ${rule.applies_to_category_id}` : rule.applies_to_brand_id ? `Brand: ${rule.applies_to_brand_id}` : 'Global'}
                            </td>
                            <td className="p-4">{rule.country}</td>
                            <td className="p-4 font-mono font-bold text-blue-600">{rule.margin_percent}%</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${rule.is_active ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                                    {rule.is_active ? 'Active' : 'Disabled'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const FraudManagementDashboard: React.FC<DashboardProps> = ({ fraudChecks = [], onAction }) => {
    return (
        <div className="animate-fade-in-up bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-serif text-lg text-neutral-900 flex items-center gap-2">
                        <ShieldAlert size={20} className="text-gold-600" />
                        Fraud Management
                    </h3>
                    <p className="text-xs text-neutral-500">Review suspicious transaction attempts.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-red-600"><span className="w-2 h-2 bg-red-600 rounded-full"></span> High (≥80)</span>
                    <span className="flex items-center gap-1 text-yellow-600"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Medium (50-79)</span>
                    <span className="flex items-center gap-1 text-green-600"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Safe (&lt;50)</span>
                </div>
            </div>

            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-neutral-500 font-medium">
                    <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Risk Level</th>
                        <th className="p-4">Risk Reason</th>
                        <th className="p-4">Analyzed At</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {fraudChecks.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-neutral-400">No active fraud alerts.</td></tr>
                    ) : (
                        fraudChecks.map(check => {
                            let scoreColor = 'bg-green-100 text-green-700';
                            if (check.score >= 80) scoreColor = 'bg-red-100 text-red-700';
                            else if (check.score >= 50) scoreColor = 'bg-yellow-100 text-yellow-800';

                            return (
                                <tr key={check.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="p-4 font-bold text-neutral-800">{check.order_id}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${scoreColor}`}>
                                            {check.score} / 100
                                        </span>
                                    </td>
                                    <td className="p-4 uppercase text-xs font-bold text-neutral-500">{check.risk_level}</td>
                                    <td className="p-4 text-xs text-neutral-600">
                                        {check.risk_factors ? (
                                            <div className="flex flex-col gap-1">
                                                {check.risk_factors.map((f, i) => (
                                                    <span key={i} className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded w-fit">
                                                        <AlertTriangle size={8} /> {f}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-neutral-400 italic">No specific factors</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs font-mono text-neutral-400">
                                        {new Date(check.checked_at).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${check.status === 'reviewed' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                                            {check.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {check.status !== 'reviewed' && (
                                            <button 
                                                onClick={() => onAction && onAction('mark_fraud_reviewed', check)}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline font-bold uppercase tracking-wider"
                                            >
                                                <Fingerprint size={12} /> Mark Reviewed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export const SystemLogsDashboard: React.FC<DashboardProps> = ({ logs = [], onAction }) => {
    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h3 className="font-serif text-lg text-neutral-900 flex items-center gap-2">
                    <FileText size={20} /> System Logs
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest mr-2">{logs.length} Entries</span>
                    <button 
                        onClick={() => onAction && onAction('export_logs')}
                        className="bg-white border border-stone-300 text-neutral-700 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors flex items-center gap-2"
                    >
                        <DownloadCloud size={12} /> Export
                    </button>
                    <button 
                        onClick={() => onAction && onAction('clear_logs')}
                        className="bg-red-50 border border-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={12} /> Clear
                    </button>
                </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-neutral-500 font-medium sticky top-0 z-10">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Related ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {logs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No logs recorded.</td></tr>
                        ) : logs.map(log => (
                            <tr key={log.id} className="hover:bg-stone-50">
                                <td className="p-4 font-mono text-xs text-neutral-500 whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider 
                                        ${log.type === 'error' ? 'bg-red-100 text-red-700' : 
                                          log.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                                          log.type === 'api_call' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="p-4 text-neutral-700 max-w-md truncate" title={log.message}>
                                    {log.message}
                                </td>
                                <td className="p-4 font-mono text-xs text-neutral-400">
                                    {log.related_order_id || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const SystemHealthDashboard: React.FC<DashboardProps> = ({ logs = [] }) => {
    return <SystemLogsDashboard logs={logs} />;
};