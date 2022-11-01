import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const APIKEY = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: "kanban-42358.firebaseapp.com",
  projectId: "kanban-42358",
  storageBucket: "kanban-42358.appspot.com",
  messagingSenderId: "300388039581",
  appId: "1:300388039581:web:dc35b313665b4c310d8d74",
  measurementId: "G-KCLK585LB9",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
