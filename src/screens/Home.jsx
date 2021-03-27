
import {db} from '../firebase/fbConfig'
import {BrowserRouter, Route} from 'react-router-dom'
import useBoards from '../hooks/useBoards'

import BoardList from '../components/BoardList'

import Kanban from './Kanban'

import {v4 as uuidv4} from 'uuid';


const Home = ({logOut, userId, loginWithGoogle, name, isAnon}) => 
{

    const boards = useBoards(userId)    

    const addNewBoard = (e) => {
        e.preventDefault()
        const uid = uuidv4()

        db.collection(`users/${userId}/boards`)
            .doc(uid)
            .set({name: e.target.elements.boardName.value})

        const columnOrder = {id: 'columnOrder', order: []}

        db.collection(`users/${userId}/boards/${uid}/columns`)
            .doc('columnOrder')
            .set(columnOrder)

        e.target.elements.boardName.value = ''   

    }

    const deleteBoard = (id) => {
        db.collection(`users/${userId}/boards`)
            .doc(id)
            .delete()
    }

    return boards !== null ? (
         <BrowserRouter>
                <Route exact path='/'>
                    <BoardList deleteBoard={deleteBoard} logOut={logOut} boards={boards} addNewBoard={addNewBoard} name={name}/>
                </Route>

                <Route path='/board/:boardId'>
                    <Kanban userId={userId} />
                </Route>

            </BrowserRouter>

    ) : <div className="spinner h-screen w-screen" />
}

export default Home