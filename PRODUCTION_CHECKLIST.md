# AGRISENSE / FertilizerAI — Production Deployment Checklist

This document outlines the configuration, environment variables, security rules, and verification procedures required to deploy the AGRISENSE recommendation application to production.

---

## 1. Required Frontend Environment Variables
Set these environment variables in your frontend hosting environment (e.g., Firebase Hosting, Vercel, Netlify, Cloudflare Pages):

| Variable Name | Description | Example / Default | Public / Secret |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the deployed FastAPI backend | `https://api.yourdomain.com` | **Public** |
| `VITE_FIREBASE_API_KEY` | Firebase Web Client API Key | `AIzaSy...` | **Public** |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `ai-powered-84c71.firebaseapp.com` | **Public** |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `ai-powered-84c71` | **Public** |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `ai-powered-84c71.firebasestorage.app` | **Public** |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging Sender ID | `264742169058` | **Public** |
| `VITE_FIREBASE_APP_ID` | Firebase Web Application ID | `1:264742169058:web:...` | **Public** |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics Measurement ID | `G-G9Q542BCPL` | **Public** |

> [!NOTE]
> Frontend configuration values are client-side public tokens. **Never** include server private keys (Gemini, OpenWeather, or Firebase Service Account JSON) in frontend code or environment variables.

---

## 2. Required Backend Environment Variables
Set these environment variables in your backend hosting platform (e.g., Render, Railway, Google Cloud Run, AWS ECS, DigitalOcean):

| Variable Name | Description | Example / Default | Public / Secret |
| :--- | :--- | :--- | :--- |
| `PORT` | Web server listening port | `8000` | Public Config |
| `HOST` | Web server binding host | `0.0.0.0` | Public Config |
| `FRONTEND_ORIGIN` | Allowed production frontend origin | `https://app.yourdomain.com` | Public Config |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `https://app.yourdomain.com,http://localhost:5173` | Public Config |
| `WEATHER_API_KEY` | OpenWeather API secret key | `[YOUR_SECRET_KEY]` | **SECRET** |
| `GEMINI_API_KEY` | Google Gemini API secret key | `[YOUR_SECRET_KEY]` | **SECRET** |
| `CROP_MODEL_PATH` | Path to crop ML model joblib | `models/crop_recommendation_model.joblib` | Config |
| `FERTILIZER_MODEL_PATH` | Path to fertilizer ML model joblib | `models/fertilizer_model.joblib` | Config |

---

## 3. Firebase Setup Requirements
1. **Firebase Authentication**:
   - Enable **Email/Password** sign-in provider in Firebase Console → Authentication → Sign-in method.
   - Enable **Google** sign-in provider and configure authorized domains (e.g., `localhost`, your production domain).
2. **Cloud Firestore**:
   - Firestore database initialized in `production` mode in the target region.
   - Deploy `firestore.rules` (see Section 4).

---

## 4. Firestore Security Rules Status
The project contains [`firestore.rules`](firestore.rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile documents and subcollections (users/{userId})
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Top-level recommendations collection
    match /recommendations/{recommendationId} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```
**Deployment instructions**:
- Option A: Run `npx -y firebase-tools deploy --only firestore:rules` after authenticating with Firebase CLI.
- Option B: Copy and paste the contents of `firestore.rules` directly into Firebase Console → Firestore Database → Rules → Publish.

---

## 5. Backend Deployment Requirements
- **Python Version**: Python 3.10, 3.11, or 3.12.
- **Dependencies**: Install from `backend/requirements.txt`:
  ```bash
  pip install -r requirements.txt
  ```
- **ML Artifacts**: Ensure `backend/models/crop_recommendation_model.joblib` and `backend/models/fertilizer_model.joblib` are bundled with the container/service.
- **Production Startup Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
  ```

---

## 6. Frontend Deployment Requirements
- **Build Command**:
  ```bash
  npm run build
  ```
- **Output Directory**: `dist/`
- **SPA Routing**: Configure static web host to rewrite all routes (`/*`) to `/index.html`.

---

## 7. Post-Deployment Verification Tests
Execute the following smoke tests once both services are deployed:

1. **Health Check**:
   - `GET https://<backend-url>/health` → HTTP 200 `{ "status": "ok" }`.
2. **Unified Recommendation**:
   - `POST https://<backend-url>/recommendation` with test payload → HTTP 200 with ML prediction, live weather, and Gemini agronomic advice.
3. **Frontend Connection**:
   - Open production frontend → Complete an Advisor test → Confirm recommendation page renders live backend response.
4. **Authentication & Multi-User Isolation**:
   - Log in with Test User A → generate recommendation → save to favorites.
   - Log out → Log in with Test User B → verify User B sees 0 history and 0 favorites from User A.
