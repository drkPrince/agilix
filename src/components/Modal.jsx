

import {Dialog} from "@reach/dialog"
import {useState} from 'react'

const Modal = () => {
	const [modal, setModal] = useState(false)

	const open = () => setModal(true)
	const close = () => setModal(false)

	return (
		<div>
			
		</div>
	)
}

export default Modal