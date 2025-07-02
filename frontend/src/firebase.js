// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPl_KRuBcA9Aifh1khJ4fSQypttBc566Y",
  authDomain: "medicalinsurance-5476b.firebaseapp.com",
  projectId: "medicalinsurance-5476b",
  storageBucket: "medicalinsurance-5476b.firebasestorage.app",
  messagingSenderId: "656036362009",
  appId: "1:656036362009:web:bb73d25a33ce318fcd3788"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
