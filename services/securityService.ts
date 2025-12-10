
import { Role, UserProfile, AdminOrder, Product, LuxurySupplier, AuditLog, DataClassification } from '../types';
import { auditLogs } from '../data/adminData';

// --- DATA CLASSIFICATION CONSTANTS ---
const CLASSIFICATION: Record<string, DataClassification> = {
    // Orders
    'order.id': 'PUBLIC',
    'order.total': 'BUSINESS_CONFIDENTIAL',
    'order.customer': 'SENSITIVE_PII',
    'order.email': 'SENSITIVE_PII',
    'order.phone': 'SENSITIVE_PII',
    'order.shipping_address': 'SENSITIVE_PII',
    'order.fraud_score': 'BUSINESS_CONFIDENTIAL',
    
    // Suppliers
    'supplier.name': 'PUBLIC',
    'supplier.margin': 'BUSINESS_CONFIDENTIAL',
    'supplier.bank_details': 'HIGHLY_SENSITIVE'
};

// --- AUDIT LOGGING ---

export const logAuditAction = (
    user: UserProfile, 
    action: AuditLog['action_type'], 
    entityType: AuditLog['entity_type'], 
    details: string,
    entityId?: string
) => {
    const log: AuditLog = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
        timestamp: new Date().toISOString(),
        actor_id: user.id,
        actor_role: user.role,
        action_type: action,
        entity_type: entityType,
        entity_id: entityId,
        details: details,
        ip_address: 'client-simulated-ip'
    };
    
    // In production, this would be an API call. Here we push to local store.
    auditLogs.unshift(log);
    console.log(`[SECURITY AUDIT] ${action} on ${entityType}: ${details}`);
};

// --- MASKING LOGIC ---

export const maskPII = (text: string | undefined, type: 'email' | 'phone' | 'address' | 'name'): string => {
    if (!text) return '';
    
    switch (type) {
        case 'email':
            const [local, domain] = text.split('@');
            if (!domain) return '***';
            return `${local.charAt(0)}***@${domain}`;
        case 'phone':
            return text.replace(/(\d{3})\d+(\d{2})/, '$1******$2');
        case 'address':
            // Show only City/Country if possible, or truncate
            // Simple heuristic: return last 20 chars or try to split
            const parts = text.split(',');
            return parts.length > 1 ? parts[parts.length - 1].trim() : '******';
        case 'name':
            const names = text.split(' ');
            return names.length > 1 ? `${names[0]} ${names[1].charAt(0)}.` : text;
        default:
            return '******';
    }
};

// --- ROLE ENFORCEMENT & VIEW TRANSFORMATION ---

/**
 * Transforms an Order object based on the viewer's role.
 * Masks sensitive fields if the user lacks permission.
 */
export const secureOrderView = (order: AdminOrder, user: UserProfile): AdminOrder => {
    // 1. Super Admin & Owner Override
    if (user.role === 'super_admin' || user.email.toLowerCase() === 'cx.tv@hotmail.com') {
        return order; // Return authentic object with NO restrictions
    }

    // 2. Full Access Roles (Internal Ops)
    if (['admin', 'operations_manager', 'risk_officer'].includes(user.role)) {
        return order; 
    }

    // 3. Clone to avoid mutating original data
    const safeOrder = { ...order };

    // 4. Apply Masking for specific restricted roles
    if (['marketing_manager', 'finance_manager', 'view_only_analyst'].includes(user.role)) {
        safeOrder.email = maskPII(order.email, 'email');
        safeOrder.phone = maskPII(order.phone, 'phone');
        safeOrder.shipping_address = maskPII(order.shipping_address, 'address');
        safeOrder.customer = maskPII(order.customer, 'name');
    }

    // 5. Supplier Specific Masking (Strict)
    if (user.role === 'supplier') {
        // Suppliers should typically not see the customer PII at all via this object, 
        // usually they only get shipping label generation data. 
        // Here we mask strictly.
        safeOrder.email = 'REDACTED';
        safeOrder.phone = 'REDACTED';
        safeOrder.customer = 'Ishtar Customer';
        // We might leave address partially visible for region checking, or fully masked depending on flow.
        safeOrder.shipping_address = maskPII(order.shipping_address, 'address'); // Only City
        
        // Hide Financials unrelated to supplier
        safeOrder.payment_method = 'REDACTED';
        safeOrder.payment_gateway = undefined;
        safeOrder.fraud_score = 0; // Hide risk score
        safeOrder.net_profit_sar = 0;
    }

    return safeOrder;
};

