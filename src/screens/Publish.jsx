
import {useState} from 'react'
import { Copy } from '../components/Icons';
import Toggle from '../components/Toggle';
import { copyBoardsToPublicBoards } from '../utils';

const Publish = ({ close, userId, boardId, boardName, data }) => 
{
	const [publish,setPublish] = useState(false);
	const publicBoardUrl = window.location.href.replace('board/','public-board/');

	const copyUrl = () =>{
		const textBox = document.querySelector(".public-url");
		textBox.select();
		document.execCommand("copy");
	}
	const publishBoard = async (status)=>{
		 if(status){
			 setPublish(false);
			 return;
			}
			setPublish(true);
			// copyBoardsToPublicBoards(userId, boardId, boardName, data );
	}

	return (
		<div className='publish-modal px-3 py-2 md:px-12  text-sm md:text-base'>
			<h2>Publish this board.</h2>
			<div className="flex my-2">
				<Toggle status={publishBoard} />
				<span className="ml-2">{ publish ? 'Published' : 'Publish'}</span>
			</div>
			{ publish ? ( <div className="flex">
			 <input className="public-url p-2 border" style={{maxWidth:'500px',width:'100%'}} type="text" defaultValue={publicBoardUrl} />
			<button onClick={copyUrl} className="p-2 border-none outline-none"><Copy /></button>
			</div> ) : '' }

		</div>
	)
}

export default Publish