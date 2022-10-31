
import {db} from '../firebase/fbConfig'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import useBoards from '../hooks/useBoards'

import BoardList from '../components/BoardList'

import Kanban from './Kanban'

import {v4 as uuidv4} from 'uuid';
import PublicKanban from './public/PublicKanban'
import NotFound from './NotFound'


const Home = ({logOut, userId, name}) => 
{

    const boards = useBoards(userId)    

    const addNewBoard = (e) => {
        e.preventDefault()
        const uid = uuidv4()

        db.collection(`users/${userId}/boards`)
            .doc(uid)
        .set({name: e.target.elements.boardName.value , private: true})

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
               <Routes>

                <Route path='/' element={
                        <BoardList deleteBoard={deleteBoard} logOut={logOut} boards={boards} addNewBoard={addNewBoard} name={name}/>
                    }></Route>

                    <Route path='/board/:boardId' element={
                        <Kanban userId={userId} />
                    }></Route>

                    <Route path='/public-board/:boardId' element={
                            <PublicKanban />
                    }></Route>
                        
                    <Route path="*" element={<NotFound />} />

               </Routes>

            </BrowserRouter>

    ) : <div className="spinner h-screen w-screen" />
}

export default Home