/**
 * Transforms a Customer/User profile for Admin viewing.
 */
export const secureCustomerView = (customer: UserProfile, viewer: UserProfile): Partial<UserProfile> => {
    // 1. Super Admin & Owner
    if (viewer.role === 'super_admin' || viewer.email.toLowerCase() === 'cx.tv@hotmail.com') {
        return customer;
    }

    // 2. Full Access
    if (['admin', 'risk_officer'].includes(viewer.role)) {
        return customer;
    }

    const safeUser = { ...customer };

    // 3. Masking
    if (['marketing_manager', 'view_only_analyst', 'finance_manager', 'operations_manager'].includes(viewer.role)) {
        safeUser.email = maskPII(customer.email, 'email');
        safeUser.phone = maskPII(customer.phone, 'phone');
        safeUser.name = maskPII(customer.name, 'name');
        
        // Mask addresses
        safeUser.addresses = customer.addresses.map(a => ({
            ...a,
            street: '******',
            city: a.city, // visible
            country: a.country // visible
        }));
    }

    // 4. Supplier Blocking
    if (viewer.role === 'supplier') {
        // Suppliers should not access customer lists directly
        throw new Error("Access Denied: Suppliers cannot view customer profiles.");
    }

    return safeUser;
};

// --- ROW LEVEL SECURITY (RLS) ---

/**
 * Filters a list of orders to ensure users only see what they are allowed to.
 */
export const enforceOrderRLS = (orders: AdminOrder[], user: UserProfile): AdminOrder[] => {
    // 1. Super Users see all
    if (user.role === 'super_admin' || ['admin', 'operations_manager', 'risk_officer', 'finance_manager', 'marketing_manager', 'view_only_analyst'].includes(user.role)) {
        return orders;
    }

    // 2. Supplier RLS
    if (user.role === 'supplier') {
        // Can only see orders that contain items linked to their supplier ID
        // AND user must have a supplierId
        if (!user.supplierId) return [];

        return orders.filter(order => 
            order.items.some(item => String(item.supplier_id) === String(user.supplierId))
        );
    }

    // Default: Deny
    return [];
};

/**
 * Filters products based on Supplier RLS
 */
export const enforceProductRLS = (products: Product[], user: UserProfile): Product[] => {
    if (user.role === 'super_admin' || ['admin', 'operations_manager', 'marketing_manager', 'view_only_analyst'].includes(user.role)) {
        return products;
    }

    if (user.role === 'supplier') {
        if (!user.supplierId) return [];
        return products.filter(p => String(p.supplierId) === String(user.supplierId));
    }

    return []; // Finance/Risk usually don't manage catalog, but if they did, they'd likely see all
};

// --- PERMISSION CHECKER ---

export const canPerformAction = (user: UserProfile, resource: string, action: 'VIEW' | 'EDIT' | 'DELETE' | 'EXPORT'): boolean => {
    // 1. OWNER / SUPER ADMIN (God Mode)
    if (user.role === 'super_admin' || user.email.toLowerCase() === 'cx.tv@hotmail.com') return true;

    // View Only Analyst
    if (user.role === 'view_only_analyst') {
        return action === 'VIEW';
    }

    switch (resource) {
        case 'settings':
            return false; // Only Super Admin/Owner can modify global settings
        case 'finance':
            return user.role === 'finance_manager';
        case 'risk_rules':
            return user.role === 'risk_officer';
        case 'catalog':
            return ['marketing_manager', 'operations_manager', 'admin'].includes(user.role);
        case 'orders':
            // Suppliers can View/Edit (status) their own orders, logic handled in UI mostly, but here for general check
            if (user.role === 'supplier' && action === 'DELETE') return false;
            return true;
        case 'ai_studio':
            return ['marketing_manager'].includes(user.role);
        default:
            return false;
    }
};
