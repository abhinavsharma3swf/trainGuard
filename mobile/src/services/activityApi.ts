import { API_BASE_URL } from "@/constants/api";
import { getSessionToken } from "@/services/athleteStorage";

export type ActivityResponse = {
    id: number;
    externalSource: string;
    externalActivityId: string;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number | null;
    movingTimeMinutes: number | null;
    pacePerMile: string | null;
};

export async function getActivities(page = 0, size = 50): Promise<ActivityResponse[]> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/activities?page=${page}&size=${size}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch activities.");
    }

    return response.json();
}