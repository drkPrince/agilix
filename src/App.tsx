import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { SyntheticEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { firebaseConfig } from "./utils/firebase";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function App() {
  const [user, loading, error] = useAuthState(auth);

  const handleGoogleLogin = (e: SyntheticEvent) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return loading ? (
    <h2>Loading</h2>
  ) : user ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
}

export default App;
