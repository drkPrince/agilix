

import {Dialog} from "@reach/dialog"
import "@reach/dialog/styles.css"
import {Cross} from './Icons'

const Modal = ({modal, setModal, children, ariaText}) => {

	return (
			<Dialog isOpen={modal} onDismiss={()=>setModal(false)} aria-label={ariaText}>
				<div className='flex justify-end'>
					<button onClick={()=>setModal(false)} >
						<Cross />
					</button>
				</div>
				{children}
			</Dialog>
	)
}

export default Modal