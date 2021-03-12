

import {Dialog} from "@reach/dialog"
import "@reach/dialog/styles.css";

const Modal = ({modal, setModal, children, ariaText}) => {

	return (
			<Dialog isOpen={modal} onDismiss={()=>setModal(false)} aria-label={ariaText}>
				<button onClick={()=>setModal(false)}>Close</button>
				{children}
			</Dialog>
	)
}

export default Modal