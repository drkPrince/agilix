
import {Draggable} from 'react-beautiful-dnd'

import {Low, Medium, High, CheckedOutline} from './Icons'

const Task = ({allData, id, index, boardId, userId, columnDetails, filterBy}) => {
	
	const theTask = allData.tasks[id]

	let matched = ''

	if(filterBy === null){
		matched = 'all'
	}

	else {
		matched = theTask.priority === filterBy
	}

    return (
    	<div className={matched ? '' : 'opacity-10'}>
	        <Draggable draggableId={id} index={index}>
	            {(provided, snapshot) => 
	                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={`shadow transition-colors duration-700 hover:shadow-xl mb-4 rounded px-2 py-3 ${snapshot.isDragging ? 'bg-indigo-800 text-white' : 'bg-white text-gray-800 '}`}>
                    	<div>
                    		<h4 className=''>{theTask.title}</h4>
                    		<div className='flex mt-2'>
                    			{extractPriority(theTask.priority)}
                    			{theTask.todos.length >= 1 && <ChecklistStatus todos={theTask.todos} />}
                    		</div>
                    	</div>
	                </div>
	            }
	        </Draggable>

        </div>
    )
}



export const extractPriority = (priority) => {
	switch(priority)
	{
		case 'could':
		{
			return <Low />
		}

		case 'should':
		{
			return <Medium />
		}

		case 'must':
		{
			return <High />
		}

		default: return null
	}
}


const ChecklistStatus = ({todos}) => {
	const tasksCompleted = todos.filter(todo => todo.done === true)

	return (
		<div className='ml-3 flex text-sm items-center justify-between'>
			<CheckedOutline className=''/>
			<h4 className='text-gray-600 mr-2 tracking-wide'>{`${tasksCompleted.length}/${todos.length}`}</h4>
			<progress className='shadow-2xl w-20' value={tasksCompleted.length} max ={todos.length}></progress>
		</div>
	)
}


export default Task
