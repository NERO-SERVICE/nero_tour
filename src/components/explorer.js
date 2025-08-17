// Seoul Explorer - Mobile Tourism App for American Visitors
import { dataService, imageService, initializeServices } from '../services/index.js';

class SeoulExplorer {
    constructor() {
        this.currentLocation = null;
        this.selectedLocation = null;
        // Favorites functionality removed for simplified UX
        this.debugMode = false; // Enable for testing
        this.landmarks = []; // 캐시된 랜드마크 데이터
        this.googleMapsReady = false;
        
        this.init();
    }

    async init() {
        try {
            // UI 초기화 먼저 진행 (빠른 렌더링)
            this.initializeEventListeners();
            this.setupCardResizeObserver();
            
            // 스켈레톤 UI 표시
            this.renderSkeletonCards();
            
            // 서비스 초기화 (이미지 preload 제거)
            await initializeServices({
                preloadData: true,
                preloadImages: false  // 이미지는 나중에 lazy load
            });
            
            // 랜드마크 데이터 로드
            this.landmarks = await dataService.getAllLandmarks();
            
            // 실제 카드 렌더링
            await this.renderLocationCards();
            this.getCurrentLocation(); // Get location only once on load
            
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Seoul Explorer initialized successfully');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Seoul Explorer:', error);
            // fallback으로 기존 방식 사용
            this.initializeFallback();
        }
    }
    
    // fallback 초기화 (서비스 로드 실패 시)
    initializeFallback() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🔄 Using fallback initialization');
        }
        this.landmarks = []; // 빈 배열로 초기화
        this.initializeEventListeners();
        this.renderLocationCards();
        this.getCurrentLocation(); // Get location only once on load
        this.setupCardResizeObserver();
    }

    // 서비스에서 랜드마크 데이터를 가져오는 새로운 메서드
    async getSeoulLandmarks() {
        try {
            if (this.landmarks.length > 0) {
                return this.landmarks;
            }
            
            this.landmarks = await dataService.getAllLandmarks();
            return this.landmarks;
        } catch (error) {
            console.error('❌ Error loading landmarks from service:', error);
            return []; // 빈 배열 반환
        }
    }

    // Geolocation API Integration - One time on page load
    getCurrentLocation() {
        const locationStatus = document.getElementById('currentLocation');

        if (!navigator.geolocation) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.warn('⚠️ Geolocation not supported');
            }
            if (locationStatus) {
                locationStatus.textContent = 'Seoul, South Korea';
            }
            return;
        }

        // Show "Getting location..." on load
        if (locationStatus) {
            locationStatus.textContent = 'Getting your location...';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log('📍 Location obtained:', this.currentLocation);
                }
                this.handleLocationSuccess();
            },
            (error) => {
                console.error('❌ Location error:', error.code, error.message);
                this.handleLocationError(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }


    async handleLocationSuccess() {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');
        
        // Always try to get real Google Maps address
        if (locationStatus) {
            locationStatus.textContent = 'Getting address...';
            
            // Call updateLocationDisplay which handles retries
            await this.updateLocationDisplay();
        }
        
        // Update location info section (only if element exists)
        if (locationInfo) {
            try {
                const nearbyLocations = await this.findNearbyLocations();
                
                if (nearbyLocations.length > 0) {
                    locationInfo.innerHTML = `
                        <div class="success-state">
                            <h3>📍 Nearby Attractions</h3>
                            ${nearbyLocations.slice(0, 3).map(location => `
                                <div style="margin: 8px 0; padding: 8px; border-left: 3px solid #4caf50;">
                                    <strong>${location.name}</strong><br>
                                    <small>${location.distance} away • ${location.category}</small>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    locationInfo.innerHTML = `
                        <div class="success-state">
                            <h3>📍 Welcome to Seoul!</h3>
                            <p>Explore popular destinations below to start your Korean adventure.</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('❌ Error updating location info:', error);
                locationInfo.innerHTML = `
                    <div class="success-state">
                        <h3>📍 Welcome to Seoul!</h3>
                        <p>Explore popular destinations below to start your Korean adventure.</p>
                    </div>
                `;
            }
        }

        this.updateDistances();
    }

    handleLocationError(errorMessage) {
        const locationStatus = document.getElementById('currentLocation');
        const locationInfo = document.getElementById('locationInfo');
        
        // Show default location
        if (locationStatus) {
            locationStatus.textContent = 'Seoul, South Korea';
        }
        
        // Show error message
        if (locationInfo) {
            locationInfo.innerHTML = `
                <div class="error-state">
                    <h3>⚠️ Location Access Needed</h3>
                    <p>Enable location services to find nearby attractions and get personalized recommendations.</p>
                    <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 20px; margin-top: 10px; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }

    // Get English address from coordinates using reverse geocoding
    async getEnglishAddress(coordinates) {
        try {
            // Check if Google Maps API key is available
            if (!window.CONFIG || !CONFIG.GOOGLE_MAPS_API_KEY || CONFIG.GOOGLE_MAPS_API_KEY === 'your-api-key-here') {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.warn('Google Maps API key not configured, using default location');
                }
                return 'Seoul, South Korea';
            }

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&language=en&key=${CONFIG.GOOGLE_MAPS_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }
            
            const data = await response.json();
            
            if (data.status === 'OK' && data.results.length > 0) {
                // Use the formatted address from Google directly
                const formattedAddress = data.results[0].formatted_address;
                
                // Clean up the address - remove country if it's South Korea
                let cleanAddress = formattedAddress
                    .replace(/, South Korea$/, '')
                    .replace(/, Korea$/, '');
                
                // If address is too long, use a shorter version
                if (cleanAddress.length > 50) {
                    // Try to get neighborhood, district format
                    const parts = cleanAddress.split(',');
                    if (parts.length >= 2) {
                        cleanAddress = `${parts[0].trim()}, ${parts[1].trim()}`;
                    }
                }
                
                return cleanAddress || 'Seoul, South Korea';
            }
            
            throw new Error('No geocoding results found');
        } catch (error) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.warn('Reverse geocoding failed:', error);
            }
            return 'Seoul, South Korea';
        }
    }


    // Calculate distance between two coordinates
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    async findNearbyLocations() {
        if (!this.currentLocation) return [];
        
        try {
            // 서비스를 통해 가까운 랜드마크 가져오기
            const nearbyLandmarks = await dataService.getNearbyLandmarks(this.currentLocation, 10);
            return nearbyLandmarks.map(location => ({
                ...location,
                distance: location.distance ? `${location.distance.toFixed(1)} km` : '0 km'
            }));
        } catch (error) {
            console.error('❌ Error finding nearby locations:', error);
            // fallback으로 기존 방식 사용
            const landmarks = await this.getSeoulLandmarks();
            return landmarks
                .map(location => ({
                    ...location,
                    distance: this.calculateDistance(
                        this.currentLocation.lat,
                        this.currentLocation.lng,
                        location.coordinates.lat,
                        location.coordinates.lng
                    ).toFixed(1) + ' km'
                }))
                .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }
    }

    async updateDistances() {
        const locationCards = document.querySelectorAll('.location-card');
        
        try {
            const landmarks = await this.getSeoulLandmarks();
            
            locationCards.forEach(card => {
                const locationId = card.dataset.locationId;
                const location = landmarks.find(l => l.id === locationId);
                if (location && this.currentLocation) {
                    const distance = this.calculateDistance(
                        this.currentLocation.lat,
                        this.currentLocation.lng,
                        location.coordinates.lat,
                        location.coordinates.lng
                    ).toFixed(1);
                    
                    const distanceElement = card.querySelector('.distance-info');
                    if (distanceElement) {
                        distanceElement.textContent = `${distance} km away`;
                    }
                }
            });
        } catch (error) {
            console.error('❌ Error updating distances:', error);
        }
    }

    // Render location cards
    async renderLocationCards() {
        const locationsGrid = document.getElementById('locationsGrid');
        
        try {
            const landmarks = await this.getSeoulLandmarks();
            
            locationsGrid.innerHTML = landmarks.map(location => {
                return `
                    <button class="location-card" data-location-id="${location.id}" onclick="seoulExplorer.navigateToDetail('${location.id}')">
                        <div class="location-image">
                            ${location.image ? 
                                `<img src="${imageService.getLandmarkImage(location.image)}" 
                                     alt="${location.name}" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="icon-fallback" style="display:none;"><i class="${location.icon}"></i></div>` :
                                `<div class="icon-fallback"><i class="${location.icon}"></i></div>`
                            }
                        </div>
                        <div class="location-info">
                            <h3 class="location-name">${location.name}</h3>
                            <p class="location-korean">${location.nameKorean}</p>
                            <p class="location-description">${location.description}</p>
                            <div class="location-tags">
                                ${location.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                            <div class="distance-info">Calculating distance...</div>
                        </div>
                    </button>
                `;
            }).join('');
            
            // 이미지 fallback 처리 추가
            const images = locationsGrid.querySelectorAll('img');
            images.forEach(img => {
                imageService.addImageFallback(img);
            });
            
            // Apply dynamic image height adjustments after rendering
            this.adjustCardImageHeights();
            
            // Setup observers for new cards
            setTimeout(() => {
                this.observeLocationCards();
                // Run tests in debug mode
                if (this.debugMode) {
                    setTimeout(() => this.testTagScenarios(), 500);
                }
            }, 100);
            
        } catch (error) {
            console.error('❌ Error rendering location cards:', error);
            locationsGrid.innerHTML = '<p>Error loading locations. Please refresh the page.</p>';
        }
    }

    // Dynamic image height adjustment based on tag content
    adjustCardImageHeights() {
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            const cards = document.querySelectorAll('.location-card');
            
            cards.forEach(card => {
                this.adjustSingleCardHeight(card);
            });
        });
    }
    
    // Adjust height for a single card
    adjustSingleCardHeight(card) {
        const image = card.querySelector('.location-image');
        const info = card.querySelector('.location-info');
        const tags = card.querySelector('.location-tags');
        const distanceInfo = card.querySelector('.distance-info');
        
        if (!image || !info || !tags) return;
        
        // Temporarily reset image height to measure content
        image.style.height = 'auto';
        
        // Measure content dimensions
        const cardWidth = card.offsetWidth;
        const infoHeight = this.measureInfoContentHeight(info, tags, distanceInfo);
        
        // Calculate optimal image height
        const targetCardHeight = this.getTargetCardHeight(cardWidth);
        const optimalImageHeight = targetCardHeight - infoHeight;
        
        // Apply constraints and set height
        const finalHeight = this.clampImageHeight(optimalImageHeight, cardWidth);
        image.style.height = `${finalHeight}px`;
        
        // Debug logging (remove in production)
        if (this.debugMode) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`Card adjusted - Tags: ${tags.offsetHeight}px, Image: ${finalHeight}px`);
            }
        }
    }
    
    // Measure the total height of info content
    measureInfoContentHeight(info, tags, distanceInfo) {
        const padding = 33; // 15px + 18px padding from CSS
        const nameHeight = info.querySelector('.location-name')?.offsetHeight || 24;
        const koreanHeight = info.querySelector('.location-korean')?.offsetHeight || 20;
        const descHeight = info.querySelector('.location-description')?.offsetHeight || 36;
        const tagHeight = tags.offsetHeight;
        const distanceHeight = distanceInfo?.offsetHeight || 36;
        const gaps = 16; // Margins between elements
        
        return padding + nameHeight + koreanHeight + descHeight + tagHeight + distanceHeight + gaps;
    }
    
    // Get target card height based on viewport/container size
    getTargetCardHeight(cardWidth) {
        if (cardWidth <= 280) {
            return 320; // Mobile/small cards
        } else if (cardWidth <= 350) {
            return 340; // Medium cards
        } else {
            return 360; // Large cards
        }
    }
    
    // Clamp image height within acceptable bounds
    clampImageHeight(height, cardWidth) {
        let minHeight = 160;
        let maxHeight = 280;
        
        // Adjust constraints based on card size
        if (cardWidth <= 280) {
            minHeight = 140;
            maxHeight = 220;
        } else if (cardWidth >= 400) {
            minHeight = 180;
            maxHeight = 320;
        }
        
        return Math.max(minHeight, Math.min(maxHeight, height));
    }
    
    // Setup ResizeObserver for responsive card adjustments
    setupCardResizeObserver() {
        if (!window.ResizeObserver) {
            // Fallback for older browsers
            window.addEventListener('resize', this.debounce(() => {
                this.adjustCardImageHeights();
            }, 250));
            return;
        }
        
        this.cardResizeObserver = new ResizeObserver(entries => {
            // Debounce resize adjustments to prevent excessive calculations
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                entries.forEach(entry => {
                    if (entry.target.classList.contains('location-card')) {
                        this.adjustSingleCardHeight(entry.target);
                    }
                });
            }, 100);
        });
        
        // Observe all location cards
        this.observeLocationCards();
    }
    
    // Observe location cards for resize changes
    observeLocationCards() {
        const cards = document.querySelectorAll('.location-card');
        cards.forEach(card => {
            if (this.cardResizeObserver) {
                this.cardResizeObserver.observe(card);
            }
        });
    }
    
    // Debounce utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Test function to validate different tag combinations
    testTagScenarios() {
        if (!this.debugMode) return;
        
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🧪 Testing Dynamic Image Heights:');
        }
        
        const cards = document.querySelectorAll('.location-card');
        cards.forEach((card, index) => {
            const image = card.querySelector('.location-image');
            const tags = card.querySelector('.location-tags');
            const tagCount = tags.children.length;
            const tagHeight = tags.offsetHeight;
            const imageHeight = parseInt(image.style.height);
            const locationName = card.querySelector('.location-name').textContent;
            
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`Card ${index + 1} (${locationName}):`, {
                tags: tagCount,
                tagHeight: `${tagHeight}px`,
                imageHeight: `${imageHeight}px`,
                tagLines: Math.ceil(tagHeight / 28)
            });
        });
    }
    
    // Cleanup method for observers
    cleanup() {
        if (this.cardResizeObserver) {
            this.cardResizeObserver.disconnect();
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.stopAutoLocationTracking();
    }

    // Navigate to detail page
    navigateToDetail(locationId) {
        // Navigate to detail.html with location parameter
        window.location.href = `detail.html?location=${locationId}`;
    }


    // Initialize event listeners
    initializeEventListeners() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🎯 Initializing event listeners...');
        }

        // Start automatic location tracking (no manual refresh needed)
        this.startAutoLocationTracking();

        // Bottom navigation with enhanced debugging
        const navItems = document.querySelectorAll('.nav-item');
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log(`📱 Found ${navItems.length} navigation items`);
        }
        
        navItems.forEach((item, index) => {
            const section = item.dataset.section;
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`📍 Nav item ${index}: section="${section}"`);
            }
            
            item.addEventListener('click', (e) => {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log('🔘 Navigation item clicked:', section);
                }
                
                try {
                    // Update active state
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    e.target.closest('.nav-item').classList.add('active');
                    
                    // Get section from clicked element
                    const clickedSection = e.target.closest('.nav-item').dataset.section;
                    if (!window.CONFIG?.IS_PRODUCTION) {
                        console.log('🎯 Navigating to section:', clickedSection);
                    }
                    
                    // Handle navigation with error handling
                    this.handleNavigation(clickedSection);
                    
                } catch (error) {
                    console.error('❌ Navigation error:', error);
                    
                    // Force map page navigation if it was a map click
                    if (section === 'map' || clickedSection === 'map') {
                        if (!window.CONFIG?.IS_PRODUCTION) {
                            console.log('🗺️ Forcing map page navigation...');
                        }
                        this.forceMapNavigation();
                    }
                }
            });
        });

        // Add additional debugging for map button specifically
        const mapButton = document.querySelector('.nav-item[data-section="map"]');
        if (mapButton) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Map button found and listener attached');
            }
            
            // Add additional click listener as backup
            mapButton.addEventListener('click', (e) => {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log('🗺️ Map button clicked (backup listener)');
                }
                e.preventDefault();
                this.forceMapNavigation();
            }, { once: false, passive: false });
            
        } else {
            console.error('❌ Map button not found!');
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('🔍 Available nav items:', 
                Array.from(navItems).map(item => ({
                    section: item.dataset.section,
                    text: item.textContent.trim()
                }))
            );
        }
    }

    // Navigation functionality

    async getDirections(locationId) {
        try {
            const landmarks = await this.getSeoulLandmarks();
            const location = landmarks.find(l => l.id === locationId);
            if (!location) {
                console.error('❌ Location not found:', locationId);
                return;
            }

            const destination = `${location.coordinates.lat},${location.coordinates.lng}`;
            const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
            
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error getting directions:', error);
        }
    }

    handleNavigation(section) {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🎯 handleNavigation called with section:', section);
        }
        
        try {
            switch(section) {
                case 'map':
                    this.openMapPage();
                    break;
                default:
                    this.showExplore();
            }
        } catch (error) {
            console.error('❌ Navigation handler error:', error);
            
            // Fallback navigation
            if (section === 'map') {
                this.forceMapNavigation();
            }
        }
    }

    // showFavorites functionality removed for simplified UX

    openMapPage() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🗺️ Opening map page...');
        }
        
        try {
            // Show loading state immediately
            this.showMapLoadingState();
            
            // Multiple navigation attempts for reliability
            this.attemptMapNavigation();
            
        } catch (error) {
            console.error('❌ openMapPage error:', error);
            this.forceMapNavigation();
        }
    }

    attemptMapNavigation() {
        console.log('📍 Attempting map navigation...');
        
        // Method 1: Direct navigation
        try {
            window.location.href = 'src/pages/map.html';
            return;
        } catch (error) {
            console.warn('⚠️ Direct navigation failed:', error);
        }

        // Method 2: Using window.location.assign
        try {
            window.location.assign('map.html');
            return;
        } catch (error) {
            console.warn('⚠️ location.assign failed:', error);
        }

        // Method 3: Relative path
        try {
            window.location.href = './map.html';
            return;
        } catch (error) {
            console.warn('⚠️ Relative path failed:', error);
        }

        // Method 4: Full path
        try {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath + '/map.html';
            return;
        } catch (error) {
            console.warn('⚠️ Full path failed:', error);
        }

        // Final fallback
        this.forceMapNavigation();
    }

    forceMapNavigation() {
        console.log('🚨 Force navigation to map page...');
        
        try {
            // Show user that navigation is happening
            this.showMapLoadingState();
            
            // Try different navigation methods
            const navigationMethods = [
                () => window.location.replace('map.html'),
                () => window.location.href = '/src/pages/map.html',
                () => window.location.assign('/src/pages/map.html'),
                () => window.location.href = 'map.html',
                () => {
                    // Create and click a link element
                    const link = document.createElement('a');
                    link.href = 'map.html';
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            ];

            // Try each method with a delay
            navigationMethods.forEach((method, index) => {
                setTimeout(() => {
                    try {
                        console.log(`🔄 Trying navigation method ${index + 1}...`);
                        method();
                    } catch (error) {
                        console.warn(`⚠️ Navigation method ${index + 1} failed:`, error);
                    }
                }, index * 100);
            });

        } catch (error) {
            console.error('❌ All navigation methods failed:', error);
            
            // Last resort: Alert user
            alert('Unable to open map page. Please try refreshing the page.');
        }
    }

    showMapLoadingState() {
        console.log('⏳ Showing map loading state...');
        
        try {
            // Show visual feedback to user
            const navButton = document.querySelector('.nav-item[data-section="map"]');
            if (navButton) {
                const originalContent = navButton.innerHTML;
                navButton.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Loading...</span>
                `;
                
                // Restore original content after timeout
                setTimeout(() => {
                    navButton.innerHTML = originalContent;
                }, 3000);
            }

            // Optional: Show overlay
            this.showNavigationOverlay();

        } catch (error) {
            console.warn('⚠️ Could not show loading state:', error);
        }
    }

    showNavigationOverlay() {
        try {
            // Create loading overlay
            const overlay = document.createElement('div');
            overlay.id = 'navigation-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(102, 126, 234, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-family: inherit;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                    <h3 style="margin: 0 0 8px 0;">Opening Seoul Map</h3>
                    <p style="margin: 0; opacity: 0.8;">Please wait...</p>
                </div>
            `;

            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(overlay);

            // Remove overlay after timeout
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 5000);

        } catch (error) {
            console.warn('⚠️ Could not show overlay:', error);
        }
    }

    async showExplore() {
        const sectionTitle = document.querySelector('.locations-section h2');
        if (sectionTitle) sectionTitle.textContent = 'Popular Seoul Destinations';
        await this.renderLocationCards();
        await this.updateDistances();
        this.addGuideToExplore();
    }

    // Enhanced automatic location tracking system
    startAutoLocationTracking() {
        console.log('🎯 Starting enhanced location tracking system');
        
        // Initialize tracking state
        this.locationTrackingState = {
            isActive: true,
            retryCount: 0,
            maxRetries: 5,
            lastUpdate: null,
            trackingMethod: 'initializing'
        };
        
        // Initial location request with enhanced error handling
        this.performLocationUpdate();
        
        // Set up multi-layer tracking system
        this.setupPeriodicTracking();
        this.setupWatchPositionTracking();
        
        // Setup health check to ensure tracking remains active
        this.setupLocationHealthCheck();
    }

    // Unified location update method
    async performLocationUpdate() {
        if (!this.locationTrackingState?.isActive) return;
        
        try {
            console.log('📍 Performing location update...');
            this.updateLocationStatus('Updating location...', 'info');
            
            const position = await this.getLocationWithRetry();
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };
            
            // Always update if this is first location or significant movement
            if (this.shouldUpdateLocation(newLocation)) {
                await this.processLocationUpdate(newLocation);
            }
            
            this.locationTrackingState.retryCount = 0; // Reset on success
            this.locationTrackingState.lastUpdate = Date.now();
            
        } catch (error) {
            console.error('❌ Location update failed:', error);
            this.handleLocationTrackingError(error);
        }
    }

    // Enhanced geolocation with retry logic
    getLocationWithRetry(timeoutMs = 10000) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: timeoutMs,
                maximumAge: 30000 // 30 seconds cache
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Location obtained successfully');
                    resolve(position);
                },
                (error) => {
                    console.warn('⚠️ Geolocation error:', error.message);
                    reject(error);
                },
                options
            );
        });
    }

    // Process and update location with enhanced address resolution
    async processLocationUpdate(newLocation) {
        this.currentLocation = newLocation;
        
        try {
            // Get English address
            const address = await this.getEnglishAddress(newLocation);
            
            // Update UI
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = address;
            }
            
            // Update distances for landmarks
            this.updateDistances();
            
            // Update status
            this.updateLocationStatus('Location updated', 'success');
            console.log(`📍 Location updated: ${address}`);
            
        } catch (error) {
            console.error('Address resolution failed:', error);
            // Fallback to coordinates display
            const locationStatus = document.getElementById('currentLocation');
            if (locationStatus) {
                locationStatus.textContent = `Seoul (${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)})`;
            }
        }
    }

    // Setup periodic tracking as fallback
    setupPeriodicTracking() {
        this.periodicInterval = setInterval(() => {
            if (this.locationTrackingState?.isActive) {
                console.log('⏰ Periodic location check');
                this.performLocationUpdate();
            }
        }, 45000); // Every 45 seconds
    }

    // Setup watchPosition for real-time tracking
    setupWatchPositionTracking() {
        if (!navigator.geolocation) return;
        
        this.watchPositionId = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                
                if (this.shouldUpdateLocation(newLocation)) {
                    console.log('👁️ WatchPosition detected location change');
                    this.processLocationUpdate(newLocation);
                }
            },
            (error) => {
                console.warn('⚠️ WatchPosition error:', error.message);
                this.locationTrackingState.trackingMethod = 'periodic_only';
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 45000
            }
        );
    }

    // Health check to ensure tracking stays active
    setupLocationHealthCheck() {
        this.healthCheckInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceLastUpdate = now - (this.locationTrackingState?.lastUpdate || 0);
            
            // If no update in 2 minutes, restart tracking
            if (timeSinceLastUpdate > 120000) {
                console.log('🔄 Location health check: restarting tracking');
                this.restartLocationTracking();
            }
        }, 60000); // Check every minute
    }

    // Restart location tracking
    restartLocationTracking() {
        this.stopAutoLocationTracking();
        setTimeout(() => {
            this.startAutoLocationTracking();
        }, 2000);
    }

    // Enhanced location change detection
    shouldUpdateLocation(newLocation) {
        if (!this.currentLocation) return true;
        
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            newLocation.lat,
            newLocation.lng
        );
        
        const timeDiff = newLocation.timestamp - (this.currentLocation.timestamp || 0);
        
        // Update if moved >30m OR if >2 minutes since last update
        return distance > 0.03 || timeDiff > 120000;
    }

    // Handle tracking errors with retry logic
    handleLocationTrackingError(error) {
        console.error('Location tracking error:', error);
        this.locationTrackingState.retryCount++;
        
        if (this.locationTrackingState.retryCount >= this.locationTrackingState.maxRetries) {
            console.error('❌ Max location retries reached');
            this.updateLocationStatus('Location unavailable', 'error');
            return;
        }
        
        // Exponential backoff retry
        const retryDelay = Math.pow(2, this.locationTrackingState.retryCount) * 1000;
        console.log(`🔄 Retrying location update in ${retryDelay}ms (attempt ${this.locationTrackingState.retryCount})`);
        
        setTimeout(() => {
            this.performLocationUpdate();
        }, retryDelay);
    }

    // Update location status with visual feedback
    updateLocationStatus(message, type = 'info') {
        const locationStatus = document.getElementById('currentLocation');
        if (!locationStatus) return;
        
        if (type !== 'success') {
            locationStatus.textContent = message;
            
            // Revert to normal after delay for non-success messages
            if (type === 'info') {
                setTimeout(() => {
                    const currentText = locationStatus.textContent;
                    if (currentText === message) {
                        locationStatus.textContent = this.getLastKnownLocation();
                    }
                }, 3000);
            }
        }
    }

    // Get last known location display
    getLastKnownLocation() {
        if (this.currentLocation) {
            return `Seoul (${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)})`;
        }
        return 'Seoul, South Korea';
    }

    // Check if location has changed significantly 
    hasLocationChanged(newLocation) {
        if (!this.currentLocation) return true;
        
        const distance = this.calculateDistance(
            this.currentLocation.lat,
            this.currentLocation.lng,
            newLocation.lat,
            newLocation.lng
        );
        
        // Update if moved more than 50 meters
        return distance > 0.05; // 0.05 km = 50 meters
    }

    // Enhanced cleanup for location tracking
    stopAutoLocationTracking() {
        console.log('🛑 Stopping location tracking');
        
        if (this.locationTrackingState) {
            this.locationTrackingState.isActive = false;
        }
        
        // Clear all intervals and watchers
        if (this.periodicInterval) {
            clearInterval(this.periodicInterval);
            this.periodicInterval = null;
        }
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        
        if (this.locationUpdateInterval) {
            clearInterval(this.locationUpdateInterval);
            this.locationUpdateInterval = null;
        }
        
        if (this.watchPositionId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.watchPositionId = null;
        }
    }

    // 스켈레톤 UI 렌더링
    renderSkeletonCards() {
        const locationsGrid = document.getElementById('locationsGrid');
        const skeletonCount = 6; // 처음에 보여줄 스켈레톤 카드 수
        
        const skeletonHTML = Array(skeletonCount).fill(0).map(() => `
            <div class="location-card skeleton-card">
                <div class="skeleton-image"></div>
                <div class="location-info">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-subtitle"></div>
                    <div class="skeleton-description"></div>
                    <div class="skeleton-tags">
                        <span class="skeleton-tag"></span>
                        <span class="skeleton-tag"></span>
                        <span class="skeleton-tag"></span>
                    </div>
                </div>
            </div>
        `).join('');
        
        locationsGrid.innerHTML = skeletonHTML;
    }
    
    // [Deprecated] 이미지 lazy loading 설정 - maps와 동일한 방식으로 직접 로드하도록 변경됨
    // setupImageLazyLoading() {
    //     // 더 이상 사용하지 않음 - 이미지를 직접 로드
    // }
    
    addGuideToExplore() {
        const locationsGrid = document.getElementById('locationsGrid');
        
        // Add guide section to the bottom of locations grid
        const guideSection = document.createElement('div');
        guideSection.className = 'guide-section';
        guideSection.style.cssText = 'grid-column: 1/-1; margin-top: 40px;';
        
        guideSection.innerHTML = `
            <div class="guide-content" style="background: #f8f9fa; padding: 25px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
                <h3 style="color: #333; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-book" style="color: #667eea;"></i>
                    Seoul Travel Guide
                </h3>
                
                <div style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-won-sign"></i> Currency & Payments
                        </h4>
                        <p>Korean Won (KRW) • Credit cards widely accepted • T-money card for subway</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-subway"></i> Getting Around
                        </h4>
                        <p>Subway system covers most attractions • Download "Citymapper" or "Subway Korea" apps • Buses have English announcements</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-utensils"></i> Food Culture
                        </h4>
                        <p>Try Korean BBQ, bibimbap, and street food • Tipping is not expected • Many restaurants don't accept credit cards</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-mobile-alt"></i> Essential Apps
                        </h4>
                        <p>Google Translate (with camera feature) • Papago (Naver translator) • KakaoMap for navigation</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-hands"></i> Cultural Etiquette
                        </h4>
                        <p>Bow when greeting • Remove shoes when entering homes • Both hands when giving/receiving items</p>
                    </div>
                    
                    <div class="guide-item">
                        <h4 style="color: #667eea; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-info-circle"></i> Travel Tips
                        </h4>
                        <p>Learn basic Korean phrases • Download offline maps • Carry cash for local markets • Respect quiet hours</p>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing guide section if present
        const existingGuide = locationsGrid.querySelector('.guide-section');
        if (existingGuide) {
            existingGuide.remove();
        }
        
        locationsGrid.appendChild(guideSection);
    }
}

// Add CSS for modal content
const additionalCSS = `
.location-detail-header h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 5px;
}

