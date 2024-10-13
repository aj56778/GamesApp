// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7a7Yw5RVqYea8kARCBvuSKSDH_2Gu-rU",
  authDomain: "boardgamesdatingapp.firebaseapp.com",
  projectId: "boardgamesdatingapp",
  storageBucket: "boardgamesdatingapp.appspot.com",
  messagingSenderId: "298717650937",
  appId: "1:298717650937:web:f8e49aded6a7fbbee2a728",
  measurementId: "G-M15VS4RVL8",
  databaseUrl: 'https://boardgamesdatingapp-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app)

export {app, analytics, auth, database, storage}