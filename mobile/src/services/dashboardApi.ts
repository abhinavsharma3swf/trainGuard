import { API_BASE_URL } from "@/constants/api";
import {clearSessionToken, getSessionToken} from "@/services/athleteStorage";
import {BodyPart} from "@/components/PathPoints";


export type DashboardFeedItem = {
    activityId: number | null;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number;
    movingTimeMinutes: number;
    pacePerMile: string;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe: number | null;
    painScore: number | null;
    painLocation: BodyPart[] | null;
    mood: string | null;
    note: string | null;
    averageWatts: string;
    description: string;
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