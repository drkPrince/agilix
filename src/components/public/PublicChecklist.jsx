

import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {Checked, Unchecked} from '../Icons'
import {useState} from 'react'


const PublicChecklist = ({todos}) => {

	const [todoList] = useState(todos)

	return (
		<div>
			<DragDropContext className='bg-gray-600'>
				<Droppable droppableId={'Checklist'}>
					{ (provided, snapshot) => 
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{todoList.map((t, i) => 
								<Draggable draggableId={t.task} index={i} key={t.id}>
						            {(provided, snapshot) => 
						                <div className='flex items-center mt-3 w-full justify-between pr-6' {...provided.draggableProps} ref={provided.innerRef}>
						                    <div className='flex w-2/3'>
						                    	<div className='mr-1'>
						                    		{t.done ? < Checked/> : <Unchecked />}
						                    	</div>
						                    	<h4 className={`ml-2 ${t.done ? 'line-through text-gray-400' : ''}`}>{t.task}</h4>
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
		</div>
	)
}

export default PublicChecklist