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
            lat: 33.5101,
            lng: 126.5219
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
        id: 'halal-makan',
        name: 'Makan Halal Korean BBQ',
        nameKorean: '마칸 할랄 한국 바베큐',
        category: 'halal',
        tags: ['halal', 'Halal', 'Korean BBQ', 'Restaurant', 'Certified'],
        description: 'Authentic Korean BBQ with Halal certification',
        longDescription: 'Makan offers a unique Halal Korean BBQ experience in Itaewon. All meat is certified Halal and prepared according to Islamic dietary laws, while maintaining the authentic Korean flavors and dining experience.',
        coordinates: {
            lat: 37.5340,
            lng: 126.9945
        },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/makan_halal_bbq.jpg',
        cuisine: 'Korean',
        priceRange: '$$',
        halalCertification: 'KMF Certified',
        tips: [
            'Popular with Muslim tourists - book ahead',
            'All-you-can-eat options available',
            'Staff speaks English and Arabic',
            'Provides prayer space'
        ],
        hours: '11:30 - 22:00 (Daily)',
        phone: '+82-2-792-1229',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [
            { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' }
        ]
    },
    {
        id: 'halal-eid',
        name: 'EID Seoul - Halal Restaurant',
        nameKorean: '이드 서울 할랄 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Middle Eastern', 'Turkish', 'Restaurant'],
        description: 'Middle Eastern and Turkish cuisine with Halal certification',
        longDescription: 'EID Seoul brings authentic Middle Eastern flavors to Seoul. Specializing in Turkish and Arab cuisine, all dishes are prepared with 100% Halal ingredients and traditional cooking methods.',
        coordinates: {
            lat: 37.5335,
            lng: 126.9960
        },
        icon: 'fas fa-utensils',
        image: 'restaurants/eid_seoul.jpg',
        cuisine: 'Middle Eastern/Turkish',
        priceRange: '$$',
        halalCertification: 'KMF Certified',
        tips: [
            'Try the lamb kebabs and hummus',
            'Shisha lounge available upstairs',
            'Vegetarian options available',
            'Iftar special during Ramadan'
        ],
        hours: '11:00 - 23:00 (Daily)',
        phone: '+82-2-798-7444',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [
            { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' }
        ]
    },
    {
        id: 'halal-kampungku',
        name: 'Kampungku Restaurant',
        nameKorean: '캄풍쿠 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Malaysian', 'Asian', 'Restaurant'],
        description: 'Malaysian Halal food in Itaewon',
        longDescription: 'Kampungku serves authentic Malaysian cuisine with all Halal ingredients. Popular among Southeast Asian expats and tourists, offering a taste of home with dishes like Nasi Lemak and Rendang.',
        coordinates: {
            lat: 37.5345,
            lng: 126.9935
        },
        icon: 'fas fa-bowl-rice',
        image: 'restaurants/kampungku.jpg',
        cuisine: 'Malaysian',
        priceRange: '$',
        halalCertification: 'Self-Certified Halal',
        tips: [
            'Nasi Lemak is the house special',
            'Affordable prices for students',
            'Takeaway available',
            'Malaysian groceries also sold'
        ],
        hours: '10:00 - 22:00 (Closed Mondays)',
        phone: '+82-2-794-6015',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [
            { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' }
        ]
    },
    {
        id: 'halal-kitchen-seoul',
        name: 'Halal Kitchen Seoul',
        nameKorean: '할랄 키친 서울',
        category: 'halal',
        tags: ['halal', 'Halal', 'Fusion', 'Korean', 'Restaurant'],
        description: 'Fusion Halal cuisine with Korean twist',
        longDescription: 'Halal Kitchen Seoul offers innovative fusion cuisine combining Korean flavors with Halal requirements. Popular dishes include Halal Bulgogi, Kimchi Fried Rice, and Korean-style fried chicken.',
        coordinates: {
            lat: 37.5550,
            lng: 126.9707
        },
        icon: 'fas fa-burger',
        image: 'restaurants/halal_kitchen_seoul.jpg',
        cuisine: 'Korean Fusion',
        priceRange: '$$',
        halalCertification: 'KMF Certified',
        tips: [
            'Halal Korean fried chicken is a must-try',
            'Delivery available through apps',
            'English menu available',
            'Popular with young locals'
        ],
        hours: '11:00 - 22:30 (Daily)',
        phone: '+82-2-332-5525',
        nearbySubway: 'Hongik University Station (Line 2, Exit 9)',
        stations: [
            { nameKorean: '홍대입구', nameEnglish: 'Hongik University', line: '2', exit: '9' }
        ]
    },
    {
        id: 'halal-bukhara',
        name: 'Bukhara Indian Restaurant',
        nameKorean: '부카라 인도 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Indian', 'Curry', 'Restaurant'],
        description: 'Authentic Indian Halal cuisine',
        longDescription: 'Bukhara brings authentic North Indian flavors to Seoul with a fully Halal menu. Known for their tandoori dishes, biryani, and wide variety of vegetarian options.',
        coordinates: {
            lat: 37.5633,
            lng: 126.9830
        },
        icon: 'fas fa-pepper-hot',
        image: 'restaurants/bukhara.jpg',
        cuisine: 'Indian',
        priceRange: '$$',
        halalCertification: 'Muslim-Friendly',
        tips: [
            'Lunch buffet offers great value',
            'Spice levels can be adjusted',
            'Vegetarian and vegan options',
            'Private dining rooms available'
        ],
        hours: '11:00 - 22:00 (Daily)',
        phone: '+82-2-778-0820',
        nearbySubway: 'Myeongdong Station (Line 4, Exit 3)',
        stations: [
            { nameKorean: '명동', nameEnglish: 'Myeongdong', line: '4', exit: '3' }
        ]
    },
    {
        id: 'halal-salam',
        name: 'Salam Restaurant',
        nameKorean: '살람 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Egyptian', 'Arab', 'Restaurant'],
        description: 'Egyptian and Arab cuisine',
        longDescription: 'Salam Restaurant specializes in authentic Egyptian and Levantine cuisine. Popular dishes include Koshari, Shawarma, and fresh Falafel, all prepared with 100% Halal ingredients.',
        coordinates: {
            lat: 37.5338,
            lng: 126.9940
        },
        icon: 'fas fa-utensils',
        image: 'restaurants/salam.jpg',
        cuisine: 'Egyptian/Arab',
        priceRange: '$',
        halalCertification: 'Owner Muslim',
        tips: [
            'Koshari is highly recommended',
            'Fresh bread baked daily',
            'Shisha available in outdoor seating',
            'Egyptian tea and coffee served'
        ],
        hours: '11:00 - 23:30 (Daily)',
        phone: '+82-2-793-4323',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [
            { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' }
        ]
    },
    {
        id: 'halal-zafran',
        name: 'Zafran Indian Restaurant',
        nameKorean: '자프란 인도 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Indian', 'Fine Dining', 'Restaurant'],
        description: 'Premium Indian dining with Halal options',
        longDescription: 'Zafran offers upscale Indian dining experience with a fully Halal menu. Known for their authentic recipes from various regions of India, including Kashmir, Punjab, and South India.',
        coordinates: {
            lat: 37.5080,
            lng: 127.0615
        },
        icon: 'fas fa-mortar-pestle',
        image: 'restaurants/zafran.jpg',
        cuisine: 'Indian',
        priceRange: '$$$',
        halalCertification: 'Muslim-Friendly',
        tips: [
            'Reservation recommended for dinner',
            'Extensive vegetarian menu',
            'Wine alternatives available',
            'Business lunch specials'
        ],
        hours: '11:30 - 22:00 (Daily)',
        phone: '+82-2-543-5573',
        nearbySubway: 'Samseong Station (Line 2, Exit 5)',
        stations: [
            { nameKorean: '삼성', nameEnglish: 'Samseong', line: '2', exit: '5' }
        ]
    },
    {
        id: 'halal-pasha',
        name: 'Pasha Turkish Restaurant',
        nameKorean: '파샤 터키 레스토랑',
        category: 'halal',
        tags: ['halal', 'Halal', 'Turkish', 'Mediterranean', 'Restaurant'],
        description: 'Authentic Turkish cuisine with Halal certification',
        longDescription: 'Pasha brings the flavors of Istanbul to Seoul with authentic Turkish dishes. All meat is Halal certified, and the restaurant features traditional Turkish decor and hospitality.',
        coordinates: {
            lat: 37.5342,
            lng: 126.9955
        },
        icon: 'fas fa-drumstick-bite',
        image: 'restaurants/pasha.jpg',
        cuisine: 'Turkish',
        priceRange: '$$',
        halalCertification: 'KMF Certified',
        tips: [
            'Turkish breakfast served on weekends',
            'Live Turkish music on Friday nights',
            'Turkish tea and desserts available',
            'Outdoor terrace for shisha'
        ],
        hours: '10:00 - 23:00 (Daily)',
        phone: '+82-2-749-0600',
        nearbySubway: 'Itaewon Station (Line 6, Exit 3)',
        stations: [
            { nameKorean: '이태원', nameEnglish: 'Itaewon', line: '6', exit: '3' }
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
            totalLandmarks: landmarks.length,
            totalHalalRestaurants: halalRestaurants.length
        }
    };
}

export default {
    categories,
    landmarks,
    generateSampleData
};