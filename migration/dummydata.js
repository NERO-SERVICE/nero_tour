/**
 * Dummy Data for Firebase Migration
 * 더미 데이터 정의 파일
 */

export const categories = [
    {
        id: 'kpdh',
        name: 'KPDH',
        nameKorean: '한국 디지털 문화유산',
        description: 'Korean Places for Digital Heritage - Cultural heritage sites and landmarks',
        icon: 'fas fa-landmark',
        color: '#9C27B0'
    },
    {
        id: 'halal',
        name: 'Halal',
        nameKorean: '할랄',
        description: 'Halal certified restaurants and Muslim-friendly locations',
        icon: 'fas fa-certificate',
        color: '#4CAF50'
    }
];

export const landmarks = [
    // 제주 서낭당
    {
        id: 'jeju-seonangdang',
        name: 'Jeju Seonangdang',
        nameKorean: '제주 서낭당',
        category: 'kpdh',
        tags: ['kpdh', 'Cultural', 'Traditional', 'Spiritual', 'Jeju'],
        description: 'Traditional Jeju shamanistic shrine protecting the village',
        longDescription: 'Seonangdang is a sacred shrine unique to Jeju Island where local deities are worshipped. These small stone structures have protected villages for centuries and represent the spiritual culture of Jeju. Visitors can witness traditional rituals and learn about the island\'s unique shamanistic heritage.',
        coordinates: {
            lat: 33.322663,
            lng: 126.841771
        },
        icon: 'fas fa-torii-gate',
        image: 'landmarks/jeju_seonangdang_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Traditional', 'Architecture', 'Culture', 'Heritage'],
        description: 'Traditional Korean architecture village between palaces',
        longDescription: 'A well-preserved traditional village with over 600 years of history, featuring hundreds of hanok (traditional Korean houses). Located between Gyeongbokgung and Changdeokgung Palaces, this living museum showcases the beauty of Korean architecture while still serving as a residential area.',
        coordinates: {
            lat: 37.5825,
            lng: 126.9833
        },
        icon: 'fas fa-home',
        image: 'landmarks/seoul_bukchon_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Modern', 'Bridge', 'Views', 'Architecture'],
        description: 'Elegant bridge over Han River connecting Gangnam districts',
        longDescription: 'Cheongdam Bridge is one of Seoul\'s most elegant river crossings, connecting the affluent Cheongdam and Apgujeong districts. The bridge offers spectacular views of the Seoul skyline and has become an iconic symbol of modern Seoul, especially beautiful when illuminated at night.',
        coordinates: {
            lat: 37.5197,
            lng: 127.0475
        },
        icon: 'fas fa-bridge',
        image: 'landmarks/seoul_cheongdamdaegyo_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Historical', 'Palace', 'UNESCO', 'Architecture'],
        description: 'The throne hall of Gyeongbokgung Palace, where kings held state affairs',
        longDescription: 'Geunjeongjeon Hall is the throne hall of Gyeongbokgung Palace, the largest of the Five Grand Palaces built during the Joseon Dynasty. This magnificent two-story structure served as the center of state affairs where kings held coronations, received foreign envoys, and conducted important national ceremonies.',
        coordinates: {
            lat: 37.5779,
            lng: 126.9770
        },
        icon: 'fas fa-landmark',
        image: 'landmarks/seoul_ilwolobongdo_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Sports', 'Olympics', 'Entertainment', 'Modern'],
        description: 'Major sports complex and home of 1988 Seoul Olympics',
        longDescription: 'Built for the 1988 Seoul Olympics, this massive sports complex includes the Olympic Stadium, Baseball Stadium, and various indoor arenas. It remains a central venue for major sporting events, K-pop concerts, and cultural festivals, symbolizing Korea\'s modern development.',
        coordinates: {
            lat: 37.5153,
            lng: 127.0731
        },
        icon: 'fas fa-running',
        image: 'landmarks/seoul_jamsilsports_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Modern', 'Skyscraper', 'Views', 'Shopping'],
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
        category: 'kpdh',
        tags: ['kpdh', 'Landmark', 'Views', 'Romance'],
        description: 'Iconic communication tower offering panoramic city views',
        longDescription: 'Standing 236 meters above sea level on Namsan Mountain, N Seoul Tower is Seoul\'s most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
        coordinates: {
            lat: 37.5512,
            lng: 126.9882
        },
        icon: 'fas fa-broadcast-tower',
        image: 'landmarks/seoul_namsantower_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Nature', 'Historical', 'Views', 'Walking'],
        description: 'Historic mountain park with Seoul fortress walls and city views',
        longDescription: 'Located on Naksan Mountain, this park offers panoramic views of Seoul and preserves a section of the ancient Seoul City Wall. The park combines natural beauty with historical significance, featuring walking trails along the fortress walls and beautiful night views of the city.',
        coordinates: {
            lat: 37.5806,
            lng: 127.0075
        },
        icon: 'fas fa-mountain',
        image: 'landmarks/seoul_naksanpark_kdh.png',
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
        category: 'kpdh',
        tags: ['kpdh', 'Shopping', 'Modern', 'Entertainment', 'Business'],
        description: 'Asia\'s largest underground shopping mall with aquarium and library',
        longDescription: 'COEX Mall in Samsung-dong is a massive underground shopping and entertainment complex. Home to the famous Starfield Library, COEX Aquarium, and hundreds of shops and restaurants, it\'s a modern urban destination that showcases Seoul\'s contemporary lifestyle and business culture.',
        coordinates: {
            lat: 37.5063,
            lng: 127.0589
        },
        icon: 'fas fa-shopping-cart',
        image: 'landmarks/seoul_samseongcoex_kdh.png',
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

