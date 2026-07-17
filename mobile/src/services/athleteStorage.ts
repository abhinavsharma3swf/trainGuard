import AsyncStorage from "@react-native-async-storage/async-storage";

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