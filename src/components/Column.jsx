import {Droppable} from 'react-beautiful-dnd'
import Task from './Task'

const Column = ({column, tasks, allData, boardId, userId, filterBy}) => {

    return (
        <div className='mx-2 rounded overflow-hidden bg-gray-100 w-1/4' style={{'minHeight': '200px'}}> 
            <div className='bg-indigo-400 flex items-center justify-between px-4 py-1'>
                <h1 className='text-xl block text-gray-100'>{column.title}</h1>
                <h3 className='text-indigo-100 tracking-wide'>{column.id === 'inProgress' ? `${tasks.length}/3` : tasks.length}</h3>
            </div>
            <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => 
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`h-full py-4 px-2 transition-all duration-1000 ${snapshot.isDraggingOver ? 'bg-green-300' : ''}`}>
                        <div>
                            {tasks.map((t, i) =>  <Task allData={allData} id={t} index={i} key={t} boardId={boardId} userId={userId} columnDetails={column} filterBy={filterBy}/> )}
                            {provided.placeholder}
                        </div>
                    </div>
                }
            </Droppable>
        </div>

    )
}

export default Column
