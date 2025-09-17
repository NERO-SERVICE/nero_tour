/**
 * Simple Data Service
 * Firebase Firestore 전용 간소화된 데이터 서비스
 */

class SimpleDataService {
    constructor() {
        this.db = null;
        this.isReady = false;
        this.readyCallbacks = [];
        this.imageCache = new Map(); // 이미지 URL 존재 여부 캐시
        this.imageLoadPromises = new Map(); // 중복 요청 방지
    }

    /**
     * Firebase 초기화 및 Firestore 연결 (기존 초기화 재사용)
     */
    async initialize() {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🚀 SimpleDataService 초기화 시작...');
        }
        
        return new Promise((resolve) => {
            // Firebase와 전역 Firebase 객체가 로드될 때까지 대기
            const checkFirebase = setInterval(() => {
                if (typeof firebase !== 'undefined' && window.Firebase && window.Firebase.isInitialized()) {
                    clearInterval(checkFirebase);
                    
                    try {
                        // 이미 초기화된 Firebase 사용
                        this.db = window.Firebase.db;
                        
                        if (this.db) {
                            this.isReady = true;
                            if (!window.CONFIG?.IS_PRODUCTION) {
                                console.log('✅ Firestore 연결 완료 (기존 초기화 재사용)');
                            }
                            
                            // 대기 중인 콜백 실행
                            this.readyCallbacks.forEach(callback => callback());
                            this.readyCallbacks = [];
                            
                            resolve(true);
                        } else {
                            console.error('❌ Firestore 인스턴스를 찾을 수 없습니다');
                            resolve(false);
                        }
                    } catch (error) {
                        console.error('❌ Firestore 연결 실패:', error);
                        resolve(false);
                    }
                }
            }, 100);
            
            // 5초 타임아웃
            setTimeout(() => {
                clearInterval(checkFirebase);
                if (!this.isReady) {
                    console.error('❌ Firebase 초기화 타임아웃 - Firebase가 먼저 초기화되어야 합니다');
                    resolve(false);
                }
            }, 5000);
        });
    }

    /**
     * 서비스가 준비될 때까지 대기
     */
    async waitForReady() {
        if (this.isReady) return true;
        
        return new Promise((resolve) => {
            this.readyCallbacks.push(() => resolve(true));
        });
    }

    /**
     * 모든 카테고리 가져오기
     */
    async getAllCategories() {
        await this.waitForReady();
        
        if (!this.db) {
            console.error('❌ Firestore가 초기화되지 않았습니다');
            return [];
        }

        try {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('📋 카테고리 로딩 중...');
            }
            const snapshot = await this.db.collection('categories').get();
            
            const categories = [];
            snapshot.forEach(doc => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`✅ ${categories.length}개 카테고리 로드 완료`);
            }
            return categories;
        } catch (error) {
            console.error('❌ 카테고리 로드 실패:', error);
            return [];
        }
    }

    /**
     * 모든 랜드마크 가져오기
     */
    async getAllLandmarks() {
        console.log('🔍 getAllLandmarks called');
        await this.waitForReady();
        
        if (!this.db) {
            console.error('❌ Firestore가 초기화되지 않았습니다');
            return [];
        }

        try {
            console.log('📍 랜드마크 로딩 중...');
            const snapshot = await this.db.collection('landmarks').get();
            console.log(`📊 Firestore query returned ${snapshot.size} documents`);
            
            const landmarks = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                landmarks.push({
                    id: doc.id,
                    ...data,
                    // 이미지 URL 처리
                    image: this.resolveImageUrl(data.image),
                    // detailSections 이미지 처리
                    detailSections: data.detailSections?.map(section => ({
                        ...section,
                        image: this.resolveImageUrl(section.image)
                    }))
                });
            });
            
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`✅ ${landmarks.length}개 랜드마크 로드 완료`);
            }
            return landmarks;
        } catch (error) {
            console.error('❌ 랜드마크 로드 실패:', error);
            return [];
        }
    }

    /**
     * ID로 특정 랜드마크 가져오기
     */
    async getLandmarkById(id) {
        console.log(`🔍 Getting landmark by ID: ${id}`);
        await this.waitForReady();
        
        if (!this.db) {
            console.error('❌ Firestore가 초기화되지 않았습니다');
            return null;
        }

        try {
            console.log(`📡 Fetching from Firestore: landmarks/${id}`);
            const doc = await this.db.collection('landmarks').doc(id).get();
            
            if (!doc.exists) {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.warn(`⚠️ 랜드마크 ${id}를 찾을 수 없습니다`);
                }
                return null;
            }
            
            const data = doc.data();
            console.log(`✅ Document data retrieved:`, data);
            
            const landmark = {
                id: doc.id,
                ...data,
                image: this.resolveImageUrl(data.image),
                detailSections: data.detailSections?.map(section => ({
                    ...section,
                    image: this.resolveImageUrl(section.image)
                }))
            };
            
            console.log(`✅ 랜드마크 ${id} 로드 완료:`, landmark);
            return landmark;
        } catch (error) {
            console.error(`❌ 랜드마크 ${id} 로드 실패:`, error);
            return null;
        }
    }

    /**
     * 카테고리별 랜드마크 가져오기
     */
    async getLandmarksByCategory(categoryId) {
        await this.waitForReady();
        
        if (!this.db) {
            console.error('❌ Firestore가 초기화되지 않았습니다');
            return [];
        }

        try {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`📍 카테고리 ${categoryId} 랜드마크 로딩 중...`);
            }
            const snapshot = await this.db
                .collection('landmarks')
                .where('category', '==', categoryId)
                .get();
            
            const landmarks = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                landmarks.push({
                    id: doc.id,
                    ...data,
                    image: this.resolveImageUrl(data.image)
                });
            });
            
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`✅ ${landmarks.length}개 랜드마크 로드 완료`);
            }
            return landmarks;
        } catch (error) {
            console.error(`❌ 카테고리 ${categoryId} 랜드마크 로드 실패:`, error);
            return [];
        }
    }

    /**
     * 이미지 URL 처리
     */

    /**
     * Firebase Storage에서 이미지 존재 여부 확인
     */
    async checkImageExists(imagePath) {
        if (!imagePath || !window.CONFIG?.FIREBASE_CONFIG?.storageBucket) {
            return false;
        }

        // 캐시에서 확인
        if (this.imageCache.has(imagePath)) {
            return this.imageCache.get(imagePath);
        }

        // 중복 요청 방지
        if (this.imageLoadPromises.has(imagePath)) {
            return this.imageLoadPromises.get(imagePath);
        }

        const checkPromise = this.performImageCheck(imagePath);
        this.imageLoadPromises.set(imagePath, checkPromise);

        try {
            const exists = await checkPromise;
            this.imageCache.set(imagePath, exists);
            return exists;
        } finally {
            this.imageLoadPromises.delete(imagePath);
        }
    }

    /**
     * 실제 이미지 존재 여부 확인 로직
     */
    async performImageCheck(imagePath) {
        const bucket = window.CONFIG.FIREBASE_CONFIG.storageBucket;
        const encodedPath = encodeURIComponent(imagePath);
        const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;

        try {
            const response = await fetch(firebaseUrl, { method: 'HEAD' });
            const exists = response.ok;

            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`🔍 Image check: ${imagePath} → ${exists ? 'EXISTS' : 'NOT_FOUND'}`);
            }

            return exists;
        } catch (error) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.warn(`⚠️ Image check failed for ${imagePath}:`, error);
            }
            return false;
        }
    }

    /**
     * 이미지 URL 처리 (동적 존재 확인)
     */
    resolveImageUrl(imagePath) {
        if (!imagePath) return null;

        // 이미 완전한 URL인 경우
        if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
            return imagePath;
        }

        // Firebase Storage URL 생성
        if (window.CONFIG?.FIREBASE_CONFIG?.storageBucket) {
            const bucket = window.CONFIG.FIREBASE_CONFIG.storageBucket;

            // 모든 경로에 대해 Firebase Storage URL 생성
            let path = imagePath;
            if (!imagePath.startsWith('landmarks/') && !imagePath.startsWith('restaurants/')) {
                path = `landmarks/${imagePath}`;
            }

            const encodedPath = encodeURIComponent(path);
            const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;

            return firebaseUrl;
        }

        // 로컬 fallback
        return `/src/assets/images/${imagePath}`;
    }

    /**
     * 안전한 이미지 URL 생성 (존재 여부 확인 포함)
     */
    async resolveImageUrlSafe(imagePath) {
        if (!imagePath) return null;

        // 이미 완전한 URL인 경우
        if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
            return imagePath;
        }

        // Firebase Storage 사용 가능한 경우
        if (window.CONFIG?.FIREBASE_CONFIG?.storageBucket) {
            // 경로 정규화
            let path = imagePath;
            if (!imagePath.startsWith('landmarks/') && !imagePath.startsWith('restaurants/')) {
                path = `landmarks/${imagePath}`;
            }

            // 이미지 존재 여부 확인
            const exists = await this.checkImageExists(path);

            if (exists) {
                const bucket = window.CONFIG.FIREBASE_CONFIG.storageBucket;
                const encodedPath = encodeURIComponent(path);
                const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;

                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log(`✅ Firebase image: ${path}`);
                }

                return firebaseUrl;
            } else {
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log(`🔄 Fallback image: ${path} → placeholder`);
                }

                return '/src/assets/images/ui/placeholder.png';
            }
        }

        // 로컬 fallback
        return `/src/assets/images/${imagePath}`;
    }

    /**
     * 현재 위치 기준 가까운 랜드마크 가져오기
     */
    async getNearbyLandmarks(coordinates, limit = 3) {
        await this.waitForReady();
        
        if (!this.db || !coordinates) {
            return [];
        }

        try {
            const landmarks = await this.getAllLandmarks();
            
            // 거리 계산
            const calculateDistance = (lat1, lng1, lat2, lng2) => {
                const R = 6371; // 지구 반지름 (km)
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                return R * c;
            };
            
            // 거리 계산 및 정렬
            const landmarksWithDistance = landmarks.map(landmark => ({
                ...landmark,
                distance: calculateDistance(
                    coordinates.lat,
                    coordinates.lng,
                    landmark.coordinates?.lat || 0,
                    landmark.coordinates?.lng || 0
                )
            }));
            
            // 거리순 정렬 후 제한
            return landmarksWithDistance
                .sort((a, b) => a.distance - b.distance)
                .slice(0, limit);
                
        } catch (error) {
            console.error('❌ 가까운 랜드마크 로드 실패:', error);
            return [];
        }
    }

    /**
     * 캐시 초기화 (호환성)
     */
    clearCache() {
        // SimpleDataService는 캐시를 사용하지 않지만 호환성을 위해 추가
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🗑️ Cache cleared (no-op in SimpleDataService)');
        }
    }

    /**
     * 서비스 상태 확인
     */
    getStatus() {
        return {
            isReady: this.isReady,
            hasDb: !!this.db,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * 서비스 상태 가져오기 (호환성)
     */
    getServiceStatus() {
        return {
            isOnline: true,
            isFirebaseReady: this.isReady,
            hasApiUrl: false,
            cacheSize: 0,
            mode: this.isReady ? 'firebase' : 'offline'
        };
    }
}

// 싱글톤 인스턴스 생성 및 자동 초기화
const simpleDataService = new SimpleDataService();
simpleDataService.initialize();

export default simpleDataService;