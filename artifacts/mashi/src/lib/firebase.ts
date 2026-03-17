import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy6wfiGiHj-5HNCZYmGFFpD0sC0Vl_LV8",
  authDomain: "mashi-ddfbc.firebaseapp.com",
  projectId: "mashi-ddfbc",
  storageBucket: "mashi-ddfbc.firebasestorage.app",
  messagingSenderId: "637669168604",
  appId: "1:637669168604:web:a444d73682cd8ff8e7eb19",
  measurementId: "G-N2B79HG2GH",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
