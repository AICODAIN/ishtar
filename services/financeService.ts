
import { OrderProfit, AdminOrder, Product, PaymentGateway, Currency } from '../types';
import { currencies } from '../data/currencies';
import { products } from '../data/products';
import { paymentGateways } from '../data/paymentGateways';
import { shippingRules } from '../data/shipping';

// 1. Helper: Get Product Cost in SAR
export const getProductLandedCost = (product: Product): number => {
    // If explicit total exists, return it
    if (product.total_cost_sar) return product.total_cost_sar;

    // Calculate from components
    const supplierCurrency = product.supplier_currency_code as Currency;
    const config = currencies.find(c => c.code === supplierCurrency);
    const exchangeRate = config ? config.exchange_rate_to_sar : 1; // Default 1 if missing

    const baseCost = product.supplier_base_cost || 0;
    const shipping = product.shipping_cost_supplier_currency || 0;
    const customs = product.customs_fees_supplier_currency || 0;

    const totalSupplierCurrency = baseCost + shipping + customs;
    
    // Convert to SAR
    return totalSupplierCurrency * exchangeRate;
};

// 2. Helper: Calculate Payment Gateway Fee
export const calculatePaymentFee = (order: AdminOrder): number => {
    const gatewayId = order.payment_gateway;
    const gateway = paymentGateways.find(g => g.id === gatewayId);
    
    if (!gateway) {
        // Fallback or estimate if gateway ID is missing (e.g. legacy order)
        // Assume standard 2.5% + 1 SAR
        return 1 + (order.total * 0.025);
    }

    const fee = gateway.fee_fixed_sar + (order.total * gateway.fee_percent / 100);
    return fee;
};

// 3. Helper: Estimate Actual Shipping Cost (Cost to Ishtar, not Price to Customer)
// Ideally this comes from a "Shipment" object, but here we estimate based on rules/weight
export const calculateActualShippingCost = (order: AdminOrder): number => {
    // Simulating Cost logic:
    // Standard: 20 SAR base
    // Express: 40 SAR base
    // VIP: 100 SAR base
    let baseCost = 25;
    if (order.shipping_method === 'express') baseCost = 45;
    if (order.shipping_method === 'vip') baseCost = 120;

    // Add per item weight estimation (simulated)
    const weightCost = order.items_count * 2; // 2 SAR per item handling/weight

    return baseCost + weightCost;
};

// 4. Main Calculator: Order Profit
export const calculateOrderProfit = (order: AdminOrder): OrderProfit => {
    
    // A. Revenue
    const revenue = order.total; // Assumes total includes shipping paid by customer

    // B. Costs
    let totalProductCost = 0;
    
    order.items.forEach(item => {
        // Find product definition to get cost data
        // In real app, cost should be snapshot at time of order to preserve history
        // Here we lookup current product data
        const productDef = products.find(p => p.id === item.sku || p.name === item.product_name); // Loose matching for demo data
        if (productDef) {
            totalProductCost += getProductLandedCost(productDef) * item.quantity;
        } else {
            // Fallback: Assume 70% of price is cost if unknown
            totalProductCost += (item.price * 0.7) * item.quantity; 
        }
    });

    const paymentFees = calculatePaymentFee(order);
    const shippingCostActual = calculateActualShippingCost(order);

    const totalCost = totalProductCost + paymentFees + shippingCostActual;

    // C. Profit
    const netProfit = revenue - totalCost;
    const marginPercent = (netProfit / revenue) * 100;

    // Estimate Shipping Revenue (Simple logic: if total > item sum, diff is shipping/tax)
    // For this demo, let's assume shipping revenue was 25 or 0 based on total > 1000 logic stored elsewhere
    // We will just return the breakdown.

    return {
        order_id: order.id,
        calculated_at: new Date().toISOString(),
        total_revenue_sar: revenue,
        total_cost_sar: totalCost,
        net_profit_sar: netProfit,
        profit_margin_percent: marginPercent,
        breakdown: {
            product_cost_sar: totalProductCost,
            shipping_cost_actual_sar: shippingCostActual,
            payment_fees_sar: paymentFees,
            shipping_revenue_sar: 0 // Placeholder, strictly needed would require separate field in Order
        }
    };
};
