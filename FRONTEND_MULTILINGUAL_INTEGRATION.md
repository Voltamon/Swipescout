# Frontend Multilingual Integration

## Overview
The frontend has been updated to automatically send the user's language preference to the backend via HTTP headers.

## Changes Made

### 1. Analysis API Service (`src/services/analysisApi.js`)
**Purpose**: Handles personality analysis and job matching API calls

**Changes**:
- Added `import i18n from '../i18n'` to access current language
- Updated request interceptor to include language headers:

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header for multilingual support
    const currentLanguage = i18n.language || 'en';
    config.headers['x-language'] = currentLanguage;
    config.headers['Accept-Language'] = currentLanguage;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Impact**: 
- ✅ `analyzeUserPersonality()` - Now sends language preference
- ✅ `findCompatibleJobs()` - Now sends language preference
- ✅ `analyzeSkillGaps()` - Now sends language preference
- ✅ `generateCareerPathRecommendations()` - Now sends language preference

### 2. Main API Service (`src/services/api.js`)
**Purpose**: Handles all other API calls (jobs, users, videos, etc.)

**Changes**:
- Added `import i18n from '../i18n'` to access current language
- Updated request interceptor to include language headers:

```javascript
api.interceptors.request.use(
  (config) => {
    token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    
    // Add language header for multilingual support
    const currentLanguage = i18n.language || 'en';
    config.headers['x-language'] = currentLanguage;
    config.headers['Accept-Language'] = currentLanguage;
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Impact**: All API calls now include language headers for future multilingual endpoints

## How It Works

### Language Detection Flow
```
User changes language in UI
    ↓
i18n.language updated (stored in localStorage)
    ↓
API request made (any endpoint)
    ↓
Axios interceptor reads i18n.language
    ↓
Adds headers: x-language and Accept-Language
    ↓
Backend receives language preference
    ↓
Backend returns localized data
    ↓
Frontend displays in user's language
```

### Supported Languages
- **English (en)** - Default fallback
- **Arabic (ar)** - Right-to-left support
- **Chinese (zh)** - Simplified Chinese

### Header Format
```http
GET /api/personality/compatible-jobs HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
x-language: ar
Accept-Language: ar
Content-Type: application/json
```

## Integration with Existing i18n

The frontend already has a robust i18n setup:
- **i18n Instance**: `src/i18n/index.js`
- **Language Detection**: Browser language, localStorage
- **Localize Utility**: `src/utils/localize.js` - Handles multilingual objects
- **Translation Files**: `src/i18n/locales/{en,ar,zh}/*.json`

### Example Usage in Components
```jsx
import { useTranslation } from 'react-i18next';
import localize from '../utils/localize';

const PersonalityTestPage = () => {
  const { t, i18n } = useTranslation();
  
  // i18n.language is automatically sent to backend via axios interceptors
  // No need to manually add language headers!
  
  const response = await findCompatibleJobs();
  // Backend automatically returns data in i18n.language
  
  return (
    <div>
      {/* For UI translations */}
      <h1>{t('personality.title')}</h1>
      
      {/* For database multilingual fields */}
      <p>{localize(response.data.compatibilityReason)}</p>
    </div>
  );
};
```

## Data Flow Example

### When user selects Arabic:
1. **Frontend**: User clicks language selector → Arabic (ar)
2. **i18n**: `i18n.changeLanguage('ar')` → Stored in localStorage
3. **API Call**: `findCompatibleJobs()` called
4. **Interceptor**: Adds `x-language: ar` header
5. **Backend**: Detects `ar` from header
6. **Backend**: Returns Arabic text from JSONB columns
7. **Frontend**: Displays Arabic compatibility reasons, recommendations, etc.

### Multilingual Response Example
```json
{
  "compatibilityReason": "شخصية INTJ متوافقة بشكل ممتاز مع متطلبات Frontend Engineer...",
  "successFactors": [
    "قدرة عالية على التركيز العميق والعمل المستقل",
    "تفكير استراتيجي ورؤية مستقبلية"
  ],
  "challenges": [
    "قد تواجه صعوبة في التواصل مع الفريق"
  ],
  "developmentRecommendations": [
    "تطوير مهارات التواصل الفعال",
    "المشاركة في أنشطة الفريق"
  ]
}
```

## Testing

### Test Language Switching
1. Open PersonalityTestPage
2. Change language to Arabic using language selector
3. Complete personality assessment
4. Verify results display in Arabic:
   - Personality type description
   - Strengths and weaknesses
   - Compatible jobs
   - Success factors
   - Development recommendations

### Test All Languages
- **English**: Default, all text in English
- **Arabic**: RTL layout, Arabic text
- **Chinese**: Simplified Chinese text

### Browser DevTools Verification
1. Open Network tab
2. Find personality API request
3. Check Request Headers:
   ```
   x-language: ar
   Accept-Language: ar
   ```
4. Check Response data contains Arabic text

## Benefits

✅ **Automatic**: No manual header management in components
✅ **Consistent**: All API calls use same language preference
✅ **Centralized**: One place to update (axios interceptor)
✅ **Type-safe**: i18n language always one of 'en' | 'ar' | 'zh'
✅ **Fallback**: Defaults to 'en' if language undefined
✅ **Synchronized**: Frontend UI language matches backend data language

## Notes for Developers

### When Adding New API Endpoints
- ✅ Language headers automatically included
- ✅ No need to manually add headers
- ✅ Backend should use `getRequestLanguage(req)` utility
- ✅ Return localized data using `getLocalizedValue()`

### When Using Multilingual Data
- Use `localize()` utility for database multilingual fields
- Use `t()` (i18n) for static UI translations
- Backend JSONB fields are already in correct language
- Don't need to manually filter by language

### Debugging
If language not working:
1. Check `i18n.language` in console: `console.log(i18n.language)`
2. Check network request headers in DevTools
3. Verify backend receives header: Check backend logs
4. Ensure backend uses `getRequestLanguage()` and `getLocalizedValue()`

## Future Enhancements
- [ ] Add URL parameter support (e.g., `?lang=ar`)
- [ ] Store user language preference in database
- [ ] Add more languages (French, Spanish, German, etc.)
- [ ] Create language selector component if not exists
- [ ] Add language switch animation/transition
