// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBwm9HkBfiV1zcg8KwxBS45uCIrx5LEJjQ",
  authDomain: "peliculas-final.firebaseapp.com",
  projectId: "peliculas-final",
  storageBucket: "peliculas-final.firebasestorage.app",
  messagingSenderId: "696797271486",
  appId: "1:696797271486:web:dec3889a545f3c7f2815ef",
  measurementId: "G-YVE43ZYS6B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
