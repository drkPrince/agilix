

import {useState} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {db, firebase} from '../firebase/fbConfig'

import Column from '../components/Column'
import Modal from '../components/Modal'
import AddTask from '../screens/AddTask'
import {Add, Github} from '../components/Icons'

import useKanbanData from '../hooks/useKanbanData'





const Kanban = ({userId}) => {

    const {boardId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, setInitialData, boardName} = useKanbanData(userId, boardId)
    const [filter, setFilter] = useState(null)
    const filters = ['must', 'should', 'could']

	const onDragEnd = (result) => {

        const {destination, source, draggableId} = result

        if(!destination) return

        if(result.type === 'task')  {

            // if(source.droppableId !== 'inProgress' && destination.droppableId === 'inProgress' && initialData.columns.inProgress.taskIds.length === 3)	{
            	

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

        else {
            const newColumnOrder = Array.from(initialData.columnOrder)
            newColumnOrder.splice(source.index, 1)
            newColumnOrder.splice(destination.index, 0, draggableId)
            setInitialData({...initialData, columnOrder: newColumnOrder})
            db.collection(`users/${userId}/boards/${boardId}/columns`)
                .doc('columnOrder')
                .update({order: newColumnOrder})
        }
    }


    const addCol = (e) => {
        e.preventDefault()
        const newColumnName = e.target.elements.newCol.value   
        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc(newColumnName)
            .set({title: newColumnName, taskIds: []})

        db.collection(`users/${userId}/boards/${boardId}/columns`)
            .doc('columnOrder')
            .update({order: firebase.firestore.FieldValue.arrayUnion(newColumnName)})

        e.target.elements.newCol.value = ''    
    }

    const debounce = (callback, wait) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        }
    }

    const changeBoardName = debounce((ev) => {
            db.collection(`users/${userId}/boards`)
                .doc(boardId)
                .update({name: ev})
    }, 9000);


	return (
		<>
            {initialData ? 
                (
                <>
                    <Modal modal={modal} setModal={setModal} ariaText='Add a new task'>
                        <AddTask boardId={boardId} userId={userId} allCols={initialData.columnOrder} close={()=>setModal(false)} />
                    </Modal>
                    

                    <main className="pb-5 h-screen relative overflow-y-hidden" >

                        <header className='fixed top-8 left-0 w-full'>
                            <div className='flex flex-wrap justify-between items-baseline mx-12 ' style={{height: '10%'}}>
                                <input type="text" defaultValue={boardName} className='text-xl justify-self-start text-gray-900' onChange={(e)=>changeBoardName(e.target.value)} />
                            	<div className='flex flex-wrap items-center mb-5 space-x-10' >
                                    <div className='flex items-center text-gray-600 hover:bg-gray-800 hover:text-gray-100 bg-gray-200 rounded-sm px-2 py-1'>
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
                            
                        </header>

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId='allCols' type='column' direction='horizontal' >
                                {provided => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex items-start mx-6 pt-3 absolute top-20 pr-12" style={{height: '90%'}}>
                                        {initialData.columnOrder.map((col, i) => {
                                            const column = initialData.columns[col]
                                            const tasks = column.taskIds.map(t => t)
                                            return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} />
                                        })}
                                        <div className='border-2 border-gray-300 p-2 rounded mx-6'>
                                            <form onSubmit={addCol}>
                                                <input type="text" name='newCol' placeholder='Add a new Column' />
                                            </form>
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                }
                            </Droppable>
                        </DragDropContext>


                       
                    </main>

                    </>
                )
                :
                <h4>Loading Tasks</h4>
            }
        </>
	)
}

export default Kanban


/* 

<DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId='allCols' type='column' direction='horizontal' >
        {provided => 
            <div {...provided.droppableProps} ref={provided.innerRef} className="inline-flex items-start mx-6 pt-3" style={{height: '90%'}}>
                {initialData.columnOrder.map((col, i) => {
                    const column = initialData.columns[col]
                    const tasks = column.taskIds.map(t => t)
                    return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} />
                })}
                <div className='border-2 border-gray-300 p-2'>
                    <form onSubmit={addCol}>
                        <input type="text" name='newCol' placeholder='Add a new Column' />
                    </form>
                </div>
                {provided.placeholder}
            </div>
        }
    </Droppable>
</DragDropContext>




 */
