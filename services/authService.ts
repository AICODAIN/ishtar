
import { users } from '../data/coreData';
import { UserProfile } from '../types';

export const login = async (email: string, password?: string): Promise<UserProfile | null> => {
  // Simulating Auth Check (Password ignored for prototype)
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  // --- SECURITY RULE: FORCE SUPER ADMIN FOR SPECIFIC OWNER ---
  if (email.toLowerCase() === 'cx.tv@hotmail.com') {
      if (!user) {
          // Create User object if missing in coreData but authorized via Security Rule
          user = {
              id: 'usr_super_admin_override',
              username: 'super_abdul',
              name: 'ABDULRAHMAN',
              email: 'CX.TV@HOTMAIL.COM',
              phone: '+966558816638',
              role: 'super_admin',
              preferences: { language: 'EN', currency: 'SAR', country: 'Saudi Arabia', notify_order_status: true, notify_promotions: true },
              loyalty: { points: 0, tier: 'Platinum' },
              addresses: []
          };
      } else {
          // Force privileges if user exists
          user = { 
              ...user, 
              role: 'super_admin',
              name: 'ABDULRAHMAN',
              phone: '+966558816638'
          };
      }
  }

  return user || null;
};

export const canAccessAdmin = (user: UserProfile) => {
    // 1. Absolute Rule for Owner
    if (user.email.toLowerCase() === 'cx.tv@hotmail.com') return true;

    // 2. Role Based Access
    return ['admin', 'super_admin', 'operations_manager', 'marketing_manager', 'finance_manager', 'risk_officer', 'view_only_analyst'].includes(user.role);
};

export const canAccessSupplier = (user: UserProfile) => user.role === 'supplier';
