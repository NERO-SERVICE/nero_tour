# Firebase Migration Tool

Firebase Firestore에 더미 데이터를 업로드하는 마이그레이션 도구입니다.

## 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 2. 의존성 설치

```bash
cd migration
npm install
```

## 사용법

### 데이터 추가 (기본)
```bash
npm run migrate
```

### 모든 데이터 삭제
```bash
npm run migrate:clear
```

### 데이터 초기화 (삭제 후 다시 추가)
```bash
npm run migrate:reset
```

### 도움말
```bash
npm run migrate:help
```

## 데이터 구조

### Categories
- historical: 역사 유적지
- landmark: 랜드마크
- shopping: 쇼핑
- modern: 현대 건축
- cultural: 문화
- nature: 자연
- food: 음식

### Landmarks
각 랜드마크는 다음 정보를 포함합니다:
- 기본 정보 (이름, 설명, 카테고리)
- 위치 정보 (좌표)
- 방문 정보 (운영시간, 입장료, 교통)
- 팁과 문화 정보
- 상세 섹션 (선택사항)

## 새로운 데이터 추가

`dummydata.js` 파일을 수정하여 새로운 카테고리나 랜드마크를 추가할 수 있습니다:

```javascript
// 새 카테고리 추가
export const categories = [
    // ... 기존 카테고리
    {
        id: 'new-category',
        name: 'New Category',
        nameKorean: '새 카테고리',
        description: 'Description',
        icon: 'fas fa-icon',
        color: '#color'
    }
];

// 새 랜드마크 추가
export const landmarks = [
    // ... 기존 랜드마크
    {
        id: 'new-landmark',
        name: 'New Landmark',
        nameKorean: '새 랜드마크',
        category: 'category-id',
        // ... 나머지 필드
    }
];
```

## 주의사항

1. **Firebase 프로젝트 설정**: Firebase Console에서 Firestore가 활성화되어 있어야 합니다.
2. **보안 규칙**: 마이그레이션을 위해 임시로 쓰기 권한이 필요할 수 있습니다.
3. **기존 데이터**: 기존 데이터가 있을 경우 확인 메시지가 표시됩니다.
4. **이미지 파일**: 이미지는 별도로 Firebase Storage에 업로드해야 합니다.

## 문제 해결

### Firebase 초기화 실패
- `.env` 파일의 설정값이 올바른지 확인하세요
- Firebase 프로젝트가 활성화되어 있는지 확인하세요

### 권한 오류
- Firebase Console > Firestore Database > 규칙에서 쓰기 권한을 확인하세요
- 개발 중에는 테스트 모드를 사용할 수 있습니다

### 모듈 오류
- `package.json`에 `"type": "module"`이 있는지 확인하세요
- Node.js 버전이 14 이상인지 확인하세요