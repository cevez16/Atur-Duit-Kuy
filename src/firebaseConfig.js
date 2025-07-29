import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYT2owelCxbtrHFesaIFMHuXz4nJF3Z-A",
  authDomain: "atur-duit-kuy.firebaseapp.com",
  projectId: "atur-duit-kuy",
  storageBucket: "atur-duit-kuy.firebasestorage.app",
  messagingSenderId: "236951025588",
  appId: "1:236951025588:web:d387430d04388b6e7824e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
