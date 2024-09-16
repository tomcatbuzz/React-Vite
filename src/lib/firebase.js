import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
export const firebaseApp = createFirebaseApp(firebaseConfig);

// FOR TESTING ONLY
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

// initialize my App Check
export const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_ENTERPRISE_KEY), 
  isTokenAutoRefreshEnabled: true, 
})

// Database exports
export const database = getDatabase(firebaseApp);

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

// Analytics exports
export const analytics = typeof window !== "undefined" ? getAnalytics(firebaseApp) : null;
// export const analytics = getAnalytics(firebaseApp); 

// export { appCheck };