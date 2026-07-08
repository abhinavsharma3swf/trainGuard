import { API_BASE_URL } from "@/constants/api";

export type ActivityResponse = {
    id: number;
    externalSource: string;
    externalActivityId: string;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number;
    movingTimeMinutes: number;
    pacePerMile: string;
};

export async function getActivities(): Promise<ActivityResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/activities`);

    if (!response.ok) {
        throw new Error("Failed to fetch activities.");
    }

    return response.json();
}