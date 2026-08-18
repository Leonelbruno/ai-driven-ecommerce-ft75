import { auth } from "../config/firebase";

type PresignResponse = {
    uploadUrl: string;
    imageUrl: string;
    key: string;
};

export async function uploadProductImage(
    file: File
): Promise<string> {
    const user = auth.currentUser;

    if (!user) {
        throw new Error(
            "Usuario no autenticado"
        );
    }

    const token =
        await user.getIdToken();

    const presignResponse =
        await fetch("/api/s3-presign", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,
            },

            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
            }),
        });

    if (!presignResponse.ok) {
        throw new Error(
            "No se pudo obtener URL de subida"
        );
    }

    const {
        uploadUrl,
        imageUrl,
    } =
        await presignResponse.json() as PresignResponse;

    const uploadResponse =
        await fetch(uploadUrl, {
            method: "PUT",

            headers: {
                "Content-Type": file.type,
            },

            body: file,
        });

    if (!uploadResponse.ok) {
        throw new Error(
            "No se pudo subir la imagen"
        );
    }

    return imageUrl;
}