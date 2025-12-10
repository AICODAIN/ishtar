import { Category } from '../types';

export const categories: Category[] = [
    // 1. Timepieces
    { id: 'cat-time', name_en: 'Timepieces', name_ar: 'ساعات', slug: 'timepieces', parent_id: null, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800' },
    { id: 'sub-time-w', name_en: "Women's Watches", name_ar: 'ساعات نسائية', slug: 'womens-watches', parent_id: 'cat-time' },
    { id: 'sub-time-m', name_en: "Men's Watches", name_ar: 'ساعات رجالية', slug: 'mens-watches', parent_id: 'cat-time' },
    { id: 'sub-time-lux', name_en: 'Luxury Watches', name_ar: 'ساعات فاخرة', slug: 'luxury-watches', parent_id: 'cat-time' },
    { id: 'sub-time-day', name_en: 'Everyday Watches', name_ar: 'ساعات يومية', slug: 'everyday-watches', parent_id: 'cat-time' },

    // 2. Jewelry
    { id: 'cat-jewel', name_en: 'Jewelry', name_ar: 'مجوهرات', slug: 'jewelry', parent_id: null, image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800' },
    { id: 'sub-jewel-rng', name_en: 'Rings', name_ar: 'خواتم', slug: 'rings', parent_id: 'cat-jewel' },
    { id: 'sub-jewel-ear', name_en: 'Earrings', name_ar: 'أقراط', slug: 'earrings', parent_id: 'cat-jewel' },
    { id: 'sub-jewel-brc', name_en: 'Bracelets', name_ar: 'أساور', slug: 'bracelets', parent_id: 'cat-jewel' },
    { id: 'sub-jewel-dem', name_en: 'Demi-Fine', name_ar: 'مجوهرات نصف فاخرة', slug: 'demi-fine', parent_id: 'cat-jewel' },

    // 3. Bags
    { id: 'cat-bags', name_en: 'Bags', name_ar: 'حقائب', slug: 'bags', parent_id: null, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' },
    { id: 'sub-bag-crs', name_en: 'Crossbody', name_ar: 'كروس بودي', slug: 'crossbody-bags', parent_id: 'cat-bags' },
    { id: 'sub-bag-tot', name_en: 'Tote', name_ar: 'توت باج', slug: 'tote-bags', parent_id: 'cat-bags' },
    { id: 'sub-bag-clt', name_en: 'Clutch', name_ar: 'كلاتش', slug: 'clutches', parent_id: 'cat-bags' },

    // 4. Accessories
    { id: 'cat-acc', name_en: 'Accessories', name_ar: 'إكسسوارات', slug: 'accessories', parent_id: null, image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc540f?q=80&w=800' },
    
    // 5. Makeup
    { id: 'cat-mkup', name_en: 'Makeup', name_ar: 'مكياج', slug: 'makeup', parent_id: null, image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800' },

    // 6. Fragrances
    { id: 'cat-frag', name_en: 'Fragrances', name_ar: 'عطور', slug: 'fragrances', parent_id: null, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800' },

    // 7. Personal Care
    { id: 'cat-care', name_en: 'Personal Care', name_ar: 'عناية شخصية', slug: 'personal-care', parent_id: null, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800' },

    // 8. Gifts
    { id: 'cat-gift', name_en: 'Gifts', name_ar: 'هدايا', slug: 'gifts', parent_id: null, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800' },
];