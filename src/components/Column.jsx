

import {Droppable} from 'react-beautiful-dnd'
import Task from './Task'

const Column = ({column, tasks, allData, boardId, userId, filterBy}) => {

    return (
        <div className='rounded w-1/4 overflow-y-auto max-h-full yo' style={{'minHeight': '20vh', background: '#f2f2f2'}}> 
            <div className='bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-between px-4 py-1 sticky top-0'>
                <h1 className='text-xl block text-indigo-50'>{column.title}</h1>
                <h3 className='text-purple-100 tracking-widest'>{column.id === 'inProgress' ? `${tasks.length}/3` : tasks.length}</h3>
            </div>
            <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => 
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`shadow-inner h-full py-4 px-2 transition-all duration-1000 ${snapshot.isDraggingOver ? 'bg-gradient-to-t from-indigo-300 to-purple-400' : ''}`}>
                        <div>
                            {tasks.map((t, i) =>  
                                <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy}/> )
                            }
                            {provided.placeholder}
                        </div>
                    </div>
                }
            </Droppable>
        </div>

    )
}

export default Column
