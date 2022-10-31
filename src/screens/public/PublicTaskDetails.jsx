import {useState} from 'react'
import {extractPriority} from '../../utils'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import PublicChecklist from '../../components/public/PublicChecklist'


const PublicTaskDetails = ({taskDetails, boardId, columnDetails, closeModal}) => {

	const [updatedDesc] = useState(taskDetails.description)

	return (
		<div className='md:px-12 text-sm md:text-base'>

			<form autoComplete='off'>

				<div >
					<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="title">Title:</label>
					<input maxLength='45' type="text" name='title' className='text-xl md:text-2xl w-full inline-block outline-none' defaultValue={taskDetails.title} readOnly />
				</div>


				<div className="lg:grid lg:grid-cols-8 gap-x-20 w-full">

{/* First column */}
					<div className="col-span-6 mt-12">

						<div>
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block'>Checklist:</label>
							<PublicChecklist todos={taskDetails.todos} taskId={taskDetails.id} boardId={boardId} />
						</div>
						
						<div className="mt-12 w-full">
							<div>
								<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="desc" >Description:</label>
								<ReactMarkdown plugins={[gfm]} className='border border-gray-200 bg-gray-50 px-2 py-3 overflow-y-auto prose text-sm sm:text-base leading-normal  text-gray-900'>
									{taskDetails.description==='' || taskDetails.description===null ? '*No description yet' : updatedDesc}
								</ReactMarkdown>
							</div>
						</div>
					</div>



					
{/* Second column */}
					<div className="col-span-2 mt-12">
						<div className="">
							<label className='text-gray-500 uppercase tracking-wide text-xs sm:text-sm  block' htmlFor="title">Priority:</label>
							<div className="flex items-center">
								{taskDetails.priority}
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
			</form>
		
		</div>
	)
}


export default PublicTaskDetails

