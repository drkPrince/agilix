import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

import {Bin} from './Icons'

import {db, firebase} from '../firebase/fbConfig'
import {debounce} from '../utils'


const Column = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {

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
        <Draggable draggableId={column.id} index={index} key={column.id}>
            {provided => 
                <div {...provided.draggableProps} ref={provided.innerRef} className='mx-4 max-h-full fancyNav min-w-max relative' >
                    <div className='w-64' style={{'minHeight': '20vh', 'backgroundColor': '#2d69e815'}} >
                        <div {...provided.dragHandleProps} className='bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-between px-4 py-1 sticky top-0 rounded-sm'>
                            <div className='inline-flex items-center'>
                                <input className='bg-transparent text-xl w-2/3 text-blue-100 truncate' type="text" defaultValue={column.title} onChange={(e)=>changeColName(e, column.id)} />
                                <h3 className='text-blue-300 tracking-widest'>{tasks.length}</h3>
                            </div>
                            <div className='text-blue-800' onClick={()=>deleteCol(column.id, tasks)}>
                                <Bin />
                            </div>
                        </div>
                        <Droppable droppableId={column.id} type='task'>
                            {(provided, snapshot) => 
                                <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-inner h-full py-4 px-2 transition-all duration-1000 ${snapshot.isDraggingOver ? 'bg-gradient-to-b from-blue-500 via-indigo-100 to-indigo-200' : ''}`}>
                                    {tasks.map((t, i) =>  <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy}/> )}
                                    {provided.placeholder}
                                </div>
                            }
                        </Droppable>
                    </div>
                </div>
            }
        </Draggable>
    )
}

export default Column





/* 



 */
