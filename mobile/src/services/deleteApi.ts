import {getSessionToken} from "@/services/athleteStorage";
import {API_BASE_URL} from "@/constants/api";

export async function deleteApi() {
    const token = await getSessionToken();

if(!token) {
    throw new Error("Missing token for deleteApi");
}
await fetch (`${API_BASE_URL}/api/deleteData`, {
    method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function deleteAccount(): Promise<void> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing token for deleting account");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/deleteData/userAccount`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.message ?? "Unable to delete account"
        );
    }
}