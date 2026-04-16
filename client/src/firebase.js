// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rent-a-ride-5af16.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rent-a-ride-5af16",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rent-a-ride-5af16.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1068277218849",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:1068277218849:web:8966754aa388cea132ed60",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
