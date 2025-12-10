
import React, { useState } from 'react';
import { adminOrders } from '../data/coreData';
import { formatPrice } from '../services/commerceService';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface SupplierPortalProps {
  supplierId: number | string;
  supplierName: string;
  onLogout: () => void;
}

const SupplierPortal: React.FC<SupplierPortalProps> = ({ supplierId, supplierName, onLogout }) => {
  const myOrders = adminOrders.filter(o => o.items.some(i => i.supplier_id === supplierId));

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div>
            <h1 className="font-serif text-xl">Supplier Portal</h1>
            <p className="text-xs text-neutral-500">{supplierName}</p>
        </div>
        <button onClick={onLogout} className="text-red-600 text-sm font-bold">Logout</button>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow-sm border-l-4 border-orange-500">
                <h3 className="text-neutral-500 text-xs font-bold uppercase">Pending</h3>
                <p className="text-3xl font-serif mt-2">{myOrders.filter(o => o.items.some(i => i.supplier_status === 'pending')).length}</p>
            </div>
            <div className="bg-white p-6 rounded shadow-sm border-l-4 border-blue-500">
                <h3 className="text-neutral-500 text-xs font-bold uppercase">Processing</h3>
                <p className="text-3xl font-serif mt-2">{myOrders.filter(o => o.items.some(i => i.supplier_status === 'preparing')).length}</p>
            </div>
            <div className="bg-white p-6 rounded shadow-sm border-l-4 border-green-500">
                <h3 className="text-neutral-500 text-xs font-bold uppercase">Shipped</h3>
                <p className="text-3xl font-serif mt-2">{myOrders.filter(o => o.items.some(i => i.supplier_status === 'shipped')).length}</p>
            </div>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 border-b bg-stone-50">
                <h3 className="font-bold text-neutral-700">My Orders</h3>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-50 text-neutral-500">
                    <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Item</th>
                        <th className="p-4">Qty</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {myOrders.map(o => (
                        o.items.filter(i => i.supplier_id === supplierId).map(item => (
                            <tr key={`${o.id}-${item.id}`} className="border-b">
                                <td className="p-4 font-bold">{o.id}</td>
                                <td className="p-4 flex items-center gap-3">
                                    <img src={item.image} className="w-10 h-10 rounded object-cover" />
                                    {item.product_name}
                                </td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${item.supplier_status === 'shipped' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {item.supplier_status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.supplier_status !== 'shipped' && (
                                        <button className="text-xs bg-neutral-900 text-white px-3 py-1 rounded hover:bg-gold-600">Update Status</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;
