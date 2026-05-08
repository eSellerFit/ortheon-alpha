import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOfxiyLh9F5IP00i90RN65h-Lfqgdc",
  authDomain: "ortheon-alpha.firebaseapp.com",
  projectId: "ortheon-alpha",
  storageBucket: "ortheon-alpha.firebasestorage.app",
  messagingSenderId: "451847600863",
  appId: "1:451847600863:web:5f6a851faed2f73502076a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
