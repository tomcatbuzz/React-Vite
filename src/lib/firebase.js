import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyDS8AOoDtgPdjDD_NO0jeP5gFDz3KkrEv8",
  authDomain: "react-vite-32a9c.firebaseapp.com",
  projectId: "react-vite-32a9c",
  storageBucket: "react-vite-32a9c.appspot.com",
  messagingSenderId: "758734288121",
  appId: "1:758734288121:web:798a9f101eedbb41cc1e28",
  measurementId: "G-3XTMWSZE5Q"
};

// prior code
// function createFirebaseApp(config) {
//   try {
//     return getApp();
//   } catch {
//     return initializeApp(config);
//   }
// }

// const firebaseApp = initializeApp(firebaseConfig);
// prior code
// export const firebaseApp = createFirebaseApp(firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log('Firebase Good', app)

// FOR TESTING ONLY
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

// initialize my App Check
// export const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_ENTERPRISE_KEY), 
//   isTokenAutoRefreshEnabled: true, 
// })

export const entCheck = () => {
  const siteKey = import.meta.env.VITE_ENTERPRISE_KEY;
  console.log('siteKey', siteKey)
  if (!siteKey) {
    console.error('Missing key')
    return null;
  }
  return initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_ENTERPRISE_KEY), 
    isTokenAutoRefreshEnabled: true, 
  })
}

// Database exports
export const database = getDatabase(app);

// Firestore exports
export const firestore = getFirestore(app);

// Storage exports
export const storage = getStorage(app);
export const STATE_CHANGED = 'state_changed';

// Analytics exports
// export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    // if (typeof window !== 'undefined') {
    const analytics = getAnalytics(app);
    console.log('Analytics initialized successfully');
    return analytics;
  } else {
    console.log('Analytics not supported in this environment');
    return null;
  }
};