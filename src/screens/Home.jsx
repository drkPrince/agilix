

import {db} from '../firebase/fbConfig'
import {BrowserRouter, Route} from 'react-router-dom'
import useBoards from '../hooks/useBoards'

import BoardList from '../components/BoardList'

import {v4 as uuidv4} from 'uuid';

const Home = ({logOut, userId, isAnon, loginWithGoogle, name}) => {

    const boards = useBoards(userId)    

    const addNewBoard = (e) => {
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
                    <BoardList loginWithGoogle={loginWithGoogle} logOut={logOut} boards={boards} addNewBoard={addNewBoard} isAnon={isAnon} name={name}/>
                </Route>

                <Route path='/board/:boardId'>
                    <h4>This will be Kanban</h4>
                </Route>

            </BrowserRouter>

    ) : <div>Bringing boards</div>
}

export default Home