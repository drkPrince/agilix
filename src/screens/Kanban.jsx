

import {useState} from 'react'
import {DragDropContext} from 'react-beautiful-dnd'
import {db} from '../firebase/fbConfig'
import {useParams} from 'react-router-dom'
import Column from '../components/Column'
import Modal from '../components/Modal'
import useKanbanData from '../hooks/useKanbanData'
import {Add, Home} from '../components/Icons'
import {Link} from 'react-router-dom'

import AddTask from '../screens/AddTask'



const Kanban = ({userId}) => {

    const {boardId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, setInitialData} = useKanbanData(userId, boardId)
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

	return (
		<DragDropContext onDragEnd={onDragEnd}>
            {initialData ? 
                (
                <>
                    <Modal modal={modal} setModal={setModal} ariaText='Add a new Modal'>
                        <AddTask boardId={boardId} userId={userId} close={()=>setModal(false)}/>
                    </Modal>
                    
                    <div className="py-20 px-28 h-screen">
                        <h4></h4>
                    	<div className='flex justify-end items-center mb-5 space-x-6' style={{height: '10%'}}>
                            <button>Github</button>
                            <div className="flex">
                                <h3 className='text-gray-500 mr-2'>Filters: </h3>
                                    <div className='space-x-3'>
                                        {filters.map(f => <button key={f} className={` capitalize ${filter === f ? 'bg-pink-300' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</button>)}
                                        {filter ? <button className='' onClick={() => setFilter(null)}>All</button> : null}
                                    </div>
                            </div>
                            <div onClick={()=>setModal(true)}>
                                <Add />
                            </div>
                            <div>
                                <Link to='/'><Home /></Link>
                            </div>
                    	</div>
                        <div className="flex items-start" style={{height: '90%'}}>
                            {initialData.columnOrder.map(col => {
                                const column = initialData.columns[col]
                                const tasks = column.taskIds.map(t => t)
                                return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} />
                            })}

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