/**
 * Services Module Entry Point
 * 서비스 모듈 진입점
 * 
 * 모든 서비스를 중앙에서 관리하고 초기화합니다.
 */

import dataService from './data-service.js';
import imageService from './image-service.js';

/**
 * 모든 서비스를 초기화합니다
 * @param {Object} config - 설정 객체
 */
export const initializeServices = async (config = {}) => {
    if (!window.CONFIG?.IS_PRODUCTION) {
        console.log('🚀 Initializing services...');
    }

    try {
        // 이미지 서비스 설정
        if (config.cdnBaseUrl) {
            imageService.setCdnBaseUrl(config.cdnBaseUrl);
        }
        
        if (config.baseImagePath) {
            imageService.setBaseImagePath(config.baseImagePath);
        }

        if (config.fallbackImage) {
            imageService.setFallbackImage(config.fallbackImage);
        }

        // 데이터 서비스 설정
        if (config.apiBaseUrl) {
            dataService.setApiBaseUrl(config.apiBaseUrl);
        }

        // 초기 데이터 로드 및 이미지 미리 로드
        if (config.preloadData !== false) {
            const landmarks = await dataService.getAllLandmarks();
            
            if (config.preloadImages !== false) {
                await imageService.preloadLandmarkImages(landmarks);
            }
        }

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('✅ Services initialized successfully');
        }
        
        // 서비스 상태 로그
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('📊 Service Status:', {
                dataService: dataService.getServiceStatus(),
                imageService: imageService.getServiceStatus()
            });
        }

    } catch (error) {
        console.error('❌ Service initialization failed:', error);
        throw error;
    }
};

/**
 * 모든 서비스의 캐시를 초기화합니다
 */
export const clearAllCaches = () => {
    dataService.clearCache();
    imageService.clearImageCache();
    if (!window.CONFIG?.IS_PRODUCTION) {
        console.log('🗑️ All caches cleared');
    }
};

/**
 * 모든 서비스의 상태를 가져옵니다
 * @returns {Object} 전체 서비스 상태
 */
export const getServicesStatus = () => {
    return {
        data: dataService.getServiceStatus(),
        image: imageService.getServiceStatus(),
        timestamp: new Date().toISOString()
    };
};

// 개별 서비스 export
export { default as dataService } from './data-service.js';
export { default as imageService } from './image-service.js';

// 편의를 위한 주요 함수들 re-export
export const {
    getAllLandmarks,
    getLandmarksByCategory,
    getLandmarkById,
    getNearbyLandmarks,
    getAllCategories,
    getCategoryById
} = dataService;

export const {
    getLandmarkImage,
    getUIImage,
    getIconImage,
    preloadImages,
    addImageFallback
} = imageService;