import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

import {Bin, Exclaim} from './Icons'

import {db, firebase} from '../firebase/fbConfig'
import {debounce} from '../utils'
import {useState} from 'react'
import Modal from './Modal'


const Column = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {

    const [modal, setModal] = useState(false)

    const deleteCol = (colId, tasks) => {
        db.collection(`users/${userId}/boards/${boardId}/columns`)        
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayRemove(colId)})   

        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc(colId)
            .delete()

        //Extract and delete its tasks
        tasks.forEach(t => {
            db.collection(`users/${userId}/boards/${boardId}/tasks`)
            .doc(t)
            .delete()
        })
    }

    const changeColName = debounce((e, colId) => {
        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc(colId)
            .update({title: e.target.value})
    }, 7000)


    return (
        <>
            <Draggable draggableId={column.id} index={index} key={column.id}>
                {provided => 
                    <div {...provided.draggableProps} ref={provided.innerRef} className='mx-4 max-h-full fancyNav min-w-max relative' >
                        <div className='w-48 sm:w-64' style={{'minHeight': '20vh', 'backgroundColor': '#ecf3ff'}} >
                            <div {...provided.dragHandleProps} className='bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between px-4 py-1 sticky top-0 rounded-sm'>
                                <div className='flex items-center'>
                                    <input className='bg-transparent sm:text-xl text-blue-100 truncate text-lg w-10/12' type="text" defaultValue={column.title} onChange={(e)=>changeColName(e, column.id)} />
                                </div>
                                <div className='text-blue-700 cursor-pointer' onClick={()=>setModal(true)} >
                                    <Bin />
                                </div>
                            </div>
                            <Droppable droppableId={column.id} type='task'>
                                {(provided, snapshot) => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-inner h-full py-4 px-2 transition-all duration-1000 ${snapshot.isDraggingOver ? 'bg-blue-500' : ''}`}>
                                        {tasks.map((t, i) =>  <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy}/> )}
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </div>
                        <Modal modal={modal} setModal={setModal} ariaText='Column Delete confirmation'>
                            <div className='md:px-12'>
                                <div className='text-yellow-600 mb-2'>
                                    <Exclaim />
                                </div>
                                <h2 className='text-base md:text-2xl text-gray-900 mb-2'>Are you sure you want to delete this column?</h2>
                                <h3 className="text-red-600 text-sm md:text-lg">This column and its tasks will be permanently deleted and it cannot be undone.</h3>
                                <div className="my-8 flex">
                                    <button className='border border-red-700 text-red-600 px-2 py-1 rounded-sm mr-4 text-sm md:text-base' onClick={()=>deleteCol(column.id, tasks)}>Yes, delete</button>
                                    <button className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base' onClick={()=>setModal(false)}>No, go back</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                }
            </Draggable>
        </>
    )
}

export default Column





/* 



 */
