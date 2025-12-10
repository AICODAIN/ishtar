
import { Product, Look, GiftBundle } from '../types';

export const products: Product[] = [
  // WATCHES
  {
    id: 'w1',
    name: 'Royal Oak Selfwinding',
    name_en: 'Royal Oak Selfwinding',
    name_ar: 'رويال أوك أوتوماتيك',
    brand: 'Audemars Piguet',
    category: 'Watches',
    price: 168750, // Converted 45000 USD to SAR roughly
    currency: 'SAR',
    final_price_sar: 168750,
    // Costing Info
    supplier_currency_code: 'EUR',
    supplier_base_cost: 35000,
    shipping_cost_supplier_currency: 200,
    customs_fees_supplier_currency: 1500,
    total_cost_sar: 148500, // Approx
    margin_percent: 13.6,
    
    image: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=800',
        'https://images.unsplash.com/photo-1619134778706-c27533cdcd34?q=80&w=800'
    ],
    description: 'An icon of modern horology. The Royal Oak Selfwinding in stainless steel features the "Grande Tapisserie" dial.',
    description_en: 'An icon of modern horology. The Royal Oak Selfwinding in stainless steel features the "Grande Tapisserie" dial.',
    description_ar: 'أيقونة صناعة الساعات الحديثة.',
    specs: { 'Case': '41mm Stainless Steel', 'Movement': 'Calibre 4302', 'Water Resistance': '50m' },
    channelSource: 'NATIVE',
    status: 'active',
    is_dropshipping: true,
    supplierId: 1, 
    channelId: 1, 
    stock_quantity: 3,
    avg_fulfillment_days: 2,
    weight_kg: 0.8,
    sku: 'AP-RO-41',
    variants: [
        { id: 'w1-blue', name: 'Blue Dial', sku: 'AP-RO-41-BL', price: 168750 },
        { id: 'w1-black', name: 'Black Dial', sku: 'AP-RO-41-BK', price: 168750 }
    ]
  },
  {
    id: 'w2',
    name: 'Submariner Date',
    name_en: 'Submariner Date',
    name_ar: 'صبمارينر ديت',
    brand: 'Rolex',
    category: 'Watches',
    price: 54375, // 14500 USD to SAR
    currency: 'SAR',
    final_price_sar: 54375,
    
    supplier_currency_code: 'USD',
    supplier_base_cost: 11000,
    shipping_cost_supplier_currency: 100,
    customs_fees_supplier_currency: 500,
    total_cost_sar: 41250,
    margin_percent: 31.8,

    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800'
    ],
    description: 'The archetype of the diver\'s watch. The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert.',
    description_en: 'The archetype of the diver\'s watch.',
    description_ar: 'النموذج الأصلي لساعة الغوص.',
    specs: { 'Case': '41mm Oystersteel', 'Movement': 'Calibre 3235', 'Water Resistance': '300m' },
    channelSource: 'SHOPIFY',
    status: 'active',
    is_dropshipping: true,
    supplierId: 1,
    channelId: 2, // Shopify KSA
    stock_quantity: 8,
    avg_fulfillment_days: 3,
    weight_kg: 0.6,
    sku: 'RLX-SUB-001'
  },
  {
    id: 'w3',
    name: 'Nautilus',
    name_en: 'Nautilus',
    name_ar: 'نوتيلوس',
    brand: 'Patek Philippe',
    category: 'Watches',
    price: 412500, // 110000 USD to SAR
    currency: 'SAR',
    final_price_sar: 412500,
    supplier_currency_code: 'EUR',
    supplier_base_cost: 90000,
    shipping_cost_supplier_currency: 500,
    customs_fees_supplier_currency: 4500,
    total_cost_sar: 364500,
    margin_percent: 13,

    image: 'https://images.unsplash.com/photo-1639037466107-1601a4bc5759?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1639037466107-1601a4bc5759?q=80&w=800'],
    description: 'With the rounded octagonal shape of its bezel, the Nautilus has epitomized the elegant sports watch since 1976.',
    description_en: 'Epitomized the elegant sports watch.',
    description_ar: 'تجسد الساعة الرياضية الأنيقة.',
    specs: { 'Case': 'Rose Gold', 'Movement': 'Self-winding', 'Dial': 'Brown Sunburst' },
    channelSource: 'NATIVE',
    status: 'draft',
    is_dropshipping: false,
    supplierId: 1,
    channelId: 1,
    stock_quantity: 0,
    weight_kg: 0.8,
    sku: 'PP-NAU-5711'
  },
  // BAGS
  {
    id: 'b1',
    name: 'Birkin 30',
    name_en: 'Birkin 30',
    name_ar: 'بيركن 30',
    brand: 'Hermès',
    category: 'Bags',
    price: 106875, // 28500 USD to SAR
    currency: 'SAR',
    final_price_sar: 106875,
    supplier_currency_code: 'EUR',
    supplier_base_cost: 22000,
    shipping_cost_supplier_currency: 200,
    customs_fees_supplier_currency: 1100,
    total_cost_sar: 89100,
    margin_percent: 20,

    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800'],
    description: 'The ultimate symbol of luxury. Crafted from Togo leather with gold-plated hardware.',
    description_en: 'The ultimate symbol of luxury.',
    description_ar: 'رمز الفخامة المطلقة.',
    specs: { 'Material': 'Togo Leather', 'Hardware': 'Gold Plated', 'Dimensions': '30 x 22 x 16 cm' },
    channelSource: 'SALLA',
    status: 'active',
    is_dropshipping: true,
    supplierId: 2, // Dubai Premium Accessories
    channelId: 4, // Salla
    stock_quantity: 1,
    avg_fulfillment_days: 5,
    weight_kg: 1.5,
    sku: 'HER-BIR-30'
  },
  {
    id: 'b2',
    name: 'Classic Flap',
    name_en: 'Classic Flap',
    name_ar: 'كلاسيك فلاب',
    brand: 'Chanel',
    category: 'Bags',
    price: 38250, // 10200 USD
    currency: 'SAR',
    final_price_sar: 38250,
    supplier_currency_code: 'EUR',
    supplier_base_cost: 8000,
    shipping_cost_supplier_currency: 150,
    customs_fees_supplier_currency: 800,
    total_cost_sar: 32400,
    margin_percent: 18,

    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800'],
    description: 'Timeless elegance. The Classic Handbag in lambskin leather with the signature CC clasp.',
    description_en: 'Timeless elegance.',
    description_ar: 'أناقة خالدة.',
    specs: { 'Material': 'Lambskin', 'Color': 'Black', 'Strap': 'Interlaced Chain' },
    channelSource: 'NATIVE',
    status: 'active',
    is_dropshipping: true,
    supplierId: 2,
    channelId: 3, // Shopify UAE
    stock_quantity: 4,
    avg_fulfillment_days: 4,
    weight_kg: 1.2,
    sku: 'CH-CLF-BK'
  },
  // BEAUTY
  {
    id: 'p1',
    name: 'N°5 Parfum',
    name_en: 'N°5 Parfum',
    name_ar: 'عطر رقم 5',
    brand: 'Chanel',
    category: 'Beauty',
    price: 506, // 135 USD
    currency: 'SAR',
    final_price_sar: 506,
    supplier_currency_code: 'KWD',
    supplier_base_cost: 25, // 25 KWD * 12.2 = 305 SAR
    shipping_cost_supplier_currency: 0,
    customs_fees_supplier_currency: 0,
    total_cost_sar: 305,
    margin_percent: 65,

    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800'],
    description: 'A powder floral bouquet. The very essence of femininity. A legendary scent.',
    description_en: 'A legendary scent.',
    description_ar: 'عطر أسطوري.',
    specs: { 'Volume': '30ml', 'Concentration': 'Parfum', 'Notes': 'Aldehydes, Jasmine, Rose' },
    channelSource: 'ZID',
    status: 'active',
    is_dropshipping: true,
    supplierId: 4, // Kuwait Select Fragrances
    channelId: 5, // Zid
    stock_quantity: 50,
    avg_fulfillment_days: 6,
    weight_kg: 0.3,
    sku: 'CH-N5-30'
  },
  {
    id: 'p2',
    name: 'Santal 33',
    name_en: 'Santal 33',
    name_ar: 'سانتال 33',
    brand: 'Le Labo',
    category: 'Beauty',
    price: 1050, // 280 USD
    currency: 'SAR',
    final_price_sar: 1050,
    supplier_currency_code: 'SAR',
    supplier_base_cost: 650,
    shipping_cost_supplier_currency: 0,
    customs_fees_supplier_currency: 0,
    total_cost_sar: 650,
    margin_percent: 61,

    image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=800'],
    description: 'A defining image of the spirit of the American West with all that it implied about masculinity and personal freedom.',
    description_en: 'A defining image of the spirit of the American West.',
    description_ar: 'صورة تعريفية لروح الغرب الأمريكي.',
    specs: { 'Volume': '100ml', 'Type': 'Eau de Parfum', 'Notes': 'Cardamom, Iris, Violet' },
    channelSource: 'NATIVE',
    status: 'active',
    is_dropshipping: false,
    supplierId: 3, // Local Warehouse
    channelId: 1,
    stock_quantity: 120,
    avg_fulfillment_days: 1,
    weight_kg: 0.4,
    sku: 'LL-S33-100'
  },
  // JEWELRY
  {
    id: 'j1',
    name: 'Love Bracelet',
    name_en: 'Love Bracelet',
    name_ar: 'سوار الحب',
    brand: 'Cartier',
    category: 'Jewelry',
    price: 28125, // 7500 USD
    currency: 'SAR',
    final_price_sar: 28125,
    supplier_currency_code: 'AED',
    supplier_base_cost: 24000,
    shipping_cost_supplier_currency: 100,
    customs_fees_supplier_currency: 1000,
    total_cost_sar: 24480, // AED to SAR
    margin_percent: 15,

    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'],
    description: 'A child of 1970s New York, the LOVE collection remains today an iconic symbol of love that transgresses convention.',
    description_en: 'An iconic symbol of love.',
    description_ar: 'رمز أيقوني للحب.',
    specs: { 'Material': '18k Yellow Gold', 'Width': '6.1mm', 'Collection': 'LOVE' },
    channelSource: 'NATIVE',
    status: 'active',
    is_dropshipping: true,
    supplierId: 2, // Dubai
    channelId: 1,
    stock_quantity: 2,
    avg_fulfillment_days: 4,
    weight_kg: 0.2,
    sku: 'CRT-LB-YG'
  },
    {
    id: 'j2',
    name: 'Alhambra Necklace',
    name_en: 'Alhambra Necklace',
    name_ar: 'قلادة الحمراء',
    brand: 'Van Cleef & Arpels',
    category: 'Jewelry',
    price: 12000, // 3200 USD
    currency: 'SAR',
    final_price_sar: 12000,
    supplier_currency_code: 'AED',
    supplier_base_cost: 9500,
    shipping_cost_supplier_currency: 50,
    customs_fees_supplier_currency: 400,
    total_cost_sar: 9690,
    margin_percent: 24,

    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800'],
    description: 'Faithful to the very first Alhambra jewel created in 1968, the Vintage Alhambra creations are distinguished by their unique, timeless elegance.',
    description_en: 'Timeless elegance.',
    description_ar: 'أناقة خالدة.',
    specs: { 'Material': 'Yellow Gold', 'Stone': 'Onyx', 'Chain': '42 cm' },
    channelSource: 'SHOPIFY',
    status: 'active',
    is_dropshipping: true,
    supplierId: 2,
    channelId: 3,
    stock_quantity: 5,
    avg_fulfillment_days: 3,
    weight_kg: 0.1,
    sku: 'VCA-ALH-OX'
  }
];

export const looks: Look[] = [
    {
        id: 'l1',
        title: 'Dubai Gala Evening',
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop',
        products: ['w1', 'b1', 'p1'],
        occasion: 'Formal'
    },
    {
        id: 'l2',
        title: 'Riyadh Business Chic',
        image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop',
        products: ['w2', 'b2', 'j2'],
        occasion: 'Work'
    }
];

export const bundles: GiftBundle[] = [
    {
        id: 'g1',
        title: 'The Golden Hour Set',
        price: 13500,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
        description: 'A curated selection of warm-toned jewelry and scents.'
    },
    {
        id: 'g2',
        title: 'Midnight in Paris',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=800&auto=format&fit=crop',
        description: 'Evening essentials for the sophisticated woman.'
    }
];
