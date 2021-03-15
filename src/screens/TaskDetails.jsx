import {useState, useRef} from 'react'
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
	const newTaskRef = useRef(null)

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
			console.log('ass')
			const taskName = e.target.value
			db.collection(`users/${userId}/boards/${boardId}/tasks`)
				.doc(taskDetails.id)
				.update({todos: firebase.firestore.FieldValue.arrayUnion({task: taskName, done: false})})
			newTaskRef.current.value = ''
		}
	}

	return (
		<div className='px-12'>

			<form onSubmit={updateTask}>

				<div className="mt-8">
					<label className='text-gray-500 block' htmlFor="title">Title:</label>
					<input type="text" name='title' className='text-2xl block w-full inline-block outline-none hover:shadow' defaultValue={taskDetails.title} onChange={(e)=>setTitle(e.target.value)} />
				</div>


				<div className="grid grid-cols-8 gap-x-16">

{/* First column */}
					<div className="col-span-6">
						{taskDetails.todos.length >= 1 ? 
							<div className="mt-12">
								<label className='text-gray-500 block'>Checklist:</label>
								<Checklist todos={taskDetails.todos} taskId={taskDetails.id} boardId={boardId} userId={userId} />
							</div>
						
							: <div className="mt-12">
								<label className='text-gray-500 block mb-2'>Checklist:</label>
								<input ref={newTaskRef} type="text" name='task' placeholder='Add a sub task' onKeyPress={addTodo} className='border-b border-gray-300 outline-none my-2 w-full' />	
							</div>
						}
					</div>


					
{/* Second column */}
					<div className="col-span-2 mt-8">
						<div className="mt-8">
							<label className='text-gray-500 block' htmlFor="title">Priority:</label>
							<div className="flex">
								<select name="priority" defaultValue={taskDetails.priority} className='px-1 py-2 mr-3 outline-none bg-gray-300 rounded-sm hover:bg-gray-400' onChange={(e)=>setPriority(e.target.value)}>
									<option className='bg-gray-200 outline-none my-6 border-none py-3' value="must">Must</option>
									<option className='bg-gray-200 outline-none my-6 border-none py-3' value="should">Should</option>
									<option className='bg-gray-200 outline-none my-6 border-none py-3' value="could">Could</option>
								</select>
								{extractPriority(taskDetails.priority)}
							</div>
						</div>



						<div className="mt-8">
							<label className='text-gray-500 block' htmlFor="title">Status:</label>
							<h4 className='bg-indigo-600 rounded-full text-white px-2 py-1 inline-block mt-1'>{columnDetails.title}</h4>
						</div>



						{taskDetails.dateAdded ? <div className="mt-8">
							<label className='text-gray-500 block' htmlFor="desc" >Date Added:</label>
							<h4 className='tracking-wide'>{new Date(taskDetails.dateAdded.seconds * 1000).toLocaleString()}</h4>
						</div> : null}
					</div>
				</div>

				<div className="mt-8">
					<div className={`${editing ? '' : 'hidden'} grid grid-cols-8 gap-x-12`}>
						<div className=" col-span-4">
							<label className='text-gray-500 block' htmlFor="desc" >Description:</label>
							<textarea name="desc" className='border border-gray-300 w-full px-4 py-3 outline-none h-56 ' defaultValue={taskDetails.description} onChange={(e)=>setNewDesc(e.target.value)} />
						</div>
					
						<div className='w-full col-span-4'>
							<label className='text-gray-500 block' htmlFor="desc" >Live Preview:</label>
							<ReactMarkdown plugins={[gfm]} className='border border-gray-200 px-2 py-3 overflow-y-auto leading-tight prose prose-md'>{updatedDesc}</ReactMarkdown>
						</div>
					</div>

					<div className={`${editing ? 'hidden' : ''} mt-8`} onClick={()=>setEditing(true)}>
						<label className='text-gray-500 block' htmlFor="desc" >Description:</label>
						<ReactMarkdown plugins={[gfm]} className='border border-gray-100 px-2 py-3 overflow-y-auto prose prose-md w-full'>
							{taskDetails.description==='' || taskDetails.description===null ? '*No description yet, type here to add*' : updatedDesc}
						</ReactMarkdown>
					</div>
				</div>
				

{/* Buttons */}
				<div className='my-8 flex justify-end w-full'>
					{(taskDetails.description !== updatedDesc) || (taskDetails.title !== updatedTitle) || (taskDetails.priority !== updatedPriority)
						? 
						<div className='bg-green-700 text-white px-2 py-1 rounded-sm'>
							<button className='cursor-pointer' type='submit'>Save changes</button> 
						</div>
						: null
					}

					<div className='border border-red-700 text-red-700 px-2 py-1 rounded-sm ml-4' onClick={deleteTask}>
						<p className='cursor-pointer'>Delete Task</p>
					</div>	
				</div>
			</form>
		
		</div>
	)
}


export default TaskDetails

