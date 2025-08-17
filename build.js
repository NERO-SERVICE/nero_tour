#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('🚀 Starting build process...');

    // Detect environment and load variables accordingly
    const isNetlify = process.env.NETLIFY === 'true';
    const envFilePath = path.join(__dirname, '.env');
    const hasEnvFile = fs.existsSync(envFilePath);

    if (isNetlify) {
        console.log('☁️ Netlify environment detected - using environment variables');
        console.log('Available environment variables:');
        console.log('- GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET');
        console.log('- FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'SET' : 'NOT SET');
        console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
    } else if (hasEnvFile) {
        console.log('📁 Local environment detected - loading from .env file');
        // Use dynamic import for dotenv in ES modules
        const dotenv = await import('dotenv');
        dotenv.config();
    } else {
        console.error('❌ No environment configuration found!');
        console.error('   - For local development: create .env file with your API keys');
        console.error('   - For Netlify: set environment variables in dashboard');
        process.exit(1);
    }

    // Read environment variables (no fallback values)
    const envVars = {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
    };

    console.log('📝 Environment variables loaded:');
    Object.keys(envVars).forEach(key => {
        const value = envVars[key];
        const maskedValue = value && value.length > 10 ? value.substring(0, 10) + '...' : (value || 'NOT_SET');
        console.log(`   ${key}: ${maskedValue}`);
    });

    // Create secure config with obfuscated keys in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Encode sensitive data in base64 for basic obfuscation
    const encodeKey = (key) => {
        if (!key) return '';
        return isProduction ? btoa(key) : key;
    };
    
    // Create the config file content with security measures
    const configContent = `// Seoul Explorer - Configuration File
// 🚀 Auto-generated during build - DO NOT EDIT MANUALLY
// Security: Sensitive data is encoded in production builds

const CONFIG = {
    // Google Maps API Key - Encoded for security
    GOOGLE_MAPS_API_KEY: "${encodeKey(envVars.GOOGLE_MAPS_API_KEY)}",
    
    // Firebase Configuration - Encoded for security
    FIREBASE_CONFIG: {
        apiKey: "${encodeKey(envVars.FIREBASE_API_KEY)}",
        authDomain: "${envVars.FIREBASE_AUTH_DOMAIN || ''}",
        projectId: "${envVars.FIREBASE_PROJECT_ID || ''}",
        storageBucket: "${envVars.FIREBASE_STORAGE_BUCKET || ''}",
        messagingSenderId: "${envVars.FIREBASE_MESSAGING_SENDER_ID || ''}",
        appId: "${envVars.FIREBASE_APP_ID || ''}",
        measurementId: "${envVars.FIREBASE_MEASUREMENT_ID || ''}"
    },
    
    // Security settings
    IS_PRODUCTION: ${isProduction},
    ENCODED_KEYS: ${isProduction},
    
    // Map default settings
    MAP_CONFIG: {
        center: { lat: 37.5665, lng: 126.9780 }, // Seoul center
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        language: 'en',
        region: 'US'
    },
    
    // Location service settings
    LOCATION_CONFIG: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
        trackingInterval: 5000, // Update location every 5 seconds
        language: 'en',
        region: 'US'
    },
    
    // Notification settings
    NOTIFICATION_CONFIG: {
        geofenceRadius: 500, // 500 meters
        enabled: true
    }
};

// Secure key decoding function
function decodeKey(encodedKey) {
    if (!encodedKey) return '';
    try {
        return CONFIG.ENCODED_KEYS ? atob(encodedKey) : encodedKey;
    } catch (e) {
        if (!CONFIG.IS_PRODUCTION) {
            console.warn('⚠️ Key decoding failed, using original');
        }
        return encodedKey;
    }
}

// API key validation - Firebase is optional, Maps is required
function validateConfig() {
    const decodedKey = decodeKey(CONFIG.GOOGLE_MAPS_API_KEY);
    const hasValidMapsKey = decodedKey && 
                           decodedKey.length > 20 && 
                           !decodedKey.includes('NOT_SET') &&
                           decodedKey.startsWith('AIza');
    
    if (!hasValidMapsKey && !CONFIG.IS_PRODUCTION) {
        console.warn('⚠️ Google Maps API key validation failed');
    }
    
    return hasValidMapsKey;
}

// Additional validation specifically for Maps
function validateMapsConfig() {
    const decodedKey = decodeKey(CONFIG.GOOGLE_MAPS_API_KEY);
    return decodedKey && 
           decodedKey.length > 30 && 
           decodedKey.startsWith('AIza') &&
           !decodedKey.includes('NOT_SET');
}

// Secure API key getter
function getGoogleMapsKey() {
    return decodeKey(CONFIG.GOOGLE_MAPS_API_KEY);
}

function getFirebaseApiKey() {
    return decodeKey(CONFIG.FIREBASE_CONFIG.apiKey);
}

// Export for global use with security functions
window.CONFIG = CONFIG;
window.validateConfig = validateConfig;
window.getGoogleMapsKey = getGoogleMapsKey;
window.getFirebaseApiKey = getFirebaseApiKey;
window.decodeKey = decodeKey;

// Build info
window.BUILD_INFO = {
    timestamp: "${new Date().toISOString()}",
    environment: "${isNetlify ? 'netlify' : 'local'}",
    version: "1.0.0",
    source: "${isNetlify ? 'netlify environment variables' : '.env file'}"
};
`;

    // Write the config file
    const configPath = path.join(__dirname, 'src', 'config', 'config.js');
    fs.writeFileSync(configPath, configContent);

    console.log('✅ Config file generated:', configPath);

    // Validate that required environment variables are set
    const missingVars = [];
    const requiredVars = ['GOOGLE_MAPS_API_KEY'];
    const optionalVars = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_STORAGE_BUCKET', 'FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_APP_ID', 'FIREBASE_MEASUREMENT_ID'];

    // Check required variables
    requiredVars.forEach(key => {
        if (!envVars[key] || envVars[key].trim() === '') {
            missingVars.push(key);
        }
    });

    // Check optional variables (just warn)
    const missingOptionalVars = [];
    optionalVars.forEach(key => {
        if (!envVars[key] || envVars[key].trim() === '') {
            missingOptionalVars.push(key);
        }
    });

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(key => console.error(`   - ${key}`));
        console.error('   Please check your environment configuration');
        process.exit(1);
    }

    if (missingOptionalVars.length > 0) {
        console.warn('⚠️  Optional Firebase variables not set (Firebase features will be disabled):');
        missingOptionalVars.forEach(key => console.warn(`   - ${key}`));
    }

    console.log('🎉 Build completed successfully!');
}

// Run the main function
main().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});