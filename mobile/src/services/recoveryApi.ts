import {API_BASE_URL} from "@/constants/api";


export type RecoveryCheckin = {
    id: number;
    activityId: number;
    rpe: number;
    painScore: number;
    painLocation: string;
    mood: string;
    note: string;
    createdAt: string;
};

export async function getRecoveryCheckins(): Promise<RecoveryCheckin[]> {
    const response = await fetch(`${API_BASE_URL}/api/recovery-checkins`);

    if (!response.ok) {
        throw new Error("Failed to fetch recovery check-ins.");
    }

    return response.json();
}