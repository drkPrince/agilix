

const Login = ({loginWithGoogle, signInAnon}) => 
{
	return (
		<>
			<div className='bg-gradient-to-r from-indigo-50 via-blue-50 to-red-50 flex flex-col-reverse md:flex-row md:justify-between px-5 md:px-20 py-12 md:py-24 h-screen'>
				<div className='w-full md:w-7/12 md:pr-12 pt-4'>
					<h1 className='text-3xl md:text-5xl text-primary'>Stay on top of the game called life with Agilix.</h1>
					<p className='mt-3 md:mt-6 text-base md:text-xl text-gray-600 leading-normal'>Agilix is an opinionated, simplified Kanban planner for personal use that helps you organise your life and accomplish more.</p>
					<div className="flex mt-6 md:mt-16 text-sm md:text-base">
		            	<button className='bg-blue-800  px-2 py-1 mr-4 text-gray-100 rounded-sm transform hover:-translate-y-1 transition-transform duration-300' onClick={loginWithGoogle}>Continue with Google</button>
		            	<button className='border border-black  px-2 py-1 text-gray-800 rounded-sm transform hover:-translate-y-1 transition-transform duration-300' onClick={signInAnon}>Continue as Guest <sup>*</sup></button>
					</div>
					<p className='text-xs text-gray-600 mt-6'><sup>*</sup> Your data will be deleted once you log out.</p>
				</div>
				<div className='w-full md:w-5/12'>
	            	<img src={require('../styles/plan.png').default}  alt="plan" />
				</div>
	        </div>
		</>
	)
}

export default Login