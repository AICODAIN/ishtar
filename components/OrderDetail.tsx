
import React from 'react';
import { AdminOrder, FraudCheck, SystemLog } from '../types';
import { X, Check, Ban, Truck, Send, AlertTriangle, MapPin, CreditCard, User, Package, RefreshCw, Calendar, Globe, Shield, Activity, ChevronRight, FileText, CheckCircle } from 'lucide-react';
import { formatPrice } from '../services/commerceService';

interface OrderDetailProps {
    order: AdminOrder;
    fraudChecks?: FraudCheck[];
    logs?: SystemLog[];
    onClose: () => void;
    onUpdateStatus: (id: string, status: string) => void;
    onReroute: (id: string, itemId: string) => void;
    onResendNotif: (id: string) => void;
    onRecheckFraud: (id: string) => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, fraudChecks = [], logs = [], onClose, onUpdateStatus, onReroute, onResendNotif, onRecheckFraud }) => {
    
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-orange-100 text-orange-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'on_hold': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-stone-100 text-stone-700';
        }
    };

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = steps.findIndex(s => s.toLowerCase() === order.status.toLowerCase()) === -1 ? 0 : steps.findIndex(s => s.toLowerCase() === order.status.toLowerCase());

    // Filter related data
    const relatedChecks = fraudChecks.filter(c => c.order_id === order.id);
    const relatedLogs = logs.filter(l => l.related_order_id === order.id || l.message.includes(order.id));

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-serif text-neutral-900">Order #{order.id}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                        {order.fraud_score >= 50 && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-600 flex items-center gap-1">
                                <AlertTriangle size={12} /> High Risk ({order.fraud_score})
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-neutral-500 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.date).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Globe size={14} /> {order.channel_id === 1 ? 'Native App' : 'Shopify'}</span>
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content Grid */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Customer & Payment */}
                <div className="space-y-8">
                    {/* Customer */}
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User size={14} /> Customer Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-bold text-neutral-900">{order.customer}</p>
                                <p className="text-xs text-neutral-500">{order.email}</p>
                                <p className="text-xs text-neutral-500">{order.phone}</p>
                            </div>
                            <div className="pt-3 border-t border-stone-200">
                                <p className="text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1"><MapPin size={12} /> Shipping Address</p>
                                <p className="text-xs text-neutral-500 leading-relaxed">{order.shipping_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CreditCard size={14} /> Payment Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-neutral-500">Method</span>
                                <span className="text-sm font-bold text-neutral-900 capitalize">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-neutral-500">Status</span>
                                <span className={`text-xs font-bold uppercase ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment_status || 'Pending'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-neutral-500">Total</span>
                                <span className="text-lg font-mono text-neutral-900 font-bold">{formatPrice(order.total, 'SAR', 'EN')}</span>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-stone-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-neutral-500 flex items-center gap-1"><Shield size={12} /> Fraud Score</span>
                                    <span className={`text-xs font-bold ${order.fraud_score > 50 ? 'text-red-600' : 'text-green-600'}`}>{order.fraud_score}/100</span>
                                </div>
                                <button 
                                    onClick={() => onRecheckFraud(order.id)}
                                    className="w-full text-center text-[10px] uppercase font-bold text-blue-600 bg-blue-50 py-1.5 rounded hover:bg-blue-100 transition-colors"
                                >
                                    Recheck Score
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Items & Fulfillment */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Fulfillment Timeline */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-100 -translate-y-1/2 rounded-full"></div>
                        <div className="relative flex justify-between">
                            {steps.map((step, idx) => {
                                const isActive = idx <= currentStepIndex;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-stone-300 text-stone-300'}`}>
                                            {isActive ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-stone-300"></div>}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-neutral-900' : 'text-stone-400'}`}>{step}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                        <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-neutral-700">Ordered Items ({order.items.length})</h3>
                            {order.status === 'processing' && (
                                <button className="text-xs text-gold-600 font-bold uppercase hover:text-gold-700 flex items-center gap-1">
                                    <Truck size={12} /> Track Shipment
                                </button>
                            )}
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-stone-100 text-neutral-400 text-xs">
                                    <th className="p-4 font-normal">Product</th>
                                    <th className="p-4 font-normal">SKU</th>
                                    <th className="p-4 font-normal">Qty</th>
                                    <th className="p-4 font-normal">Supplier</th>
                                    <th className="p-4 font-normal">Status</th>
                                    <th className="p-4 font-normal text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {order.items.map(item => (
                                    <tr key={item.id} className="hover:bg-stone-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded object-cover border border-stone-200" />
                                                <span className="font-medium text-neutral-800">{item.product_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-mono text-neutral-500">{item.sku}</td>
                                        <td className="p-4 font-bold">{item.quantity}</td>
                                        <td className="p-4 text-xs text-neutral-600">ID: {item.supplier_id}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                                item.supplier_status === 'shipped' ? 'bg-green-100 text-green-700' :
                                                item.supplier_status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {item.supplier_status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => onReroute(order.id, item.id)}
                                                className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1"
                                                title="Reroute to backup supplier"
                                            >
                                                <RefreshCw size={12} /> Reroute
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-neutral-900 mb-1">Manage Order</h4>
                            <p className="text-xs text-neutral-500">Update status or trigger notifications.</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => onResendNotif(order.id)}
                                className="bg-white border border-stone-300 text-neutral-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-50 flex items-center gap-2"
                            >
                                <Send size={14} /> Resend Email
                            </button>
                            
                            {order.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                                        className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Ban size={14} /> Reject
                                    </button>
                                    <button 
                                        onClick={() => onUpdateStatus(order.id, 'processing')}
                                        className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold-600 flex items-center gap-2 shadow-lg"
                                    >
                                        <Check size={14} /> Approve & Process
                                    </button>
                                </>
                            )}
                            
                            {order.status === 'processing' && (
                                <button 
                                    onClick={() => onUpdateStatus(order.id, 'shipped')}
                                    className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold-600 flex items-center gap-2 shadow-lg"
                                >
                                    <Truck size={14} /> Mark Shipped
                                </button>
                            )}

                            {order.status === 'shipped' && (
                                <button 
                                    onClick={() => onUpdateStatus(order.id, 'delivered')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 flex items-center gap-2 shadow-lg"
                                >
                                    <CheckCircle size={14} /> Mark Delivered
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Inline Views: Fraud Checks & Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Fraud Checks Table */}
                        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                            <div className="p-4 bg-stone-50 border-b border-stone-200">
                                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={14} /> Fraud Checks
                                </h3>
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                <table className="w-full text-xs text-left">
                                    <tbody className="divide-y divide-stone-50">
                                        {relatedChecks.length > 0 ? relatedChecks.map(c => (
                                            <tr key={c.id}>
                                                <td className="p-3 text-neutral-500">{new Date(c.checked_at).toLocaleTimeString()}</td>
                                                <td className={`p-3 font-bold ${c.score > 50 ? 'text-red-600' : 'text-green-600'}`}>{c.score}/100</td>
                                                <td className="p-3 uppercase">{c.status}</td>
                                            </tr>
                                        )) : (
                                            <tr><td className="p-4 text-center text-neutral-400 italic">No checks recorded</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Logs */}
                        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                            <div className="p-4 bg-stone-50 border-b border-stone-200">
                                <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Order Logs
                                </h3>
                            </div>
                            <div className="max-h-40 overflow-y-auto p-3 space-y-2">
                                {relatedLogs.length > 0 ? relatedLogs.map(l => (
                                    <div key={l.id} className="text-xs flex gap-2">
                                        <span className="text-neutral-400 font-mono flex-shrink-0">{new Date(l.created_at).toLocaleTimeString()}</span>
                                        <span className="text-neutral-700">{l.message}</span>
                                    </div>
                                )) : (
                                    <p className="text-center text-neutral-400 italic">No logs found</p>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};
