/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8yusQYcMvZPaklfwHGuObz8Cw8TEn8IE",
  authDomain: "hidden-identitydot.firebaseapp.com",
  projectId: "hidden-identitydot",
  storageBucket: "hidden-identitydot.appspot.com",
  messagingSenderId: "407682500109",
  appId: "1:407682500109:web:23864f760da1aa74503744",
  measurementId: "G-B7QPHF3SNX",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const unifiedGamesCollection = collection(db, "unifiedGame");
