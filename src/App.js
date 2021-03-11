

import useAuth from './hooks/useAuth'
import Home from './screens/Home'
import Login from './screens/Login'


function App() {

    const [user, loginWithGoogle, loginAnonymously, logOut, error] = useAuth()

    //error while logging in
    if (error) 
        return (
            <div>
                <h1>{error}</h1>
                <button className='bg-blue-600 text-3xl px-2 py-1' onClick={loginWithGoogle}>Try again</button>
            </div>
        )


    //Not logged in
    if (user === false) {
        return <Login loginWithGoogle={loginWithGoogle} loginAnonymously={loginAnonymously} />
    }

    //state of loading
    if (user === null) {
        return 'Loaddding Screen'
    } 

    //logged in
    else return <Home logOut={logOut} userId={user.uid} isAnon={user.isAnonymous} loginWithGoogle={loginWithGoogle} name={user.displayName}/>
}



export default App;



