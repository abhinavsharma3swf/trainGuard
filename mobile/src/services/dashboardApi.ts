import { API_BASE_URL } from "@/constants/api";

export type DashboardFeedItem = {
    activityId: number;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number;
    movingTimeMinutes: number;
    pacePerMile: string;
    averageWatts: string;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe: number | null;
    painScore: number | null;
    painLocation: string | null;
    mood: string | null;
    note: string | null;
};

export async function getDashboardFeed(athleteId: number): Promise<DashboardFeedItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/feed/${athleteId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard feed.");
    }

    return response.json();
}