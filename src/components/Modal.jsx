import { Dialog } from "@reach/dialog"
import { Cross } from './Icons'

const Modal = ({ modal, setModal, children, ariaText }) => {

    return (
        <Dialog isOpen={modal} onDismiss={()=>setModal(false)} aria-label={ariaText}>
				<div className='flex justify-end'>
					<div onClick={()=>setModal(false)} >
						<Cross />
					</div>
				</div>
				{children}
			</Dialog>
    )
}

export default Modal