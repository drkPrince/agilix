import {CheckedOutline} from './Icons'

const ChecklistProgress = ({todos}) => {
	const tasksCompleted = todos.filter(todo => todo.done === true)

	return (
		<div className='ml-3 flex text-sm items-center justify-between'>
			<CheckedOutline className=''/>
			<h4 className='text-gray-600 mr-2 tracking-wide'>{`${tasksCompleted.length}/${todos.length}`}</h4>
			<progress className='shadow-2xl w-20' value={tasksCompleted.length} max ={todos.length}></progress>
		</div>
	)
}

export default ChecklistProgress