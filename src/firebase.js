import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasAllKeys = Object.values(firebaseConfig).every((value) => Boolean(value))

let app
let auth
let provider
let db
let analytics

if (hasAllKeys) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  auth.useDeviceLanguage()
  provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  db = getFirestore(app)
}

export const firebaseReady = Boolean(app)

export const watchAuthState = (callback) => {
  if (!firebaseReady) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export const signInWithGoogle = async () => {
  if (!firebaseReady) {
    throw new Error('Firebase environment variables are missing. Add them to .env.local before signing in.')
  }
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const signOut = async () => {
  if (!firebaseReady) {
    return
  }
  await firebaseSignOut(auth)
}

export const saveConsent = async ({ uid, optedIn, locale, earningsFocus }) => {
  if (!firebaseReady) {
    console.warn('Firebase not configured yet. Consent will not be persisted.')
    return
  }
  const ref = doc(db, 'userConsents', uid)
  await setDoc(ref, {
    optedIn,
    locale,
    earningsFocus,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export const logTaskCompletion = async ({ uid, taskId, rewardLabel, rewardValue }) => {
  if (!firebaseReady) {
    console.warn('Firebase not configured yet. Task completion stored locally only.')
    return
  }
  await addDoc(collection(db, 'taskHistory'), {
    uid,
    taskId,
    rewardLabel,
    rewardValue,
    createdAt: serverTimestamp(),
  })
}

export const initAnalytics = async () => {
  if (!firebaseReady || analytics) {
    return analytics
  }
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const { getAnalytics } = await import('firebase/analytics')
    analytics = getAnalytics(app)
    return analytics
  } catch (error) {
    console.warn('Analytics setup skipped:', error)
    return null
  }
}

export const logAnalyticsEvent = async (eventName, params = {}) => {
  if (!firebaseReady) return
  const analyticsInstance = await initAnalytics()
  if (!analyticsInstance) return
  try {
    const { logEvent } = await import('firebase/analytics')
    logEvent(analyticsInstance, eventName, params)
  } catch (error) {
    console.warn('Analytics event failed:', error)
  }
}
