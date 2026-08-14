import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../types/User";

import {
    loginWithEmail,
    loginWithGoogle,
    logoutFirebase,
    observeAuthState,
    registerWithEmail,
} from "../services/authService";

import {
    createUserProfile,
    getUserProfile,
} from "../services/userService";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;

    register: (
        email: string,
        password: string
    ) => Promise<void>;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    loginGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(
        null
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = observeAuthState(
            async (firebaseUser) => {
                try {
                    if (!firebaseUser) {
                        setUser(null);
                        return;
                    }

                    let profile = await getUserProfile(
                        firebaseUser.uid
                    );

                    if (!profile) {
                        profile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email ?? "",
                            role: "customer",
                            ...(firebaseUser.displayName
                                ? { displayName: firebaseUser.displayName }
                                : {}),
                        };

                        await createUserProfile(profile);
                    }

                    setUser(profile);
                } finally {
                    setLoading(false);
                }
            }
        );

        return unsubscribe;
    }, []);

    const register = async (
        email: string,
        password: string
    ) => {
        await registerWithEmail(email, password);
    };

    const login = async (
        email: string,
        password: string
    ) => {
        await loginWithEmail(email, password);
    };

    const loginGoogle = async () => {
        await loginWithGoogle();
    };

    const logout = async () => {
        await logoutFirebase();
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                register,
                login,
                loginGoogle,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}