import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { BottomNav } from "@/components/BottomNav";
import { getSessionToken } from "@/services/athleteStorage";
import { getStravaAuthorizationUrl } from "@/services/stravaApi";

export default function ConnectScreen() {
    const [error, setError] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [athleteId, setAthleteId] = useState("");

    async function checkExistingConnection() {
        const accessToken = await getSessionToken();

        if (accessToken) {
            setAthleteId(accessToken);
            router.replace("/dashboard");
        }
    }

    useEffect(() => {
        checkExistingConnection();
    }, []);


    const handleConnectStrava = async () => {
        try {
            setIsConnecting(true);
            setError("");

            const url = await getStravaAuthorizationUrl();

            if (!url) {
                setError("Could not get Strava authorization URL.");
                return;
            }
            await Linking.openURL(url);
        } catch (error) {
            console.error(error);
            setError("Could not open Strava connection.");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <View style={styles.logoMark}>
                    <Text style={styles.logoText}>SG</Text>
                </View>

                <Text style={styles.appName}>Smart Gauge</Text>

                <Text style={styles.subtitle}>
                    Connect Strava to import your latest activities and track your recovery
                    status.
                </Text>

                <View style={styles.disclaimerCard}>
                    <Text style={styles.disclaimerTitle}>
                        Beta Disclaimer and User Acknowledgement
                    </Text>

                    <ScrollView
                        style={styles.disclaimerScroll}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                    >
                        <Text style={styles.disclaimerText}>
                            Smart Gauge is a beta fitness tracking and training analysis
                            application. By using this app, you acknowledge and agree that the
                            app is provided for informational, educational, and personal
                            tracking purposes only.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            Smart Gauge is not a medical device, healthcare service, coaching
                            service, emergency service, or substitute for professional medical
                            advice, diagnosis, treatment, or training guidance. Any information
                            displayed in the app, including activity history, recovery
                            check-ins, pain scores, training trends, performance metrics, or
                            alerts, should not be relied upon as medical, safety, or
                            professional training advice.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            You are responsible for your own training decisions, physical
                            activity, health choices, and use of the information displayed in
                            the app. You should consult a qualified medical professional,
                            coach, or other appropriate professional before making decisions
                            that may affect your health, injury risk, training load, or
                            physical performance.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            Smart Gauge may connect to third-party services, including Strava,
                            to import activity data. By connecting your Strava account, you
                            authorize Smart Gauge to access and store the activity data needed
                            to provide the app’s features. This may include activity names,
                            sport types, dates, distances, durations, elevation, heart rate,
                            power, recovery check-ins, pain scores, notes, and related training
                            information.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            Although reasonable efforts are made to protect user data, no
                            software system, network, server, database, or third-party
                            integration can be guaranteed to be completely secure,
                            uninterrupted, or error-free. You acknowledge that data may be
                            delayed, incomplete, inaccurate, unavailable, or affected by
                            third-party service changes, outages, user permissions, API
                            limitations, or technical issues.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            You are responsible for reviewing your own data and determining
                            whether it is accurate and appropriate for your personal use. Smart
                            Gauge and its developer are not responsible for decisions,
                            injuries, losses, damages, training outcomes, data inaccuracies,
                            service interruptions, third-party service issues, or other
                            consequences arising from your use of the app or reliance on
                            information displayed in the app.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            Because this is a beta product, features may change, break, be
                            removed, or behave unexpectedly. Data may be modified, deleted,
                            reset, or lost during testing, development, hosting changes,
                            database migrations, or app updates.
                        </Text>

                        <Text style={styles.disclaimerText}>
                            By continuing to use Smart Gauge, you agree that you understand
                            these limitations and accept responsibility for your use of the app
                            and any decisions you make based on its information.
                        </Text>
                    </ScrollView>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={[styles.primaryButton, isConnecting && styles.disabledButton]}
                    onPress={handleConnectStrava}
                    disabled={isConnecting}
                >
                    <Text style={styles.primaryButtonText}>
                        {isConnecting ? "Connecting..." : "I Understand — Connect with Strava"}
                    </Text>
                </Pressable>

                <Text style={styles.footerText}>
                    By tapping Connect with Strava, you acknowledge the beta disclaimer.
                </Text>
            </View>

            {/*<BottomNav activeRoute="login" storedAthleteId={athleteId} />*/}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
        justifyContent: "center",
        padding: 20,
        paddingBottom: 110,
    },
    card: {
        backgroundColor: "#151b1f",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#263238",
    },
    logoMark: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: "#fd5900",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    logoText: {
        color: "#501600",
        fontSize: 24,
        fontWeight: "900",
    },
    appName: {
        color: "#e0e3e5",
        fontSize: 34,
        fontWeight: "900",
        marginBottom: 8,
    },
    subtitle: {
        color: "#c5c6cd",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    disclaimerCard: {
        backgroundColor: "#101415",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#2a3033",
        marginBottom: 16,
    },
    disclaimerTitle: {
        color: "#e0e3e5",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 10,
    },
    disclaimerScroll: {
        maxHeight: 190,
    },
    disclaimerText: {
        color: "#c5c6cd",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 12,
    },
    primaryButton: {
        backgroundColor: "#fd5900",
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#501600",
        fontSize: 16,
        fontWeight: "900",
    },
    disabledButton: {
        opacity: 0.6,
    },
    errorText: {
        color: "#ffb4ab",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 12,
    },
    footerText: {
        color: "#8b949e",
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
        marginTop: 10,
    },
});