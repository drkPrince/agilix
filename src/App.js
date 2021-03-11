import { useState, useEffect } from 'react'
import { firebase, db } from './firebase/fbConfig'
import Home from './screens/Home'
import { Redirect } from 'react-router-dom'


function App() {

    const [user, loginWithGoogle, loginAnonymously, logOut, error] = useAuth()

    console.log(user)

    if (error)
        return (
            <div>
                <h1>{error}</h1>
                <button className='bg-blue-600 text-3xl px-2 py-1' onClick={loginWithGoogle}>Try again</button>
            </div>
        )

    //Not logged in
    if (user === false) {
        return <LoginScreen loginWithGoogle={loginWithGoogle} loginAnonymously={loginAnonymously} />
    }

    //state of loading
    if (user === null) {
        return 'Loaddding Screen'
    } 
    else return <Home logOut={logOut} userId={user.uid} isAnon={user.isAnonymous} loginWithGoogle={loginWithGoogle}/>
}


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

export default App;


const LoginScreen = ({ loginWithGoogle, loginAnonymously }) => {
    return (
        <div>
            <button className='bg-blue-600 text-3xl px-2 py-1' onClick={loginWithGoogle}>Login with Google</button>
            <button className='bg-black text-3xl px-2 py-1' onClick={loginAnonymously}>Login Anonymously</button>
        </div>
    )
}