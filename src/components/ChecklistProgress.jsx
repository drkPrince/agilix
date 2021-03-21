import {CheckedOutline} from './Icons'

const ChecklistProgress = ({todos}) => {
	const tasksCompleted = todos.filter(todo => todo.done === true)

	return (
		<div className='flex sm:text-sm items-center justify-between text-xs'>
			<div className='bg-blue-100 flex rounded-3xl px-1 sm:px-1.5 py-0.5 text-blue-900 mr-1'>
				<CheckedOutline />
				<h4 className='tracking-wider'>{`${tasksCompleted.length}/${todos.length}`}</h4>
			</div>
			<progress className='shadow-2xl w-12 sm:w-20' value={tasksCompleted.length} max={todos.length}></progress>
		</div>
	)
}

export default ChecklistProgress