import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { firebaseConfig } from "../utils/firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface BoardList {
  id: number;
  name: string;
}

const Boards = () => {
  const [user, loading, error] = useAuthState(auth);
  const [boardList, setBoardList] = useState<BoardList[]>([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const boardListNames: BoardList[] = [];
        getDocs(collection(db, `users/${user.uid}/boards`)).then((list) => {
          list.forEach((name) => {
            boardListNames.push({
              id: name.id,
              name: name.data().name,
            } as unknown as BoardList);
          });
          setBoardList(boardListNames);
        });
      }
    })();
  }, []);

  return (
    <main>
      <h1>Your Boards</h1>
      {boardList.map((board, i) => (
        <Link key={i} to={`/board/${board.id}`}>
          {board.name}
        </Link>
      ))}
    </main>
  );
};

export default Boards;
