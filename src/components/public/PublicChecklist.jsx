

import { Checked, Unchecked } from '../Icons'
import { useState } from 'react'


const PublicChecklist = ({ todos }) => {

	const [todoList] = useState(todos)

	return (
		<div>
			{todoList && todoList.map((t, i) =>
				<div key={t.id}>
					<div className='flex items-center mt-3 w-full justify-between pr-6'>
						<div className='flex w-2/3'>
							<div className='mr-1'>
								{t.done ? < Checked /> : <Unchecked />}
							</div>
							<h4 className={`ml-2 ${t.done ? 'line-through text-gray-400' : ''}`}>{t.task}</h4>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default PublicChecklist