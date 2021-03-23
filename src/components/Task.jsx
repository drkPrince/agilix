
import { Draggable } from 'react-beautiful-dnd'
import ChecklistProgress from './ChecklistProgress'
import { extractPriority } from '../utils'

import Modal from './Modal'
import TaskDetails from '../screens/TaskDetails'
import {Description} from './Icons'
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
        <div className={`${matched ? '' : 'opacity-10'}`}>

        	<Modal modal={modal} setModal={setModal} ariaText='Task Details'>
        		<TaskDetails taskDetails={theTask} closeModal={()=>setModal(false)} boardId={boardId} userId={userId} columnDetails={columnDetails} />
        	</Modal> 

	        <Draggable draggableId={id} index={index}>
	            {(provided, snapshot) => 
	                <div onClick={()=>setModal(true)} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={`shadow-lg transition-shadow duration-300 hover:shadow-xl mb-4 rounded px-1.5 py-2.5 ${snapshot.isDragging ? 'bg-gradient-to-r from-red-100 to-blue-100 text-gray-900' : 'bg-white text-gray-800'}`}>
                		<div className='w-full'>
                            <h4 className='text-sm sm:text-base'>{theTask.title}</h4>
                            <div className='flex mt-2 space-x-3 sm:space-x-5'>
                                {extractPriority(theTask.priority)}
                                {theTask.todos.length >= 1 && <ChecklistProgress todos={theTask.todos} />}
                                {(theTask.description !== null && theTask.description?.length > 1) ? <Description /> : null }
                            </div>
                        </div>
	                </div>
	            }
	        </Draggable>

        </div>
    )
}



export default Task