/**
 * Smart Image Component
 * Firebase Storage 이미지 존재 여부를 확인하고 적절한 fallback을 제공하는 스마트 이미지 컴포넌트
 */

class SmartImage {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            placeholder: '/src/assets/images/ui/placeholder.png',
            loadingClass: 'image-loading',
            errorClass: 'image-error',
            successClass: 'image-success',
            showLoadingIndicator: true,
            retryAttempts: 2,
            retryDelay: 1000,
            ...options
        };

        this.currentAttempt = 0;
        this.isLoading = false;
    }

    /**
     * 이미지 로드 및 표시
     */
    async loadImage(imagePath, alt = '') {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentAttempt = 0;

        // 로딩 상태 표시
        this.showLoadingState();

        try {
            // 데이터 서비스에서 안전한 URL 가져오기
            const imageUrl = await window.simpleDataService?.resolveImageUrlSafe(imagePath) || imagePath;

            // 이미지 로드 시도
            const success = await this.attemptImageLoad(imageUrl, alt);

            if (success) {
                this.showSuccessState();
                if (!window.CONFIG?.IS_PRODUCTION) {
                    console.log(`✅ Image loaded successfully: ${imagePath}`);
                }
            } else {
                await this.handleImageError(imagePath, alt);
            }
        } catch (error) {
            console.error(`❌ Image load error: ${imagePath}`, error);
            await this.handleImageError(imagePath, alt);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * 이미지 로드 시도
     */
    async attemptImageLoad(imageUrl, alt) {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => {
                this.displayImage(img, alt);
                resolve(true);
            };

            img.onerror = () => {
                resolve(false);
            };

            // 타임아웃 설정 (5초)
            setTimeout(() => {
                resolve(false);
            }, 5000);

            img.src = imageUrl;
        });
    }

    /**
     * 이미지 에러 처리
     */
    async handleImageError(imagePath, alt) {
        this.currentAttempt++;

        if (this.currentAttempt <= this.options.retryAttempts) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log(`🔄 Retrying image load (${this.currentAttempt}/${this.options.retryAttempts}): ${imagePath}`);
            }

            // 재시도 딜레이
            await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));

            // 재시도
            return this.loadImage(imagePath, alt);
        } else {
            // 최종 fallback 표시
            this.showFallbackImage(alt);
        }
    }

    /**
     * 로딩 상태 표시
     */
    showLoadingState() {
        this.container.className = `smart-image ${this.options.loadingClass}`;

        if (this.options.showLoadingIndicator) {
            this.container.innerHTML = `
                <div class="image-loading-indicator">
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                </div>
            `;
        }
    }

    /**
     * 성공 상태 표시
     */
    showSuccessState() {
        this.container.className = `smart-image ${this.options.successClass}`;
    }

    /**
     * 이미지 표시
     */
    displayImage(img, alt) {
        img.alt = alt;
        img.className = 'smart-image-content';

        // 기존 내용 대체
        this.container.innerHTML = '';
        this.container.appendChild(img);
    }

    /**
     * Fallback 이미지 표시
     */
    showFallbackImage(alt) {
        this.container.className = `smart-image ${this.options.errorClass}`;

        const img = new Image();
        img.src = this.options.placeholder;
        img.alt = alt || 'Image not available';
        img.className = 'smart-image-fallback';

        img.onload = () => {
            this.container.innerHTML = '';
            this.container.appendChild(img);
        };

        img.onerror = () => {
            // Placeholder도 실패한 경우 아이콘 표시
            this.container.innerHTML = `
                <div class="image-fallback-icon">
                    <i class="fas fa-image"></i>
                    <span>Image not available</span>
                </div>
            `;
        };

        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log(`🔄 Displaying fallback image`);
        }
    }

    /**
     * 즉시 fallback 표시 (빠른 로딩용)
     */
    showImmediateFallback(alt) {
        this.showFallbackImage(alt);
    }
}

// 전역 헬퍼 함수
window.SmartImage = SmartImage;

// 기존 이미지들을 스마트 이미지로 업그레이드하는 헬퍼
window.upgradeImageToSmart = function(imgElement, imagePath) {
    const container = document.createElement('div');
    container.className = 'smart-image-container';

    // 기존 이미지 요소를 컨테이너로 교체
    imgElement.parentNode.replaceChild(container, imgElement);

    // 스마트 이미지로 로드
    const smartImage = new SmartImage(container);
    smartImage.loadImage(imagePath, imgElement.alt);

    return smartImage;
};

export default SmartImage;