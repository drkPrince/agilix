import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


//Your Firebase config object.


// Initialize Firebase
firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()

// firebase.firestore().enablePersistence()

export {firebase, db}
