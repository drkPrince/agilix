import { useState, useEffect } from 'react'
import { firebase, db } from '../firebase/fbConfig'

import {createBoardForAnons} from '../utils'

const useAuth = () => 
{
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const loginWithGoogle = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithRedirect(provider)
            setError(null)
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
    }

    const loginAnonymously = () => {
        firebase.auth().signInAnonymously()
            .then((user) => { 
                console.log('Welcome Anon')
                createBoardForAnons(user.user.uid)
        })
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

    return [user, loginWithGoogle, logOut, error, loginAnonymously]
}


export default useAuth