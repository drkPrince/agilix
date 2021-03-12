

import {Dialog} from "@reach/dialog"
import "@reach/dialog/styles.css";

const Modal = ({modal, setModal, children}) => {
	

	return (
			<Dialog isOpen={modal} onDismiss={()=>setModal(false)} aria-label='content'>
				<button onClick={()=>setModal(false)}>Close</button>
				{children}
			</Dialog>
	)
}

export default Modal