import type { ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";

type Props = {
    children: ReactNode;
};

export function AuthTestProvider({
    children,
}: Props) {
    return (
        <AuthContext.Provider
            value={{
                user: {
                    uid: "test-user",
                    email: "test@email.com",
                    role: "customer",
                },
                isAuthenticated: true,
                loading: false,

                register: async () => { },
                login: async () => { },
                loginGoogle: async () => { },
                logout: async () => { },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}