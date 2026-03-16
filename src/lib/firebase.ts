import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5INGjCMf9onOFF7OGBeFJOQTY4PjflUg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "duka-smart-16c8e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "duka-smart-16c8e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "duka-smart-16c8e.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "455090093044",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:455090093044:web:19b332f83d394274fc57a1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JMKXZLBP1H",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config missing — running in demo mode. Public pages will work but auth/database features require Firebase keys.");
  }
} catch (e) {
  console.warn("Firebase initialization failed:", e);
}

export { auth, db };
export default app;
