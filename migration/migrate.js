import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { categories, landmarks } from './dummydata.js';
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

// Firestore Migration
async function migrateFirestore() {
    console.log('Starting Firestore migration...');
    
    // Categories 마이그레이션
    const categoriesRef = db.collection('categories');
    for (const category of categories) {
        await categoriesRef.doc(category.id).set(category);
        console.log(`✅ Category migrated: ${category.name}`);
    }
    
    // Landmarks 마이그레이션
    const landmarksRef = db.collection('landmarks');
    for (const landmark of landmarks) {
        await landmarksRef.doc(landmark.id).set(landmark);
        console.log(`✅ Landmark migrated: ${landmark.name}`);
    }
    
    console.log('✨ Firestore migration completed!');
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

// Migration 실행
async function runMigration() {
    try {
        await migrateFirestore();
        await migrateStorage();
        console.log('🎉 All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();