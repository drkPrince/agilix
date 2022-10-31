
import {useState} from 'react'
import {db, firebase} from '../firebase/fbConfig'
import {v4 as uuidv4} from 'uuid';

const Publish = ({boardId, userId, close, allCols}) => 
{

	return (
		<div className='px-3 py-2 md:px-12  text-sm md:text-base'>
			<h2>Publish Board!</h2>
			<p>I understand publishing this board to public can cause security issue.</p>
		</div>
	)
}

export default Publish