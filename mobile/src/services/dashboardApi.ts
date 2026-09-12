import { API_BASE_URL } from "@/constants/api";
import {clearSessionToken, getSessionToken, SessionExpiredError} from "@/services/athleteStorage";
import {BodyPart} from "@/components/PathPoints";


export type DashboardFeedItem = {
    activityId: number | null;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number | null;
    movingTimeMinutes: number | null;
    pacePerMile: string | null;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe: number | null;
    painScore: number | null;
    painLocation: string | null;
    mood: string | null;
    note: string | null;
    averageWatts: number | null;
    start_latlng?: number | null;
    description: string | null;
};

export async function getDashboardFeed(page = 0, size = 100): Promise<DashboardFeedItem[]> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(`${API_BASE_URL}/api/dashboard/feed?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            await clearSessionToken();
            throw new SessionExpiredError();
        }
        throw new Error("Failed to fetch dashboard feed.");
    }

    return response.json();
}