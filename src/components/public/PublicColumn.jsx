import { Droppable, Draggable } from 'react-beautiful-dnd'
import PublicTask from './PublicTask'


const PublicColumn = ({ column, tasks, allData, boardId, userId, filterBy, index }) => {

    return (
        <>
            <Draggable draggableId={column.id} index={index} key={column.id}>
                {provided => 
                    <div {...provided.draggableProps} ref={provided.innerRef} className='mr-5'>
                        <div style={{background: '#edf2ff'}}>
                            <div {...provided.dragHandleProps} className='bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 flex items-center justify-between px-4 py-1 rounded-sm'>
                               <h2 className={`sm:text-lg text-blue-100 truncate text-lg`}>{column.title} </h2>
                            </div>
                            <Droppable droppableId={column.id} type='task'>
                                {(provided, snapshot) => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-sm h-full py-4 px-2 ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-green-400 via-green-200 to-green-100' : ''}`}>
                                        {tasks.map((t, i) =>  <PublicTask allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy}/> )}
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </div>
                    </div>
                }
            </Draggable>
        </>
    )
}

export default PublicColumn