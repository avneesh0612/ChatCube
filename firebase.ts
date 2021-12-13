import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

export const firebaseApp = {
  apiKey: process.env.firebase_config_api_key,
  authDomain: process.env.firebase_authDomain,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
  measurementId: process.env.firebase_measurementid,
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseApp)
  : firebase.app();

const db = app.firestore();
const storage = firebase.storage();

export { db, storage };
