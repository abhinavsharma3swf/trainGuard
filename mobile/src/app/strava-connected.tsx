import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { saveAthleteId } from "@/services/athleteStorage";

export default function StravaConnected() {
    const params = useLocalSearchParams();

    useEffect(() => {
        async function saveConnection() {
            const athleteIdParam = Array.isArray(params.athleteId)
                ? params.athleteId[0]
                : params.athleteId;

            if (!athleteIdParam) {
                return;
            }

            const athleteId = Number(athleteIdParam);

            if (Number.isNaN(athleteId)) {
                return;
            }

            await saveAthleteId(athleteId);
            router.replace("/dashboard");
        }

        saveConnection();
    }, [params.athleteId]);

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Connecting Strava...</Text>
            <Text style={styles.message}>Saving your Smart Gauge connection.</Text>
        </View>
    );
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
});