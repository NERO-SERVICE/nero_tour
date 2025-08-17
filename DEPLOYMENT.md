# 🚀 Firebase Firestore 연결 오류 해결 가이드

## 🚨 주요 문제: Firestore Connection Failed

**오류 메시지**: `Could not reach Cloud Firestore backend. Connection failed`

이 오류는 주로 **환경변수 설정 문제** 또는 **Firebase 프로젝트 설정 문제**로 발생합니다.

## 📋 Netlify 배포 시 필수 체크리스트

### 1. **Netlify 환경변수 설정 (가장 중요!)**

Netlify Dashboard → Site settings → Environment variables에서 다음 **모든** 변수를 정확히 설정:

⚠️ **중요**: 변수명이 정확히 일치해야 하며, 값에 따옴표 없이 입력하세요.

### 2. **Firebase Console 설정**

#### A. Authentication - Authorized Domains
1. [Firebase Console](https://console.firebase.google.com) → nero-tour-3fcd9
2. **Authentication** → **Settings** → **Authorized domains**
3. 다음 도메인 추가:
   ```
   your-app-name.netlify.app
   *.netlify.app
   ```

#### B. Firestore Database Rules (필수!)
1. **Firestore Database** → **Rules**
2. 다음 규칙으로 교체:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /categories/{document=**} {
         allow read: if true;
         allow write: if false;
       }
       match /landmarks/{document=**} {
         allow read: if true;
         allow write: if false;
       }
       match /{document=**} {
         allow read: if false;
         allow write: if false;
       }
     }
   }
   ```
3. **Publish** 클릭

#### C. Storage Rules
1. **Storage** → **Rules**
2. 다음 규칙으로 교체:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /landmarks/{allPaths=**} {
         allow read: if true;
         allow write: if false;
       }
       match /{allPaths=**} {
         allow read: if false;
         allow write: if false;
       }
     }
   }
   ```
3. **Publish** 클릭

### 3. **Google Cloud Console API 키 설정**

1. [Google Cloud Console](https://console.cloud.google.com)
2. nero-tour-3fcd9 프로젝트 선택
3. **APIs & Services** → **Credentials**
4. Browser API Key 클릭
5. **Application restrictions**:
   - HTTP referrers 선택
   - 다음 URL 추가:
     ```
     https://your-app-name.netlify.app/*
     https://*.netlify.app/*
     http://localhost:*
     ```
6. **API restrictions**:
   - Restrict key 선택
   - 다음 API 선택:
     - Maps JavaScript API
     - Places API
     - Geocoding API

## 🔧 배포 프로세스

### 1. **코드 준비**
```bash
# 하드코딩된 config.js 제거 (중요!)
rm src/config/config.js

# 변경사항 커밋
git add .
git commit -m "Remove hardcoded config for Netlify deployment"
git push origin main
```

### 2. **Netlify 설정**
1. GitHub 레포지토리 연결
2. Build settings:
   - **Build command**: `node build.js`
   - **Publish directory**: `.`
3. Environment variables 모두 설정
4. Deploy

### 3. **배포 확인**
1. Netlify 빌드 로그에서 다음 확인:
   ```
   ☁️ Netlify environment detected
   Available environment variables:
   - GOOGLE_MAPS_API_KEY: SET
   - FIREBASE_API_KEY: SET
   - FIREBASE_PROJECT_ID: SET
   ```

2. 브라우저에서 F12 → Console 확인:
   ```
   ✅ Firebase initialized successfully
   ✅ Config loaded from environment variables
   ```

## 🐛 문제 해결

### A. 환경변수가 로드되지 않는 경우
**증상**: 빌드 로그에 "NOT SET" 표시
**해결**:
1. Netlify → Site settings → Environment variables 재확인
2. 변수명에 공백이나 특수문자 없는지 확인
3. "Clear cache and deploy site" 실행

### B. Firebase 연결 오류가 계속되는 경우
**증상**: "Could not reach Cloud Firestore backend"
**해결**:
1. Firebase Console에서 Authorized domains 재확인
2. Firestore Rules가 `allow read: if true;`인지 확인
3. 프로젝트 ID가 정확한지 확인

### C. CORS 오류 (이미지 로딩 실패)
**해결**:
```bash
# Google Cloud SDK로 CORS 설정
gcloud auth login
gcloud config set project nero-tour-3fcd9
gsutil cors set cors.json gs://nero-tour-3fcd9.firebasestorage.app
```

### D. API 키 오류
**증상**: Google Maps가 로드되지 않음
**해결**:
1. Google Cloud Console에서 API 키의 HTTP referrer에 Netlify 도메인 추가
2. Maps JavaScript API가 활성화되어 있는지 확인

## 📊 디버깅 도구

### 1. **브라우저 콘솔 확인**
```javascript
// 개발자도구 → Console에서 실행
console.log('CONFIG:', window.CONFIG);
console.log('Firebase App:', firebase.apps);
```

### 2. **네트워크 탭 확인**
- F12 → Network → XHR 필터
- firestore.googleapis.com 요청 상태 확인
- 403/401 오류가 있는지 확인

### 3. **Firebase Console 모니터링**
- Firestore → Usage 탭에서 읽기 요청 확인
- Storage → Usage 탭에서 다운로드 확인

## ⚠️ 보안 주의사항

### 절대 하지 말 것:
- ❌ .env 파일을 GitHub에 푸시
- ❌ serviceAccountKey.json을 GitHub에 푸시
- ❌ src/config/config.js를 하드코딩된 값으로 커밋

### 해야 할 것:
- ✅ API 키에 도메인 제한 설정
- ✅ Firestore Rules에서 write 권한 완전 차단
- ✅ 정기적인 API 사용량 모니터링

## 🎯 성공 지표

배포가 성공하면 다음을 확인할 수 있습니다:

1. **Netlify 빌드 로그**:
   ```
   ✅ Config file created successfully
   ✅ All environment variables loaded
   ```

2. **브라우저 콘솔**:
   ```
   ✅ Firebase initialized successfully
   ✅ Firestore connected
   ✅ Landmarks data loaded
   ```

3. **사이트 동작**:
   - 지도가 정상 로드
   - 랜드마크 데이터 표시
   - 이미지 정상 로딩
   - 상세 페이지 동작