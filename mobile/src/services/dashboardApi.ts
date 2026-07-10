import { API_BASE_URL } from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";


export type DashboardFeedItem = {
    activityId: number;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number;
    movingTimeMinutes: number;
    pacePerMile: string;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe: number | null;
    painScore: number | null;
    painLocation: string | null;
    mood: string | null;
    note: string | null;
    averageWatts: string;
};

export async function getDashboardFeed(): Promise<DashboardFeedItem[]> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(`${API_BASE_URL}/api/dashboard/feed`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard feed.");
    }

    return response.json();
}