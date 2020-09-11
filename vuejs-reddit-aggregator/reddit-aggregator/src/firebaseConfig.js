// src/firebaseConfig.js
import { initializeApp } from "firebase";
import * as firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const app = initializeApp({
  apiKey: "AIzaSyDGHOS9mFP1aBbu-Pkvk5g2R6y4asVoB64",
  authDomain: "reddit-aggregator.firebaseapp.com",
  databaseURL: "https://reddit-aggregator.firebaseio.com",
  projectId: "reddit-aggregator",
  storageBucket: "reddit-aggregator.appspot.com",
  messagingSenderId: "971424320688",
  appId: "1:971424320688:web:6104a14b6d34633b41bf75",
  measurementId: "G-LPMHJ4ZTHF",
});

export const db = app.firestore();
export const subredditCollection = db.collection("subredditList");

export const firebaseLogin = {
  auth: firebase.auth(),
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  },
  logout() {
    firebase
      .auth()
      .signOut()
      .then(function() {})
      .catch(function(error) {
        console.log(error);
      });
  },
};
