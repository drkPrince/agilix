

import {useState} from 'react'
import {DragDropContext} from 'react-beautiful-dnd'
import {db, firebase} from '../firebase/fbConfig'
import {useParams} from 'react-router-dom'
import Column from '../components/Column'
import Modal from '../components/Modal'
import useKanbanData from '../hooks/useKanbanData'
import {Add, Home, Github} from '../components/Icons'
import {Link} from 'react-router-dom'

import AddTask from '../screens/AddTask'



const Kanban = ({userId}) => {

    const {boardId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, setInitialData, boardName} = useKanbanData(userId, boardId)
    console.log(initialData)
    const [filter, setFilter] = useState(null)
    const filters = ['must', 'should', 'could']

	const onDragEnd = (result) => {
        const {destination, source, draggableId} = result

        if(!destination) return

        if(source.droppableId !== 'inProgress' && destination.droppableId === 'inProgress' && initialData.columns.inProgress.taskIds.length === 3)	{
        	console.warn('Cannot be doing more than three')
        	return
        }

        const startColumn = initialData.columns[source.droppableId]    
        const endColumn = initialData.columns[destination.droppableId]    

        if(startColumn === endColumn){
            const newTaskIds = Array.from(endColumn.taskIds)

            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)


            const newColumn = {
                ...endColumn, taskIds: newTaskIds
            }

            const newState = {
                ...initialData, 
                columns: {...initialData.columns, [endColumn.id]: newColumn}
            }

            setInitialData(newState)
            db.collection(`users/${userId}/boards/${boardId}/columns`).doc(startColumn.id)
            	.update({taskIds: newTaskIds})
            return
        }


        const startTaskIDs = Array.from(startColumn.taskIds)
        startTaskIDs.splice(source.index, 1)
        const newStart = {
            ...startColumn, taskIds: startTaskIDs
        }


        const finishTaskIDs = Array.from(endColumn.taskIds)
        finishTaskIDs.splice(destination.index, 0, draggableId)
        const newFinish = {
            ...endColumn, taskIds: finishTaskIDs
        }


        const newState = {
            ...initialData, 
            columns: {
                ...initialData.columns,
                [startColumn.id]: newStart,
                [endColumn.id]: newFinish
            }
        }

        setInitialData(newState)

        db.collection(`users/${userId}/boards/${boardId}/columns`).doc(newStart.id)
            .update({taskIds: startTaskIDs})

        db.collection(`users/${userId}/boards/${boardId}/columns`).doc(newFinish.id)
            .update({taskIds: finishTaskIDs})
    }


    const addCol = (e) => {
        console.log('addCol') 
        e.preventDefault()
        const newColumnName = e.target.elements.newCol.value   
        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc(newColumnName.toLowerCase())
            .set({title: newColumnName, taskIds: []})

        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayUnion(newColumnName.toLowerCase())})

        e.target.elements.newCol.value = ''    
    }



	return (
		<DragDropContext onDragEnd={onDragEnd}>
            {initialData ? 
                (
                <>
                    <Modal modal={modal} setModal={setModal} ariaText='Add a new Modal'>
                        <AddTask boardId={boardId} userId={userId} close={()=>setModal(false)} />
                    </Modal>
                    

                    <div className="pt-16 pb-10 px-20 h-screen space-y-4">

                        <div className='flex justify-between items-baseline' style={{height: '10%'}}>
                            <h4 className='text-xl justify-self-start text-gray-900'>{boardName}</h4>
                        	<div className='flex justify-end items-center mb-5 space-x-10' >
                                <Link to='/' className='flex items-center text-gray-600 hover:text-gray-800 cursor-pointer'>
                                    <Home />
                                    <span>Home</span>
                                </Link>
                                <div className='flex items-center text-gray-600 hover:text-gray-800'>
                                    <Github />
                                    <a href='http://github.com/drkPrince/agileX' target='blank'>Github</a>
                                </div>
                                <div className="flex items-center">
                                    <h3 className='text-gray-500 mr-2'>Show: </h3>
                                        <div className='space-x-3 text-gray-600 flex'>
                                            {filters.map(f => <div key={f} className={`px-2 py-1 hover:text-gray-800 rounded-sm cursor-pointer capitalize ${filter === f ? 'bg-pink-300' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</div>)}
                                            {filter ? <div className='px-2 py-1 cursor-pointer hover:text-gray-800 rounded-sm' onClick={() => setFilter(null)}>All</div> : null}
                                        </div>
                                </div>
                                <div className='bg-gradient-to-tr from-green-100 via-green-200 to-green-300 hover:bg-green-200 text-green-900 rounded-full p-1' onClick={()=>setModal(true)}>
                                    <Add />
                                </div>
                                
                        	</div>
                        </div>

                        <div className="flex items-start space-x-8" style={{height: '90%'}}>
                            {initialData.columnOrder.map(col => {
                                const column = initialData.columns[col]
                                const tasks = column.taskIds.map(t => t)
                                return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} />
                            })}
                            <div>
                                <form onSubmit={addCol}>
                                    <input type="text" name='newCol' placeholder='Add a new Column' />
                                </form>
                            </div>

                        </div>
                    </div>

                    </>
                )
                :
                <h4>Loading Tasks</h4>
            }
        </DragDropContext>
	)
}

export default Kanban