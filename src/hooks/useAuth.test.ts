import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthTestProvider } from "../test/AuthTestProvider";

describe("useAuth", () => {
    it("obtiene el usuario desde AuthContext", () => {
        const { result } = renderHook(
            () => useAuth(),
            {
                wrapper: AuthTestProvider,
            }
        );

        expect(
            result.current.isAuthenticated
        ).toBe(true);

        expect(
            result.current.user?.email
        ).toBe("test@email.com");

        expect(
            result.current.user?.role
        ).toBe("customer");
    });
});