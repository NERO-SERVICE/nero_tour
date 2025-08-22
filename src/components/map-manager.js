// Seoul Map Manager - Dedicated map functionality with Custom Markers
import { dataService, imageService } from '../services/index.js';
import geolocationService from '../services/geolocation-service.js';

class SeoulMapManager {
    constructor() {
        this.map = null;
        this.userLocationMarker = null;
        this.attractionMarkers = [];
        this.currentLocation = null;
        this.trafficLayer = null;
        this.isTrafficVisible = false;
        this.isFullscreen = false;
        this.landmarks = []; // 캐시된 랜드마크 데이터
        this.placesService = null; // Google Places 서비스
        this.searchMarkers = []; // 검색 결과 마커들
        
        this.init();
    }

    async init() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🗺️ Initializing Seoul Map Manager...');
        }
        
        try {
            // 서비스 초기화 및 랜드마크 데이터 로드
            this.landmarks = await dataService.getAllLandmarks();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Landmarks data loaded for map');
            }
        } catch (error) {
            console.error('❌ Failed to load landmarks data:', error);
            // Firebase에서 데이터를 불러올 수 없는 경우 빈 배열 사용
            this.landmarks = [];
        }
        
        // Get user location once on load
        this.getCurrentLocation();
        
        // Setup control event listeners
        this.setupControlListeners();
        
        // Setup search functionality
        this.setupSearchListeners();
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
            return [];
        }
    }
    

    // Show bottom sheet with landmark information and image gallery
    showLandmarkBottomSheet(landmark) {
        // Remove existing bottom sheet if any
        const existingBottomSheet = document.getElementById('landmarkBottomSheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        // Create bottom sheet HTML with improved layout
        const bottomSheetHTML = `
            <div id="landmarkBottomSheet" class="landmark-bottom-sheet">
                <div class="bottom-sheet-backdrop" onclick="this.parentElement.remove()"></div>
                <div class="bottom-sheet-content">
                    <!-- Header with drag handle -->
                    <div class="bottom-sheet-header">
                        <div class="drag-handle"></div>
                        <button class="close-button" 
                                onclick="this.closest('.landmark-bottom-sheet').remove()"
                                aria-label="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- Title and Description First -->
                    <div class="landmark-info-top">
                        <div class="landmark-title-section">
                            <h2 class="landmark-name">${landmark.name}</h2>
                            <p class="landmark-name-korean">${landmark.nameKorean}</p>
                        </div>
                        <p class="landmark-description">${landmark.description}</p>
                        
                        <!-- Distance Badge -->
                        <div class="distance-badge">
                            <i class="fas fa-location-dot"></i>
                            <span>${this.currentLocation ? 
                                this.calculateDistance(
                                    this.currentLocation.lat,
                                    this.currentLocation.lng,
                                    landmark.coordinates.lat,
                                    landmark.coordinates.lng
                                ).toFixed(1) + ' km' : 'Distance unknown'
                            }</span>
                        </div>
                    </div>
                    
                    <!-- Image Section with 5:3 ratio -->
                    <div class="landmark-image-container">
                        ${landmark.image ? 
                            `<img src="${imageService.getLandmarkImage(landmark.image)}" 
                                  alt="${landmark.name}" 
                                  class="landmark-image"
                                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                             <div class="image-fallback" style="display: none;">
                                 <span class="fallback-icon">${this.getCategoryIcon(landmark.category)}</span>
                             </div>` :
                            `<div class="image-fallback">
                                 <span class="fallback-icon">${this.getCategoryIcon(landmark.category)}</span>
                             </div>`
                        }
                    </div>
                    
                    <!-- Tags -->
                    <div class="landmark-tags">
                        ${landmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="action-btn secondary" onclick="seoulMapManager.getDirections('${landmark.id}')">
                            <i class="fas fa-route"></i>
                            <span>Directions</span>
                        </button>
                        <button class="action-btn primary" onclick="window.location.href='detail.html?location=${landmark.id}'">
                            <i class="fas fa-circle-info"></i>
                            <span>Details</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .landmark-bottom-sheet {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                max-width: 414px;
                margin: 0 auto;
            }
            
            .bottom-sheet-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .bottom-sheet-content {
                position: relative;
                width: 100%;
                max-height: 85vh;
                background: white;
                border-radius: 24px 24px 0 0;
                box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.3s ease-out;
                overflow-y: auto;
                overflow-x: hidden;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            .bottom-sheet-header {
                position: sticky;
                top: 0;
                background: white;
                padding: 12px 20px 8px;
                text-align: center;
                z-index: 10;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .drag-handle {
                width: 48px;
                height: 5px;
                background: #e0e0e0;
                border-radius: 3px;
                margin: 0 auto 8px;
            }
            
            .close-button {
                position: absolute;
                top: 12px;
                right: 16px;
                width: 32px;
                height: 32px;
                background: #f5f5f5;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #666;
                transition: all 0.2s ease;
            }
            
            .close-button:hover {
                background: #e8e8e8;
                transform: scale(1.05);
            }
            
            .landmark-info-top {
                padding: 20px 20px 16px;
                background: white;
            }
            
            .landmark-title-section {
                margin-bottom: 12px;
            }
            
            .landmark-name {
                font-size: 24px;
                font-weight: 700;
                color: #1a1a1a;
                margin: 0 0 4px 0;
                line-height: 1.2;
            }
            
            .landmark-name-korean {
                font-size: 16px;
                color: #666;
                margin: 0 0 12px 0;
            }
            
            .landmark-description {
                font-size: 15px;
                line-height: 1.6;
                color: #444;
                margin: 0 0 12px 0;
            }
            
            .distance-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
            }
            
            .distance-badge i {
                font-size: 12px;
            }
            
            .landmark-image-container {
                width: calc(100% - 40px);
                margin: 0 20px 16px;
                aspect-ratio: 5/3;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                background: #f0f0f0;
            }
            
            .landmark-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .image-fallback {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .fallback-icon {
                font-size: 48px;
                color: white;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            
            .gallery-indicators {
                position: absolute;
                bottom: 8px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 6px;
                z-index: 10;
            }
            
            .indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transition: all 0.2s ease;
            }
            
            .indicator.active {
                background: white;
                transform: scale(1.2);
            }
            
            .landmark-info {
                padding: 20px;
                max-height: calc(60vh - 200px);
                overflow-y: auto;
            }
            
            .landmark-header {
                margin-bottom: 16px;
            }
            
            .landmark-name {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin: 0 0 4px 0;
            }
            
            .landmark-name-korean {
                font-size: 1rem;
                color: #666;
                margin: 0 0 16px 0;
            }
            
            .landmark-description {
                font-size: 1rem;
                line-height: 1.6;
                color: #555;
                margin-bottom: 16px;
            }
            
            .landmark-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 0 20px;
                margin-bottom: 20px;
                justify-content: center;
            }
            
            .tag {
                background: #f3f4f6;
                color: #4b5563;
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
            }
            
            .action-buttons {
                display: flex;
                gap: 10px;
                padding: 20px;
                padding-bottom: 28px;
                background: white;
            }
            
            .action-btn {
                flex: 1;
                padding: 16px 20px;
                border: none;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                min-height: 52px;
                position: relative;
                overflow: hidden;
                -webkit-tap-highlight-color: transparent;
            }
            
            .action-btn i {
                font-size: 18px;
            }
            
            .action-btn span {
                font-weight: 600;
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
            }
            
            .action-btn.primary:active {
                transform: scale(0.97);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
            }
            
            .action-btn.secondary {
                background: white;
                color: #666;
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .action-btn.secondary:active {
                transform: scale(0.97);
                background: #f5f5f5;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
            }
            
            @media (hover: hover) {
                .action-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
                }
                
                .action-btn.secondary:hover {
                    background: #fafafa;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }
            }
        `;

        // Add styles and bottom sheet to page
        document.head.appendChild(styleSheet);
        document.body.appendChild(document.createElement('div'));
        document.body.lastElementChild.innerHTML = bottomSheetHTML;
        
        // Add touch gesture support for closing bottom sheet
        this.addBottomSheetGestures();
        
        // Initialize image gallery interactions
        this.initializeImageGallery(landmark.id);
        
        // Add enhanced touch interactions for floating close button
        this.setupFloatingCloseButton();
    }

    // Add touch gesture support for bottom sheet
    addBottomSheetGestures() {
        const bottomSheet = document.getElementById('landmarkBottomSheet');
        const content = bottomSheet?.querySelector('.bottom-sheet-content');
        const dragHandle = bottomSheet?.querySelector('.drag-handle');
        
        if (!bottomSheet || !content || !dragHandle) return;

        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let initialHeight = 0;

        // Touch start
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
            initialHeight = content.offsetHeight;
            isDragging = true;
            content.style.transition = 'none';
        };

        // Touch move
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) { // Only allow downward dragging
                const newHeight = Math.max(initialHeight - deltaY, 200);
                content.style.height = `${newHeight}px`;
            }
        };

        // Touch end
        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            content.style.transition = 'all 0.3s ease-out';
            
            const deltaY = currentY - startY;
            
            // If dragged down more than 100px, close the bottom sheet
            if (deltaY > 100) {
                bottomSheet.remove();
            } else {
                // Snap back to original position
                content.style.height = 'auto';
            }
        };

        // Add event listeners
        dragHandle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        // Cleanup function
        const cleanup = () => {
            dragHandle.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        // Store cleanup function for later use
        bottomSheet.addEventListener('remove', cleanup);
    }

    // Setup floating close button interactions
    setupFloatingCloseButton() {
        const closeButton = document.querySelector('.floating-close-button');
        if (!closeButton) return;

        // Add touch feedback
        closeButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeButton.style.transform = 'scale(0.92)';
            closeButton.style.transition = 'transform 0.1s ease';
        });

        closeButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeButton.style.transform = 'scale(1)';
            closeButton.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Trigger click after animation
            setTimeout(() => {
                closeButton.click();
            }, 100);
        });

        closeButton.addEventListener('touchcancel', (e) => {
            closeButton.style.transform = 'scale(1)';
            closeButton.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    // Add image gallery interactions (for future multiple images)
    initializeImageGallery(landmarkId) {
        const gallery = document.getElementById(`imageGallery-${landmarkId}`);
        const indicators = document.getElementById(`galleryIndicators-${landmarkId}`);
        
        if (!gallery || !indicators) return;

        let currentIndex = 0;
        const items = gallery.querySelectorAll('.gallery-item');
        const indicatorDots = indicators.querySelectorAll('.indicator');

        // Update indicators
        const updateIndicators = (index) => {
            indicatorDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Handle scroll
        gallery.addEventListener('scroll', () => {
            const scrollLeft = gallery.scrollLeft;
            const itemWidth = gallery.offsetWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateIndicators(currentIndex);
            }
        });

        // Handle indicator clicks
        indicatorDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                gallery.scrollTo({
                    left: index * gallery.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Create simple icon-based marker with purple gradient
    createCustomMarkerIcon(landmark) {        
        const categoryIcon = this.getCategoryIcon(landmark.category);
        
        // Larger mobile-optimized pin with purple gradient border
        const svgMarker = `
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="56" viewBox="0 0 70 56">
                <defs>
                    <linearGradient id="purpleGradient-${landmark.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#aa6dd8;stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadow-${landmark.id}" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.4)"/>
                    </filter>
                </defs>
                
                <!-- Outer gradient border circle -->
                <circle cx="35" cy="28" r="26" fill="url(#purpleGradient-${landmark.id})" filter="url(#shadow-${landmark.id})" opacity="1"/>
                
                <!-- Inner white circle -->
                <circle cx="35" cy="28" r="22" fill="white"/>
                
                <!-- Inner gradient background -->
                <circle cx="35" cy="28" r="19" fill="url(#purpleGradient-${landmark.id})" opacity="0.15"/>
                
                <!-- Category icon -->
                <text x="35" y="36" text-anchor="middle" fill="#667eea" font-size="20" font-family="system-ui" font-weight="600">${categoryIcon}</text>
            </svg>
        `;

        return {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
            scaledSize: new google.maps.Size(70, 56),
            anchor: new google.maps.Point(35, 28)
        };
    }

    // Get category icon for markers
    getCategoryIcon(category) {
        const icons = {
            'historical': '🏛️',
            'landmark': '🗼', 
            'shopping': '🛍️',
            'modern': '🏢',
            'cultural': '🏘️',
            'default': '📍'
        };
        return icons[category] || icons.default;
    }

    // Add markers for Seoul attractions with custom icons
    async addAttractionMarkers() {
        if (!this.map) return;

        try {
            const landmarks = await this.getSeoulLandmarks();
            
            landmarks.forEach(landmark => {
                // Create simple icon-based marker
                const markerIcon = this.createCustomMarkerIcon(landmark);
                
                const marker = new google.maps.Marker({
                    position: landmark.coordinates,
                    map: this.map,
                    title: landmark.name,
                    icon: markerIcon,
                    zIndex: 100
                });

                // Store marker reference with landmark data
                this.attractionMarkers.push({
                    marker: marker,
                    landmark: landmark
                });

                // Add click listener to show bottom sheet instead of info window
                marker.addListener('click', () => {
                    this.showLandmarkBottomSheet(landmark);
                });
            });

            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`✅ Added ${landmarks.length} attraction markers with icon-based pins`);
            }
        } catch (error) {
            console.error('❌ Error adding attraction markers:', error);
        }
    }

    // Rest of the methods remain the same...
    // Convert coordinates to address using Google Geocoding API
    async getAddressFromCoordinates(lat, lng) {
        try {
            const geocoder = new google.maps.Geocoder();
            const latlng = { lat: lat, lng: lng };
            
            return new Promise((resolve) => {
                geocoder.geocode({ location: latlng, language: 'en' }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        // Get formatted address and split by comma
                        const fullAddress = results[0].formatted_address;
                        const addressParts = fullAddress.split(',').map(part => part.trim());
                        
                        // Filter out country names, postal codes, and coordinates
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
                            console.warn('⚠️ Geocoding failed, using default');
                        }
                        resolve('Seoul, South Korea');
                    }
                });
            });
        } catch (error) {
            console.error('❌ Geocoding error:', error);
            return 'Seoul, South Korea';
        }
    }
    
    
    // Get current user location using centralized service
    async getCurrentLocation() {
        const locationText = document.getElementById('currentLocationText');
        
        // Check if location service is available
        const hasSupport = await geolocationService.hasLocationSupport();
        if (!hasSupport) {
            if (locationText) {
                locationText.textContent = 'Seoul, South Korea';
            }
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.warn('⚠️ Location access is not available');
            }
            return;
        }

        // Show "Getting location..." on load
        if (locationText) {
            locationText.textContent = 'Getting location...';
        }

        try {
            // First, try to get cached location (if permission was previously granted)
            const cachedLocation = geolocationService.getCachedLocation();
            if (cachedLocation && geolocationService.getPermissionState().hasBeenGranted) {
                this.currentLocation = cachedLocation;
                await this.handleLocationSuccess();
                return;
            }

            // Check if we should show permission prompt
            const shouldPrompt = await geolocationService.shouldShowPermissionPrompt();
            
            if (shouldPrompt) {
                // Request location with smart permission handling
                const result = await geolocationService.requestLocationWithPrompt({
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000
                });
                
                this.currentLocation = result;
                
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log('✅ Location obtained:', this.currentLocation, 
                               result.showedPrompt ? '(with prompt)' : '(cached)');
                }
                
                await this.handleLocationSuccess();
            } else {
                // Permission was denied or not available - use default location
                this.useDefaultLocation();
                return;
            }
        } catch (error) {
            console.error('❌ Location error:', error.message);
            this.useDefaultLocation();
        }
    }

    // Use default Seoul location when location services are unavailable
    useDefaultLocation() {
        const locationText = document.getElementById('currentLocationText');
        
        if (locationText) {
            locationText.textContent = 'Seoul, South Korea';
        }
        
        console.log('📍 Using default Seoul location');
        
        // Use default Seoul coordinates
        this.currentLocation = { lat: 37.5665, lng: 126.9780 };
        
        // Update map if already initialized
        if (this.map) {
            this.updateUserLocationOnMap();
        }
    }

    // Handle successful location retrieval
    async handleLocationSuccess() {
        const locationText = document.getElementById('currentLocationText');
        
        // Get address from coordinates - using Google's English format
        if (locationText && window.google && window.google.maps) {
            try {
                const address = await this.getAddressFromCoordinates(
                    this.currentLocation.lat, 
                    this.currentLocation.lng
                );
                locationText.textContent = address;
            } catch (error) {
                console.error('❌ Error getting address:', error);
                locationText.textContent = 'Seoul, South Korea';
            }
        }
        
        // Update map if already initialized
        if (this.map) {
            this.updateUserLocationOnMap();
        }
    }

    // Initialize Google Maps
    async initializeMap() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🗺️ Initializing Google Maps...');
        }
        
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            console.error('❌ Map container not found');
            return;
        }

        const mapLoading = document.getElementById('mapLoading');

        try {
            // Default center (Seoul)
            const seoulCenter = this.currentLocation || { lat: 37.5665, lng: 126.9780 };

            // Initialize map
            this.map = new google.maps.Map(mapContainer, {
                zoom: 12,
                center: seoulCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [{"visibility": "off"}]
                    }
                ],
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                }
            });

            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Map initialized successfully');
            }

            // Hide loading screen
            if (mapLoading) {
                mapLoading.style.display = 'none';
            }


            // Add user location marker
            this.updateUserLocationOnMap();

            // Add attraction markers with simple icon-based pins
            await this.addAttractionMarkers();

            // Initialize traffic layer
            this.trafficLayer = new google.maps.TrafficLayer();
            
            // Initialize Places service for search
            this.placesService = new google.maps.places.PlacesService(this.map);

        } catch (error) {
            console.error('❌ Map initialization failed:', error);
            if (mapLoading) {
                mapLoading.innerHTML = '<h3>Map loading failed</h3><p>Please refresh the page to try again.</p>';
            }
        }
    }

    // Update user location marker on map
    updateUserLocationOnMap() {
        if (!this.map || !this.currentLocation) return;

        // Remove existing user location marker
        if (this.userLocationMarker) {
            this.userLocationMarker.setMap(null);
        }

        // Create new user location marker with red color
        this.userLocationMarker = new google.maps.Marker({
            position: this.currentLocation,
            map: this.map,
            title: 'Your Current Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                        <defs>
                            <filter id="userShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                            </filter>
                        </defs>
                        <circle cx="18" cy="18" r="15" fill="#FF4444" stroke="white" stroke-width="4" filter="url(#userShadow)"/>
                        <circle cx="18" cy="18" r="7" fill="white"/>
                        <circle cx="18" cy="18" r="3" fill="#FF4444"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(36, 36),
                anchor: new google.maps.Point(18, 18)
            },
            zIndex: 999
        });

        // Add info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <h4 style="margin: 0 0 4px 0; color: #FF4444;">📍 Your Location</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">Seoul, South Korea</p>
                </div>
            `
        });

        this.userLocationMarker.addListener('click', () => {
            // Close all attraction info windows
            this.attractionMarkers.forEach(markerInfo => {
                if (markerInfo.infoWindow) {
                    markerInfo.infoWindow.close();
                }
            });
            userInfoWindow.open(this.map, this.userLocationMarker);
        });

        // Center map on user location
        this.map.setCenter(this.currentLocation);
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

    // Setup control event listeners
    setupControlListeners() {
        // Center on user location
        const centerUserBtn = document.getElementById('centerUserBtn');
        if (centerUserBtn) {
            centerUserBtn.addEventListener('click', () => {
                if (this.currentLocation && this.map) {
                    this.map.setCenter(this.currentLocation);
                    this.map.setZoom(15);
                    if (!window.CONFIG?.IS_PRODUCTION) {
                        console.log('📍 Centered map on user location');
                    }
                } else {
                    if (!window.CONFIG?.IS_PRODUCTION) {
                        console.warn('⚠️ User location not available');
                    }
                }
            });
        }

        // Toggle traffic layer
        const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
        if (toggleTrafficBtn) {
            toggleTrafficBtn.addEventListener('click', () => {
                if (this.trafficLayer && this.map) {
                    if (this.isTrafficVisible) {
                        this.trafficLayer.setMap(null);
                        this.isTrafficVisible = false;
                        if (!window.CONFIG?.IS_PRODUCTION) {
                            console.log('🚫 Traffic layer hidden');
                        }
                    } else {
                        this.trafficLayer.setMap(this.map);
                        this.isTrafficVisible = true;
                        if (!window.CONFIG?.IS_PRODUCTION) {
                            console.log('🚗 Traffic layer shown');
                        }
                    }
                }
            });
        }

        // Toggle fullscreen
        const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
        if (toggleFullscreenBtn) {
            toggleFullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    // Get directions to a landmark
    async getDirections(landmarkId) {
        try {
            const landmarks = await this.getSeoulLandmarks();
            const landmark = landmarks.find(l => l.id === landmarkId);
            if (!landmark) {
                console.error('❌ Landmark not found:', landmarkId);
                return;
            }

            const destination = `${landmark.coordinates.lat},${landmark.coordinates.lng}`;
            const url = `https://maps.google.com/maps?daddr=${destination}&dirflg=w`;
            
            window.open(url, '_blank');
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`🗺️ Opened directions to ${landmark.name}`);
            }
        } catch (error) {
            console.error('❌ Error getting directions:', error);
        }
    }

    // Toggle fullscreen mode
    toggleFullscreen() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;

        if (!this.isFullscreen) {
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
            this.isFullscreen = true;
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('🖥️ Entered fullscreen mode');
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('🖥️ Exited fullscreen mode');
            }
        }
    }

    // Setup search event listeners
    setupSearchListeners() {
        // Use header search elements instead
        const searchInput = document.getElementById('headerSearchInput');
        const clearButton = document.getElementById('headerClearSearch');
        const searchResults = document.getElementById('headerSearchResults');

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🔍 Setting up search listeners:', {
            searchInput: !!searchInput,
            clearButton: !!clearButton,
            searchResults: !!searchResults
        });

        if (!searchInput || !clearButton || !searchResults) {
            console.error('❌ Search elements not found');
            return;
        }

        let searchTimeout;

        // Input event for real-time search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Show/hide clear button
            if (query) {
                clearButton.style.display = 'flex';
            } else {
                clearButton.style.display = 'none';
                this.hideSearchResults();
                return;
            }

            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Debounce search
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Clear search
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            this.hideSearchResults();
            this.clearSearchMarkers();
        });

        // Voice search removed from header for simplicity

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-search-container')) {
                this.hideSearchResults();
            }
        });

        // Handle Enter key for immediate search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            }
        });
    }


    // Perform place search using Google Places API
    async performSearch(query) {
        if (!this.placesService || !query) return;

        const searchResults = document.getElementById('headerSearchResults');
        if (!searchResults) return;

        // Show loading
        this.showSearchLoading();

        // Clear previous search markers
        this.clearSearchMarkers();

        // Search request
        const request = {
            query: query,
            bounds: this.map.getBounds(),
            fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types']
        };

        this.placesService.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                this.displaySearchResults(results);
            } else {
                this.showNoResults();
            }
        });
    }

    // Display search results
    displaySearchResults(results) {
        const searchResults = document.getElementById('headerSearchResults');
        if (!searchResults) return;

        searchResults.innerHTML = '';
        searchResults.style.display = 'block';

        results.slice(0, 5).forEach((place, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            const icon = this.getPlaceIcon(place.types);
            
            resultItem.innerHTML = `
                <div class="search-result-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="search-result-text">
                    <div class="search-result-name">${place.name}</div>
                    <div class="search-result-address">${place.formatted_address}</div>
                </div>
            `;

            resultItem.addEventListener('click', () => {
                this.selectSearchResult(place);
            });

            searchResults.appendChild(resultItem);
        });
    }

    // Select a search result
    selectSearchResult(place) {
        // Hide search results
        this.hideSearchResults();

        // Clear previous search markers
        this.clearSearchMarkers();

        // Center map on selected place
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(16);

        // Add marker for selected place
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="60" viewBox="0 0 70 60">
                        <defs>
                            <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#ee5a24;stop-opacity:1" />
                            </linearGradient>
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/>
                            </filter>
                        </defs>
                        <circle cx="35" cy="30" r="25" fill="url(#searchGradient)" stroke="white" stroke-width="3" filter="url(#shadow)"/>
                        <circle cx="35" cy="30" r="18" fill="white"/>
                        <text x="35" y="38" text-anchor="middle" fill="#ff6b6b" font-size="20" font-weight="bold">📍</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(70, 60),
                anchor: new google.maps.Point(35, 30)
            },
            zIndex: 1000
        });

        // Store search marker
        this.searchMarkers.push(marker);

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <h4 style="margin: 0 0 4px 0; color: #ff6b6b;">${place.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${place.formatted_address}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        // Show info window immediately
        infoWindow.open(this.map, marker);

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('✅ Selected place:', place.name);
        }
    }

    // Get appropriate icon for place type
    getPlaceIcon(types) {
        if (!types) return 'fas fa-map-marker-alt';
        
        const typeIconMap = {
            restaurant: 'fas fa-utensils',
            food: 'fas fa-utensils',
            cafe: 'fas fa-coffee',
            shopping_mall: 'fas fa-shopping-bag',
            store: 'fas fa-store',
            tourist_attraction: 'fas fa-camera',
            museum: 'fas fa-landmark',
            hospital: 'fas fa-hospital',
            school: 'fas fa-graduation-cap',
            bank: 'fas fa-university',
            gas_station: 'fas fa-gas-pump',
            subway_station: 'fas fa-subway',
            bus_station: 'fas fa-bus',
            park: 'fas fa-tree',
            gym: 'fas fa-dumbbell',
            hotel: 'fas fa-bed'
        };

        for (const type of types) {
            if (typeIconMap[type]) {
                return typeIconMap[type];
            }
        }

        return 'fas fa-map-marker-alt';
    }

    // Show search loading
    showSearchLoading() {
        const searchResults = document.getElementById('headerSearchResults');
        if (!searchResults) return;

        searchResults.innerHTML = '<div class="search-loading">Searching places</div>';
        searchResults.style.display = 'block';
    }

    // Show no results
    showNoResults() {
        const searchResults = document.getElementById('headerSearchResults');
        if (!searchResults) return;

        searchResults.innerHTML = '<div class="search-no-results">No places found</div>';
        searchResults.style.display = 'block';
    }

    // Hide search results
    hideSearchResults() {
        const searchResults = document.getElementById('headerSearchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Clear search markers
    clearSearchMarkers() {
        this.searchMarkers.forEach(marker => {
            marker.setMap(null);
        });
        this.searchMarkers = [];
    }
}

// Create global instance
window.seoulMapManager = new SeoulMapManager();

// Global callback for Google Maps API
window.initializeGoogleMaps = function() {
    if (!window.CONFIG?.IS_PRODUCTION) {
        console.log('✅ Google Maps API loaded and ready');
    }
    window.seoulMapManager.initializeMap();
};