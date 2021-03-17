
import { Link } from 'react-router-dom'

const BoardList = ({ loginWithGoogle, logOut, boards, addNewBoard, name }) => {
    return (
        <div className='bg-gray-100 mx-12 my-20 p-4 '>
            <div className='flex flex-col my-2 space-y-3'>
                <div className='flex justify-end'>
                    <button className='px-3 bg-red-200 text-red-800 px-2 py-1 rounded-sm' onClick={logOut}>Log out</button>
                </div>
                <h1>Welcome, {name}</h1>
                <h1 className='text-5xl'>Your Boards</h1>
                <div className="flex my-2">
                    {boards.map(b => 
                        <div className='bg-blue-200 text-blue-600 mx-2 py-8 px-6' key={b.id}>
                            <Link className='text-2xl' to={`/board/${b.id}`} key={b.id}>{b.name}</Link>
                        </div>
                    )}
                </div>
            </div>
            <form onSubmit={addNewBoard} className='my-12'>
                <label htmlFor="boardName" className='block'>Or make a new board</label>
                <input required type="text" name='boardName' className='bg-transparent border border-green-600 px-2 py-1 rounded-sm' placeholder='Enter a board name' />
                <button type='submit' className='bg-green-200 text-green-900 border-green-900 border rounded-sm px-2 py-1 block my-5' >Add</button>
            </form>
        </div>
    )
}

export default BoardList