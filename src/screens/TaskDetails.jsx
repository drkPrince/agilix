import {useState} from 'react'
import {Bin, Save} from '../components/Icons'
import Checklist from '../components/Checklist'
import {db, firebase} from '../firebase/fbConfig'
import {extractPriority} from '../utils'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'


const TaskDetails = ({taskDetails, boardId, userId, columnDetails, closeModal}) => {

	const [updatedTitle, setTitle] = useState(taskDetails.title)
	const [updatedPriority, setPriority] = useState(taskDetails.priority)
	const [updatedDesc, setNewDesc] = useState(taskDetails.description)

	const [editing, setEditing] = useState(false)

	const updateTask = (e) => {
		e.preventDefault()
		closeModal()
		db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskDetails.id)
			.update({title: updatedTitle, priority: updatedPriority, description: updatedDesc})
	}

	const deleteTask = (e) => {
		closeModal()
		db.collection(`users/${userId}/boards/${boardId}/columns`)	
			.doc(columnDetails.id)
			.update({taskIds: firebase.firestore.FieldValue.arrayRemove(taskDetails.id)})
		db.collection(`board/${boardId}/tasks`)
			.doc(taskDetails.id)
			.delete()
	}

	const addTodo = (e) => {
		if(e.key === 'Enter'){
			const taskName = e.target.value
			db.collection(`users/${userId}/boards/${boardId}/tasks`)
				.doc(taskDetails.id)
				.update({todos: firebase.firestore.FieldValue.arrayUnion({task: taskName, done: false})})
		}
	}


	return (
		<div className='px-12'>

			<form onSubmit={updateTask}>
				<div className="mt-8">
					<label className='text-gray-600 block' htmlFor="title">Title:</label>
					<input type="text" name='title' className='text-2xl block w-full inline-block outline-none hover:shadow' defaultValue={taskDetails.title} onChange={(e)=>setTitle(e.target.value)} />
				</div>

				<div className="mt-8">
					<label className='text-gray-600 block' htmlFor="title">Status:</label>
					<h4 className=''>{columnDetails.title}</h4>
				</div>

				
				<div className="mt-8">
					<label className='text-gray-600 block' htmlFor="title">Priority:</label>
					<div className="flex">
						<select name="priority" defaultValue={taskDetails.priority} className='px-1 py-2 mr-3 outline-none bg-gray-300 rounded-sm hover:bg-gray-400' onChange={(e)=>setPriority(e.target.value)}>
							<option className='bg-gray-200 outline-none my-6 border-none py-3' value="must">Must</option>
							<option className='bg-gray-200 outline-none my-6 border-none py-3' value="should">Should</option>
							<option className='bg-gray-200 outline-none my-6 border-none py-3' value="could">Could</option>
						</select>
						{extractPriority(taskDetails.priority)}
					</div>
				</div>
				
				{taskDetails.todos.length >= 1 ? 
					<div className="mt-8">
						<label className='text-gray-600 block'>Checklist:</label>
						<Checklist todos={taskDetails.todos} taskId={taskDetails.id} boardId={boardId} userId={userId} />
					</div>
				
					: <div className="mt-8">
						<input type="text" name='task' placeholder='Add a sub task' onKeyPress={addTodo} className='border-b border-gray-300 outline-none my-2' />
					</div>
				}

				{editing ? 
					<>
						<div className="mt-8">
							<label className='text-gray-600 block' htmlFor="desc" >Description:</label>
							<textarea name="desc" className='border border-gray-300 w-full px-4 py-3 outline-none h-40' cols='50' rows='5' defaultValue={taskDetails.description} onChange={(e)=>setNewDesc(e.target.value)} />
						</div>

						<div className="mt-2" >
							<label className='text-gray-600 block' htmlFor="desc" >Preview:</label>
							<ReactMarkdown plugins={[gfm]} className='border border-gray-200 px-2 py-3'>{updatedDesc}</ReactMarkdown>
						</div>
					</>
					: 
					<div className="mt-8" onClick={()=>setEditing(true)}>
						<label className='text-gray-600 block' htmlFor="desc" >Description:</label>
						<ReactMarkdown plugins={[gfm]} className='border-b border-gray-200 pt-3 pb-2'>{updatedDesc}</ReactMarkdown>
					</div>
				}

				{taskDetails.dateAdded ? <div className="mt-8" onClick={()=>setEditing(true)}>
					<label className='text-gray-600 block' htmlFor="desc" >Date Added:</label>
					<h4>{new Date(taskDetails.dateAdded.seconds * 1000).toDateString()}</h4>
				</div> : null}
				


				<div className='my-8 flex justify-end w-full'>
					{(taskDetails.description !== updatedDesc) || (taskDetails.title !== updatedTitle) || (taskDetails.priority !== updatedPriority)
						? 
						<div className='bg-green-700 text-white px-2 py-1 rounded-sm flex items-center'>
							<Save />
							<button className='ml-1 cursor-pointer' type='submit'>Save changes</button> 
						</div>
						: null
					}

					<div className='bg-red-700 text-white px-2 py-1 rounded-sm flex items-center ml-4' onClick={deleteTask}>
						<Bin />
						<p className='ml-1 cursor-pointer'>Delete Task</p>
					</div>	
				</div>
			</form>
		
		</div>
	)
}


export default TaskDetails