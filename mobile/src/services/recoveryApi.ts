import {API_BASE_URL} from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";
import {BodyPart} from "@/components/PathPoints";


export type RecoveryCheckin = {
    id: number;
    activityId: number;
    rpe: number;
    painScore: number;
    painLocation: string;
    painLocationEnum: BodyPart[];
    mood: string;
    note: string;
    sportType: string;
    createdAt: string;
    temperature: number;
    humidity: number;
    feelsLikeTemperature: number;
    windSpeed: number;
    dewPoint: number;
    trainingLoad: number;
};

export async function getRecoveryCheckins(
    page = 0,
    size = 20
): Promise<RecoveryCheckin[]> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error("Missing session token.");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/recovery-checkins?page=${page}&size=${size}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch recovery check-ins.");
    }

    return response.json();
}