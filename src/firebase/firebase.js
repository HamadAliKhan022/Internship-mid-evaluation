import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZgxwnOS2y0xYBhbL6LU-XzQO5JekNlkY",
  authDomain: "portfoliohub-hamad-2026.firebaseapp.com",
  projectId: "portfoliohub-hamad-2026",
  storageBucket: "portfoliohub-hamad-2026.firebasestorage.app",
  messagingSenderId: "278117923432",
  appId: "1:278117923432:web:c71065ef2f6f0e2adad9dd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
