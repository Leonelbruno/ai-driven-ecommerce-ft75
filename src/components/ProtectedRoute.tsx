import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
    children: ReactNode;
};

export function ProtectedRoute({
    children,
}: ProtectedRouteProps) {
    const {
        isAuthenticated,
        loading,
    } = useAuth();

    if (loading) {
        return <p>Comprobando sesión...</p>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}