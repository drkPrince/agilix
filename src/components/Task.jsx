
import { Draggable } from 'react-beautiful-dnd'
import ChecklistProgress from './ChecklistProgress'
import { extractPriority } from '../utils'

import Modal from './Modal'
import TaskDetails from '../screens/TaskDetails'

import {useState} from 'react'


const Task = ({ allData, id, index, boardId, userId, columnDetails, filterBy }) => {


	const [modal, setModal] = useState(false)

    const theTask = allData.tasks[id]

    let matched = ''

    if (filterBy === null) {
        matched = 'all'
    } else {
        matched = theTask.priority === filterBy
    }

    return (
        <div className={matched ? '' : 'opacity-10'}>

        	<Modal modal={modal} setModal={setModal} ariaText='Task Details'>
        		<TaskDetails taskDetails={theTask} close={()=>setModal(false)} boardId={boardId} userId={userId} columnDetails={columnDetails} />
        	</Modal> 

	        <Draggable draggableId={id} index={index}>
	            {(provided, snapshot) => 
	                <div onClick={()=>setModal(true)} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={`shadow transition-colors duration-700 hover:shadow-xl mb-4 rounded px-2 py-3 ${snapshot.isDragging ? 'bg-indigo-800 text-white' : 'bg-white text-gray-800 '}`}>
                    	<div>
                    		<h4 className=''>{theTask.title}</h4>
                    		<div className='flex mt-2'>
                    			{extractPriority(theTask.priority)}
                    			{theTask.todos.length >= 1 && <ChecklistProgress todos={theTask.todos} />}
                    		</div>
                    	</div>
	                </div>
	            }
	        </Draggable>

        </div>
    )
}







export default Task