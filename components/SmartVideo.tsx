
import React, { useRef, useState, useEffect } from 'react';
import { VideoAsset, ProductHotspot } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize2, ShoppingBag, Scan, Disc } from 'lucide-react';
import { products } from '../data/products';

interface SmartVideoProps {
    video: VideoAsset;
    autoPlay?: boolean;
    onProductClick: (product: any) => void; // Pass resolved product
}

const SmartVideo: React.FC<SmartVideoProps> = ({ video, autoPlay = true, onProductClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeHotspots, setActiveHotspots] = useState<ProductHotspot[]>([]);

    useEffect(() => {
        // Reset state when video source changes
        setIsPlaying(autoPlay);
        setIsMuted(true);
        setActiveHotspots([]);
        
        if (autoPlay && videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }
    }, [video.url, autoPlay]);

    // Time Update & Hotspot Detection
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const time = videoRef.current.currentTime;
        setCurrentTime(time);

        // Find hotspots active at this second
        const current = video.hotspots.filter(hs => time >= hs.timestamp_start && time <= hs.timestamp_end);
        setActiveHotspots(current);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const resolveProduct = (id: string) => {
        return products.find(p => p.id === id);
    };

    return (
        <div className="relative w-full h-full bg-black group overflow-hidden">
            <video
                ref={videoRef}
                src={video.url}
                poster={video.thumbnail}
                className="w-full h-full object-cover transition-transform duration-700"
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
            />

            {/* Dark Overlay Gradient for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

            {/* AI Hotspots Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {activeHotspots.map(hs => {
                    const product = resolveProduct(hs.productId);
                    if (!product) return null;

                    return (
                        <div 
                            key={hs.id}
                            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 animate-fade-in-up flex items-center gap-2 cursor-pointer z-20"
                            style={{ left: `${hs.x_position}%`, top: `${hs.y_position}%` }}
                            onClick={() => onProductClick(product)}
                        >
                            {/* Pulse Dot */}
                            <div className="relative">
                                <div className="w-5 h-5 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
                                    <div className="w-2.5 h-2.5 bg-gold-500 rounded-full shadow-[0_0_10px_#C9A646]"></div>
                                </div>
                                <div className="absolute inset-0 bg-gold-500 rounded-full animate-ping opacity-40"></div>
                            </div>

                            {/* Info Tag */}
                            <div className="bg-black/80 backdrop-blur-md pl-3 pr-4 py-2 rounded-lg shadow-xl border border-white/10 max-w-[180px] flex gap-3 items-center group/tag hover:scale-105 transition-transform">
                                <div className="w-10 h-10 rounded bg-white overflow-hidden flex-shrink-0">
                                    <img src={product.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-wider text-neutral-400">{product.brand}</p>
                                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{product.name}</p>
                                </div>
                                <div className="bg-gold-500 rounded-full p-1.5 text-black">
                                    <ShoppingBag size={10} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <button onClick={toggleMute} className="p-2 bg-white/20 backdrop-blur hover:bg-white text-white hover:text-black rounded-full transition-colors">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button onClick={togglePlay} className="p-2 bg-white/20 backdrop-blur hover:bg-white text-white hover:text-black rounded-full transition-colors">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
            </div>

            {/* AI Badge */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-30 shadow-lg">
                <Scan size={12} className="text-gold-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest text-white font-bold">AI Vision Active</span>
            </div>
        </div>
    );
};

export default SmartVideo;
