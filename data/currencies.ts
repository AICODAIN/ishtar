
import { CurrencyConfig } from '../types';

export const currencies: CurrencyConfig[] = [
    { code: 'SAR', name_en: 'Saudi Riyal', name_ar: 'ريال سعودي', exchange_rate_to_sar: 1, rate_to_sar: 1, rate_from_sar: 1, symbol: 'SAR', is_enabled: true },
    { code: 'USD', name_en: 'US Dollar', name_ar: 'دولار أمريكي', exchange_rate_to_sar: 3.75, rate_to_sar: 3.75, rate_from_sar: 0.266, symbol: '$', is_enabled: true },
    { code: 'AED', name_en: 'UAE Dirham', name_ar: 'درهم إماراتي', exchange_rate_to_sar: 1.02, rate_to_sar: 1.02, rate_from_sar: 0.98, symbol: 'AED', is_enabled: true },
    { code: 'KWD', name_en: 'Kuwaiti Dinar', name_ar: 'دينار كويتي', exchange_rate_to_sar: 12.20, rate_to_sar: 12.20, rate_from_sar: 0.082, symbol: 'KWD', is_enabled: true },
    { code: 'QAR', name_en: 'Qatari Riyal', name_ar: 'ريال قطري', exchange_rate_to_sar: 1.03, rate_to_sar: 1.03, rate_from_sar: 0.97, symbol: 'QAR', is_enabled: true },
    { code: 'BHD', name_en: 'Bahraini Dinar', name_ar: 'دينار بحريني', exchange_rate_to_sar: 9.95, rate_to_sar: 9.95, rate_from_sar: 0.10, symbol: 'BHD', is_enabled: true },
    { code: 'OMR', name_en: 'Omani Rial', name_ar: 'ريال عماني', exchange_rate_to_sar: 9.74, rate_to_sar: 9.74, rate_from_sar: 0.102, symbol: 'OMR', is_enabled: true },
    { code: 'EUR', name_en: 'Euro', name_ar: 'يورو', exchange_rate_to_sar: 4.05, rate_to_sar: 4.05, rate_from_sar: 0.247, symbol: '€', is_enabled: true },
    { code: 'GBP', name_en: 'British Pound', name_ar: 'جنيه إسترليني', exchange_rate_to_sar: 4.75, rate_to_sar: 4.75, rate_from_sar: 0.21, symbol: '£', is_enabled: true },
];
