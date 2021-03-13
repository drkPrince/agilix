import {useState, useEffect} from 'react'
import {db} from '../firebase/fbConfig'

const useBoards = (userId) => {
	const [boards, setBoards] = useState(null)

    useEffect(() => {
        return db.collection(`users`).doc(userId).get()
            .then(doc => {
                try {
                    if(doc.exists){
                        return db.collection(`users/${doc.id}/boards`).onSnapshot(snap => {
                            const documents = []
                            snap.forEach(doc => documents.push({id: doc.id, ...doc.data()}))
                            console.log(documents)
                            setBoards(documents)
                        })
                    }
                    else return
                }

                catch(e) {
                    console.log(e)
                }
            })
        }, [userId]) 


	return boards
}

export default useBoards