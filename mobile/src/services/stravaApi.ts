import { API_BASE_URL } from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";

export async function getStravaAuthorizationUrl(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/strava/authorization-url`);

    if (!response.ok) {
        throw new Error("Failed to get Strava authorization URL.");
    }

    return response.text();
}
//
// export async function syncStravaActivities(athleteId: number): Promise<void> {
//     const response = await fetch(`${API_BASE_URL}/api/strava/sync/${athleteId}`, {
//         method: "POST",
//     });
//
//     if (!response.ok) {
//         throw new Error("Failed to sync Strava activities.");
//     }
// }


export async function syncStravaActivities(): Promise<void> {
    const token = await getSessionToken();
    console.log("token", token)

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(`${API_BASE_URL}/api/strava/sync`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to sync Strava activities.");
    }
}