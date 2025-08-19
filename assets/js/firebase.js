// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGXN6dWthp8Z4aYP7JvW38O32aG8KRGR4",
  authDomain: "ticket-web-9fa9e.firebaseapp.com",
  projectId: "ticket-web-9fa9e",
  storageBucket: "ticket-web-9fa9e.firebasestorage.app",
  messagingSenderId: "801985358951",
  appId: "1:801985358951:web:29e558c044ecaaa5c8f8c2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
