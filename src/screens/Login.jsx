
const Login = ({loginWithGoogle, loginAnonymously}) => {
	return (
		<div>
            <button className='bg-blue-600 text-3xl px-2 py-1' onClick={loginWithGoogle}>Login with Google</button>
            <button className='bg-black text-3xl px-2 py-1' onClick={loginAnonymously}>Login Anonymously</button>
        </div>
	)
}

export default Login