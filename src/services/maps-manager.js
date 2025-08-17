// Google Maps Manager - Seoul Explorer
class GoogleMapsManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindows = [];
        this.directionsService = null;
        this.directionsRenderer = null;
        this.placesService = null;
        this.userLocationMarker = null;
        this.markerCluster = null;
        this.isInitialized = false;
    }

    // 간소화된 지도 초기화
    async initializeMap(containerId) {
        
        // Basic checks
        if (!window.google?.maps) {
            throw new Error('Google Maps API not available');
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container not found: ${containerId}`);
        }

        // 기본 지도 옵션 - English language for American users
        const mapOptions = {
            zoom: 12,
            center: { lat: 37.5665, lng: 126.9780 }, // Seoul coordinates
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            // Ensure English language interface
            gestureHandling: 'greedy',
            styles: this.getMapStyles()
        };

        try {
            this.map = new google.maps.Map(container, mapOptions);
            
        } catch (error) {
            console.error('❌ Map creation failed:', error);
            throw error;
        }
        
        // Initialize simplified services
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
        this.placesService = new google.maps.places.PlacesService(this.map);

        this.isInitialized = true;
    }

    // 커스텀 지도 스타일
    getMapStyles() {
        return [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "water",
                "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
            }
        ];
    }

    // 간소화된 마커 추가
    addLandmarkMarkers(landmarks) {
        
        if (!this.map) return;

        // 기존 마커 제거
        this.clearMarkers();

        landmarks.forEach((landmark, index) => {
            try {
                const marker = new google.maps.Marker({
                    position: landmark.coordinates,
                    map: this.map,
                    title: landmark.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#667eea',
                        fillOpacity: 0.8,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: 12
                    }
                });

                // 간단한 정보창
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><h3>${landmark.name}</h3><p>${landmark.description}</p></div>`
                });

                marker.addListener('click', () => {
                    this.closeAllInfoWindows();
                    infoWindow.open(this.map, marker);
                });

                this.markers.push(marker);
                this.infoWindows.push(infoWindow);
                
            } catch (error) {
                console.error(`마커 ${index + 1} 오류:`, error);
            }
        });

    }

    // 커스텀 마커 아이콘
    getCustomIcon(category) {
        const iconConfig = {
            historical: { color: '#8B4513', symbol: '🏯' },
            shopping: { color: '#FF6B6B', symbol: '🛍️' },
            nightlife: { color: '#9B59B6', symbol: '🎵' },
            cultural: { color: '#E67E22', symbol: '🏛️' },
            modern: { color: '#3498DB', symbol: '🏙️' },
            landmark: { color: '#2ECC71', symbol: '🗼' }
        };

        const config = iconConfig[category] || iconConfig['landmark'];
        
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: config.color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 12
        };
    }

    // 정보창 콘텐츠 생성
    createInfoWindowContent(landmark) {
        return `
            <div class="map-info-window">
                <h3>${landmark.name}</h3>
                <p class="korean-name">${landmark.nameKorean}</p>
                <p class="description">${landmark.description}</p>
                <div class="info-actions">
                    <button onclick="seoulExplorer.showLocationDetails('${landmark.id}')" class="info-btn">
                        Details
                    </button>
                    <button onclick="mapsManager.getDirections('${landmark.id}')" class="info-btn">
                        Directions
                    </button>
                </div>
            </div>
        `;
    }

    // 사용자 위치 마커 추가
    addUserLocationMarker(position) {
        if (this.userLocationMarker) {
            this.userLocationMarker.setMap(null);
        }

        this.userLocationMarker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: "My Location",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#2ECC71',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
                scale: 8
            },
            animation: google.maps.Animation.BOUNCE
        });

        // 잠시 후 애니메이션 중지
        setTimeout(() => {
            this.userLocationMarker.setAnimation(null);
        }, 2000);
    }

    // 내 위치로 지도 중심 이동
    centerOnUser(position) {
        if (this.map) {
            this.map.setCenter(position);
            this.map.setZoom(15);
        }
    }

    // 경로 계산 및 표시
    async calculateRoute(origin, destination, travelMode = 'WALKING') {
        if (!this.directionsService) return;

        const request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode[travelMode],
            unitSystem: google.maps.UnitSystem.METRIC
        };

        try {
            const result = await new Promise((resolve, reject) => {
                this.directionsService.route(request, (result, status) => {
                    if (status === 'OK') {
                        resolve(result);
                    } else {
                        reject(new Error(`경로 계산 실패: ${status}`));
                    }
                });
            });

            this.directionsRenderer.setDirections(result);
            return result;
        } catch (error) {
            console.error('경로 계산 오류:', error);
            throw error;
        }
    }

    // 주변 장소 검색
    searchNearbyPlaces(location, radius = 1000, type = 'tourist_attraction') {
        if (!this.placesService) return;

        const request = {
            location: location,
            radius: radius,
            type: type
        };

        return new Promise((resolve, reject) => {
            this.placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(new Error(`장소 검색 실패: ${status}`));
                }
            });
        });
    }

    // 마커 클러스터링 설정
    setupMarkerClustering() {
        if (window.markerClusterer && this.markers.length > 0) {
            this.markerCluster = new markerClusterer.MarkerClusterer({
                map: this.map,
                markers: this.markers
            });
        }
    }

    // 모든 정보창 닫기
    closeAllInfoWindows() {
        this.infoWindows.forEach(infoWindow => {
            infoWindow.close();
        });
    }

    // 마커 제거
    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
        this.infoWindows = [];
        
        if (this.markerCluster) {
            this.markerCluster.clearMarkers();
        }
    }

    // 카테고리별 마커 필터링
    filterMarkersByCategory(category) {
        // 구현 예정: 카테고리별 마커 표시/숨김
        if (category === 'all') {
            // Show all markers
            return;
        }
        // Filter by specific category
    }

    // 이벤트 핸들러
    onMarkerClick(landmark) {
        // SeoulExplorer에서 처리
        if (window.seoulExplorer && window.seoulExplorer.onMapMarkerClick) {
            window.seoulExplorer.onMapMarkerClick(landmark);
        }
    }

    // 길찾기 (외부 앱으로 이동)
    getDirections(landmarkId) {
        if (window.seoulExplorer) {
            window.seoulExplorer.getDirections(landmarkId);
        }
    }
}

// 전역 변수로 설정
window.GoogleMapsManager = GoogleMapsManager;