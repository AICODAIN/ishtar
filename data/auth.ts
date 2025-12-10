
import { UserProfile } from '../types';

interface AuthEntry extends UserProfile {
    passwordHash: string; // Plain text for demo
}

export const authUsers: AuthEntry[] = [
    // 1. Super Admin (ABDULRAHMAN)
    {
        id: 'admin_01',
        username: 'super_abdul',
        name: 'ABDULRAHMAN',
        email: 'CX.TV@HOTMAIL.COM', // Target Email
        role: 'super_admin', // Full Access
        passwordHash: 'admin123',
        phone: '+966558816638',
        addresses: [],
        loyalty: { points: 99999, tier: 'Platinum' },
        preferences: { 
            notify_order_status: true, 
            notify_promotions: true,
            language: 'EN',
            currency: 'SAR',
            country: 'Saudi Arabia'
        },
        language: 'EN',
        currency: 'SAR',
        country: 'Saudi Arabia'
    },
    // 2. Supplier (e.g., Riyadh Luxury Watches - Supplier ID 1)
    {
        id: 'sup_01',
        username: 'riyadh_watches',
        name: 'Riyadh Watches Manager',
        email: 'watches.riyadh@example.com',
        role: 'supplier',
        supplierId: 1,
        passwordHash: 'supply123',
        phone: '+966500000001',
        addresses: [],
        loyalty: { points: 0, tier: 'Silver' },
        preferences: { 
            notify_order_status: true, 
            notify_promotions: false,
            language: 'AR',
            currency: 'SAR',
            country: 'Saudi Arabia'
        },
        language: 'AR',
        currency: 'SAR',
        country: 'Saudi Arabia'
    },
    // 3. Customer
    {
        id: 'cust_01',
        username: 'sarah_c',
        name: 'Sarah Al-Saud',
        email: 'sarah@example.com',
        role: 'customer',
        passwordHash: 'password',
        phone: '+966551234567',
        addresses: [{ id: 'a1', type: 'Home', country: 'Saudi Arabia', city: 'Riyadh', street: 'Olaya St' }],
        loyalty: { points: 1250, tier: 'Gold' },
        preferences: { 
            notify_order_status: true, 
            notify_promotions: false,
            language: 'EN',
            currency: 'SAR',
            country: 'Saudi Arabia'
        },
        language: 'EN',
        currency: 'SAR',
        country: 'Saudi Arabia'
    }
];
