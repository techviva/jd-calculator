import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
export const initializeFirebase = () => {
  if (getApps().length <= 0) {
    const app = initializeApp(firebaseConfig)
    // Enable analytics in client-side environment
    if (typeof window !== 'undefined' && 'measurementId' in firebaseConfig) {
      getAnalytics(app)
    }
    return app
  }
  return getApps()[0]
}

// Firebase services
export const app = initializeFirebase()
export const auth = getAuth(app)
export const db = getFirestore(app)
