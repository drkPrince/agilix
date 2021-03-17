import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'

import {Bin} from './Icons'

import {db, firebase} from '../firebase/fbConfig'


const Column = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {

    const deleteCol = (colId, tasks) => {

        db.collection(`users/${userId}/boards/${boardId}/columns`)        
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayRemove(colId)})   


        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc(colId)
            .delete()
                .then(() => {
                    console.log("Column deleted!");
                }).catch(error => {
                    console.error("Error removing document: ", error);
                })



        //Extract and delete its tasks
        tasks.forEach(t => {
            db.collection(`users/${userId}/boards/${boardId}/tasks`)
            .doc(t)
            .delete()
        })
    }

    return (
        <Draggable draggableId={column.id} index={index} key={column.id}>
            {provided => 
                <div {...provided.draggableProps} ref={provided.innerRef} className='rounded mx-6 max-h-full overflow-y-auto fancyNav min-w-max' >
                    <div className='w-72' style={{'minHeight': '20vh',  'backgroundColor': '#f2f2f2'}} >
                        <div {...provided.dragHandleProps} className='bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-between px-4 py-1 sticky top-0'>
                            <div className='flex items-center'>
                                <h1 className='text-xl block text-indigo-50 mr-5'>{column.title}</h1>
                                <h3 className='text-purple-100 tracking-widest'>{tasks.length}</h3>
                            </div>
                            <div className='text-gray-300' onClick={()=>deleteCol(column.id, tasks)}>
                                <Bin />
                            </div>
                        </div>
                        <Droppable droppableId={column.id} type='task'>
                            {(provided, snapshot) => 
                                <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-inner h-full py-4 px-2 transition-all duration-1000 ${snapshot.isDraggingOver ? 'bg-gradient-to-t from-indigo-300 to-purple-400' : ''}`}>
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
