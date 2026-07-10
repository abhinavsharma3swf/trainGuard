import AsyncStorage from "@react-native-async-storage/async-storage";

const ATHLETE_ID_KEY = "smart_gauge_athlete_id";

export async function saveAthleteId(athleteId: number) {
    await AsyncStorage.setItem(ATHLETE_ID_KEY, String(athleteId));
}

export async function getAthleteId(): Promise<number | null> {
    const value = await AsyncStorage.getItem(ATHLETE_ID_KEY);

    if (!value) {
        return null;
    }

    return Number(value);
}

export async function clearAthleteId() {
    await AsyncStorage.removeItem(ATHLETE_ID_KEY);
}