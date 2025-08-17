/**
 * Dummy Data for Firebase Migration
 * 더미 데이터 정의 파일
 */

export const categories = [
    {
        id: 'historical',
        name: 'Historical',
        nameKorean: '역사',
        description: 'Historical sites and traditional Korean culture',
        icon: 'fas fa-landmark',
        color: '#8B4513'
    },
    {
        id: 'landmark',
        name: 'Landmark',
        nameKorean: '랜드마크',
        description: 'Iconic buildings and famous landmarks',
        icon: 'fas fa-building',
        color: '#667eea'
    },
    {
        id: 'shopping',
        name: 'Shopping',
        nameKorean: '쇼핑',
        description: 'Shopping districts and commercial areas',
        icon: 'fas fa-shopping-bag',
        color: '#ff6b6b'
    },
    {
        id: 'modern',
        name: 'Modern',
        nameKorean: '현대',
        description: 'Modern Seoul - business districts and urban life',
        icon: 'fas fa-city',
        color: '#4ecdc4'
    },
    {
        id: 'cultural',
        name: 'Cultural',
        nameKorean: '문화',
        description: 'Cultural sites and traditional experiences',
        icon: 'fas fa-theater-masks',
        color: '#45b7d1'
    },
    {
        id: 'nature',
        name: 'Nature',
        nameKorean: '자연',
        description: 'Parks, mountains, and natural attractions',
        icon: 'fas fa-tree',
        color: '#43a047'
    },
    {
        id: 'food',
        name: 'Food',
        nameKorean: '음식',
        description: 'Food markets, restaurants, and culinary experiences',
        icon: 'fas fa-utensils',
        color: '#ff9800'
    }
];

