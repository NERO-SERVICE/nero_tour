/**
 * Geolocation Service - Centralized location management
 * Handles permission checking, caching, and cross-page location access
 */

class GeolocationService {
    constructor() {
        this.currentLocation = null;
        this.permissionStatus = null;
        this.watchId = null;
        this.callbacks = new Set();
        this.lastLocationUpdate = null;
        this.permissionState = {
            hasBeenGranted: false,
            hasBeenDenied: false,
            lastCheckTime: null
        };
        this.initializeService();
    }

    async initializeService() {
        try {
            // Check if Permissions API is supported
            if ('permissions' in navigator) {
                this.permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
                this.permissionStatus.addEventListener('change', () => {
                    this.handlePermissionChange();
                });
            }

            // Try to get cached location from sessionStorage
            this.loadCachedLocation();
            
            // Load permission state from localStorage
            this.loadPermissionState();
        } catch (error) {
            console.warn('⚠️ Permission API not fully supported:', error.message);
        }
    }

    /**
     * Get current location with permission checking
     * @param {Object} options - Geolocation options
     * @returns {Promise<{lat: number, lng: number}>}
     */
    async getCurrentLocation(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes cache
            ...options
        };

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser');
        }

        // Check HTTPS requirement
        if (!this.isSecureContext()) {
            throw new Error('Location access requires a secure connection (HTTPS)');
        }

        // Check permission status with smart handling
        const permission = await this.checkPermissionStatus();
        
        // If permission was previously granted, don't ask again
        if (this.permissionState.hasBeenGranted && permission === 'granted') {
            // Continue with location request
        } 
        // If permission is currently denied but hasn't been permanently denied, 
        // we can still try to request (browser will show prompt)
        else if (permission === 'denied' && !this.shouldSkipPermissionRequest()) {
            // Clear the denied state to allow new request
            this.resetDeniedPermission();
        }
        // If permission is permanently denied, throw error
        else if (permission === 'denied' && this.shouldSkipPermissionRequest()) {
            throw new Error('Location access denied. Please allow location access in your browser settings.');
        }

        // Return cached location if available and fresh
        if (this.currentLocation && this.isCachedLocationFresh(defaultOptions.maximumAge)) {
            console.log('📍 Using cached location:', this.currentLocation);
            return this.currentLocation;
        }

        // Request new location
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    this.lastLocationUpdate = Date.now();
                    this.saveCachedLocation();
                    this.notifyCallbacks(this.currentLocation);
                    
                    // Mark permission as granted for future use
                    this.markPermissionAsGranted();
                    
                    console.log('📍 New location obtained:', this.currentLocation);
                    resolve(this.currentLocation);
                },
                (error) => {
                    // Handle permission denied specifically
                    if (error.code === error.PERMISSION_DENIED) {
                        this.markPermissionAsDenied();
                    }
                    
                    const errorMessage = this.getLocationErrorMessage(error);
                    console.error('❌ Location error:', error.code, errorMessage);
                    reject(new Error(errorMessage));
                },
                defaultOptions
            );
        });
    }

    /**
     * Check current permission status
     * @returns {Promise<string>} - 'granted', 'denied', 'prompt'
     */
    async checkPermissionStatus() {
        try {
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                return permission.state;
            }
        } catch (error) {
            console.warn('⚠️ Could not check permission status:', error.message);
        }
        
        // Fallback: try to detect based on previous attempts
        return this.currentLocation ? 'granted' : 'prompt';
    }

    /**
     * Watch position with automatic permission handling
     * @param {Function} callback - Success callback
     * @param {Function} errorCallback - Error callback  
     * @param {Object} options - Watch options
     */
    async watchPosition(callback, errorCallback, options = {}) {
        try {
            // First get current location to establish permission
            await this.getCurrentLocation(options);
            
            const defaultOptions = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000, // 1 minute for watch
                ...options
            };

            if (this.watchId) {
                navigator.geolocation.clearWatch(this.watchId);
            }

            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    this.lastLocationUpdate = Date.now();
                    this.saveCachedLocation();
                    this.notifyCallbacks(this.currentLocation);
                    
                    if (callback) callback(this.currentLocation);
                },
                (error) => {
                    const errorMessage = this.getLocationErrorMessage(error);
                    console.error('❌ Watch position error:', error.code, errorMessage);
                    if (errorCallback) errorCallback(new Error(errorMessage));
                },
                defaultOptions
            );

        } catch (error) {
            if (errorCallback) errorCallback(error);
        }
    }

    /**
     * Stop watching position
     */
    clearWatch() {
        if (this.watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    /**
     * Add callback for location updates
     * @param {Function} callback - Callback function
     */
    addLocationCallback(callback) {
        this.callbacks.add(callback);
    }

    /**
     * Remove location callback
     * @param {Function} callback - Callback function to remove
     */
    removeLocationCallback(callback) {
        this.callbacks.delete(callback);
    }

    /**
     * Get cached location without requesting new one
     * @returns {Object|null} - Cached location or null
     */
    getCachedLocation() {
        return this.currentLocation;
    }

    /**
     * Check if device has location services enabled
     * @returns {Promise<boolean>}
     */
    async hasLocationSupport() {
        if (!navigator.geolocation) return false;
        if (!this.isSecureContext()) return false;
        
        const permission = await this.checkPermissionStatus();
        return permission !== 'denied';
    }

    // Private methods

    isSecureContext() {
        return location.protocol === 'https:' || 
               location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1';
    }

    isCachedLocationFresh(maxAge) {
        if (!this.currentLocation || !this.lastLocationUpdate) return false;
        return (Date.now() - this.lastLocationUpdate) < maxAge;
    }

    loadCachedLocation() {
        try {
            const cached = sessionStorage.getItem('nero_user_location');
            if (cached) {
                const locationData = JSON.parse(cached);
                // Check if cached location is not too old (1 hour)
                if (Date.now() - locationData.savedAt < 3600000) {
                    this.currentLocation = locationData.location;
                    this.lastLocationUpdate = locationData.savedAt;
                    console.log('📱 Loaded cached location:', this.currentLocation);
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load cached location:', error.message);
        }
    }

    saveCachedLocation() {
        if (!this.currentLocation) return;
        
        try {
            const locationData = {
                location: this.currentLocation,
                savedAt: Date.now()
            };
            sessionStorage.setItem('nero_user_location', JSON.stringify(locationData));
        } catch (error) {
            console.warn('⚠️ Could not cache location:', error.message);
        }
    }

    notifyCallbacks(location) {
        this.callbacks.forEach(callback => {
            try {
                callback(location);
            } catch (error) {
                console.error('❌ Error in location callback:', error);
            }
        });
    }

    handlePermissionChange() {
        if (this.permissionStatus && this.permissionStatus.state === 'denied') {
            this.currentLocation = null;
            this.clearWatch();
            sessionStorage.removeItem('nero_user_location');
            console.log('🚫 Location permission revoked');
        }
    }

    getLocationErrorMessage(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Location access denied. Please allow location access in your browser settings.';
            case error.POSITION_UNAVAILABLE:
                return 'Location unavailable. Please check your device location settings.';
            case error.TIMEOUT:
                return 'Location request timeout. Please try again.';
            default:
                return 'Unknown location error occurred.';
        }
    }

    // Permission state management methods
    
    /**
     * Mark permission as granted and save to localStorage
     */
    markPermissionAsGranted() {
        this.permissionState.hasBeenGranted = true;
        this.permissionState.hasBeenDenied = false;
        this.permissionState.lastCheckTime = Date.now();
        this.savePermissionState();
        console.log('✅ Permission marked as granted');
    }

    /**
     * Mark permission as denied and save to localStorage
     */
    markPermissionAsDenied() {
        this.permissionState.hasBeenDenied = true;
        this.permissionState.hasBeenGranted = false;
        this.permissionState.lastCheckTime = Date.now();
        this.savePermissionState();
        console.log('🚫 Permission marked as denied');
    }

    /**
     * Reset denied permission state to allow new prompts
     */
    resetDeniedPermission() {
        this.permissionState.hasBeenDenied = false;
        this.permissionState.lastCheckTime = Date.now();
        this.savePermissionState();
        console.log('🔄 Denied permission state reset');
    }

    /**
     * Check if we should skip permission request based on previous interactions
     * @returns {boolean}
     */
    shouldSkipPermissionRequest() {
        // If permission was never denied, don't skip
        if (!this.permissionState.hasBeenDenied) {
            return false;
        }

        // If permission was denied very recently (less than 1 minute), skip to avoid spam
        const timeSinceLastDenial = Date.now() - (this.permissionState.lastCheckTime || 0);
        const oneMinute = 60 * 1000;
        
        if (timeSinceLastDenial < oneMinute) {
            return true;
        }

        // Otherwise, allow new request (user might have changed their mind)
        return false;
    }

    /**
     * Check if permission can be requested (not permanently blocked)
     * @returns {Promise<boolean>}
     */
    async canRequestPermission() {
        try {
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                return permission.state !== 'denied' || !this.shouldSkipPermissionRequest();
            }
        } catch (error) {
            console.warn('⚠️ Could not check permission capability:', error.message);
        }
        
        // Fallback: allow request if we can't determine the state
        return !this.shouldSkipPermissionRequest();
    }

    /**
     * Save permission state to localStorage
     */
    savePermissionState() {
        try {
            const stateData = {
                ...this.permissionState,
                domain: window.location.hostname,
                savedAt: Date.now()
            };
            localStorage.setItem('nero_geolocation_state', JSON.stringify(stateData));
        } catch (error) {
            console.warn('⚠️ Could not save permission state:', error.message);
        }
    }

    /**
     * Load permission state from localStorage
     */
    loadPermissionState() {
        try {
            const stored = localStorage.getItem('nero_geolocation_state');
            if (stored) {
                const stateData = JSON.parse(stored);
                
                // Only load if it's for the same domain
                if (stateData.domain === window.location.hostname) {
                    this.permissionState = {
                        hasBeenGranted: stateData.hasBeenGranted || false,
                        hasBeenDenied: stateData.hasBeenDenied || false,
                        lastCheckTime: stateData.lastCheckTime || null
                    };
                    console.log('📱 Loaded permission state:', this.permissionState);
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not load permission state:', error.message);
            // Reset to default state on error
            this.permissionState = {
                hasBeenGranted: false,
                hasBeenDenied: false,
                lastCheckTime: null
            };
        }
    }

    /**
     * Clear all permission states (for testing/debugging)
     */
    clearPermissionState() {
        this.permissionState = {
            hasBeenGranted: false,
            hasBeenDenied: false,
            lastCheckTime: null
        };
        localStorage.removeItem('nero_geolocation_state');
        console.log('🗑️ Permission state cleared');
    }

    /**
     * Get current permission state for debugging
     * @returns {Object}
     */
    getPermissionState() {
        return {
            ...this.permissionState,
            currentPermission: this.permissionStatus?.state || 'unknown'
        };
    }

    /**
     * Request location with smart permission handling
     * This method handles the full flow of permission checking and requesting
     * @param {Object} options - Geolocation options
     * @returns {Promise<{lat: number, lng: number, showedPrompt: boolean}>}
     */
    async requestLocationWithPrompt(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
            ...options
        };

        let showedPrompt = false;

        try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            // Check HTTPS requirement
            if (!this.isSecureContext()) {
                throw new Error('Location access requires a secure connection (HTTPS)');
            }

            // Check if we can make a request
            const canRequest = await this.canRequestPermission();
            if (!canRequest) {
                throw new Error('Location access is currently blocked. Please check your browser settings.');
            }

            // Check if permission was previously granted
            if (this.permissionState.hasBeenGranted) {
                return await this.getCurrentLocation(options);
            }

            // If we get here, we need to show a prompt
            showedPrompt = true;
            
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.currentLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp
                        };
                        
                        this.lastLocationUpdate = Date.now();
                        this.saveCachedLocation();
                        this.notifyCallbacks(this.currentLocation);
                        
                        // Mark permission as granted
                        this.markPermissionAsGranted();
                        
                        console.log('📍 Location obtained with prompt:', this.currentLocation);
                        resolve({
                            ...this.currentLocation,
                            showedPrompt: true
                        });
                    },
                    (error) => {
                        // Handle permission denied
                        if (error.code === error.PERMISSION_DENIED) {
                            this.markPermissionAsDenied();
                        }
                        
                        const errorMessage = this.getLocationErrorMessage(error);
                        console.error('❌ Location request failed:', error.code, errorMessage);
                        reject(new Error(errorMessage));
                    },
                    defaultOptions
                );
            });

        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if location permission prompt should be shown to user
     * @returns {Promise<boolean>}
     */
    async shouldShowPermissionPrompt() {
        // If already granted, no need to prompt
        if (this.permissionState.hasBeenGranted) {
            return false;
        }

        // If recently denied, don't spam
        if (this.shouldSkipPermissionRequest()) {
            return false;
        }

        // Check browser permission state
        try {
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                return permission.state === 'prompt' || 
                       (permission.state === 'denied' && !this.permissionState.hasBeenDenied);
            }
        } catch (error) {
            console.warn('⚠️ Could not check permission state:', error.message);
        }

        // Fallback: show prompt if not explicitly denied recently
        return !this.permissionState.hasBeenDenied || !this.shouldSkipPermissionRequest();
    }
}

// Create singleton instance
const geolocationService = new GeolocationService();

// Export for use in other modules
window.GeolocationService = geolocationService;

export default geolocationService;