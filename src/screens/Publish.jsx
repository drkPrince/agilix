
import {useState} from 'react'
import { Copy } from '../components/Icons';
import Toggle from '../components/Toggle';
import { copyBoardToPublicBoards, removeBoardFromPublicBoards } from '../utils';
import { Notyf } from 'notyf';
const notyf = new Notyf();

const Publish = ({ status:dbStatus, close, userId, boardId, boardName, data }) => 
{	
	const [tempStatus,setTempStatus] = useState(dbStatus);
	const publicBoardUrl = window.location.href.replace('board/',`b/${userId}/`);

	const copyUrl = () =>{
		const textBox = document.querySelector(".public-url");
		textBox.select();
		document.execCommand("copy");
		notyf.success('Successfully copied!');
	}
	const publishBoard = async (status)=>{
		
		 setTempStatus(status);
		 if(status){
			 removeBoardFromPublicBoards(boardId,userId, data).then(msg=>{
				if(msg === 'removed'){
					notyf.success('Unpulished this board!');
				 }
			 })
			 return;
		}

		copyBoardToPublicBoards(userId, boardId, boardName, data ).then(msg=>{
			if(msg === 'published'){
				notyf.success('Successfully pulished this board!');
			}
		})
	}

	return (
		<div className='publish-modal px-3 py-2 md:px-12  text-sm md:text-base'>
			<h2 className="my-4 text-2xl">Publish this board.</h2>
			<div className="flex my-2">
				<Toggle dbStatus={dbStatus} emitToggle={publishBoard} />
				<span className="ml-2">{ !tempStatus ? 'Published' : 'Publish'}</span>
			</div>
			{ !tempStatus ? ( <div className="flex">
			 	<input className="public-url p-2 border" style={{maxWidth:'500px',width:'100%'}} type="text" defaultValue={publicBoardUrl} />
				<button onClick={copyUrl} className="p-2 border-none outline-none"><Copy /></button>
			</div> ) : '' }


			{
				!tempStatus ? <div className="flex"><button onClick={()=>publishBoard(false)} className="mt-4 bg-green-700 text-white px-4 py-1 rounded-sm transform hover:-translate-y-1 transition-transform duration-300 cursor-hover">Sync Changes</button></div> : ''
			}
		</div>
	)
}

export default Publish