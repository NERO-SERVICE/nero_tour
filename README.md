# 🔥 Seoul Explorer - Firebase Edition

A modern, mobile-first web application for exploring Seoul's attractions with Firebase backend integration and interactive Google Maps.

## 🌟 Features

- **🔥 Firebase Backend**: Real-time data from Firestore and images from Firebase Storage
- **🗺️ Interactive Maps**: Google Maps integration with custom markers
- **📍 Location Tracking**: Real-time GPS with detailed address display
- **🏛️ Seoul Landmarks**: Curated attractions stored in Firebase
- **📱 Mobile-First**: Optimized for mobile devices (414px design)
- **💾 Smart Caching**: Intelligent offline support with Firebase fallback

## 🚀 Quick Start

### Prerequisites
- Node.js and npm
- Google Maps API key
- Firebase project

### Installation

1. **Clone and install:**
```bash
git clone <your-repo>
cd Nero-Tour
npm install
```

2. **Configure API keys** in `src/config/config.js`:
```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: "your-google-maps-key",
    FIREBASE_CONFIG: {
        apiKey: "your-firebase-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.firebasestorage.app",
        // ...
    }
};
```

3. **Run development server:**
```bash
npm run dev
```

Visit `http://localhost:8002` (automatically redirects to main app)

## 🏗️ Clean Architecture

```
Nero-Tour/
├── index.html               # Root entry point (redirects to main app)
├── src/
│   ├── components/          # UI Components
│   │   ├── explorer.js      # Main app logic
│   │   ├── map-manager.js   # Google Maps
│   │   └── detail-page.js   # Detail views
│   ├── config/              # Configuration
│   │   ├── config.js        # API keys & settings
│   │   └── firebase.js      # Firebase initialization
│   ├── data/                # Local data (fallback)
│   │   ├── landmarks.js     # Seoul landmarks
│   │   └── categories.js    # Location categories
│   ├── services/            # Business Logic
│   │   ├── data-service.js  # Firebase data management
│   │   ├── image-service.js # Firebase Storage images
│   │   └── maps-manager.js  # Maps coordination
│   ├── pages/               # HTML Pages
│   │   ├── index.html       # Main application page
│   │   ├── map.html         # Full-screen map
│   │   └── detail.html      # Landmark details
│   ├── styles/              # Stylesheets
│   └── assets/              # Static assets
├── build.js                 # Build configuration
├── package.json             # Dependencies
└── netlify.toml            # Deployment config
```

## 🔥 Firebase Integration

### Data Architecture
- **Firestore Collections:**
  - `categories` - Location categories
  - `landmarks` - Seoul attraction data
- **Firebase Storage:**
  - `landmarks/` - Attraction images
- **Smart Fallback:**
  1. Firebase Firestore (primary)
  2. Cached data (5-minute TTL)
  3. Local data files (offline)

### Automatic Setup
Firebase data and images are automatically populated when the app loads. The system:
- ✅ Creates sample landmark images
- ✅ Uploads data to Firestore
- ✅ Configures Storage URLs
- ✅ Tests complete integration

## 🔧 Configuration

### Firebase Setup
1. **Create Firebase project**
2. **Enable services:**
   - Firestore Database
   - Firebase Storage
3. **Set security rules** (development):

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Dev mode
    }
  }
}

// Storage Rules  
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // Dev mode
    }
  }
}
```

## 🔄 Firebase Migration

### Data Migration to Firebase

두 가지 방법으로 Firebase에 데이터를 마이그레이션할 수 있습니다:

#### 방법 1: Client SDK 방식 (권장)

1. **환경 변수 설정** - `.env` 파일 생성:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. **마이그레이션 실행**:
```bash
# 데이터 추가 (기존 데이터 유지)
node migration/migration.js

# 데이터 덮어쓰기 (기존 데이터 삭제 후 새로 추가)
node migration/migration.js reset

# 데이터 삭제만
node migration/migration.js clear

# 도움말
node migration/migration.js help
```

#### 방법 2: Admin SDK 방식

1. **서비스 계정 키 다운로드**:
   - Firebase Console → 프로젝트 설정 → 서비스 계정
   - 새 비공개 키 생성 → `serviceAccountKey.json`으로 저장

2. **마이그레이션 실행**:
```bash
node migration/migrate.js
```

### Migration Data Structure

마이그레이션 시 업로드되는 데이터:
- **7개 카테고리**: Historical, Landmark, Shopping, Modern, Cultural, Nature, Food
- **9개 랜드마크**: 
  - 제주 서낭당
  - 북촌한옥마을
  - 청담대교
  - 경복궁 근정전
  - 잠실주경기장
  - 롯데타워
  - 남산타워
  - 낙산공원
  - 삼성동 코엑스

### 주의사항
- ⚠️ `reset` 명령은 기존 데이터를 완전히 삭제합니다
- 💾 중요한 데이터는 마이그레이션 전 백업하세요
- 🔐 `.env` 파일과 `serviceAccountKey.json`은 절대 커밋하지 마세요

### Google Maps Setup
Enable these APIs in Google Cloud Console:
- Maps JavaScript API
- Places API
- Directions API

## 📱 Mobile-First Design

Optimized for mobile with:
- **414px max-width** (iPhone Pro Max)
- **Touch-friendly UI** with swipe gestures
- **Firebase-powered** fast loading
- **Offline capabilities** with smart caching

## 🌐 Deployment

### Netlify (Recommended)
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `/`
4. Add environment variables for API keys

### Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

## 🎯 Key Benefits

### ⚡ Performance
- **Firebase CDN**: Global image delivery
- **Smart Caching**: 5-minute TTL with offline support
- **Mobile Optimized**: Fast loading on slow networks

### 🔄 Reliability
- **Automatic Fallback**: Firebase → Cache → Local data
- **Error Handling**: Graceful degradation
- **Offline Support**: Cached data when offline

### 🔒 Security
- **Firebase Security Rules**: Configurable access control
- **API Key Management**: Environment-based configuration
- **Domain Restrictions**: Google Cloud Console setup

## 🚀 Production Ready

✅ **Clean codebase** - No test files or development utilities  
✅ **Firebase integration** - Real-time backend with image storage  
✅ **Mobile optimization** - Fast, responsive, touch-friendly  
✅ **Offline support** - Smart caching with fallback strategies  
✅ **Security** - Proper API key management and Firebase rules  

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Test Firebase integration thoroughly
4. Submit Pull Request

## 📄 License

MIT License - see LICENSE file for details.