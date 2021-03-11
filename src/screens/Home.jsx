
import {useState, useEffect} from 'react'
import {db, firebase} from '../firebase/fbConfig'
import {BrowserRouter, Route, Link} from 'react-router-dom'

import {v4 as uuidv4} from 'uuid';

const Home = ({logOut, userId, isAnon, loginWithGoogle}) => {

    const [boards, setBoards] = useState(null)

    useEffect(() => {
        return db.collection(`users`).doc(userId).get()
            .then(doc => {
                if(doc.exists){
                    return db.collection(`users/${doc.id}/boards`).onSnapshot(snap => {
                        const documents = []
                        snap.forEach(doc => documents.push({id: doc.id, ...doc.data()}))
                        setBoards(documents)
                    })
                }
                else return
            })
        }, []) 


    const addBoard = (e) => {
        e.preventDefault()

        const uid = uuidv4()

        db.collection(`users/${userId}/boards`)
            .doc(uid)
            .set({name: e.target.elements.boardName.value})

        const columnsObject = [{id: 'backlog', title: 'Backlog', taskIds: ['welcome']}, {id: 'inProgress', title: 'In Progress', taskIds: []}, {id: 'ready', title: 'Ready', taskIds: []}, {id: 'done', title: 'Done', taskIds: []}]    

        columnsObject.forEach(c => {
            db.collection(`users/${userId}/boards`)
                .doc(uid)
                .collection('columns')
                .doc(c.id)
                .set({title: c.title, taskIds: c.taskIds})    
        })

        db.collection(`users/${userId}/boards`)
            .doc(uid)
            .collection('tasks')
            .doc('welcome')
            .set({title: 'Welcome to Agility', priority: 'should', todos: [], description: 'Agility is an opinionated Agile planner.'})
    }

    return boards ? (
         <BrowserRouter>
                <Route exact path='/'>
                    <div className='bg-gray-100 mx-12 my-20 p-4'>
                        <div className='flex flex-col my-2'>
                            {isAnon ? <button onClick={loginWithGoogle}>loginWithGoogle</button> : <button className='px-3' onClick={logOut}>Log out</button>}
                            <h1 className='text-5xl'>Your Boards</h1>
                            <div className="flex my-2">
                                {boards.map(b => 
                                    <div className='bg-blue-700 text-white mx-2 py-3 px-2' key={b.id}>
                                        <Link className='text-2xl' to={`/board/${b.id}`} key={b.id}>{b.name}</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <form onSubmit={addBoard} className='my-12'>
                            <h2>Or make a new board</h2>
                            <input type="text" name='boardName' className='bg-transparent border border-green-600 px-2 py-1 rounded-sm' placeholder='Enter a board name' />
                            <button type='submit' className='bg-green-600 px-2 py-1 block my-3' >Add</button>
                        </form>
                    </div>
                </Route>

                <Route path='/board/:boardId'>
                    <h4>This will be home</h4>
                </Route>

            </BrowserRouter>

    ) : <div>Bringing boards</div>
}

export default Home