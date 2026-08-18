import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadProductImage } from "./imageService";

vi.mock("../config/firebase", () => ({
    auth: {
        currentUser: {
            getIdToken: vi
                .fn()
                .mockResolvedValue("fake-token"),
        },
    },
}));

describe("uploadProductImage", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it("obtiene una URL firmada y sube la imagen a S3", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({
                ok: true,

                json: async () => ({
                    uploadUrl:
                        "https://s3.test/upload",

                    imageUrl:
                        "https://s3.test/products/test.jpg",

                    key:
                        "products/test.jpg",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        vi.stubGlobal(
            "fetch",
            fetchMock
        );

        const file = new File(
            ["imagen-de-prueba"],
            "test.jpg",
            {
                type: "image/jpeg",
            }
        );

        const result =
            await uploadProductImage(file);

        expect(result).toBe(
            "https://s3.test/products/test.jpg"
        );

        expect(fetchMock).toHaveBeenCalledTimes(2);

        expect(
            fetchMock
        ).toHaveBeenNthCalledWith(
            1,
            "/api/s3-presign",
            expect.objectContaining({
                method: "POST",

                headers:
                    expect.objectContaining({
                        Authorization:
                            "Bearer fake-token",
                    }),
            })
        );

        expect(
            fetchMock
        ).toHaveBeenNthCalledWith(
            2,
            "https://s3.test/upload",
            expect.objectContaining({
                method: "PUT",
                body: file,
            })
        );
    });
});