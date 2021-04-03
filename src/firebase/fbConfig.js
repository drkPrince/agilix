import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyBh86q0PoUZCgTN9q8lBH0bZ-LtlYawyfU",
    authDomain: "kanban-42358.firebaseapp.com",
    projectId: "kanban-42358",
    storageBucket: "kanban-42358.appspot.com",
    messagingSenderId: "300388039581",
    appId: "1:300388039581:web:dc35b313665b4c310d8d74",
    measurementId: "G-KCLK585LB9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()

// firebase.firestore().enablePersistence()




export {firebase, db}
