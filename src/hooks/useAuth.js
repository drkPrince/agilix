import { useState, useEffect } from 'react'
import { firebase, db } from '../firebase/fbConfig'

const useAuth = () => {

    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const loginWithGoogle = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
            setError(null)
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
    }


    const loginAnonymously = async () => {
        firebase.auth().signInAnonymously()
            .then(() => {
                console.log('Anon Signed in')
            })

            .catch((error) => {
                console.log('anon failed')
            });
    }


    const logOut = () => {
        firebase.auth().signOut()
    }



    useEffect(() => {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user)
                db.collection('users')
                    .doc(user.uid)
                    .set({ id: user.uid, name: user.displayName, email: user.email }, { merge: true })
            } else setUser(false)
        })
    }, [user])

    return [user, loginWithGoogle, loginAnonymously, logOut, error]
}


export default useAuth