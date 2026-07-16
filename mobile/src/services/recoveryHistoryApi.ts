import { API_BASE_URL } from "@/constants/api";
import { getSessionToken } from "@/services/athleteStorage";

export type RecoveryHistoryItem = {
    checkinId: number;
    createdAt: string;
    rpe: number;
    painScore: number;
    painLocation?: string | null;
    mood?: string | null;
    note?: string | null;
    sportType: string;
};

export async function getRecoveryHistory(
    page: number,
    size: number
): Promise<RecoveryHistoryItem[]> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/recovery-checkins/history?page=${page}&size=${size}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load recovery history.");
    }

    return response.json();
}