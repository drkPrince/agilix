

import {useState} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {db, firebase} from '../firebase/fbConfig'

import Column from '../components/Column'
import Modal from '../components/Modal'
import AddTask from '../screens/AddTask'
import {Add, Github} from '../components/Icons'

import useKanbanData from '../hooks/useKanbanData'
import {debounce} from '../utils'


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

    const changeBoardName = debounce((ev) => {
        db.collection(`users/${userId}/boards`)
            .doc(boardId)
            .update({name: ev})
    }, 7000);


	return (
		<>
            {initialData ? 
                (
                <>
                    <Modal modal={modal} setModal={setModal} ariaText='Add a new task'>
                        <AddTask boardId={boardId} userId={userId} allCols={initialData.columnOrder} close={()=>setModal(false)} />
                    </Modal>
                    

                    <main className="pb-5 h-screen relative">

                        <header className='fixed top-0 pt-6 sm:pt-8 pb-2 sm:pb-4 w-full bg-white z-10 text-sm sm:text-base'>
                            <div className='flex flex-wrap justify-between items-baseline mx-10' >
                                <input type="text" defaultValue={boardName} className='text-xl text-gray-900' onChange={(e)=>changeBoardName(e.target.value)} />
                            	<div className='flex flex-wrap items-center sm:space-x-9' >
                                    <div className='flex items-center text-gray-600 hover:bg-gray-300 bg-gray-200 rounded-sm px-2 py-1 mr-3 hidden sm:flex'>
                                        <Github />
                                        <a href='http://github.com/drkPrince/agileX' target='blank'>Github</a>
                                    </div>
                                    <div className="flex items-center mt-2 sm:mt-0">
                                        <h3 className='text-gray-500 mr-2'>Show: </h3>
                                        <div className='space-x-1 sm:space-x-3 text-gray-600 flex'>
                                            {filters.map(f => <div key={f} className={`px-2 py-1 hover:text-gray-800 rounded-sm cursor-pointer capitalize ${filter === f ? 'bg-blue-200 text-blue-900' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</div>)}
                                            {filter ? <div className='px-2 py-1 cursor-pointer hover:text-blue-800 rounded-sm' onClick={() => setFilter(null)}>All</div> : null}
                                        </div>
                                    </div>
                                    <div className='bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 hover:bg-blue-800 text-white rounded-full p-2 sm:p-1 fixed bottom-4 right-3 sm:static' onClick={()=>setModal(true)}>
                                        <Add />
                                    </div>
                            	</div>
                            </div>
                        </header>


                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId='allCols' type='column' direction='horizontal' >
                                {provided => 
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex items-start mx-6 absolute top-28" style={{height: '90%'}}>
                                        {
                                            initialData?.columnOrder.map((col, i) => {
                                                const column = initialData.columns[col]
                                                const tasks = column.taskIds.map(t => t)
                                                return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} />
                                            }) 
                                        }
                                        {provided.placeholder}
                                        <div className='mx-6'>
                                            <form onSubmit={addCol}>
                                                <input className='px-2 py-1 z-4 placeholder-blue-900 border border-blue-700 text-blue-900 rounded' type="text" name='newCol' placeholder='Add a new Column' />
                                            </form>
                                        </div>
                                    </div>
                                }
                            </Droppable>
                        </DragDropContext>
                    </main>

                    </>
                )
                :
                <div className="spinner h-screen w-screen" />
            }
        </>
	)
}

export default Kanban


