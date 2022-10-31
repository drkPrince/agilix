
import {useState} from 'react'
import {db, firebase} from '../firebase/fbConfig'
import {v4 as uuidv4} from 'uuid';
import Toggle from '../components/Toggle';
import { copyBoardsToPublicBoards } from '../utils';

const Publish = ({ close, userId, boardId, boardName, data }) => 
{
	const [publish,setPublish] = useState(true);

	const publishBoard = async (status)=>{
		 if(!status){
			 setPublish(false);
			 return;
			}
		copyBoardsToPublicBoards(userId, boardId, boardName, data );
	}

	return (
		<div className='publish-modal px-3 py-2 md:px-12  text-sm md:text-base'>
			<h2>Publish this board.</h2>
			<div className="flex my-2">
				<Toggle status={publishBoard} />
				<span className="ml-2">{publish ? 'Publish' : 'Published'}</span>
			</div>

		</div>
	)
}

export default Publish