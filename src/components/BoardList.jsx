import { Link } from 'react-router-dom'

const BoardList = ({ loginWithGoogle, logOut, boards, addNewBoard, isAnon, name }) => {
    return (
        <div className='bg-gray-100 mx-12 my-20 p-4'>
            <div className='flex flex-col my-2'>
                {isAnon ? <button onClick={loginWithGoogle}>loginWithGoogle</button> : <button className='px-3' onClick={logOut}>Log out</button>}
                <h1>Welcome, {name}</h1>
                <h1 className='text-5xl'>Your Boards</h1>
                <div className="flex my-2">
                    {boards.map(b => 
                        <div className='bg-blue-700 text-white mx-2 py-3 px-2' key={b.id}>
                            <Link className='text-2xl' to={`/board/${b.id}`} key={b.id}>{b.name}</Link>
                        </div>
                    )}
                </div>
            </div>
            <form onSubmit={addNewBoard} className='my-12'>
                <h2>Or make a new board</h2>
                <input type="text" name='boardName' className='bg-transparent border border-green-600 px-2 py-1 rounded-sm' placeholder='Enter a board name' />
                <button type='submit' className='bg-green-600 px-2 py-1 block my-3' >Add</button>
            </form>
        </div>
    )
}

export default BoardList