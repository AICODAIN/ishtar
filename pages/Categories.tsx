
import React from 'react';
import { categories } from '../data/categories';
import { Language } from '../types';

interface CategoriesProps {
    language: Language;
    onNavigateCategory: (slug: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ language, onNavigateCategory }) => {
    const isRTL = language === 'AR';
    // Filter root categories
    const rootCategories = categories.filter(c => c.parent_id === null);

    return (
        <div className={`min-h-screen pt-32 pb-20 bg-white ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl text-neutral-900 mb-4">{isRTL ? 'الأقسام' : 'Departments'}</h1>
                    <p className="text-neutral-500 font-light max-w-lg mx-auto">
                        {isRTL ? 'تصفح مجموعاتنا الحصرية حسب الفئة.' : 'Explore our exclusive collections by category.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rootCategories.map(cat => (
                        <div 
                            key={cat.id} 
                            className="group cursor-pointer relative overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-xl transition-all duration-500"
                            onClick={() => onNavigateCategory(cat.slug)}
                        >
                            <img 
                                src={cat.image || 'https://via.placeholder.com/800'} 
                                alt={isRTL ? cat.name_ar : cat.name_en} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                                <h2 className="font-serif text-4xl mb-2">{isRTL ? cat.name_ar : cat.name_en}</h2>
                                <span className="text-xs uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                    {isRTL ? 'اكتشف' : 'Discover'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