export const landmarks = [
    // 제주 서낭당
    {
        id: 'jeju-seonangdang',
        name: 'Jeju Seonangdang',
        nameKorean: '제주 서낭당',
        category: 'cultural',
        description: 'Traditional Jeju shamanistic shrine protecting the village',
        longDescription: 'Seonangdang is a sacred shrine unique to Jeju Island where local deities are worshipped. These small stone structures have protected villages for centuries and represent the spiritual culture of Jeju. Visitors can witness traditional rituals and learn about the island\'s unique shamanistic heritage.',
        coordinates: {
            lat: 33.5101,
            lng: 126.5219
        },
        icon: 'fas fa-torii-gate',
        image: 'landmarks/jeju_seonangdang_kdh.png',
        tags: ['Cultural', 'Traditional', 'Spiritual', 'Jeju'],
        tips: [
            'Respect the sacred nature of the site',
            'Photography may be restricted during rituals',
            'Visit with a local guide for deeper understanding',
            'Best experienced during traditional ceremonies'
        ],
        hours: 'Always accessible (outdoor shrine)',
        entrance: 'Free',
        nearbySubway: 'N/A - Jeju Island location',
        stations: [],
        culturalTips: 'Remove hats and maintain quiet reverence. These are active religious sites for local residents.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/jeju_seonangdang_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 북촌한옥마을
    {
        id: 'bukchon-hanok',
        name: 'Bukchon Hanok Village',
        nameKorean: '북촌한옥마을',
        category: 'cultural',
        description: 'Traditional Korean architecture village between palaces',
        longDescription: 'A well-preserved traditional village with over 600 years of history, featuring hundreds of hanok (traditional Korean houses). Located between Gyeongbokgung and Changdeokgung Palaces, this living museum showcases the beauty of Korean architecture while still serving as a residential area.',
        coordinates: {
            lat: 37.5825,
            lng: 126.9833
        },
        icon: 'fas fa-home',
        image: 'landmarks/seoul_bukchon_kdh.png',
        tags: ['Traditional', 'Architecture', 'Culture', 'Heritage'],
        tips: [
            'Visit early morning (before 9 AM) for fewer crowds',
            'Respect residents - keep noise levels down',
            'Wear comfortable walking shoes for hilly streets',
            'Try on hanbok for authentic photo opportunities'
        ],
        hours: '24/7 (respect quiet hours 22:00-08:00)',
        entrance: 'Free (some cultural centers charge admission)',
        nearbySubway: 'Anguk Station (Line 3, Exit 2)',
        stations: [
            { nameKorean: '안국', nameEnglish: 'Anguk', line: '3', exit: '2' }
        ],
        culturalTips: 'Many hanoks are private residences. Observe quietly and avoid entering private property.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_bukchon_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 청담대교
    {
        id: 'cheongdam-bridge',
        name: 'Cheongdam Bridge',
        nameKorean: '청담대교',
        category: 'landmark',
        description: 'Elegant bridge over Han River connecting Gangnam districts',
        longDescription: 'Cheongdam Bridge is one of Seoul\'s most elegant river crossings, connecting the affluent Cheongdam and Apgujeong districts. The bridge offers spectacular views of the Seoul skyline and has become an iconic symbol of modern Seoul, especially beautiful when illuminated at night.',
        coordinates: {
            lat: 37.5197,
            lng: 127.0475
        },
        icon: 'fas fa-bridge',
        image: 'landmarks/seoul_cheongdamdaegyo_kdh.png',
        tags: ['Modern', 'Bridge', 'Views', 'Architecture'],
        tips: [
            'Best viewed at sunset for golden hour photography',
            'Walk across for panoramic Han River views',
            'Visit nearby Hangang Park for riverside activities',
            'Night illumination creates romantic atmosphere'
        ],
        hours: '24/7',
        entrance: 'Free',
        nearbySubway: 'Cheongdam Station (Line 7) or Apgujeong Station (Line 3)',
        stations: [
            { nameKorean: '청담', nameEnglish: 'Cheongdam', line: '7', exit: null },
            { nameKorean: '압구정', nameEnglish: 'Apgujeong', line: '3', exit: null }
        ],
        culturalTips: 'Popular location for K-drama filming. The surrounding area is known for luxury shopping and K-pop entertainment companies.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_cheongdamdaegyo_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 경복궁 근정전
    {
        id: 'gyeongbokgung-geunjeongjeon',
        name: 'Geunjeongjeon Hall',
        nameKorean: '근정전',
        category: 'historical',
        description: 'The throne hall of Gyeongbokgung Palace, where kings held state affairs',
        longDescription: 'Geunjeongjeon Hall is the throne hall of Gyeongbokgung Palace, the largest of the Five Grand Palaces built during the Joseon Dynasty. This magnificent two-story structure served as the center of state affairs where kings held coronations, received foreign envoys, and conducted important national ceremonies.',
        coordinates: {
            lat: 37.5779,
            lng: 126.9770
        },
        icon: 'fas fa-landmark',
        image: 'landmarks/seoul_ilwolobongdo_kdh.png',
        tags: ['Historical', 'Palace', 'UNESCO', 'Architecture'],
        tips: [
            'Visit during the changing of the guard ceremony (10:00, 14:00)',
            'Best photographed from the stone courtyard markers',
            'Look up to see the elaborate ceiling with painted dragons',
            'Audio guides available in multiple languages'
        ],
        hours: '09:00 - 18:00 (Mar-Oct), 09:00 - 17:00 (Nov-Feb)',
        entrance: 'Adult: 3,000 KRW, Youth: 1,500 KRW',
        nearbySubway: 'Gyeongbokgung Station (Line 3, Exit 5)',
        stations: [
            { nameKorean: '경복궁', nameEnglish: 'Gyeongbokgung', line: '3', exit: '5' }
        ],
        culturalTips: 'Remove shoes if entering during special exhibitions. Photography allowed but no flash.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_ilwolobongdo_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
            {
                title: 'Throne and Royal Authority',
                image: 'landmarks/남산타워.png',
                description: 'The throne sits on a raised platform beneath an ornate canopy decorated with dragons.'
            }
        ]
    },
    
    // 잠실주경기장
    {
        id: 'jamsil-stadium',
        name: 'Jamsil Sports Complex',
        nameKorean: '잠실주경기장',
        category: 'modern',
        description: 'Major sports complex and home of 1988 Seoul Olympics',
        longDescription: 'Built for the 1988 Seoul Olympics, this massive sports complex includes the Olympic Stadium, Baseball Stadium, and various indoor arenas. It remains a central venue for major sporting events, K-pop concerts, and cultural festivals, symbolizing Korea\'s modern development.',
        coordinates: {
            lat: 37.5153,
            lng: 127.0731
        },
        icon: 'fas fa-running',
        image: 'landmarks/seoul_jamsilsports_kdh.png',
        tags: ['Sports', 'Olympics', 'Entertainment', 'Modern'],
        tips: [
            'Check event schedules for concerts and games',
            'Baseball season runs from March to October',
            'K-pop concerts often held at the main stadium',
            'Olympic museum nearby showcases 1988 memorabilia'
        ],
        hours: 'Event dependent (typically 10:00 - 22:00)',
        entrance: 'Varies by event (Baseball: 8,000-50,000 KRW)',
        nearbySubway: 'Sports Complex Station (Line 2, Exit 6-7)',
        stations: [
            { nameKorean: '종합운동장', nameEnglish: 'Sports Complex', line: '2', exit: '6' },
            { nameKorean: '종합운동장', nameEnglish: 'Sports Complex', line: '2', exit: '7' }
        ],
        culturalTips: 'Experience Korean baseball culture with cheerleaders and organized chants. Bring your own food and drinks for a picnic atmosphere.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_jamsilsports_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 롯데타워
    {
        id: 'lotte-tower',
        name: 'Lotte World Tower',
        nameKorean: '롯데타워',
        category: 'landmark',
        description: 'Korea\'s tallest building with observation deck and luxury shopping',
        longDescription: 'Standing at 555 meters, Lotte World Tower is the 5th tallest building in the world and a symbol of modern Seoul. The tower features Seoul Sky observation deck on floors 117-123, offering breathtaking 360-degree views, along with luxury shopping, restaurants, and entertainment facilities.',
        coordinates: {
            lat: 37.5125,
            lng: 127.1024
        },
        icon: 'fas fa-building',
        images: [
            'landmarks/seoul_lottetower_kdh.png',
            'landmarks/seoul_lottetower_origin.png',
            'landmarks/자양역.png'
        ],
        image: 'landmarks/seoul_lottetower_kdh.png', // 메인 이미지
        tags: ['Modern', 'Skyscraper', 'Views', 'Shopping'],
        tips: [
            'Book Seoul Sky tickets online to avoid queues',
            'Visit at sunset for day and night views',
            'Glass floor experience on 118th floor',
            'Fastest double-deck elevator in the world'
        ],
        hours: 'Seoul Sky: 10:00 - 22:00 (last entry 21:00)',
        entrance: 'Seoul Sky: Adults 29,000 KRW, Children 25,000 KRW',
        nearbySubway: 'Jamsil Station (Line 2 & 8, Exit 1-2)',
        stations: [
            { nameKorean: '잠실', nameEnglish: 'Jamsil', line: '2', exit: '1' },
            { nameKorean: '잠실', nameEnglish: 'Jamsil', line: '2', exit: '2' },
            { nameKorean: '잠실', nameEnglish: 'Jamsil', line: '8', exit: null },
            { nameKorean: '잠실', nameEnglish: 'Jamsil', line: '8', exit: null }
        ],
        culturalTips: 'The tower incorporates traditional Korean art motifs in its design. Look for ceramic and metal craft decorations inspired by Korean heritage.',
        detailSections: [
            {
                title: 'Seoul Sky Observatory',
                image: 'landmarks/seoul_lottetower_origin.png',
                description: 'The observation deck spans 6 floors (117F-123F) with 360-degree views. The glass-floored Sky Deck on the 118th floor offers a thrilling experience looking straight down from 478 meters high.'
            },
            {
                title: 'Shopping & Entertainment',
                image: 'landmarks/명동-화장품.png',
                description: 'The tower houses Lotte World Mall with luxury brands, the largest duty-free shop in Seoul, a concert hall, cinema, and aquarium, making it a complete entertainment destination.'
            }
        ]
    },
    
    // 남산타워
    {
        id: 'namsan-tower',
        name: 'N Seoul Tower',
        nameKorean: '남산타워',
        category: 'landmark',
        description: 'Iconic communication tower offering panoramic city views',
        longDescription: 'Standing 236 meters above sea level on Namsan Mountain, N Seoul Tower is Seoul\'s most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
        coordinates: {
            lat: 37.5512,
            lng: 126.9882
        },
        icon: 'fas fa-broadcast-tower',
        image: 'landmarks/seoul_namsantower_kdh.png',
        tags: ['Landmark', 'Views', 'Romance'],
        tips: [
            'Take the cable car up for scenic views',
            'Best visited at sunset for stunning photo opportunities',
            'Bring a padlock to add to the love locks fence'
        ],
        hours: '10:00 - 23:00 (Sun-Fri), 10:00 - 24:00 (Sat)',
        entrance: 'Cable car: 8,500 KRW, Observatory: 10,000 KRW',
        nearbySubway: 'Myeong-dong Station (Line 4) + Cable car',
        stations: [
            { nameKorean: '명동', nameEnglish: 'Myeong-dong', line: '4', exit: null }
        ],
        culturalTips: 'Popular date spot - couples often attach love locks here',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_namsantower_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 낙산공원
    {
        id: 'naksan-park',
        name: 'Naksan Park',
        nameKorean: '낙산공원',
        category: 'nature',
        description: 'Historic mountain park with Seoul fortress walls and city views',
        longDescription: 'Located on Naksan Mountain, this park offers panoramic views of Seoul and preserves a section of the ancient Seoul City Wall. The park combines natural beauty with historical significance, featuring walking trails along the fortress walls and beautiful night views of the city.',
        coordinates: {
            lat: 37.5806,
            lng: 127.0075
        },
        icon: 'fas fa-mountain',
        image: 'landmarks/seoul_naksanpark_kdh.png',
        tags: ['Nature', 'Historical', 'Views', 'Walking'],
        tips: [
            'Best sunset views from the fortress wall trail',
            'Cherry blossoms in spring are spectacular',
            'Connect with Ihwa Mural Village for a full day trip',
            'Wear comfortable shoes for uphill walking'
        ],
        hours: '24/7 (Park), Exhibition Hall: 09:00 - 18:00',
        entrance: 'Free',
        nearbySubway: 'Hyehwa Station (Line 4, Exit 2) - 15 min walk',
        stations: [
            { nameKorean: '혜화', nameEnglish: 'Hyehwa', line: '4', exit: '2' }
        ],
        culturalTips: 'The Seoul City Wall here is part of UNESCO World Heritage tentative list. Respect the historical structures and stay on designated paths.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_naksanpark_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    },
    
    // 삼성동 코엑스
    {
        id: 'samsung-coex',
        name: 'COEX Mall',
        nameKorean: '삼성동 코엑스',
        category: 'modern',
        description: 'Asia\'s largest underground shopping mall with aquarium and library',
        longDescription: 'COEX Mall in Samsung-dong is a massive underground shopping and entertainment complex. Home to the famous Starfield Library, COEX Aquarium, and hundreds of shops and restaurants, it\'s a modern urban destination that showcases Seoul\'s contemporary lifestyle and business culture.',
        coordinates: {
            lat: 37.5063,
            lng: 127.0589
        },
        icon: 'fas fa-shopping-cart',
        image: 'landmarks/seoul_samseongcoex_kdh.png',
        tags: ['Shopping', 'Modern', 'Entertainment', 'Business'],
        tips: [
            'Visit Starfield Library for Instagram-worthy photos',
            'COEX Aquarium is great for families with children',
            'Connected directly to Samseong subway station',
            'Various K-pop related shops and entertainment'
        ],
        hours: '10:00 - 22:00 (varies by store)',
        entrance: 'Mall: Free, Aquarium: Adults 33,000 KRW',
        nearbySubway: 'Samseong Station (Line 2, directly connected)',
        stations: [
            { nameKorean: '삼성', nameEnglish: 'Samseong', line: '2', exit: null }
        ],
        culturalTips: 'Major venue for international conferences and K-pop events. The Starfield Library has become an iconic Seoul landmark with its towering bookshelves.',
        detailSections: [
            {
                title: 'Architectural Significance',
                image: 'landmarks/seoul_samseongcoex_origin.png',
                description: 'Built in 1395 and reconstructed in 1867, Geunjeongjeon showcases the pinnacle of Korean palace architecture.'
            },
        ]
    }
];

// 추가 샘플 데이터를 위한 헬퍼 함수
export function generateSampleData() {
    return {
        categories,
        landmarks,
        metadata: {
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            totalCategories: categories.length,
            totalLandmarks: landmarks.length
        }
    };
}

export default {
    categories,
    landmarks,
    generateSampleData
};