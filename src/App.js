

import useAuth from './hooks/useAuth'
import Home from './screens/Home'
import Login from './screens/Login'


const App = () => 
{

    const [user, loginWithGoogle, logOut, error, anon] = useAuth()

    if(navigator.onLine !== true)
    {
        return (
                <div className='p-12'>
                    <div className="my-12">
                        <h1 className='text-xl text-red-800'>The network is disconnected. Connect and try again</h1>
                    </div>
                </div>
            )
    }

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
        return <Login loginWithGoogle={loginWithGoogle} signInAnon={anon}/>
    }

    //state of loading
    if (user === null) {
        return <div className="spinner h-screen w-screen" />
    } 

    //logged in
    else return <Home logOut={logOut} userId={user.uid} name={user.displayName} isAnon={user.isAnonymous}/>
}



export default App;



