import AsyncStorage from "@react-native-async-storage/async-storage";

// const ATHLETE_ID_KEY = "smart_gauge_athlete_id";
//
// export async function saveAthleteId(athleteId: number) {
//     await AsyncStorage.setItem(ATHLETE_ID_KEY, String(athleteId));
// }
//
// export async function getAthleteId(): Promise<number | null> {
//     const value = await AsyncStorage.getItem(ATHLETE_ID_KEY);
//
//     if (!value) {
//         return null;
//     }
//
//     return Number(value);
// }
//
// export async function clearAthleteId() {
//     await AsyncStorage.removeItem(ATHLETE_ID_KEY);
// }


const SESSION_TOKEN_KEY = "smart_gauge_session_token";

export async function saveSessionToken(token: string) {
    await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
}

export async function getSessionToken(): Promise<string | null> {
    return AsyncStorage.getItem(SESSION_TOKEN_KEY);
}

export async function clearSessionToken() {
    await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
}