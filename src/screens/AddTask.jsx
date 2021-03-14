
import {useState} from 'react'
import {db, firebase} from '../firebase/fbConfig'
import {v4 as uuidv4} from 'uuid';


const AddTask = ({boardId, userId, close}) => 
{
	const [description, setDescription] = useState(null)

	const addTask = (e) => {
        e.preventDefault()

        const uid = uuidv4()
        const title = e.target.elements.newTaskTitle.value
        const priority = e.target.elements.priority.value

        db.collection(`users/${userId}/boards/${boardId}/tasks`)
        	.doc(uid)
        	.set({title,  priority , description, todos: [], dateAdded: firebase.firestore.FieldValue.serverTimestamp() })

        db.collection(`users/${userId}/boards/${boardId}/columns`)
        	.doc('backlog')
        	.update({taskIds: firebase.firestore.FieldValue.arrayUnion(uid)})

        close()	
    }


	return (
		<div className='p-12'>
			<form onSubmit={addTask} className=''>
				<h4 className='text text-gray-700'>Add a New Task</h4>

				<div className="grid mt-12 grid-cols-12">
					<div className='col-span-8'>
						<label htmlFor="newTaskTitle" className='block'>Title:</label>
						<input type="text" name='newTaskTitle' className='bg-transparent border-b border-gray-400 w-3/4 text-2xl outline-none' />
					</div>
					
					
					<div className='col-span-4'>
			            <label htmlFor="priority" className='block'>Priority:</label>
			            <select name="priority" className='px-1 py-2'>
			            	<option value="must" className=''>Must</option>
			            	<option value="should" className=''>Should</option>
			            	<option value="could" className=''>Could</option>
			            </select>
					</div>
				</div>

				<div className="my-8">
					<label htmlFor="newTaskDescription" className='block'>Description (optional):</label>
					<textarea name="desc" className='border border-gray-300 w-full px-4 py-3 outline-none h-32' defaultValue={description} onChange={(e)=>setDescription(e.target.value)} />
				</div>

	            <button className='bg-purple-500 text-white px-2 py-1 rounded-sm'>Add Task</button>
	        </form>
		</div>
	)
}

export default AddTask