
import React from 'react';
import { Brand } from '../types';
import { brands } from '../data/brands';

interface BrandStripProps {
    onBrandClick: (brand: Brand) => void;
}

const BrandStrip: React.FC<BrandStripProps> = ({ onBrandClick }) => {
    // Only show logos for featured or top brands to keep strip clean, or duplicate for infinite loop
    const displayBrands = brands.filter(b => b.is_featured || b.group === 'LUXURY').slice(0, 20);
    const marqueeList = [...displayBrands, ...displayBrands, ...displayBrands]; // Triple for smooth loop

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, brandName: string) => {
        const img = e.currentTarget;
        const parent = img.parentElement;
        
        img.style.display = 'none';
        
        if (parent) {
            parent.classList.add('flex', 'items-center', 'justify-center');
            parent.innerText = brandName.charAt(0);
            parent.classList.add('font-serif', 'text-2xl', 'text-neutral-400');
        }
    };

    return (
        <div className="w-full bg-white border-b border-stone-100 py-12 overflow-hidden relative group">
            <div className="text-center mb-10">
                <h3 className="text-gold-600 text-[10px] font-bold tracking-[0.3em] uppercase">Partner Maisons</h3>
            </div>
            
            {/* Gradient masks for smooth fade edges */}
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-scroll group-hover:paused items-center">
                {marqueeList.map((brand, idx) => (
                    <div 
                        key={`${brand.id}-${idx}`}
                        onClick={() => onBrandClick(brand)}
                        className="mx-10 cursor-pointer transition-transform duration-300 hover:scale-110 flex flex-col items-center justify-center gap-4 opacity-60 hover:opacity-100 min-w-[120px]"
                    >
                        <div className="h-16 w-32 flex items-center justify-center bg-white rounded-lg p-2 hover:shadow-lg transition-shadow border border-transparent hover:border-gold-100">
                            {brand.logo ? (
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name_en} 
                                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
                                    onError={(e) => handleImageError(e, brand.name_en)}
                                />
                            ) : (
                                <span className="font-serif text-xl font-bold text-stone-300 hover:text-neutral-900 transition-colors">
                                    {brand.name_en}
                                </span>
                            )}
                        </div>
                        {/* Tooltip-like name on hover */}
                        <span className="text-[9px] uppercase tracking-widest text-neutral-900 opacity-0 hover:opacity-100 transition-opacity translate-y-2 hover:translate-y-0 duration-300">
                            {brand.name_en}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandStrip;
