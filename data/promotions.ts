
import { Promotion } from '../types';

export const promotions: Promotion[] = [
    {
        id: 'promo-1',
        name_en: 'Summer Luxury Sale',
        name_ar: 'عروض الصيف الفاخرة',
        type: 'percentage_discount',
        discount_value: 15,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        is_active: true,
        scope: 'category',
        target_ids: ['Watches', 'Bags'],
        description: '15% Off selected categories'
    },
    {
        id: 'promo-2',
        name_en: 'New User Welcome',
        name_ar: 'عرض الترحيب',
        type: 'fixed_amount_discount',
        discount_value: 100,
        start_date: '2024-01-01',
        end_date: '2025-01-01',
        is_active: false, // Inactive initially
        scope: 'min_order',
        min_order_amount_sar: 1000,
        description: '100 SAR off orders above 1000 SAR'
    }
];
