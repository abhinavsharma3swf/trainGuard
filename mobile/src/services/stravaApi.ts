import { API_BASE_URL } from "@/constants/api";

export async function syncStravaActivities(athleteId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/strava/sync/${athleteId}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to sync Strava activities.");
    }
}