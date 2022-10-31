import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAWXMb5HJHbgeHHQzZT1V3lBvPGqsnM6hg",
    authDomain: "ah-tasks.firebaseapp.com",
    projectId: "ah-tasks",
    storageBucket: "ah-tasks.appspot.com",
    messagingSenderId: "291163592036",
    appId: "1:291163592036:web:7920a36a8d6303e13f1671"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()

// firebase.firestore().enablePersistence()

export {firebase, db}