// Halal Restaurants Data
export const halalRestaurants = [
    {
        id: 'halal-eid',
        name: 'Eid - Halal Korean Food',
        nameKorean: '이드',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Food with Halal certification',
        longDescription: 'Korean Food with Halal certification',
        coordinates: { lat: 37.5332204, lng: 126.996389 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/eid_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:30 - 21:00 (Daily)',
        phone: '+82-70-8899-8210',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-gosame',
        name: 'Gosame - Korean Fish Restaurant',
        nameKorean: '고삼이',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Fish Restaurant',
        longDescription: 'Korean Fish Restaurant',
        coordinates: { lat: 37.5583636, lng: 126.9347281 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/gosame_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 20:50 (Breaktime 14:40-16:30)',
        phone: '+82-2-324-1403',
        nearbySubway: 'Sinchon Station (Line 2, Exit 1)',
        stations: [ { nameKorean: '신촌', nameEnglish: 'Sinchon', line: '2', exit: '1' } ]
    },
    {
        id: 'halal-gurkha',
        name: 'Gurkha - Indian Restaurant',
        nameKorean: '구르카',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Gurkha Restaurant is located in myeongdong, Seoul and is special for Indian, Nepalese, Chinese food. We are always working hard to provide our customers with the best tasting food and services. We will continue to our hard work to give you guys the best of best treatment a restaurant can offer.',
        coordinates: { lat: 37.5630639, lng: 126.9851915 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/gurkha_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Closed Tuesdays)',
        phone: '+82-2-775-8860',
        nearbySubway: 'Myeongdong Station (Line 4, Exit 8)',
        stations: [ { nameKorean: '명동', nameEnglish: 'Myeongdong', line: '4', exit: '8' } ]
    },
    {
        id: 'halal-jilhal-hongdae',
        name: 'Jillhal Bros (Hongdae)',
        nameKorean: '질할브로스 홍대점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.559114, lng: 126.924412 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_hongdae_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-324-1422',
        nearbySubway: 'Hongik University Station (Line 2, Exit 3)',
        stations: [ { nameKorean: '홍대입구', nameEnglish: 'Hongik University', line: '2', exit: '3' } ]
    },
    {
        id: 'halal-jilhal-yeouido',
        name: 'Jillhal Bros (Yeouido)',
        nameKorean: '질할브로스 여의도점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.529186, lng: 126.921843 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_yeouido_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:30 - 21:00 (Breaktime 15:00-17:00)',
        phone: '+82-507-1364-1422',
        nearbySubway: 'National Assembly Station (Line 9, Exit 3)',
        stations: [ { nameKorean: '국회의사당', nameEnglish: 'National Assembly', line: '9', exit: '3' } ]
    },
    {
        id: 'halal-jilhal-gwanghwamun',
        name: 'Jillhal Bros (Gwanghwamun)',
        nameKorean: '질할브로스 광화문점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.570528, lng: 126.9789736 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_gwanghwamun_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:00 - 20:30 (Daily)',
        phone: '+82-2-2251-8122',
        nearbySubway: 'Gwanghwamun Station (Line 5, Exit 4)',
        stations: [ { nameKorean: '광화문', nameEnglish: 'Gwanghwamun', line: '5', exit: '4' } ]
    },
    {
        id: 'halal-jilhal-yeoksam',
        name: 'Jillhal Bros (Yeoksam)',
        nameKorean: '질할브로스 역삼점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.5009452, lng: 127.0361278 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_yeoksam_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Breaktime 15:00-17:00, Closed Saturdays/Sundays)',
        phone: '+82-2-566-1422',
        nearbySubway: 'Yeoksam Station (Line 2, Exit 5)',
        stations: [ { nameKorean: '역삼', nameEnglish: 'Yeoksam', line: '2', exit: '5' } ]
    },
    {
        id: 'halal-jilhal-cheongdam',
        name: 'Jillhal Bros (Cheongdam)',
        nameKorean: '질할브로스 청담점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.5249862, lng: 127.0498222 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_cheongdam_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:30 - 21:30 (Breaktime 15:00-16:30)',
        phone: '+82-507-1446-1625',
        nearbySubway: 'Cheongdam Station (Line 7, Exit 9)',
        stations: [ { nameKorean: '청담', nameEnglish: 'Cheongdam', line: '7', exit: '9' } ]
    },
    {
        id: 'halal-jilhal-songpa',
        name: 'Jillhal Bros (Songpa)',
        nameKorean: '질할브로스 송파점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'American Restaurant',
        longDescription: 'American Restaurant',
        coordinates: { lat: 37.5101383, lng: 127.1086628 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jilhalbros_songpa_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-507-1325-1422',
        nearbySubway: 'Songpanaru Station (Line 9, Exit 1)',
        stations: [ { nameKorean: '송파나루', nameEnglish: 'Songpanaru', line: '9', exit: '1' } ]
    },
    {
        id: 'halal-jyoti-chungmuro',
        name: 'Jyoti Indian Restaurant (Chungmuro)',
        nameKorean: '죠티인도레스토랑 충무로점',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.5612681, lng: 126.9979265 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jyoti_chungmuro_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-2261-2912',
        nearbySubway: 'Chungmuro Station (Line 4, Exit 1)',
        stations: [ { nameKorean: '충무로', nameEnglish: 'Chungmuro', line: '4', exit: '1' } ]
    },
    {
        id: 'halal-jyoti-sinchon',
        name: 'Jyoti Indian Restaurant (Sinchon)',
        nameKorean: '죠티인도레스토랑 신촌점',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.5549159, lng: 126.9379006 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/jyoti_sinchon_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-507-1403-3536',
        nearbySubway: 'Sinchon Station (Line 2, Exit 5)',
        stations: [ { nameKorean: '신촌', nameEnglish: 'Sinchon', line: '2', exit: '5' } ]
    },
    {
        id: 'halal-kervan-itaewon',
        name: 'Kervan Turkish Restaurant (Itaewon)',
        nameKorean: '케르반 이태원점',
        category: 'halal',
        tags: ['Turkish','Halal'],
        description: 'Turkish Restaurant',
        longDescription: 'Turkish Restaurant',
        coordinates: { lat: 37.53448, lng: 126.995298 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/kervan_itaewon_seoul.jpg',
        cuisine: 'Turkish',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 04:00 (Daily)',
        phone: '+82-2-792-4767',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-kervan-banpo',
        name: 'Kervan Turkish Restaurant (Famille Station)',
        nameKorean: '케르반 파미에스테이션점',
        category: 'halal',
        tags: ['Turkish','Halal'],
        description: 'Turkish Restaurant',
        longDescription: 'Turkish Restaurant',
        coordinates: { lat: 37.504314, lng: 127.006693 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/kervan_banpo_seoul.jpg',
        cuisine: 'Turkish',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:30 - 22:00 (Daily)',
        phone: '+82-2-6282-4767',
        nearbySubway: 'Express Bus Terminal Station (Line 7, Exit 3)',
        stations: [ { nameKorean: '고속터미널', nameEnglish: 'Express Bus Terminal', line: '7', exit: '3' } ]
    },
    {
        id: 'halal-kervan-coex',
        name: 'Kervan Turkish Restaurant (Coex)',
        nameKorean: '케르반 코엑스점',
        category: 'halal',
        tags: ['Turkish','Halal'],
        description: 'Turkish Restaurant',
        longDescription: 'Turkish Restaurant',
        coordinates: { lat: 37.511601, lng: 127.058892 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/kervan_coex_seoul.jpg',
        cuisine: 'Turkish',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Breaktime 15:00-16:30)',
        phone: '+82-2-556-4767',
        nearbySubway: 'Samseong Station (Line 2, Exit 6)',
        stations: [ { nameKorean: '삼성', nameEnglish: 'Samseong', line: '2', exit: '6' } ]
    },
    {
        id: 'halal-lazzatuz ',
        name: 'Lazzatuz - Uzbek Restaurant',
        nameKorean: '라자트',
        category: 'halal',
        tags: ['Uzbek','Halal'],
        description: 'Uzbek Restaurant',
        longDescription: 'Uzbek Restaurant',
        coordinates: { lat: 37.533547, lng: 126.995463 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/lazzatuz_seoul.jpg',
        cuisine: 'Uzbek',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '12:00 - 22:00 (Closed Mondays)',
        phone: '+82-10-4793-0064',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-mrkebab',
        name: 'Mr.Kebab - Turkish Kebab & Dondurma',
        nameKorean: '미스터케밥',
        category: 'halal',
        tags: ['Turkish','Halal'],
        description: 'Turkish Restaurant',
        longDescription: 'Turkish Restaurant',
        coordinates: { lat: 37.534497, lng: 126.995518 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/mrkebab_seoul.jpg',
        cuisine: 'Turkish',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: 'Open 24 Hours (Daily)',
        phone: '+82-2-792-1997',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-osegyehyang',
        name: 'Osegyehyang',
        nameKorean: '오세계향',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Vegetarian Restaurant',
        longDescription: 'Korean Vegetarian Restaurant',
        coordinates: { lat: 37.574769, lng: 126.985254 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/osegyehyang_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:30 - 21:00 (Breaktime 15:00-17:00, Closed Thursdays)',
        phone: '+82-735-7171',
        nearbySubway: 'Anguk Station (Line 3, Exit 6)',
        stations: [ { nameKorean: '안국', nameEnglish: 'Anguk', line: '3', exit: '6' } ]
    },
    {
        id: 'halal-persianpalace',
        name: 'Persian Palace (Hyehwa)',
        nameKorean: '페르시안궁전',
        category: 'halal',
        tags: ['Persian','Halal'],
        description: 'Persian Restaurant',
        longDescription: 'Persian Restaurant',
        coordinates: { lat: 37.584939, lng: 126.9973 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/persianpalace_seoul.jpg',
        cuisine: 'Persian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 21:10 (Breaktime 15:00-16:00)',
        phone: '+82-2-763-6050',
        nearbySubway: 'Hyehwa Station (Line 4, Exit 4)',
        stations: [ { nameKorean: '혜화', nameEnglish: 'Hyehwa', line: '4', exit: '4' } ]
    },
    {
        id: 'halal-pooja-dongmyo',
        name: 'Pooja Restaurant (Dongmyo)',
        nameKorean: '뿌자',
        category: 'halal',
        tags: ['Nepal','Halal'],
        description: 'Nepal Restaurant',
        longDescription: 'Nepal Restaurant',
        coordinates: { lat: 37.572829, lng: 127.013838 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/pooja_dongmyo_seoul.jpg',
        cuisine: 'Nepal',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 23:00 (Daily)',
        phone: '+82-2-744-2199',
        nearbySubway: 'Dongmyo Station (Line 1, Exit 8)',
        stations: [ { nameKorean: '동묘', nameEnglish: 'Dongmyo', line: '1', exit: '8' } ]
    },
    {
        id: 'halal-pooja-ddp',
        name: 'Pooja Restaurant (DDP)',
        nameKorean: '뿌자2',
        category: 'halal',
        tags: ['Nepal','Halal'],
        description: 'Nepal Restaurant',
        longDescription: 'Nepal Restaurant',
        coordinates: { lat: 37.566916, lng: 127.006804 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/pooja_ddp_seoul.jpg',
        cuisine: 'Nepal',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 21:00 (Daily)',
        phone: '+82-2-2274-2922',
        nearbySubway: 'Dongdaemun History & Culture Park Station (Line 2, Exit 13)',
        stations: [ { nameKorean: '동대문역사문화공원역', nameEnglish: 'Dongdaemun History & Culture Park', line: '2', exit: '13' } ]
    },
    {
        id: 'halal-potala',
        name: 'Potala Restaurant (Jongro)',
        nameKorean: '포탈라 종로점',
        category: 'halal',
        tags: ['Tibetan','Halal'],
        description: 'Tibetan Restaurant',
        longDescription: 'Tibetan Restaurant',
        coordinates: { lat: 37.568604, lng: 126.988827 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/potala_seoul.jpg',
        cuisine: 'Tibetan',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-507-1421-0094',
        nearbySubway: 'Euljiro 3(sam)-ga Station (Line 2, Exit 1)',
        stations: [ { nameKorean: '을지로3가', nameEnglish: 'Euljiro 3', line: '2', exit: '1' } ]
    },
    {
        id: 'halal-saffron',
        name: 'Saffron (Lotte City Hotel)',
        nameKorean: '사프론',
        category: 'halal',
        tags: ['Pakistani','Halal'],
        description: 'Pakistani Restaurant',
        longDescription: 'Created in 2009, Saffron was established with a dream; a dream of providing a fine-dining experience for people to enjoy the best quality of food with an ambience like none other. Saffron has hosted not only Celebrities, Sportsmen, Businessmen, Diplomats, and Delegations, but it has also hosted some of the most powerful leaders of the world ranging from High-Ranking Army officers to Presidents. I wanted to establish a place for the halal community of Korea with extravagant architecture and ambience. The best ingredients are utilized for the most delicious and excellent quality of food. I am sure that everyone who were to visit Saffron will fall in love.The experience of dining at Saffron will be exquisite and one to remember. ',
        coordinates: { lat: 37.567136, lng: 126.987947 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/saffron_seoul.jpg',
        cuisine: 'Pakistani',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:30 - 22:00 (Daily)',
        phone: '+82-2-6361-8644',
        nearbySubway: 'Euljiro 3(sam)-ga Station (Line 2, Exit 1)',
        stations: [ { nameKorean: '을지로3가', nameEnglish: 'Euljiro 3', line: '2', exit: '1' } ]
    },
    {
        id: 'halal-shakeshack-ddp',
        name: 'SHAKE SHACK (Doota Mall)',
        nameKorean: '쉐이크쉑 두타점',
        category: 'halal',
        tags: ['American','Halal'],
        description: 'Hamburger Restaurant',
        longDescription: 'Hamburger Restaurant',
        coordinates: { lat: 37.569007, lng: 127.00923 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/shakeshack_ddp_seoul.jpg',
        cuisine: 'American',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:30 - 24:00 (Daily)',
        phone: '+82-2-3398-4003',
        nearbySubway: 'Dongdaemun Station (Line 4, Exit 8)',
        stations: [ { nameKorean: '동대문', nameEnglish: 'Dongdaemun', line: '4', exit: '8' } ]
    },
    {
        id: 'halal-sitisarah',
        name: 'Siti Sarah',
        nameKorean: '시티사라',
        category: 'halal',
        tags: ['Indonesian','Halal'],
        description: 'Indonesian Restaurant',
        longDescription: 'Indonesian Restaurant',
        coordinates: { lat: 37.533222, lng: 126.995989 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/sitisarah_seoul.jpg',
        cuisine: 'Indonesian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:00 - 24:00 (Daily)',
        phone: '+82-2-796-8515',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-taj',
        name: 'Taj - Indian Restaurant',
        nameKorean: '타지',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.564338, lng: 126.986059 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/taj_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:30 - 20:30 (Breaktime 14:00-17:30, Closed Mondays)',
        phone: '+82-507-1410-0677',
        nearbySubway: 'Euljiro 1(il)-ga Station (Line 2, Exit 5)',
        stations: [ { nameKorean: '을지로입구', nameEnglish: 'Euljiro 1', line: '2', exit: '5' } ]
    },
    {
        id: 'halal-tajpalace',
        name: 'Taj Palace',
        nameKorean: '타지 팰리스',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.533774, lng: 126.995461 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/tajpalace_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-790-5786',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-warung',
        name: 'Warung Makan Borobudur',
        nameKorean: '와룽 마칸 보로부두르',
        category: 'halal',
        tags: ['Indonesian','Halal'],
        description: 'Indonesian Restaurant',
        longDescription: 'Indonesian Restaurant',
        coordinates: { lat: 37.47958, lng: 126.884653 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/warung_seoul.jpg',
        cuisine: 'Indonesian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:00 - 21:00 (Open Saturdays, Sundays)',
        phone: '+82-2-868-3072',
        nearbySubway: 'Gasan Digital Complex (Line 1, Exit 6)',
        stations: [ { nameKorean: '가산디지털단지', nameEnglish: 'Gasan Digital Complex', line: '1', exit: '6' } ]
    },
    {
        id: 'halal-yoogane-myeongdong2',
        name: 'Yoogane Chicken Galbi (Myeongdong 2)',
        nameKorean: '유가네닭갈비 명동2호점',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Chicken Galbi Restaurant',
        longDescription: 'Korean Chicken Galbi Restaurant',
        coordinates: { lat: 37.563306, lng: 126.983512 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/yoogane_myeongdong2_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:00 - 23:00 (Daily)',
        phone: '+82-2-3789-2492',
        nearbySubway: 'Euljiro 1(il)-ga Station (Line 2, Exit 5)',
        stations: [ { nameKorean: '을지로입구', nameEnglish: 'Euljiro 1', line: '2', exit: '5' } ]
    },
    {
        id: 'halal-dubai',
        name: 'Dubai Restaurant',
        nameKorean: '두바이레스토랑',
        category: 'halal',
        tags: ['Dubai','Halal'],
        description: 'Dubai Restaurant',
        longDescription: 'Dubai Restaurant',
        coordinates: { lat: 37.534470, lng: 126.995398 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/dubai_seoul.jpg',
        cuisine: 'Middle Eastern',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '12:00 - 23:00 (Closed Mondays)',
        phone: '+82-2-798-9277',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-adnan',
        name: 'Adnan Kebab',
        nameKorean: '아드난 케밥',
        category: 'halal',
        tags: ['Turkish','Halal'],
        description: 'Kebab Restaurant',
        longDescription: 'Kebab Restaurant',
        coordinates: { lat: 37.559165, lng: 126.978342 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/adnan_seoul.jpg',
        cuisine: 'Turkish',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '10:00 - 21:00 (Daily)',
        phone: '+82-2-776-6904',
        nearbySubway: 'Hoehyeon Station (Line 4, Exit 6)',
        stations: [ { nameKorean: '회현', nameEnglish: 'Hoehyeon', line: '4', exit: '6' } ]
    },
    {
        id: 'halal-arabesque',
        name: 'Arabesque',
        nameKorean: '아라베스크',
        category: 'halal',
        tags: ['Middle','Eastern','Halal'],
        description: 'Middle Eastern Restaurant',
        longDescription: 'Middle Eastern Restaurant',
        coordinates: { lat: 37.535810, lng: 126.998954 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/arabesque_seoul.jpg',
        cuisine: 'Middle Eastern',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:30 - 22:00 (Daily)',
        phone: '+82-2-790-6910',
        nearbySubway: 'Itaewon Station (Line 6, Exit 2)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '2' } ]
    },
    {
        id: 'halal-babaindia',
        name: 'Baba India',
        nameKorean: '바바인디아',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.494896, lng: 127.028709 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/babaindia_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 21:00 (Breaktime 15:00-17:00)',
        phone: '+82-2-521-4588',
        nearbySubway: 'Gangnam Station (Line 2, Exit 5)',
        stations: [ { nameKorean: '강남', nameEnglish: 'Gangnam', line: '2', exit: '5' } ]
    },
    {
        id: 'halal-bombaygrill',
        name: 'Bombay Grill',
        nameKorean: '봄베그릴',
        category: 'halal',
        tags: ['Indian','Halal'],
        description: 'Indian Restaurant',
        longDescription: 'Indian Restaurant',
        coordinates: { lat: 37.533230, lng: 126.996237 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/bombaygrill_seoul.jpg',
        cuisine: 'Indian',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-792-7155',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [ { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' } ]
    },
    {
        id: 'halal-busanjib',
        name: 'Busan Jib',
        nameKorean: '부산집',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Halal Restaurant',
        longDescription: 'Korean Halal Restaurant',
        coordinates: { lat: 37.563231, lng: 126.984899 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/busanjib_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-777-8660',
        nearbySubway: 'Myeongdong Station (Line 4, Exit 6)',
        stations: [ { nameKorean: '명동', nameEnglish: 'Myeongdong', line: '4', exit: '6' } ]
    },
    {
        id: 'halal-petra',
        name: 'Petra',
        nameKorean: '페트라',
        category: 'halal',
        tags: ['Middle','Eastern','Halal'],
        description: 'Middle Eastern Restaurant',
        longDescription: 'Middle Eastern Restaurant',
        coordinates: { lat: 37.534710, lng: 126.987623 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/petra_seoul.jpg',
        cuisine: 'Middle Eastern',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '11:00 - 21:00 (Daily)',
        phone: '+82-2-790-4433',
        nearbySubway: 'Noksapyeong Station (Line 6, Exit 1)',
        stations: [ { nameKorean: '녹사평', nameEnglish: 'Noksapyeong', line: '6', exit: '1' } ]
    },
    {
        id: 'halal-yanggood',
        name: 'Yang Good',
        nameKorean: '양국',
        category: 'halal',
        tags: ['Korean','Halal'],
        description: 'Korean Lamb Restaurant',
        longDescription: 'Korean Lamb Restaurant',
        coordinates: { lat: 37.502109, lng: 127.034703 },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/yanggood_seoul.jpg',
        cuisine: 'Korean',
        priceRange: '',
        halalCertification: '',
        tips: [],
        hours: '16:00 - 22:30 (Closed Sundays)',
        phone: '+82-507-1434-7060',
        nearbySubway: 'Yeoksam Station (Line 2, Exit 6)',
        stations: [ { nameKorean: '역삼', nameEnglish: 'Yeoksam', line: '2', exit: '6' } ]
    },
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
            totalLandmarks: landmarks.length,
            totalHalalRestaurants: halalRestaurants.length
        }
    };
}

// Combine all landmarks and halal restaurants
export const allLandmarks = [...landmarks, ...halalRestaurants];

export default {
    categories,
    landmarks,
    halalRestaurants,
    allLandmarks,
    generateSampleData
};