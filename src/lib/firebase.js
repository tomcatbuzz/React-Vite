import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfxbFnc02aos0fRT0bQQB8XCL6-UuN05Y",
  authDomain: "reactweb-b9752.firebaseapp.com",
  databaseURL: "https://reactweb-b9752-default-rtdb.firebaseio.com",
  projectId: "reactweb-b9752",
  storageBucket: "reactweb-b9752.appspot.com",
  messagingSenderId: "393859501157",
  appId: "1:393859501157:web:877f7447bf0528439f8a8c",
  measurementId: "G-YVHKYD2P2Y"
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);

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