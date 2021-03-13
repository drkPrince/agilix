

import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {Checked, Unchecked, Cross, Dragger} from './Icons'
import {firebase, db} from '../firebase/fbConfig'
import {useState} from 'react'


const Checklist = ({todos, taskId, boardId, userId}) => {

	const [todoList, setList] = useState(todos)

	const addSubTask = (e) => {
		if(e.key === 'Enter'){
		 	setList([...todoList, {task: e.target.value, done: false}])
			db.collection(`users/${userId}/boards/${boardId}/tasks`)
				.doc(taskId)
				.update({todos: firebase.firestore.FieldValue.arrayUnion({task: e.target.value, done: false})})
		}
	}

	const checkMark = (e, todo) => {
		const toBeChanged = todoList.filter(t => t.task === todo.task)[0]
		const rest = todoList.filter(t => t.task !== todo.task)
		toBeChanged.done = !toBeChanged.done

		db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskId)
			.update({todos: [...rest, toBeChanged]})
	}

	const deleteSubTask = (taskName) => {
		const filtered = todoList.filter(t => t.task !== taskName)
		setList(filtered)
		db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskId)
			.update({todos: filtered})
	}

	const endOfDrag = (result) => {
		const {destination, source, draggableId} = result
		if(!destination) return
		const toBeMoved = todoList[source.index]
		const newOrder = [...todoList]
		newOrder.splice(source.index, 1)
        newOrder.splice(destination.index, 0, toBeMoved)
        setList(newOrder)
        db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskId)
			.update({todos: newOrder})
	}


	return (
		<div>
			<DragDropContext onDragEnd={endOfDrag} className='bg-gray-600'>
				<Droppable droppableId={'Checklist'}>
					{ (provided, snapshot) => 
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{todoList.map((t, i) => 
								<Draggable draggableId={t.task} index={i} key={t.task}>
						            {(provided, snapshot) => 
						                <div className='flex items-center mt-3 w-full justify-between pr-6' {...provided.draggableProps} ref={provided.innerRef}>
						                    <div className='flex w-2/3'>
						                    	<div className='mr-1' onClick={(e) => checkMark(e, t)} >
						                    		{t.done ? < Checked/> : <Unchecked />}
						                    	</div>
						                    	<h4 className={`ml-2 ${t.done ? 'line-through text-gray-400' : ''}`}>{t.task}</h4>
						                    </div>
											<div onClick={() => deleteSubTask(t.task)}>
												<Cross />
											</div>
											<div {...provided.dragHandleProps} >
												<Dragger />
											</div>
						                </div>
						            }
						        </Draggable>
							)}
							{provided.placeholder}	
						</div>
					}
				</Droppable>
			</DragDropContext>
			<input type="text" name='task' placeholder='Add a sub task' onKeyPress={addSubTask} className='border-b border-gray-300 outline-none my-6 w-full' />	
		</div>
	)
}

export default Checklist