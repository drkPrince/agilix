import {useState} from 'react'
import Checklist from '../components/Checklist'
import {db, firebase} from '../firebase/fbConfig'
import {extractPriority} from '../utils'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import Modal from '../components/Modal'
import {Exclaim} from '../components/Icons'


const TaskDetails = ({taskDetails, boardId, userId, columnDetails, closeModal}) => {

	const [updatedTitle, setTitle] = useState(taskDetails.title)
	const [updatedPriority, setPriority] = useState(taskDetails.priority)
	const [updatedDesc, setNewDesc] = useState(taskDetails.description)
	const [modal, setModal] = useState(false)

	const [editing, setEditing] = useState(false)

	const updateTask = (e) => {
		e.preventDefault()
		closeModal()
		db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskDetails.id)
			.update({title: updatedTitle, priority: updatedPriority, description: updatedDesc})
	}

	const deleteTask = (e) => {
		setModal(false)
		closeModal()
		db.collection(`users/${userId}/boards/${boardId}/columns`)	
			.doc(columnDetails.id)
			.update({taskIds: firebase.firestore.FieldValue.arrayRemove(taskDetails.id)})
		db.collection(`users/${userId}/boards/${boardId}/tasks`)
			.doc(taskDetails.id)
			.delete()
	}

	return (
		<div className='md:px-12 text-sm md:text-base'>
			<Modal modal={modal} setModal={setModal} ariaText='Task Delete confirmation'>
				<div className='md:px-12'>
					<div className='text-yellow-600 mb-2'>
					    <Exclaim />
					</div>
					<h2 className='text-base md:text-2xl text-gray-900'>Are you sure you want to delete this task?</h2>
					<h3 className="text-red-600 text-sm md:text-xl">This cannot be undone.</h3>
					<div className="my-8 flex">
						<button className='border border-red-700 text-red-700 px-2 py-1 rounded-sm mr-4 text-sm md:text-base' onClick={deleteTask}>Yes, delete</button>
						<button className='bg-blue-800 text-gray-100 px-2 py-1 rounded-sm text-sm md:text-base' onClick={()=>setModal(false)}>No, go back</button>
					</div>
				</div>
			</Modal>

			<form onSubmit={updateTask} autoComplete='off'>

				<div >
					<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="title">Title:</label>
					<input maxLength='45' type="text" name='title' className='text-xl md:text-2xl block w-full inline-block outline-none' defaultValue={taskDetails.title} onChange={(e)=>setTitle(e.target.value)} />
				</div>


				<div className="lg:grid lg:grid-cols-8 gap-x-20 w-full">

{/* First column */}
					<div className="col-span-6 mt-12">

						<div>
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block'>Checklist:</label>
							<Checklist todos={taskDetails.todos} taskId={taskDetails.id} boardId={boardId} userId={userId} />
						</div>
						
						<div className="mt-12 w-full">
							<div className={`${editing ? '' : 'hidden'}`}>
								<div className="">
									<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="desc" >Description:</label>
									<textarea name="desc" className='border border-gray-300  px-4 py-3 outline-none h-56 w-full' defaultValue={taskDetails.description} onChange={(e)=>setNewDesc(e.target.value)} />
									<div>
										<div onClick={()=>setEditing(false)} className='inline-block cursor-pointer text-gray-700 px-2 py-0.5 rounded-sm bg-gray-300'>Cancel</div>
									</div>
								</div>
							
								<div className='mt-6'>
									<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm block' htmlFor="desc" >Live Preview:</label>
									<ReactMarkdown plugins={[gfm]} className='border border-gray-200 px-2 py-3 overflow-y-auto leading-normal  prose text-sm sm:text-base leading-tight text-gray-900'>{updatedDesc}</ReactMarkdown>
								</div>
							</div>

							<div className={`${editing ? 'hidden' : ''}`} onClick={()=>setEditing(true)}>
								<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="desc" >Description:</label>
								<ReactMarkdown plugins={[gfm]} className='border border-gray-200 bg-gray-50 px-2 py-3 overflow-y-auto prose text-sm sm:text-base leading-normal  text-gray-900'>
									{taskDetails.description==='' || taskDetails.description===null ? '*No description yet, type here to add*' : updatedDesc}
								</ReactMarkdown>
							</div>
						</div>
					</div>



					
{/* Second column */}
					<div className="col-span-2 mt-12">
						<div className="">
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="title">Priority:</label>
							<div className="flex items-center">
								<select name="priority" defaultValue={taskDetails.priority} className='select' onChange={(e)=>setPriority(e.target.value)}>
									<option className='option' value="high">High</option>
									<option className='option' value="medium">Medium</option>
									<option className='option' value="low">Low</option>
								</select>
								{extractPriority(taskDetails.priority)}
							</div>
						</div>



						<div className="mt-12">
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="title">Status:</label>
							<h4 className='bg-gray-600 rounded-sm text-white px-2 py-1 inline-block'>{columnDetails.title}</h4>
						</div>



						{taskDetails.dateAdded ? <div className="mt-12">
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="desc" >Date Added:</label>
							<h4 className='tracking-wide'>{new Date(taskDetails.dateAdded.seconds * 1000).toLocaleString().split(',')[0]}</h4>
						</div> : null}
					</div>
				</div>

				
				

{/* Buttons */}
				<div className='my-12 flex justify-end w-full text-sm sm:text-base'>
					{(taskDetails.description !== updatedDesc) || (taskDetails.title !== updatedTitle) || (taskDetails.priority !== updatedPriority)
						? 
						<div className='bg-green-700 text-white px-2 py-1 rounded-sm transform hover:-translate-y-1 transition-transform duration-300'>
							<button className='cursor-pointer' type='submit'>Save changes</button> 
						</div>
						: null
					}

					<div className='border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-colors duration-300 px-2 py-0.5 rounded-sm ml-4' onClick={() => setModal(true)}>
						<p className='cursor-pointer'>Delete Task</p>
					</div>	
				</div>
			</form>
		
		</div>
	)
}


export default TaskDetails

