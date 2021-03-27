
import { db } from './firebase/fbConfig'

import {Low, Medium, High} from './components/Icons'

export const extractPriority = (priority) => {
	switch(priority)
	{
		case 'low':
		{
			return <Low />
		}

		case 'medium':
		{
			return <Medium />
		}

		case 'high':
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
	        priority: 'low',
	        dateAdded: new Date(), 
	        todos: []
	    },

	    {
	        id: '2',
	        title: 'You can add detailed Descriptions.', 
	        description: '## Agilix supports Markdown too!\n- Agilix fully supports Github flavoured Markdown.\n- You can do **bold** and *italic*.\n ```\n You can write code too!\n```\n>Pretend this is a great quote.\nTo learn more about Markdown, visit [here](https://commonmark.org/help/).',
	        priority: 'high',
	        dateAdded: new Date(), 
	        todos: []
	    },


	    {
	        id: '3',
	        title: 'Try rearranging tasks and columns', 
	        description: null,
	        priority: 'high',
	        dateAdded: new Date(), 
	        todos: []
	    }, 


	    {
	        id: '4',
	        title: 'Breakdown big tasks into small actionable steps.', 
	        description: 'Remember to make these steps actionable, achievable and small.',
	        priority: 'medium',
	        dateAdded: new Date(), 
	        todos: [{id: 1, task: 'First subtask', done: false}, {id: 3, task: 'And another', done: true}, {id: 2, task: 'You can reorder these too!', done: false}]
	    },


	    {
	    	id: "5",
	    	title: "There are three levels of priority",
	    	priority: "low",
	    	todos:[],
	    	description :"- High\n- Medium\n- Low"
	    },

	    {
	    	id: "6",
	    	title: "Do you like it? 😊",
	    	priority: "medium",
	    	todos:[],
	    	description :"### Tell me your suggestions, feedback or anything at all!\n[This](http://github.com/drkPrince/agilix) is the link to the Github repo. Drop a 🌟 if you like it. \n**Keep a beginner motivated**."
	    },

	    {
	    	id: '7',
	    	title: 'Try changing board and Column names now.',
	    	priority: 'low',
	    	todos: [],
	    	description: ''
	    }


	]

	const columns = [
	    {title: 'Backlog', taskIds: ['1', '2']},
	    {title: 'In Progress', taskIds: ['3', '5', '7']},
	    {title: 'Done', taskIds: ['6']},
	    {title: 'Waiting', taskIds: ['4']}
	]

	const columnOrder = {id: 'columnOrder', order: ['Backlog', 'Waiting', 'In Progress', 'Done']}

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
