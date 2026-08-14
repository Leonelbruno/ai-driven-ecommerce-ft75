import { auth } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    type User as FirebaseUser,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const observeAuthState = (
    callback: (user: FirebaseUser | null) => void
) => {
    return onAuthStateChanged(auth, callback);
};

export const registerWithEmail = (
    email: string,
    password: string
) => {
    return createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
};

export const loginWithEmail = (
    email: string,
    password: string
) => {
    return signInWithEmailAndPassword(
        auth,
        email,
        password
    );
};

export const loginWithGoogle = () => {
    return signInWithPopup(
        auth,
        googleProvider
    );
};

export const logoutFirebase = () => {
    return signOut(auth);
};