

import {useState} from 'react'
import {useParams} from 'react-router-dom'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'

import {Link} from 'react-router-dom'
import Modal from '../../components/Modal'
import AddTask from '../AddTask'

import usePublicKanban from '../../hooks/public/usePublicKanbanData'
import PublicColumn from '../../components/public/PublicColumn'


const PublicKanban = ({userId}) => {
    
    const {boardId} = useParams()
    const [modal, setModal] = useState(false)
    const {initialData, boardName} = usePublicKanban(userId, boardId)
    const [filter, setFilter] = useState(null)
    const filters = ['high', 'medium', 'low']


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
                                        <input type="text" readOnly defaultValue={boardName} className='text-gray-800 ml-2 w-1/2 truncate outline-none' />
                                    </span> 
                                    <div className='flex flex-wrap items-center sm:space-x-9'>
                                        <div className="flex items-center mt-2 sm:mt-0 ">
                                            <h3 className='text-gray-500 mr-2'>Show Priority: </h3>
                                            <div className='space-x-1 text-blue-900 flex bg-indigo-50 rounded-sm'>
                                                {filters.map(f => <div key={f} className={`px-3  border-black py-1 hover:bg-blue-600 hover:text-blue-50 cursor-pointer capitalize ${filter === f ? 'bg-blue-600 text-blue-50' : ''}`} onClick={() => setFilter(f==='all' ? null : f)}>{f}</div>)}
                                                {filter ? <div className='px-2 py-1 cursor-pointer hover:text-blue-700 rounded-sm' onClick={() => setFilter(null)}>All</div> : null}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </header>
                            
                            
                            <DragDropContext>
                                <Droppable droppableId='allCols' type='column' direction='horizontal'>
                                    {provided => 
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid overflow-x-auto h-full items-start pt-3 md:pt-2 mx-1 md:mx-6 auto-cols-220 md:auto-cols-270 grid-flow-col" style={{height: '90%'}}>
                                            {
                                                initialData?.columnOrder.map((col, i) => {
                                                    const column = initialData?.columns[col]
                                                    const tasks = column.taskIds?.map(t => t)
                                                    return <PublicColumn column={column} tasks={tasks} allData={initialData} key={column.id} boardId={boardId} userId={userId} filterBy={filter} index={i} />
                                                }) 
                                            }
                                            {provided.placeholder}
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

export default PublicKanban