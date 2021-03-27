import { Dialog } from "@reach/dialog"
import { Cross } from './Icons'

const Modal = ({ modal, setModal, children, ariaText }) => {

    return (
        <Dialog isOpen={modal} onDismiss={()=>setModal(false)} aria-label={ariaText} className='z-20 fade-in'>
			<div className='flex justify-end'>
				<div onClick={()=>setModal(false)} >
					<div className='p-1.5 hover:bg-red-200 rounded-full text-red-900'>
						<Cross />
					</div>
				</div>
			</div>
			{children}
		</Dialog>
    )
}

export default Modal