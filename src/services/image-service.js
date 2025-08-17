/**
 * Image Service
 * Firebase Storage 연동 이미지 관리 서비스
 * 
 * Firebase Storage를 우선으로 사용하고, 로컬 이미지를 fallback으로 사용합니다.
 */

class ImageService {
    constructor() {
        this.baseImagePath = '/src/assets/images';
        this.cdnBaseUrl = null; // 향후 CDN URL 설정
        this.fallbackImage = '/src/assets/images/ui/placeholder.png';
        this.storage = null; // Firebase Storage 인스턴스
        this.isFirebaseReady = false;
        this.storageBaseUrl = null; // Firebase Storage 기본 URL
        
        // Firebase Storage 초기화
        this.initFirebaseStorage();
    }

    /**
     * Firebase Storage 초기화
     */
    async initFirebaseStorage() {
        let attempts = 0;
        const maxAttempts = 50; // 5초 대기

        while (attempts < maxAttempts) {
            // window.firebase (소문자) 확인
            if (window.firebase && window.firebase.storage) {
                try {
                    this.storage = window.firebase.storage();
                    this.isFirebaseReady = true;
                    
                    // Storage 기본 URL 설정
                    const storageRef = this.storage.ref();
                    this.storageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/${window.CONFIG.FIREBASE_CONFIG.storageBucket}/o`;
                    
                    console.log('✅ Firebase Storage connected to ImageService');
                    return true;
                } catch (error) {
                    console.warn('⚠️ Firebase Storage initialization error:', error);
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        console.warn('⚠️ Firebase Storage not available - using direct URLs');
        return false;
    }

    /**
     * 랜드마크 이미지 경로를 반환합니다
     * @param {string} imagePath - 이미지 파일 경로 (dummydata.js에서 온 원본 경로)
     * @returns {string} 완전한 이미지 경로
     */
    getLandmarkImage(imagePath) {
        if (!imagePath) {
            console.warn('⚠️ No image path provided');
            return this.fallbackImage;
        }
        
        // 이미 완전한 URL인 경우
        if (this.isFullUrl(imagePath)) {
            console.log('📸 Using full URL:', imagePath);
            return imagePath;
        }

        // Firebase Storage URL 직접 구성
        try {
            // CONFIG가 있는지 확인
            if (window.CONFIG && window.CONFIG.FIREBASE_CONFIG && window.CONFIG.FIREBASE_CONFIG.storageBucket) {
                const storageBucket = window.CONFIG.FIREBASE_CONFIG.storageBucket;
                
                // dummydata.js의 경로를 그대로 사용 (예: 'landmarks/jeju_seonangdang_kdh.png')
                const encodedPath = encodeURIComponent(imagePath);
                const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`;
                
                console.log(`🖼️ Firebase URL for ${imagePath}:`, firebaseUrl);
                return firebaseUrl;
            } else {
                console.warn('⚠️ CONFIG not available yet');
            }
        } catch (error) {
            console.error('❌ Error generating Firebase URL:', error);
        }

        // Fallback: 기본 placeholder 이미지 반환
        console.warn(`⚠️ Using fallback image for: ${imagePath}`);
        return this.fallbackImage;
    }

    /**
     * UI 이미지 경로를 반환합니다
     * @param {string} imageName - 이미지 파일명
     * @returns {string} 완전한 이미지 경로
     */
    getUIImage(imageName) {
        if (!imageName) return this.fallbackImage;
        
        if (this.isFullUrl(imageName)) {
            return imageName;
        }

        if (this.cdnBaseUrl) {
            return `${this.cdnBaseUrl}/ui/${imageName}`;
        }

        return `${this.baseImagePath}/ui/${imageName}`;
    }

    /**
     * 아이콘 이미지 경로를 반환합니다
     * @param {string} iconName - 아이콘 파일명
     * @returns {string} 완전한 아이콘 경로
     */
    getIconImage(iconName) {
        if (!iconName) return this.fallbackImage;
        
        if (this.isFullUrl(iconName)) {
            return iconName;
        }

        if (this.cdnBaseUrl) {
            return `${this.cdnBaseUrl}/icons/${iconName}`;
        }

        return `${this.baseImagePath}/icons/${iconName}`;
    }

    /**
     * 이미지 URL이 완전한 URL인지 확인합니다
     * @param {string} url - 확인할 URL
     * @returns {boolean} 완전한 URL 여부
     */
    isFullUrl(url) {
        return url.startsWith('http://') || 
               url.startsWith('https://') || 
               url.startsWith('//') ||
               url.startsWith('/');
    }

    /**
     * 이미지를 미리 로드합니다
     * @param {string|Array<string>} imagePaths - 미리 로드할 이미지 경로(들)
     * @returns {Promise<Array>} 로드 결과 배열
     */
    async preloadImages(imagePaths) {
        const paths = Array.isArray(imagePaths) ? imagePaths : [imagePaths];
        
        const loadPromises = paths.map(async (path) => {
            try {
                await this.loadImage(path);
                return { path, status: 'loaded' };
            } catch (error) {
                console.warn(`⚠️ Failed to preload image: ${path}`, error);
                return { path, status: 'failed', error };
            }
        });

        return Promise.all(loadPromises);
    }

    /**
     * 단일 이미지를 로드합니다
     * @param {string} imagePath - 이미지 경로
     * @returns {Promise<HTMLImageElement>} 로드된 이미지 엘리먼트
     */
    loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
            
            img.src = imagePath;
        });
    }

    /**
     * 이미지 엘리먼트에 fallback 처리를 추가합니다
     * @param {HTMLImageElement} imgElement - 이미지 엘리먼트
     * @param {string} fallbackSrc - fallback 이미지 경로
     */
    addImageFallback(imgElement, fallbackSrc = this.fallbackImage) {
        if (!imgElement || imgElement.tagName !== 'IMG') {
            console.warn('⚠️ Invalid image element provided');
            return;
        }

        // 이미 fallback이 설정된 경우 중복 방지
        if (imgElement.dataset.fallbackAdded) {
            return;
        }

        imgElement.addEventListener('error', () => {
            if (imgElement.src !== fallbackSrc) {
                console.warn(`⚠️ Image load failed, using fallback: ${imgElement.src}`);
                imgElement.src = fallbackSrc;
            }
        });

        imgElement.dataset.fallbackAdded = 'true';
    }

    /**
     * 랜드마크 이미지들을 일괄 미리 로드합니다
     * @param {Array} landmarks - 랜드마크 데이터 배열
     * @returns {Promise<void>}
     */
    async preloadLandmarkImages(landmarks) {
        const imagePaths = [];

        landmarks.forEach(landmark => {
            if (landmark.image) {
                imagePaths.push(this.getLandmarkImage(landmark.image));
            }

            // 상세 섹션 이미지들도 포함
            if (landmark.detailSections) {
                landmark.detailSections.forEach(section => {
                    if (section.image) {
                        imagePaths.push(this.getLandmarkImage(section.image));
                    }
                });
            }
        });

        if (imagePaths.length > 0) {
            console.log(`🖼️ Preloading ${imagePaths.length} landmark images...`);
            const results = await this.preloadImages(imagePaths);
            
            const successful = results.filter(r => r.status === 'loaded').length;
            const failed = results.filter(r => r.status === 'failed').length;
            
            console.log(`✅ Preloaded ${successful} images, ${failed} failed`);
        }
    }

    /**
     * 이미지 최적화 옵션을 생성합니다 (향후 CDN 연동 시 사용)
     * @param {Object} options - 최적화 옵션
     * @returns {string} 최적화된 이미지 URL
     */
    getOptimizedImageUrl(imagePath, options = {}) {
        if (!this.cdnBaseUrl || !imagePath) {
            return imagePath;
        }

        const {
            width,
            height,
            quality = 80,
            format = 'auto'
        } = options;

        let optimizedUrl = imagePath;
        const params = new URLSearchParams();

        if (width) params.append('w', width.toString());
        if (height) params.append('h', height.toString());
        if (quality !== 80) params.append('q', quality.toString());
        if (format !== 'auto') params.append('f', format);

        if (params.toString()) {
            optimizedUrl += `?${params.toString()}`;
        }

        return optimizedUrl;
    }

    /**
     * 반응형 이미지 srcset을 생성합니다
     * @param {string} imagePath - 기본 이미지 경로
     * @param {Array<number>} widths - 생성할 width 배열
     * @returns {string} srcset 문자열
     */
    generateResponsiveSrcSet(imagePath, widths = [480, 768, 1024, 1200]) {
        if (!this.cdnBaseUrl) {
            return imagePath;
        }

        const srcSet = widths.map(width => {
            const optimizedUrl = this.getOptimizedImageUrl(imagePath, { width });
            return `${optimizedUrl} ${width}w`;
        }).join(', ');

        return srcSet;
    }

    /**
     * CDN 기본 URL을 설정합니다
     * @param {string} cdnUrl - CDN 기본 URL
     */
    setCdnBaseUrl(cdnUrl) {
        this.cdnBaseUrl = cdnUrl.endsWith('/') ? cdnUrl.slice(0, -1) : cdnUrl;
        console.log(`🌐 CDN base URL set to: ${this.cdnBaseUrl}`);
    }

    /**
     * 기본 이미지 경로를 설정합니다
     * @param {string} basePath - 기본 이미지 경로
     */
    setBaseImagePath(basePath) {
        this.baseImagePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        console.log(`📁 Base image path set to: ${this.baseImagePath}`);
    }

    /**
     * fallback 이미지를 설정합니다
     * @param {string} fallbackPath - fallback 이미지 경로
     */
    setFallbackImage(fallbackPath) {
        this.fallbackImage = fallbackPath;
        console.log(`🖼️ Fallback image set to: ${this.fallbackImage}`);
    }

    /**
     * 이미지 캐시를 초기화합니다
     */
    clearImageCache() {
        console.log('🗑️ Image cache cleared');
    }

    /**
     * Firebase Storage에 이미지를 업로드합니다
     * @param {File} file - 업로드할 파일
     * @param {string} path - Storage 내 경로 (예: 'landmarks/image.jpg')
     * @returns {Promise<string>} 업로드된 파일의 다운로드 URL
     */
    async uploadToStorage(file, path) {
        if (!this.isFirebaseReady) {
            throw new Error('Firebase Storage not initialized');
        }

        try {
            console.log(`📤 Uploading ${file.name} to ${path}...`);
            
            const storageRef = this.storage.ref(path);
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            console.log(`✅ Upload successful: ${downloadURL}`);
            return downloadURL;
            
        } catch (error) {
            console.error(`❌ Upload failed for ${path}:`, error);
            throw error;
        }
    }

    /**
     * Firebase Storage에서 이미지를 삭제합니다
     * @param {string} path - Storage 내 경로
     * @returns {Promise<void>}
     */
    async deleteFromStorage(path) {
        if (!this.isFirebaseReady) {
            throw new Error('Firebase Storage not initialized');
        }

        try {
            const storageRef = this.storage.ref(path);
            await storageRef.delete();
            console.log(`🗑️ Deleted: ${path}`);
        } catch (error) {
            console.error(`❌ Delete failed for ${path}:`, error);
            throw error;
        }
    }

    /**
     * Firebase Storage에서 이미지 목록을 가져옵니다
     * @param {string} folderPath - 폴더 경로 (예: 'landmarks/')
     * @returns {Promise<Array>} 이미지 정보 배열
     */
    async listStorageImages(folderPath) {
        if (!this.isFirebaseReady) {
            throw new Error('Firebase Storage not initialized');
        }

        try {
            const storageRef = this.storage.ref(folderPath);
            const result = await storageRef.listAll();
            
            const imageList = await Promise.all(
                result.items.map(async (itemRef) => {
                    const url = await itemRef.getDownloadURL();
                    const metadata = await itemRef.getMetadata();
                    
                    return {
                        name: itemRef.name,
                        fullPath: itemRef.fullPath,
                        url: url,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        created: metadata.timeCreated,
                        updated: metadata.updated
                    };
                })
            );
            
            console.log(`📋 Found ${imageList.length} images in ${folderPath}`);
            return imageList;
            
        } catch (error) {
            console.error(`❌ Failed to list images in ${folderPath}:`, error);
            throw error;
        }
    }

    /**
     * 서비스 상태를 가져옵니다
     * @returns {Object} 서비스 상태 정보
     */
    getServiceStatus() {
        return {
            baseImagePath: this.baseImagePath,
            cdnBaseUrl: this.cdnBaseUrl,
            fallbackImage: this.fallbackImage,
            usingCdn: !!this.cdnBaseUrl,
            isFirebaseReady: this.isFirebaseReady,
            storageBaseUrl: this.storageBaseUrl,
            mode: this.isFirebaseReady ? 'firebase-storage' : 
                  this.cdnBaseUrl ? 'cdn' : 'local'
        };
    }
}

// 싱글톤 인스턴스 생성
const imageService = new ImageService();

export default imageService;