import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";

const SESSION_TOKEN_KEY = "smart_gauge_session_token";

export async function saveSessionToken(token: string) {
    if (Platform.OS === "web") {
        window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        return;
    }

    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}

export async function getSessionToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
    }

    return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function clearSessionToken() {
    if (Platform.OS === "web") {
        window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
        return;
    }

    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}

export class SessionExpiredError extends Error {
    constructor() {
        super("Your session has expired. Please reconnect Strava.");
        this.name = "SessionExpiredError";
    }
}