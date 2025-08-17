/**
 * Firebase Migration Script
 * Firebase Firestore에 더미 데이터를 업로드하는 마이그레이션 스크립트
 * 
 * 사용법:
 * 1. .env 파일에 Firebase 설정 추가
 * 2. node migration/migration.js 실행
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { config } from 'dotenv';
import { categories, landmarks } from './dummydata.js';
import readline from 'readline';

// .env 파일 로드
config();

// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// 색상 코드 (콘솔 출력용)
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// 로깅 헬퍼
const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.magenta}🚀 ${msg}${colors.reset}\n`)
};

// readline 인터페이스 생성
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 사용자 확인 함수
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.toLowerCase());
        });
    });
}

// Firebase 초기화
let app, db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    log.success('Firebase 초기화 성공');
} catch (error) {
    log.error(`Firebase 초기화 실패: ${error.message}`);
    process.exit(1);
}

// 기존 데이터 확인
async function checkExistingData() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const landmarksSnapshot = await getDocs(collection(db, 'landmarks'));
        
        return {
            categoriesCount: categoriesSnapshot.size,
            landmarksCount: landmarksSnapshot.size,
            hasData: categoriesSnapshot.size > 0 || landmarksSnapshot.size > 0
        };
    } catch (error) {
        log.error(`데이터 확인 실패: ${error.message}`);
        return { categoriesCount: 0, landmarksCount: 0, hasData: false };
    }
}

// 카테고리 마이그레이션
async function migrateCategories(batch) {
    log.info('카테고리 마이그레이션 시작...');
    let count = 0;
    
    for (const category of categories) {
        const docRef = doc(db, 'categories', category.id);
        batch.set(docRef, {
            ...category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        count++;
        process.stdout.write(`\r  카테고리 처리 중: ${count}/${categories.length}`);
    }
    
    console.log(); // 줄바꿈
    log.success(`${count}개 카테고리 준비 완료`);
    return count;
}

// 랜드마크 마이그레이션
async function migrateLandmarks(batch) {
    log.info('랜드마크 마이그레이션 시작...');
    let count = 0;
    
    for (const landmark of landmarks) {
        const docRef = doc(db, 'landmarks', landmark.id);
        batch.set(docRef, {
            ...landmark,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        count++;
        process.stdout.write(`\r  랜드마크 처리 중: ${count}/${landmarks.length}`);
    }
    
    console.log(); // 줄바꿈
    log.success(`${count}개 랜드마크 준비 완료`);
    return count;
}

// 마이그레이션 실행
async function runMigration(mode = 'add') {
    log.title('Firebase 마이그레이션 시작');
    
    try {
        // 기존 데이터 확인
        const existing = await checkExistingData();
        if (existing.hasData) {
            log.warning(`기존 데이터 발견: ${existing.categoriesCount}개 카테고리, ${existing.landmarksCount}개 랜드마크`);
            
            if (mode === 'add') {
                const answer = await askQuestion('기존 데이터가 있습니다. 계속하시겠습니까? (y/n): ');
                if (answer !== 'y') {
                    log.info('마이그레이션 취소됨');
                    rl.close();
                    return;
                }
            }
        }
        
        // 배치 작업 시작
        const batch = writeBatch(db);
        
        // 카테고리 마이그레이션
        const categoriesCount = await migrateCategories(batch);
        
        // 랜드마크 마이그레이션
        const landmarksCount = await migrateLandmarks(batch);
        
        // 배치 커밋
        log.info('Firebase에 데이터 전송 중...');
        await batch.commit();
        
        // 완료 메시지
        log.title('✨ 마이그레이션 완료!');
        log.success(`총 ${categoriesCount}개 카테고리 업로드 완료`);
        log.success(`총 ${landmarksCount}개 랜드마크 업로드 완료`);
        
        // 검증
        const verification = await checkExistingData();
        log.info(`검증: ${verification.categoriesCount}개 카테고리, ${verification.landmarksCount}개 랜드마크 확인됨`);
        
    } catch (error) {
        log.error(`마이그레이션 실패: ${error.message}`);
        console.error(error);
    } finally {
        rl.close();
    }
}

// 데이터 삭제 함수 (옵션)
async function clearData() {
    log.title('Firebase 데이터 삭제');
    
    const answer = await askQuestion('⚠️  모든 데이터를 삭제하시겠습니까? (yes/no): ');
    if (answer !== 'yes') {
        log.info('삭제 취소됨');
        rl.close();
        return;
    }
    
    try {
        const batch = writeBatch(db);
        
        // 카테고리 삭제
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        categoriesSnapshot.forEach((document) => {
            batch.delete(doc(db, 'categories', document.id));
        });
        
        // 랜드마크 삭제
        const landmarksSnapshot = await getDocs(collection(db, 'landmarks'));
        landmarksSnapshot.forEach((document) => {
            batch.delete(doc(db, 'landmarks', document.id));
        });
        
        await batch.commit();
        log.success('모든 데이터가 삭제되었습니다');
        
    } catch (error) {
        log.error(`삭제 실패: ${error.message}`);
    } finally {
        rl.close();
    }
}

// CLI 인터페이스
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch(command) {
        case 'clear':
            await clearData();
            break;
        case 'reset':
            await clearData();
            await runMigration('replace');
            break;
        case 'help':
            console.log(`
${colors.bright}Firebase Migration Tool${colors.reset}

사용법:
  node migration/migration.js [command]

명령어:
  (없음)    - 데이터 추가 (기본)
  clear     - 모든 데이터 삭제
  reset     - 모든 데이터 삭제 후 다시 추가
  help      - 도움말 표시

환경설정:
  .env 파일에 Firebase 설정이 필요합니다.
  .env.example 파일을 참고하세요.
            `);
            rl.close();
            break;
        default:
            await runMigration();
    }
}

// 스크립트 실행
main().catch((error) => {
    log.error(`스크립트 실행 실패: ${error.message}`);
    console.error(error);
    process.exit(1);
});