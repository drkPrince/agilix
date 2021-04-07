

import {useState} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {db, firebase} from '../firebase/fbConfig'
import {Link} from 'react-router-dom'
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
    const filters = ['high', 'medium', 'low']

   
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
                    
                    <main className="pb-2 h-screen w-screen">

                        <div className='flex flex-col h-full'>
                            <header className='bg-white z-10 text-sm sm:text-base py-5 mx-3 md:mx-6'>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <span className='text-xl'>
                                        <Link to='/' className='text-blue-800 hover:text-blue-500'>Boards </Link>
                                        <span className=''>/</span>
                                        <input type="text" defaultValue={boardName} className='text-gray-800 ml-2 w-1/2 truncate' onChange={(e)=>changeBoardName(e.target.value)} />
                                    </span> 
                                    <div className='flex flex-wrap items-center sm:space-x-9'>
                                        <div className="flex items-center mt-2 sm:mt-0 ">
                                            <h3 className='text-gray-500 mr-2'>Show Priority: </h3>
                                            <div className='space-x-1 text-blue-900 flex bg-indigo-50 rounded-sm'>
                                                {filters.map(f => <div key={f} className={`px-3  border-black py-1 hover:bg-blue-600 hover:text-blue-50 cursor-pointer capitalize ${filter === f ? 'bg-blue-600 text-blue-50' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</div>)}
                                                {filter ? <div className='px-2 py-1 cursor-pointer hover:text-blue-700 rounded-sm' onClick={() => setFilter(null)}>All</div> : null}
                                            </div>
                                        </div>
                                        <div className='flex items-center text-blue-900 hover:bg-blue-600 hover:text-blue-50 bg-indigo-50 rounded-sm px-2 py-1 mr-3 hidden sm:flex'>
                                            <Github />
                                            <a href='https://github.com/drkPrince/agilix' target='blank'>Github</a>
                                        </div>
                                        <div className='text-white bg-gradient-to-br from-primary via-indigo-600 to-blue-600 transform hover:scale-110 transition-all duration-300 rounded-full p-2 sm:p-1 fixed bottom-6 right-6 sm:static' onClick={()=>setModal(true)}>
                                            <Add />
                                        </div>
                                    </div>
                                </div>
                            </header>
                            
                            
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId='allCols' type='column' direction='horizontal'>
                                    {provided => 
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid overflow-x-auto h-full items-start pt-3 md:pt-2 mx-1 md:mx-6 auto-cols-220 md:auto-cols-270 grid-flow-col" style={{height: '90%'}}>
                                            {
                                                initialData?.columnOrder.map((col, i) => {
                                                    const column = initialData?.columns[col]
                                                    const tasks = column.taskIds?.map(t => t)
                                                    return <Column column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} />
                                                }) 
                                            }
                                            {provided.placeholder}
                                            <form onSubmit={addCol} autoComplete='off' className='ml-2'>
                                                <input maxLength='20' className='truncate bg-transparent placeholder-indigo-500 text-indigo-800 bg-indigo-50 px-2 outline-none py-1 rounded-sm ring-2 focus:ring-indigo-500' type="text" name='newCol' placeholder='Add a new column' />
                                            </form>
                                        </div>
                                    }
                                </Droppable>
                            </DragDropContext>
                        </div>
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


