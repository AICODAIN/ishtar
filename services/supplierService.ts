
import { luxurySuppliers } from '../data/luxurySuppliers';
import { LuxurySupplier, Product } from '../types';

/**
 * Returns the full list of approved luxury suppliers.
 */
export const getApprovedSuppliers = (): LuxurySupplier[] => {
    return luxurySuppliers.filter(s => s.status === 'Approved');
};

/**
 * Verifies if a product comes from an approved luxury source.
 * This is used to display the "Verified Supplier Network" badge.
 */
export const isProductAuthentic = (product: Product): boolean => {
    // If manually verified, trust it
    if (product.authenticity_verified) return true;

    // Check against approved supplier IDs
    // Note: SupplierId in Product can be number (legacy) or string (new system)
    const approvedIds = getApprovedSuppliers().map(s => s.supplier_id);
    
    if (typeof product.supplierId === 'string' && approvedIds.includes(product.supplierId)) {
        return true;
    }

    return false;
};

/**
 * Determines the best supplier based on customer location (Region Routing).
 * Priorities:
 * 1. USA Customer -> USA Warehouses (BrandsGateway, Hertwill)
 * 2. UK Customer -> UK or EU Suppliers
 * 3. EU Customer -> EU Suppliers
 */
export const getBestSupplierForRegion = (customerCountryCode: string, category: string): LuxurySupplier | null => {
    const allSuppliers = getApprovedSuppliers();
    
    const isUSA = customerCountryCode === 'US' || customerCountryCode === 'USA';
    const isUK = customerCountryCode === 'UK' || customerCountryCode === 'GB';
    const isEU = ['FR', 'IT', 'DE', 'ES', 'NL', 'SE'].includes(customerCountryCode); // simplified

    // Filter by Category first
    const categorySuppliers = allSuppliers.filter(s => 
        s.main_categories.some(cat => cat.includes(category) || category.includes(cat))
    );

    if (categorySuppliers.length === 0) return null;

    if (isUSA) {
        // Prioritize suppliers with US presence
        const usSuppliers = categorySuppliers.filter(s => s.region === 'USA' || s.region === 'Global');
        if (usSuppliers.length > 0) return usSuppliers[0];
    }

    if (isUK) {
        // Prioritize UK specific, then Global/EU
        const ukSuppliers = categorySuppliers.filter(s => s.region === 'UK');
        if (ukSuppliers.length > 0) return ukSuppliers[0];
    }

    if (isEU) {
        // Prioritize EU specific
        const euSuppliers = categorySuppliers.filter(s => s.region === 'EU');
        if (euSuppliers.length > 0) return euSuppliers[0];
    }

    // Default Fallback
    return categorySuppliers[0];
};

/**
 * Risk Check: Ensure no product uses a banned supplier.
 */
export const validateSupplierCompliance = (product: Product): { valid: boolean; reason?: string } => {
    const id = String(product.supplierId);
    const supplier = luxurySuppliers.find(s => s.supplier_id === id);

    if (!supplier) {
        // If it's a legacy numeric ID, we skip this check for now or map legacy suppliers
        if (!isNaN(Number(product.supplierId))) return { valid: true };
        return { valid: false, reason: 'Unknown Supplier ID' };
    }

    if (supplier.status !== 'Approved') {
        return { valid: false, reason: `Supplier ${supplier.supplier_name} is ${supplier.status}` };
    }

    return { valid: true };
};
