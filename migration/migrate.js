import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { categories, landmarks, halalRestaurants } from './dummydata.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8'));

// Firebase Admin 초기화
initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ? `gs://${process.env.FIREBASE_STORAGE_BUCKET}` : 'gs://nero-tour-3fcd9.appspot.com'
});

const db = getFirestore();
const bucket = getStorage().bucket();

// Helper function to clean data for Firestore
function cleanDataForFirestore(data) {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
        // Skip undefined values
        if (value === undefined) {
            continue;
        }
        // Recursively clean nested objects
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            cleaned[key] = cleanDataForFirestore(value);
        } else if (Array.isArray(value)) {
            // Clean arrays
            cleaned[key] = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return cleanDataForFirestore(item);
                }
                return item;
            }).filter(item => item !== undefined);
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

// Firestore Migration
async function migrateFirestore() {
    console.log('Starting Firestore migration...');

    try {
        // Categories 마이그레이션
        const categoriesRef = db.collection('categories');
        for (const category of categories) {
            const cleanedCategory = cleanDataForFirestore(category);
            await categoriesRef.doc(category.id).set(cleanedCategory);
            console.log(`✅ Category migrated: ${category.name}`);
        }

        // Landmarks 마이그레이션
        const landmarksRef = db.collection('landmarks');
        for (const landmark of landmarks) {
            const cleanedLandmark = cleanDataForFirestore(landmark);
            await landmarksRef.doc(landmark.id).set(cleanedLandmark);
            console.log(`✅ Landmark migrated: ${landmark.name}`);
        }

        // Halal Restaurants 마이그레이션
        if (halalRestaurants && halalRestaurants.length > 0) {
            const halalRef = db.collection('halalRestaurants');
            for (const restaurant of halalRestaurants) {
                const cleanedRestaurant = cleanDataForFirestore(restaurant);
                await halalRef.doc(restaurant.id).set(cleanedRestaurant);
                console.log(`✅ Halal restaurant migrated: ${restaurant.name}`);
            }
        }

        console.log('✨ Firestore migration completed!');
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        throw error;
    }
}

// Storage Migration (이미지 업로드)
async function migrateStorage() {
    console.log('Starting Storage migration...');
    
    // 로컬 이미지 파일 업로드 예시
    // const localImagePath = './images/gyeongbokgung.jpg';
    // const destination = 'attractions/gyeongbokgung.jpg';
    
    // await bucket.upload(localImagePath, {
    //     destination: destination,
    //     metadata: {
    //         contentType: 'image/jpeg',
    //     }
    // });
    
    // console.log(`✅ Image uploaded: ${destination}`);
    
    console.log('✨ Storage migration completed!');
}

// Clear all data from Firestore
async function clearFirestore() {
    console.log('🗑️ Clearing all Firestore data...');

    try {
        // Clear categories
        const categoriesSnapshot = await db.collection('categories').get();
        for (const doc of categoriesSnapshot.docs) {
            await doc.ref.delete();
            console.log(`  ❌ Deleted category: ${doc.id}`);
        }

        // Clear landmarks
        const landmarksSnapshot = await db.collection('landmarks').get();
        for (const doc of landmarksSnapshot.docs) {
            await doc.ref.delete();
            console.log(`  ❌ Deleted landmark: ${doc.id}`);
        }

        // Clear halal restaurants
        const halalSnapshot = await db.collection('halalRestaurants').get();
        for (const doc of halalSnapshot.docs) {
            await doc.ref.delete();
            console.log(`  ❌ Deleted halal restaurant: ${doc.id}`);
        }

        console.log('✨ All data cleared!');
    } catch (error) {
        console.error('❌ Clear failed:', error.message);
        throw error;
    }
}

// Show help information
function showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════╗
║           Firebase Migration Tool - Help             ║
╚══════════════════════════════════════════════════════╝

Usage: npm run <command>

Commands:
  migrate       - Upload all data to Firebase
  migrate:clear - Delete all data from Firebase
  migrate:reset - Clear and re-upload all data
  migrate:help  - Show this help message

Data Collections:
  • categories (7 items)
  • landmarks (9 items with KPDH attributes)
  • halalRestaurants (8 items)

Examples:
  npm run migrate       # Upload data
  npm run migrate:clear # Clear all data
  npm run migrate:reset # Reset database
`);
}

// Main execution
async function main() {
    const command = process.argv[2];

    try {
        switch (command) {
            case 'clear':
                await clearFirestore();
                break;
            case 'reset':
                console.log('🔄 Resetting database...');
                await clearFirestore();
                console.log('\n📤 Re-uploading data...');
                await migrateFirestore();
                await migrateStorage();
                console.log('✨ Reset completed!');
                break;
            case 'help':
                showHelp();
                break;
            default:
                await migrateFirestore();
                await migrateStorage();
                console.log('🎉 All migrations completed successfully!');
                break;
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Operation failed:', error);
        process.exit(1);
    }
}

main();