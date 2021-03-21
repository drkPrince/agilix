
import { db } from './firebase/fbConfig'

import {Low, Medium, High} from './components/Icons'

export const extractPriority = (priority) => {
	switch(priority)
	{
		case 'could':
		{
			return <Low />
		}

		case 'should':
		{
			return <Medium />
		}

		case 'must':
		{
			return <High />
		}

		default: return null
	}
}



export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    }
}


export const createBoardForAnons = (userId) => {
	const tasks = [
	    {
	        id: '1',
	        title: 'Welcome to Agilix 🙌', 
	        description: 'Agilix is a Kanban planner that helps you to focus on what matters most.',
	        priority: 'could',
	        dateAdded: new Date(), 
	        todos: []
	    },

	    {
	        id: '5',
	        title: 'There are three levels of priority. 🔴 🔶 💚', 
	        description: 'Items with priority **Must** are most important. You should focus on these first. **Should** priority tasks are nice to have done. The **Could** are least important. Do them at last.',
	        priority: 'could',
	        dateAdded: new Date(), 
	        todos: []
	    },

	    {
	        id: '2',
	        title: 'You can add detailed Descriptions.', 
	        description: '## Agilix support Markdown too!',
	        priority: 'must',
	        dateAdded: new Date(), 
	        todos: []
	    },

	    {
	        id: '3',
	        title: 'Try rearranging tasks and columns', 
	        description: null,
	        priority: 'must',
	        dateAdded: new Date(), 
	        todos: []
	    }, 


	    {
	        id: '4',
	        title: 'Breakdown big tasks into small actionable steps.', 
	        description: 'Make these steps actionable, manageable, and small. ',
	        priority: 'must',
	        dateAdded: new Date(), 
	        todos: [{id: 1, task: 'First subtask', done: false}, {id: 3, task: 'And another', done: true}, {id: 2, task: 'You can reorder these too!', done: false}]
	    }
	]

	const columns = [
	    {title: 'Backlog', taskIds: ['1', '2']},
	    {title: 'In Progress', taskIds: ['3']},
	    {title: 'Done', taskIds: ['4', '5']},
	]

	const columnOrder = {id: 'columnOrder', order: ['Backlog', 'In Progress', 'Done']}

	db.collection(`users/${userId}/boards/first/columns`)
	    .doc('columnOrder')
	    .set(columnOrder)

	db.collection(`users/${userId}/boards`)
	    .doc('first')
	    .set({name: 'Main Board'})    

	columns.forEach(c => {
	    db.collection(`users/${userId}/boards/first/columns`)
	        .doc(c.title)
	        .set({title: c.title, taskIds: c.taskIds})
	})    

	tasks.forEach(t => {
	    db.collection(`users/${userId}/boards/first/tasks`)
	        .doc(t.id)
	        .set(t)
	})
}
