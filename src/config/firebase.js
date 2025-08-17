// Firebase Configuration and Initialization
// Make sure config.js is loaded before this script
// This file uses Firebase v9+ modular SDK with CDN imports

// Firebase configuration loaded from CONFIG with decoding
function getFirebaseConfig() {
    if (typeof window !== 'undefined' && window.CONFIG?.FIREBASE_CONFIG) {
        const config = window.CONFIG.FIREBASE_CONFIG;
        
        // Decode API key if it's encoded
        const decodedConfig = {
            ...config,
            apiKey: window.getFirebaseApiKey ? window.getFirebaseApiKey() : config.apiKey
        };
        
        return decodedConfig;
    }
    
    return null; // No Firebase config available
}

// Check if Firebase config is valid
function isFirebaseConfigValid(config) {
    return config && 
           config.apiKey && 
           config.projectId && 
           config.apiKey.length > 10 && 
           !config.apiKey.includes('NOT_FOUND') &&
           !config.apiKey.includes('undefined');
}

// Initialize Firebase when the page loads
let FirebaseApp = null;
let FirebaseDB = null;
let FirebaseAuth = null;
let FirebaseAnalytics = null;
let FirebaseFunctions = null;
let FirebaseStorage = null;

function initializeFirebase() {
    try {
        const firebaseConfig = getFirebaseConfig();
        
        // Check if Firebase config is valid
        if (!isFirebaseConfigValid(firebaseConfig)) {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.error('❌ Firebase configuration not available or invalid');
                console.error('Config:', firebaseConfig);
            }
            return false;
        }
        
        // Check if Firebase SDK is loaded from CDN
        if (typeof firebase === 'undefined') {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.error('❌ Firebase SDK not loaded from CDN');
            }
            return false;
        }

        // Only log in development mode
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🔥 Initializing Firebase with config:', {
                projectId: firebaseConfig.projectId,
                authDomain: firebaseConfig.authDomain,
                storageBucket: firebaseConfig.storageBucket
            });
        }

        // Initialize Firebase App
        FirebaseApp = firebase.initializeApp(firebaseConfig);
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('✅ Firebase App initialized');
        }
        
        // Initialize Firestore
        if (firebase.firestore) {
            FirebaseDB = firebase.firestore();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Firestore initialized');
            }
        } else {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.error('❌ Firestore not available');
            }
        }
        
        // Initialize Storage
        if (firebase.storage) {
            FirebaseStorage = firebase.storage();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Firebase Storage initialized');
            }
        } else {
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.error('❌ Firebase Storage not available');
            }
        }
        
        // Initialize Auth
        if (firebase.auth) {
            FirebaseAuth = firebase.auth();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Firebase Auth initialized');
            }
        }
        
        // Initialize Analytics
        if (firebase.analytics && firebaseConfig.measurementId) {
            FirebaseAnalytics = firebase.analytics();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Firebase Analytics initialized');
            }
        }
        
        // Initialize Functions
        if (firebase.functions) {
            FirebaseFunctions = firebase.functions();
            if (!window.CONFIG?.IS_PRODUCTION) {
                console.log('✅ Firebase Functions initialized');
            }
        }
        
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.log('🎉 All Firebase services initialized successfully!');
        }
        return true;
        
    } catch (error) {
        if (!window.CONFIG?.IS_PRODUCTION) {
            console.error('❌ Firebase initialization failed:', error);
            console.error('Error details:', error.message);
        }
        return false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}

// Export for global access - Use getter functions to return current values
window.Firebase = {
    get app() { return FirebaseApp; },
    get db() { return FirebaseDB; },
    get auth() { return FirebaseAuth; },
    get analytics() { return FirebaseAnalytics; },
    get functions() { return FirebaseFunctions; },
    get storage() { return FirebaseStorage; },
    initialize: initializeFirebase,
    isInitialized: () => !!FirebaseApp,
    getStatus: () => ({
        app: !!FirebaseApp,
        db: !!FirebaseDB,
        auth: !!FirebaseAuth,
        storage: !!FirebaseStorage,
        analytics: !!FirebaseAnalytics,
        functions: !!FirebaseFunctions
    })
};