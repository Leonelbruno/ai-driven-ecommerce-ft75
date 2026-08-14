import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { User } from "../types/User";

export const createUserProfile = async (
    user: User
) => {
    await setDoc(
        doc(db, "users", user.uid),
        user
    );
};

export const getUserProfile = async (
    uid: string
): Promise<User | null> => {
    const userRef = doc(db, "users", uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as User;
};