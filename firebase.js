import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDR_3PbaIlaGnWrrolAjfY6Yome8sbjTzE",
  authDomain: "flashcards-ebfb9.firebaseapp.com",
  projectId: "flashcards-ebfb9",
  storageBucket: "flashcards-ebfb9.appspot.com",
  messagingSenderId: "805070399489",
  appId: "1:805070399489:web:65eeecbad63be86c97f800",
  measurementId: "G-WKS3ZRNFBR"
};

let app;
let db;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} else {
  // Server-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

export { app, db };

// Dynamically import analytics only on the client side
export const getAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  }
  return null;
};