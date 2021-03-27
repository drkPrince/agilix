
import {useState} from 'react'
import {db, firebase} from '../firebase/fbConfig'
import {v4 as uuidv4} from 'uuid';

const AddTask = ({boardId, userId, close, allCols}) => 
{
	const [description, setDescription] = useState(null)

	const addTask = (e) => {
        e.preventDefault()

        const uid = uuidv4()
        const title = e.target.elements.newTaskTitle.value
        const priority = e.target.elements.priority.value
        const column = e.target.elements.column.value

        db.collection(`users/${userId}/boards/${boardId}/tasks`)
        	.doc(uid)
        	.set({title,  priority , description, todos: [], dateAdded: firebase.firestore.FieldValue.serverTimestamp() })

        db.collection(`users/${userId}/boards/${boardId}/columns`)
        	.doc(column)
        	.update({taskIds: firebase.firestore.FieldValue.arrayUnion(uid)})

        close()	
    }


	return (
		<div className='px-3 py-2 md:px-12  text-sm md:text-base'>
			<form onSubmit={addTask} autoComplete='off' >
				<h4 className='text-lg sm:text-2xl text-gray-800'>Add a New Task</h4>

				<div className="mt-6 sm:mt-12">
					<div>
						<label htmlFor="newTaskTitle" className='block text-gray-500'>Title:</label>
						<input maxLength='45' required type="text" name='newTaskTitle' className='bg-transparent border-b border-gray-400 w-3/4 text-lg md:text-2xl outline-none' />
					</div>
					
					<div className="sm:flex my-8">
						<div className=''>
				            <label htmlFor="priority" className=' text-gray-500 block sm:inline'>Priority: </label>
				            <select name="priority" defaultValue='low' className='select'>
				            	<option value="high" className='option'>High</option>
				            	<option value="medium" className='option'>Medium</option>
				            	<option value="low" className='option'>Low</option>
				            </select>
				           
						</div>

						<div className="mt-8 sm:mt-0 sm:ml-12">
							<label className='text-gray-500 block sm:inline' htmlFor="column">Select a column: </label>
							<select name="column" required className='select'>
								{allCols.map(c => <option className='option' value={c} key={c}>{c}</option>)}
							</select>
						</div>
					</div>

				</div>

				<div className="my-8">
					<label htmlFor="newTaskDescription" className='block text-gray-500'>Description (optional):</label>
					<textarea name="desc" className='border border-gray-300 w-full px-4 py-3 outline-none h-32' defaultValue={description} onChange={(e)=>setDescription(e.target.value)} />
				</div>


	            <button className='bg-purple-500 text-white px-2 py-1 rounded-sm'>Add Task</button>
	        </form>
		</div>
	)
}

export default AddTask