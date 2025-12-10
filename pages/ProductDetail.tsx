
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Truck, ShieldCheck, Heart, Share2, Sparkles, Wand2, User, Percent, Video, PlayCircle } from 'lucide-react';
import { Product } from '../types';
import { reviews } from '../data/reviews';
import { promotions } from '../data/promotions'; // Use global promotions
import { getActivePromotionForProduct, calculateDiscountedPrice } from '../services/commerceService';
import { isProductAuthentic } from '../services/supplierService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onChatClick: () => void;
  onAskStylist: (message: string) => void;
  onGenerateVideo: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onChatClick, onAskStylist, onGenerateVideo }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  
  // Calculate Reviews
  const productReviews = useMemo(() => reviews.filter(r => r.product_id === product.id), [product.id]);
  const avgRating = useMemo(() => {
      if (productReviews.length === 0) return 0;
      return productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length;
  }, [productReviews]);

  // Pricing Logic
  const activePromo = useMemo(() => getActivePromotionForProduct(product, promotions), [product]);
  const discountedPrice = useMemo(() => calculateDiscountedPrice(product.price, activePromo), [product, activePromo]);
  
  // Authenticity Check
  const isVerified = useMemo(() => isProductAuthentic(product), [product]);

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Thank you for your review! It will be published after moderation.");
      setNewReviewComment('');
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-12 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb / Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="space-y-4">
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative group">
                    <img 
                        src={product.images[activeImage] || product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                    {activePromo && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Percent size={14} />
                            {activePromo.name_en} (-{activePromo.discount_value}%)
                        </div>
                    )}
                    
                    {/* Generate Campaign Video Button (Overlay) */}
                    <button 
                        onClick={onGenerateVideo}
                        className="absolute bottom-4 right-4 bg-white/30 backdrop-blur-md text-white p-2 md:p-3 rounded-full hover:bg-white/50 transition-all group/btn flex items-center gap-2 border border-white/20 hover:border-white shadow-lg"
                    >
                        <Video size={20} className="fill-white/20" />
                        <span className="max-w-0 overflow-hidden group-hover/btn:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/btn:opacity-100">
                            Create Campaign
                        </span>
                    </button>
                </div>
                {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-square bg-neutral-50 overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-neutral-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <div className="mb-2 flex justify-between items-start">
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.2em]">{product.brand}</span>
                    <div className="flex gap-4 text-neutral-400">
                        <button className="hover:text-red-500 transition-colors"><Heart size={20} /></button>
                        <button className="hover:text-neutral-900 transition-colors"><Share2 size={20} /></button>
                    </div>
                </div>
                
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="font-serif text-4xl text-neutral-900 leading-tight">{product.name}</h1>
                    <button 
                        onClick={() => onAskStylist(`I am considering the ${product.name}. How would you style this item for a special occasion?`)}
                        className="flex-shrink-0 text-gold-500 hover:text-white hover:bg-gold-500 p-2 rounded-full transition-all border border-gold-200 hover:border-gold-500"
                        title="Get Styling Advice"
                    >
                        <Wand2 size={20} />
                    </button>
                </div>
                
                {/* Rating Badge */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-gold-500">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={14} fill={star <= Math.round(avgRating) ? "currentColor" : "none"} className={star <= Math.round(avgRating) ? "" : "text-neutral-300"} />
                        ))}
                    </div>
                    <span className="text-xs text-neutral-500">({productReviews.length} reviews)</span>
                </div>

                {/* Authenticity Badge (Verified Network) */}
                {isVerified && (
                    <div className="mb-6 flex items-center gap-2 bg-stone-50 border border-stone-200 p-3 rounded-lg w-fit">
                        <ShieldCheck size={16} className="text-gold-600" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">Verified Luxury Network</p>
                            <p className="text-[10px] text-neutral-500">100% Authentic. Sourced from Approved EU/US Partners.</p>
                        </div>
                    </div>
                )}

                {/* Price Display with Promo Logic */}
                <div className="mb-8">
                    {activePromo ? (
                        <div className="flex items-center gap-4">
                            <span className="text-2xl text-red-600 font-bold">{discountedPrice.toLocaleString()} {product.currency}</span>
                            <span className="text-xl text-neutral-400 line-through decoration-neutral-400">{product.price.toLocaleString()} {product.currency}</span>
                        </div>
                    ) : (
                        <p className="text-2xl text-neutral-900 font-light">{product.price.toLocaleString()} {product.currency}</p>
                    )}
                </div>
                
                <p className="text-neutral-600 font-light leading-relaxed mb-8 border-b border-neutral-100 pb-8">
                    {product.description}
                </p>

                {/* Actions */}
                <div className="space-y-4 mb-10">
                    <button className="w-full bg-neutral-900 text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gold-600 transition-all shadow-lg">
                        Add to Cart
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => onAskStylist(`I am considering the ${product.name}. How would you style this item for a special occasion?`)}
                            className="border border-gold-300 bg-gold-50 text-gold-700 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-gold-100 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Wand2 size={14} className="group-hover:animate-pulse" /> Ask AI Stylist
                        </button>
                        <button 
                            onClick={onChatClick} 
                            className="border border-neutral-200 text-neutral-600 py-3 uppercase text-[10px] font-bold tracking-widest hover:border-neutral-400 hover:text-neutral-900 transition-all flex items-center justify-center gap-2"
                        >
                            <Sparkles size={14} /> Concierge
                        </button>
                    </div>
                </div>

                {/* Specs */}
                <div className="space-y-6 border-b border-neutral-100 pb-8 mb-8">
                    <div className="bg-stone-50 p-6 rounded-sm">
                        <h3 className="font-serif text-lg mb-4">Specifications</h3>
                        <div className="space-y-2 text-sm">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b border-stone-200 pb-2 last:border-0">
                                    <span className="text-neutral-500">{key}</span>
                                    <span className="font-medium text-neutral-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 text-xs text-neutral-500">
                        <div className="flex items-center gap-2">
                            <Truck size={14} /> Free Global Shipping
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} /> Authenticity Guarantee
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <h3 className="font-serif text-2xl mb-6 text-neutral-900">Client Reviews</h3>
                    {productReviews.length > 0 ? (
                        <div className="space-y-6 mb-8">
                            {productReviews.map(review => (
                                <div key={review.id} className="border-b border-neutral-100 pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs text-neutral-500">
                                                <User size={12} />
                                            </div>
                                            <span className="text-sm font-bold text-neutral-900">{review.user_name}</span>
                                        </div>
                                        <span className="text-xs text-neutral-400">{review.date}</span>
                                    </div>
                                    <div className="flex text-gold-500 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-neutral-200"} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 italic mb-8">No reviews yet. Be the first to review this masterpiece.</p>
                    )}

                    {/* Simple Write Review */}
                    <form onSubmit={handleSubmitReview} className="bg-stone-50 p-6 rounded-sm">
                        <h4 className="font-bold text-sm mb-4">Write a Review</h4>
                        <textarea 
                            className="w-full p-3 border border-stone-200 rounded text-sm mb-4 focus:outline-none focus:border-gold-500"
                            placeholder="Share your experience..."
                            rows={3}
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit" className="text-xs font-bold uppercase tracking-widest bg-white border border-stone-300 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors">
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
