
import { Campaign, VideoAsset } from '../types';

export const campaigns: Campaign[] = [
    {
        id: 'cmp_summer_24',
        title: 'Summer Solstice',
        description: 'Embrace the warmth with our curated summer collection.',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        is_active: true,
        target_segment: 'watches',
        hero_video: {
            id: 'vid_hero_summer',
            // Fashion/Shopping cinematic video
            url: 'https://videos.pexels.com/video-files/7653634/7653634-uhd_2560_1440_25fps.mp4',
            // Fallback thumbnail of woman shopping
            thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600',
            title: 'Summer Luxury',
            category_tags: ['fashion', 'luxury'],
            duration_sec: 30,
            hotspots: [
                {
                    id: 'hs_1',
                    productId: 'b1', // Link to Hermès Birkin
                    timestamp_start: 2,
                    timestamp_end: 8,
                    x_position: 45,
                    y_position: 50,
                    label: 'Hermès Birkin'
                },
                {
                    id: 'hs_2',
                    productId: 'w1', // Link to AP Watch
                    timestamp_start: 10,
                    timestamp_end: 15,
                    x_position: 60,
                    y_position: 60,
                    label: 'Royal Oak'
                }
            ]
        }
    },
    {
        id: 'cmp_eid_24',
        title: 'Eid Collection',
        description: 'Celebrate in style.',
        start_date: '2024-04-01',
        end_date: '2024-04-15',
        is_active: false,
        target_segment: 'bags',
        hero_video: {
            id: 'vid_hero_eid',
            url: 'https://videos.pexels.com/video-files/4936666/4936666-uhd_2560_1440_25fps.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600',
            title: 'Eid Elegance',
            category_tags: ['bags', 'gifts'],
            duration_sec: 45,
            hotspots: []
        }
    }
];

export const highlightReels: VideoAsset[] = [
    {
        id: 'hl_1',
        title: 'Timepieces',
        url: 'https://videos.pexels.com/video-files/3205915/3205915-uhd_2560_1440_25fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=600',
        category_tags: ['watches'],
        hotspots: [],
        duration_sec: 15,
        is_highlight: true
    },
    {
        id: 'hl_2',
        title: 'Iconic Bags',
        url: 'https://videos.pexels.com/video-files/4936666/4936666-uhd_2560_1440_25fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
        category_tags: ['bags'],
        hotspots: [],
        duration_sec: 12,
        is_highlight: true
    },
    {
        id: 'hl_3',
        title: 'Scent of Night',
        url: 'https://videos.pexels.com/video-files/6774640/6774640-uhd_2560_1440_25fps.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
        category_tags: ['fragrances'],
        hotspots: [],
        duration_sec: 10,
        is_highlight: true
    }
];
