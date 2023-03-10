import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom";
import { firebaseConfig } from "../utils/firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Kanban = () => {
  const [user, loading, error] = useAuthState(auth);
  const { boardId } = useParams();

  console.log({ boardId });
  return <div>Kanban</div>;
};

export default Kanban;
