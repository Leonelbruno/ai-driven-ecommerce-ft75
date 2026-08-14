import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

type AdminRouteProps = {
    children: ReactNode;
};

export function AdminRoute({
    children,
}: AdminRouteProps) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return <p>Comprobando sesión...</p>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}