// Detail Page JavaScript - Seoul Explorer
import { dataService, imageService } from '../services/index.js';

class DetailPage {
    constructor() {
        this.locationId = null;
        this.locationData = null;
        this.init();
    }

    init() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('DetailPage init started');
        }
        
        // Get location ID from URL parameters
        this.locationId = this.getLocationIdFromURL();
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('Location ID from URL:', this.locationId);
        }
        
        if (!this.locationId) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('No location ID found, showing error');
            }
            this.showError();
            return;
        }

        // Load location data
        this.loadLocationData();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    getLocationIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('location');
    }

    async loadLocationData() {
        try {
            // Wait for data service to be ready
            await dataService.waitForReady();
            
            // 서비스를 통해 랜드마크 데이터 로드
            this.locationData = await dataService.getLandmarkById(this.locationId);
            
            if (!this.locationData) {
                console.error('Location not found:', this.locationId);
                this.showError();
                return;
            }

            this.renderLocationDetails();
        } catch (error) {
            console.error('Error loading location data:', error);
            // fallback으로 기존 데이터 사용
            const landmarks = this.getSeoulLandmarksData();
            this.locationData = landmarks.find(location => location.id === this.locationId);
            
            if (this.locationData) {
                this.renderLocationDetails();
            } else {
                this.showError();
            }
        }
    }

    // Extract landmarks data directly (copied from SeoulExplorer class)
    getSeoulLandmarksData() {
        return [
            {
                id: 'naksan-park',
                name: 'Naksan Park',
                nameKorean: '낙산공원',
                category: 'historical',
                description: 'Hillside park with panoramic Seoul views and ancient fortress walls',
                longDescription: 'Located on Naksan Mountain (125m), this park offers stunning panoramic views of Seoul. Walk along the 2.1km ancient fortress wall section from Hyehwamun to Heunginjimun, connecting to the famous Ihwa Mural Village.',
                coordinates: { lat: 37.5806, lng: 127.0075 },
                icon: 'fas fa-mountain',
                image: 'landmarks/낙산공원.png',
                tags: ['Historical', 'Views', 'Walking'],
                tips: [
                    'Best views of Seoul skyline especially at sunset',
                    'Connect your visit with Ihwa Mural Village',
                    'Wear comfortable walking shoes for fortress wall walk'
                ],
                hours: '24/7 (Exhibition hall: 09:00-17:00)',
                entrance: 'Free',
                nearbySubway: 'Hyehwa Station (Line 4), Exit 2',
                culturalTips: 'Part of Seoul City Wall - UNESCO World Heritage tentative list'
            },
            {
                id: 'namsan-tower',
                name: 'N Seoul Tower',
                nameKorean: '남산타워',
                category: 'landmark',
                description: 'Iconic communication tower offering panoramic city views',
                longDescription: 'Standing 236 meters above sea level on Namsan Mountain, N Seoul Tower is Seoul\'s most recognizable landmark. The tower offers breathtaking 360-degree views of the city and is famous for its "love locks" tradition.',
                coordinates: { lat: 37.5512, lng: 126.9882 },
                icon: 'fas fa-broadcast-tower',
                image: 'landmarks/남산타워.png',
                tags: ['Landmark', 'Views', 'Romance'],
                tips: [
                    'Take the cable car up for scenic views',
                    'Best visited at sunset for stunning photo opportunities',
                    'Bring a padlock to add to the love locks fence'
                ],
                hours: '10:00 - 23:00 (Sun-Fri), 10:00 - 24:00 (Sat)',
                entrance: 'Cable car: 8,500 KRW, Observatory: 10,000 KRW',
                nearbySubway: 'Myeong-dong Station (Line 4) + Cable car',
                culturalTips: 'Popular date spot - couples often attach love locks here'
            },
            {
                id: 'myeongdong',
                name: 'Myeong-dong',
                nameKorean: '명동',
                category: 'shopping',
                description: 'Korea\'s premier shopping and beauty district',
                longDescription: 'Discover Seoul\'s most vibrant shopping and beauty district, where traditional Korean culture meets modern retail therapy. From world-renowned K-beauty products to authentic street food, Myeong-dong offers an immersive experience into Korean lifestyle.',
                coordinates: { lat: 37.5636, lng: 126.9824 },
                icon: 'fas fa-shopping-bag',
                image: 'landmarks/명동.png',
                tags: ['Shopping', 'Food', 'Beauty'],
                tips: [
                    'Try Korean skincare products - many stores offer free samples',
                    'Haggling is acceptable at street vendors',
                    'Visit in the evening for the best street food experience'
                ],
                hours: 'Stores: 10:00 - 22:00, Street food: 12:00 - 02:00',
                entrance: 'Free (individual purchases vary)',
                nearbySubway: 'Myeong-dong Station (Line 4)',
                culturalTips: 'Bow when receiving free samples, tipping is not expected',
                detailSections: [
                    {
                        title: 'K-Beauty Paradise',
                        image: 'landmarks/명동-화장품.png',
                        description: 'Myeong-dong is the epicenter of Korean beauty culture. Walk through streets lined with flagship stores of famous brands like Innisfree, Etude House, and The Face Shop. Experience the latest in Korean skincare technology with free consultations and product samples. Many stores offer English-speaking staff and tax-free shopping for tourists.'
                    },
                    {
                        title: 'Street Food Heaven',
                        image: 'landmarks/명동-길거리음식.png',
                        description: 'As evening falls, Myeong-dong transforms into a street food paradise. Try iconic Korean snacks like hotteok (sweet pancakes), tteokbokki (spicy rice cakes), and Korean corn dogs. The street food market operates from late afternoon until early morning, offering authentic flavors at budget-friendly prices.'
                    },
                    {
                        title: 'Fashion & Shopping',
                        image: 'landmarks/명동-쇼핑.png',
                        description: 'From high-end department stores like Lotte and Shinsegae to trendy boutiques and international brands, Myeong-dong caters to every fashion taste and budget. The area features both luxury shopping experiences and affordable fashion finds, making it a complete retail destination.'
                    },
                    {
                        title: 'Cultural Experience',
                        image: 'landmarks/명동-문화.png',
                        description: 'Beyond shopping, Myeong-dong offers cultural experiences including traditional Korean performances, art galleries, and historic Myeong-dong Cathedral. The area seamlessly blends modern consumer culture with Korean traditions, providing visitors with a well-rounded cultural experience.'
                    }
                ]
            },
            {
                id: 'jayang-station',
                name: 'Jayang Station',
                nameKorean: '자양역',
                category: 'modern',
                description: 'Major subway interchange connecting eastern Seoul districts',
                longDescription: 'Located in Gwangjin District, Jayang Station serves as an important transit hub on Line 7. The area features modern residential complexes, local markets, and easy access to the Han River parks.',
                coordinates: { lat: 37.5342, lng: 127.0822 },
                icon: 'fas fa-subway',
                image: 'landmarks/자양역.png',
                tags: ['Transportation', 'Local Life', 'Residential'],
                tips: [
                    'Great access point to Han River parks',
                    'Explore local Korean markets nearby',
                    'Less touristy but authentic Seoul experience'
                ],
                hours: '05:30 - 24:00 (subway operating hours)',
                entrance: 'Subway fare: 1,370 KRW',
                nearbySubway: 'Jayang Station (Line 7)',
                culturalTips: 'Experience everyday Seoul life away from tourist crowds'
            },
            {
                id: 'lotte-world-tower',
                name: 'Lotte World Tower',
                nameKorean: '롯데월드타워',
                category: 'landmark',
                description: 'Korea\'s tallest skyscraper with shopping and observation decks',
                longDescription: 'At 555 meters tall, Lotte World Tower is the 6th tallest building in the world. Features Seoul Sky observation deck, luxury shopping, restaurants, and direct connection to Lotte World theme park.',
                coordinates: { lat: 37.5120, lng: 127.1020 },
                icon: 'fas fa-building',
                image: 'landmarks/롯데월드타워.png',
                tags: ['Modern', 'Views', 'Shopping'],
                tips: [
                    'Visit Seoul Sky observatory on floors 117-123',
                    'Book tickets online for discounted prices',
                    'Combine with Lotte World theme park visit'
                ],
                hours: '10:00 - 22:00 (observatory varies)',
                entrance: 'Seoul Sky: 27,000 KRW (adult)',
                nearbySubway: 'Jamsil Station (Line 2, 8)',
                culturalTips: 'Represents modern Seoul\'s architectural achievements'
            },
            {
                id: 'jamsil-stadium',
                name: 'Jamsil Sports Complex',
                nameKorean: '잠실주경기장',
                category: 'modern',
                description: 'Major sports complex hosting baseball, soccer, and events',
                longDescription: 'Built for the 1988 Seoul Olympics, this massive complex includes Olympic Stadium, baseball stadium, and indoor arena. Home to LG Twins baseball team and major K-pop concerts.',
                coordinates: { lat: 37.5120, lng: 127.0719 },
                icon: 'fas fa-futbol',
                image: 'landmarks/잠실주경기장.png',
                tags: ['Sports', 'Entertainment', 'Olympics'],
                tips: [
                    'Check schedules for baseball games or concerts',
                    'Great atmosphere during LG Twins home games',
                    'Easy access to Lotte World nearby'
                ],
                hours: 'Event-dependent (usually 18:30 for baseball)',
                entrance: 'Varies by event (baseball: 8,000-50,000 KRW)',
                nearbySubway: 'Sports Complex Station (Line 2)',
                culturalTips: 'Experience Korean baseball culture - very enthusiastic fans!'
            },
            {
                id: 'bukchon-hanok',
                name: 'Bukchon Hanok Village',
                nameKorean: '북촌한옥마을',
                category: 'cultural',
                description: 'Traditional Korean architecture village between palaces',
                longDescription: 'A well-preserved traditional village with over 600 years of history, featuring beautiful hanok (traditional Korean houses). Perfect for experiencing traditional Korean architecture and culture.',
                coordinates: { lat: 37.5825, lng: 126.9833 },
                icon: 'fas fa-home',
                image: 'landmarks/북촌한옥마을.png',
                tags: ['Traditional', 'Architecture', 'Culture'],
                tips: [
                    'Visit early morning or late afternoon for fewer crowds',
                    'Respect residents - keep noise levels down',
                    'Wear comfortable shoes for walking on uneven surfaces'
                ],
                hours: '24/7 (respect quiet hours 22:00-08:00)',
                entrance: 'Free',
                nearbySubway: 'Anguk Station (Line 3)',
                culturalTips: 'Many hanoks are private residences - observe quietly and respectfully'
            },
            {
                id: 'samsung-station',
                name: 'Samsung Station (COEX)',
                nameKorean: '삼성역',
                category: 'modern',
                description: 'Major business district with COEX Mall and convention center',
                longDescription: 'Located in the heart of Gangnam, Samsung Station connects to Asia\'s largest underground shopping mall (COEX). The area features corporate headquarters, luxury hotels, and entertainment venues.',
                coordinates: { lat: 37.5072, lng: 127.0553 },
                icon: 'fas fa-briefcase',
                image: 'landmarks/삼성역.png',
                tags: ['Business', 'Shopping', 'Modern'],
                tips: [
                    'Explore massive COEX underground mall',
                    'Visit COEX Aquarium and Starfield Library',
                    'Great area for Korean BBQ restaurants'
                ],
                hours: 'COEX: 10:00 - 22:00, Restaurants vary',
                entrance: 'Free to area (COEX Aquarium: 23,000 KRW)',
                nearbySubway: 'Samsung Station (Line 2)',
                culturalTips: 'Heart of Korea\'s business culture - dress professionally'
            }
        ];
    }

    renderLocationDetails() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('Starting to render location details for:', this.locationData.name);
        }
        
        const loadingState = document.getElementById('loadingState');
        const detailContent = document.getElementById('detailContent');
        const headerTitle = document.getElementById('headerTitle');
        const directionsFab = document.getElementById('directionsFab');

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('Found DOM elements:', {
                loadingState: !!loadingState,
                detailContent: !!detailContent,
                headerTitle: !!headerTitle,
                directionsFab: !!directionsFab
            });
        }

        // Check if essential elements exist
        if (!loadingState || !detailContent) {
            console.error('Essential DOM elements not found!');
            return;
        }

        // Hide loading state
        loadingState.style.display = 'none';
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('Loading state hidden');
        }
        
        // Update header title
        if (headerTitle) {
            headerTitle.textContent = this.locationData.name;
        }
        
        // Show directions FAB
        if (directionsFab) {
            directionsFab.style.display = 'flex';
        }

        // Build content
        const contentHTML = `
            <!-- Hero Section -->
            <div class="detail-hero">
                <div class="smart-image-container detail-image" id="heroImageContainer"></div>
                <div class="detail-hero-overlay">
                    <div class="detail-hero-title">${this.locationData.name}</div>
                    <div class="detail-hero-subtitle">${this.locationData.nameKorean}</div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="detail-main-content">
                <!-- Tags -->
                <div class="detail-tags">
                    ${this.locationData.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
                </div>
                
                <!-- Main Description -->
                <div class="detail-main-description">
                    ${this.locationData.longDescription}
                </div>
                
                <!-- Detail Sections -->
                ${this.renderDetailSections()}
                
                <!-- Practical Information -->
                <div class="practical-info">
                    <h3><i class="fas fa-info-circle"></i> Practical Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div class="info-item-content">
                                <div class="info-item-label">Hours</div>
                                <div class="info-item-value">${this.locationData.hours}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-won-sign"></i>
                            <div class="info-item-content">
                                <div class="info-item-label">Entrance</div>
                                <div class="info-item-value">${this.locationData.entrance}</div>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-subway"></i>
                            <div class="info-item-content">
                                <div class="info-item-label">Nearest Subway</div>
                                <div class="info-item-value">${this.locationData.nearbySubway}</div>
                            </div>
                        </div>
                        ${this.renderSubwayStations()}
                    </div>
                </div>
                
                <!-- Tips Section -->
                <div class="tips-section">
                    <h3><i class="fas fa-lightbulb"></i> Insider Tips</h3>
                    <ul class="tips-list">
                        ${this.locationData.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- Cultural Tips -->
                <div class="detail-section">
                    <div class="detail-section-title">🇰🇷 Cultural Insight</div>
                    <div class="detail-section-description">
                        <em>${this.locationData.culturalTips}</em>
                    </div>
                </div>
            </div>
        `;

        detailContent.innerHTML = contentHTML;

        // 스마트 이미지 로드
        this.loadSmartImages();
        
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('Content rendered successfully');
        }
    }

    /**
     * 스마트 이미지 로드
     */
    async loadSmartImages() {
        // Hero 이미지 로드
        const heroContainer = document.getElementById('heroImageContainer');
        if (heroContainer && this.locationData.image) {
            const heroSmartImage = new window.SmartImage(heroContainer, {
                showLoadingIndicator: true,
                retryAttempts: 3
            });
            await heroSmartImage.loadImage(this.locationData.image, this.locationData.name);
        }

        // Section 이미지들 로드
        if (this.locationData.detailSections) {
            for (let i = 0; i < this.locationData.detailSections.length; i++) {
                const section = this.locationData.detailSections[i];
                const sectionContainer = document.getElementById(`sectionImage${i}`);

                if (sectionContainer && section.image) {
                    const sectionSmartImage = new window.SmartImage(sectionContainer, {
                        showLoadingIndicator: false,
                        retryAttempts: 2
                    });
                    await sectionSmartImage.loadImage(section.image, section.title);
                }
            }
        }

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('✅ All smart images loaded');
        }
    }

    renderDetailSections() {
        if (!this.locationData.detailSections || this.locationData.detailSections.length === 0) {
            return '';
        }

        return this.locationData.detailSections.map((section, index) => {
            return `
                <div class="detail-section">
                    <div class="detail-section-image">
                        <div class="smart-image-container" id="sectionImage${index}"></div>
                    </div>
                    <div class="detail-section-title">${section.title}</div>
                    <div class="detail-section-description">${section.description}</div>
                </div>
            `;
        }).join('');
    }

    renderSubwayStations() {
        if (!this.locationData.stations || this.locationData.stations.length === 0) {
            return '';
        }

        // Group stations by station name to show multiple lines at the same station
        const stationGroups = {};
        this.locationData.stations.forEach(station => {
            const key = station.nameKorean;
            if (!stationGroups[key]) {
                stationGroups[key] = {
                    nameKorean: station.nameKorean,
                    nameEnglish: station.nameEnglish,
                    lines: []
                };
            }
            stationGroups[key].lines.push({
                line: station.line,
                exit: station.exit
            });
        });

        return `
            <div class="subway-stations">
                <h4 class="subway-title">
                    <i class="fas fa-train"></i> Subway Stations
                </h4>
                <div class="stations-list">
                    ${Object.values(stationGroups).map(group => {
                        // Sort lines by number and group exits
                        const lineExits = {};
                        group.lines.forEach(item => {
                            if (!lineExits[item.line]) {
                                lineExits[item.line] = [];
                            }
                            if (item.exit) {
                                lineExits[item.line].push(item.exit);
                            }
                        });

                        // Check if there are any exits
                        const hasExits = Object.values(lineExits).some(exits => exits.length > 0);
                        const exitInfo = Object.entries(lineExits)
                            .filter(([line, exits]) => exits.length > 0)
                            .map(([line, exits]) => `Exit ${exits.join(', ')}`)
                            .join(' ');

                        // Check if name is long (needs vertical layout)
                        const isLongName = group.nameKorean.length > 4 || group.nameEnglish.length > 10;
                        
                        return `
                            <div class="station-item ${hasExits ? '' : 'no-exit'} ${isLongName ? 'vertical-names' : ''}">
                                <div class="station-lines">
                                    ${Object.keys(lineExits).sort().map(line => `
                                        <span class="subway-line line-${line}">${line}</span>
                                    `).join('')}
                                </div>
                                <div class="station-name-wrapper ${isLongName ? 'vertical' : 'horizontal'}">
                                    <span class="name-korean">${group.nameKorean}</span>
                                    <span class="name-english">${group.nameEnglish}</span>
                                </div>
                                ${hasExits ? `
                                    <div class="station-exit-wrapper">
                                        <span class="station-exits">${exitInfo}</span>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    showError() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }

    initializeEventListeners() {
        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn && !backBtn.hasAttribute('data-listener-attached')) {
            backBtn.addEventListener('click', () => {
                this.goBack();
            });
            backBtn.setAttribute('data-listener-attached', 'true');
        }

        // Directions FAB
        const directionsFab = document.getElementById('directionsFab');
        if (directionsFab && !directionsFab.hasAttribute('data-listener-attached')) {
            directionsFab.addEventListener('click', () => {
                this.getDirections();
            });
            directionsFab.setAttribute('data-listener-attached', 'true');
        }

        // Handle browser back button - check if already attached
        if (!window.detailPagePopstateAttached) {
            window.addEventListener('popstate', () => {
                this.goBack();
            });
            window.detailPagePopstateAttached = true;
        }
    }

    goBack() {
        // Use history.back() if there's history, otherwise go to index.html
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }

    getDirections() {
        if (!this.locationData) return;
        
        const destination = `${this.locationData.coordinates.lat},${this.locationData.coordinates.lng}`;
        const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
        
        window.open(url, '_blank');
    }
}

// Make DetailPage available globally for debugging
window.DetailPage = DetailPage;

// Initialize DetailPage with proper Firebase waiting
async function initializeDetailPage() {
    try {
        console.log('🚀 Initializing Detail Page...');
        
        // Wait a bit for Firebase to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if Firebase is ready
        let retries = 0;
        while ((!window.Firebase || !window.Firebase.isInitialized()) && retries < 20) {
            console.log(`⏳ Waiting for Firebase... (attempt ${retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, 250));
            retries++;
        }
        
        if (!window.Firebase || !window.Firebase.isInitialized()) {
            console.error('❌ Firebase failed to initialize after 5 seconds');
            throw new Error('Firebase initialization timeout');
        }
        
        console.log('✅ Firebase is ready, creating DetailPage instance');
        const detailPage = new DetailPage();
        window.detailPageInstance = detailPage;
        
    } catch (error) {
        console.error('❌ Error creating DetailPage:', error);
        // Show error state if initialization fails
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'flex';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDetailPage);

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    console.log('Document already loaded, initializing immediately');
    initializeDetailPage();
}