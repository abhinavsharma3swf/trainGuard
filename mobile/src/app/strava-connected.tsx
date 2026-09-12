import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {saveSessionToken} from "@/services/athleteStorage";
import { API_BASE_URL } from "@/constants/api";


export default function StravaConnectedScreen() {
    const params = useLocalSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isExchanging, setIsExchanging] = useState(false);

    useEffect(() => {
        async function saveConnection() {
            const tokenParam = Array.isArray(params.token)
                ? params.token[0]
                : params.token;
            const codeParam = Array.isArray(params.code)
                ? params.code[0]
                : params.code;

            if (!tokenParam && !codeParam) {
                setError("The Strava connection token is missing.");
                return;
            }

            try {
                setIsExchanging(true);
                const sessionToken = tokenParam ?? await exchangeSessionCode(codeParam!);

                if (!sessionToken) {
                    throw new Error("The Strava connection token is empty.");
                }

                await saveSessionToken(sessionToken);
                router.replace("/dashboard");
            } catch (exchangeError) {
                console.error("Failed to exchange Strava session code:", exchangeError);
                setError("Could not finish the Strava connection. Please try again.");
            } finally {
                setIsExchanging(false);
            }
        }

        saveConnection();
    }, [params.code, params.token]);

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>{error ? "Connection failed" : "Connecting Strava..."}</Text>
            <Text style={styles.message}>
                {error ?? (isExchanging ? "Saving your Smart Gauge connection." : "Preparing your Smart Gauge connection.")}
            </Text>
            {error ? (
                <Pressable style={styles.retryButton} onPress={() => router.replace("/")}>
                    <Text style={styles.retryText}>Try again</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

async function exchangeSessionCode(code: string): Promise<string> {
    const response = await fetch(
        `${API_BASE_URL}/api/strava/session-exchange?code=${encodeURIComponent(code)}`
    );

    if (!response.ok) {
        throw new Error("The Strava connection code is invalid or expired.");
    }

    return response.text();
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        color: "#e0e3e5",
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 8,
    },
    message: {
        color: "#c5c6cd",
        fontSize: 16,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#fd5900",
        borderRadius: 12,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    retryText: {
        color: "#501600",
        fontWeight: "900",
    },
});