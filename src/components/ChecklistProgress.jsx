import {CheckedOutline} from './Icons'

const ChecklistProgress = ({todos}) => {
	const tasksCompleted = todos.filter(todo => todo.done === true)

	return (
		<div className='flex text-sm items-center justify-between '>
			<div className='bg-indigo-100 flex rounded-3xl px-1 py-0.5 text-indigo-900 mr-2'>
				<CheckedOutline className=''/>
				<h4 className=' mr-2 tracking-wide '>{`${tasksCompleted.length}/${todos.length}`}</h4>
			</div>
			<progress className='shadow-2xl w-20' value={tasksCompleted.length} max ={todos.length}></progress>
		</div>
	)
}

export default ChecklistProgress