.korean-name {
    font-size: 1rem;
    color: #666;
    font-weight: 500;
}

.description-section {
    margin: 20px 0;
}

.description-section h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.practical-info {
    margin: 25px 0;
}

.practical-info h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.1rem;
}

.info-grid {
    display: grid;
    gap: 15px;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.info-item i {
    color: #667eea;
    margin-top: 2px;
    width: 20px;
}

.tips-section, .cultural-tips {
    margin: 20px 0;
}

.tips-section h3, .cultural-tips h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.tips-section ul {
    padding-left: 20px;
}

.tips-section li {
    margin: 8px 0;
    line-height: 1.4;
}

.cultural-tips em {
    color: #666;
    font-style: italic;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.favorite-btn, .directions-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.favorite-btn {
    background: #ff6b6b;
    color: white;
}

.directions-btn {
    background: #667eea;
    color: white;
}

.favorite-btn:hover, .directions-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
`;

// Add the additional CSS to the document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Add method to update location display
SeoulExplorer.prototype.updateLocationDisplay = async function() {
    if (!this.currentLocation) return;
    
    const locationStatus = document.getElementById('currentLocation');
    if (!locationStatus) return;
    
    if (window.google && window.google.maps) {
        try {
            const address = await this.getGoogleMapsAddress(this.currentLocation.lat, this.currentLocation.lng);
            locationStatus.textContent = address;
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('📍 Updated location display:', address);
            }
        } catch (error) {
            console.error('Error updating location display:', error);
            // Retry after delay
            setTimeout(() => this.updateLocationDisplay(), 2000);
        }
    } else {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('⏳ Google Maps not ready, retrying...');
        }
        setTimeout(() => this.updateLocationDisplay(), 1000);
    }
};

// Called when Google Maps is ready
SeoulExplorer.prototype.onGoogleMapsReady = function() {
    if (!window.CONFIG?.IS_PRODUCTION) {
        console.log('🗺️ Google Maps ready in explorer');
    }
    this.googleMapsReady = true;
    // Update location display immediately
    if (this.currentLocation) {
        this.updateLocationDisplay();
    }
};

// Add Google Maps address method to SeoulExplorer prototype
SeoulExplorer.prototype.getGoogleMapsAddress = async function(lat, lng) {
    return new Promise((resolve, reject) => {
        if (!window.google || !window.google.maps) {
            reject('Google Maps not loaded');
            return;
        }
        
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: lat, lng: lng };
        
        geocoder.geocode({ location: latlng, language: 'en', region: 'US' }, (results, status) => {
            if (status === 'OK' && results[0]) {
                // Get formatted address and split by comma
                const fullAddress = results[0].formatted_address;
                const addressParts = fullAddress.split(',').map(part => part.trim());
                
                // Filter out country names and postal codes
                const filteredParts = addressParts.filter(part => {
                    // Remove "South Korea", "Republic of Korea", postal codes, and coordinate-like strings
                    return !part.includes('South Korea') && 
                           !part.includes('Republic of Korea') &&
                           !part.includes('Korea') &&
                           !/^\d{5}/.test(part) && // Remove postal codes
                           !/\(\d+\.\d+,\s*\d+\.\d+\)/.test(part) && // Remove coordinates
                           !/^[\d\s-]+$/.test(part); // Remove numbers only
                });
                
                // Take only the first 3 meaningful parts
                let formattedAddress = '';
                if (filteredParts.length > 0) {
                    // Reverse the order if needed (sometimes address comes in reverse)
                    if (filteredParts[0] && /^\d+/.test(filteredParts[0])) {
                        // If first part starts with numbers (street number), reverse
                        formattedAddress = filteredParts.slice(0, 3).reverse().join(', ');
                    } else {
                        // Otherwise take first 3 parts as is
                        formattedAddress = filteredParts.slice(0, 3).join(', ');
                    }
                }
                
                // Clean up the address - remove any remaining coordinates or numbers
                formattedAddress = formattedAddress.replace(/\s*\(\d+\.\d+,\s*\d+\.\d+\)\s*/g, '');
                formattedAddress = formattedAddress.replace(/,\s*,/g, ','); // Remove double commas
                formattedAddress = formattedAddress.trim();
                
                // Fallback to simple format if parsing fails
                if (!formattedAddress || formattedAddress.length < 5) {
                    formattedAddress = 'Seoul, South Korea';
                }
                
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log('✅ Formatted address:', formattedAddress);
                }
                resolve(formattedAddress);
            } else {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.warn('⚠️ Geocoding failed:', status);
                }
                reject('Geocoding failed');
            }
        });
    });
};

// Add fallback getEnglishAddress method
SeoulExplorer.prototype.getEnglishAddress = async function(coordinates) {
    // Try Google Maps first if available
    if (window.google && window.google.maps) {
        try {
            return await this.getGoogleMapsAddress(coordinates.lat, coordinates.lng);
        } catch (error) {
            console.error('Error getting address:', error);
        }
    }
    // Fallback
    return 'Seoul, South Korea';
};

// Initialize the app
let seoulExplorer;
document.addEventListener('DOMContentLoaded', () => {
    seoulExplorer = new SeoulExplorer();
    // Make it globally accessible for Google Maps callback
    window.seoulExplorer = seoulExplorer;
});