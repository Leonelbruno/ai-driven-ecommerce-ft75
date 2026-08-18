import {
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

const firebaseApiKey =
    process.env.VITE_FIREBASE_API_KEY;

const firebaseProjectId =
    process.env.VITE_FIREBASE_PROJECT_ID;

const s3Client = new S3Client({
    region,
});

async function isAdmin(
    request: Request
): Promise<boolean> {
    const authorization =
        request.headers.get("authorization");

    if (
        !authorization?.startsWith("Bearer ") ||
        !firebaseApiKey ||
        !firebaseProjectId
    ) {
        return false;
    }

    const token = authorization.slice(7);

    // Verifica que el token realmente pertenezca
    // a un usuario de Firebase.
    const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: token,
            }),
        }
    );

    if (!authResponse.ok) {
        return false;
    }

    const authData = await authResponse.json() as {
        users?: {
            localId?: string;
        }[];
    };

    const uid =
        authData.users?.[0]?.localId;

    if (!uid) {
        return false;
    }

    // Busca el perfil en Firestore para verificar role.
    const profileResponse = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/users/${uid}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!profileResponse.ok) {
        return false;
    }

    const profile =
        await profileResponse.json() as {
            fields?: {
                role?: {
                    stringValue?: string;
                };
            };
        };

    return (
        profile.fields?.role?.stringValue ===
        "admin"
    );
}

export async function POST(
    request: Request
) {
    if (!region || !bucket) {
        return Response.json(
            {
                error: "Configuración de AWS incompleta",
            },
            {
                status: 500,
            }
        );
    }

    const admin = await isAdmin(request);

    if (!admin) {
        return Response.json(
            {
                error: "No autorizado",
            },
            {
                status: 403,
            }
        );
    }

    try {
        const body = await request.json();

        const {
            fileName,
            contentType,
        } = body as {
            fileName?: string;
            contentType?: string;
        };

        if (!fileName || !contentType) {
            return Response.json(
                {
                    error:
                        "fileName y contentType son obligatorios",
                },
                {
                    status: 400,
                }
            );
        }

        if (!contentType.startsWith("image/")) {
            return Response.json(
                {
                    error:
                        "Solo se permiten imágenes",
                },
                {
                    status: 400,
                }
            );
        }

        const safeFileName =
            fileName.replace(
                /[^a-zA-Z0-9._-]/g,
                "-"
            );

        const key =
            `products/${randomUUID()}-${safeFileName}`;

        const command =
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: contentType,
            });

        const uploadUrl =
            await getSignedUrl(
                s3Client,
                command,
                {
                    expiresIn: 300,
                    signableHeaders:
                        new Set(["content-type"]),
                }
            );

        const imageUrl =
            `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

        return Response.json({
            uploadUrl,
            imageUrl,
            key,
        });
    } catch (error) {
        console.error(
            "Error generando URL firmada:",
            error
        );

        return Response.json(
            {
                error:
                    "No se pudo generar la URL de subida",
            },
            {
                status: 500,
            }
        );
    }
}