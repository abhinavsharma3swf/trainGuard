import {router} from "expo-router";
import React, {useEffect, useState} from "react";
import {Linking, Pressable, StyleSheet, Text, View,} from "react-native";
import {getSessionToken} from "@/services/athleteStorage";
import {getStravaAuthorizationUrl} from "@/services/stravaApi";
import {PrivacyStatement} from "@/components/PrivacyStatement";
import {BetaDisclaimer} from "@/components/BetaDisclaimer";
import {Checkbox} from 'expo-checkbox';

export default function ConnectScreen() {
    const [error, setError] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [athleteId, setAthleteId] = useState("");
    const [privacyStatementFLag, setPrivacyStatementFLag] = useState<boolean>(false);
    const [betaDisclaimerFlag, setBetaDisclaimerFlag] = useState<boolean>(false)
    const [confirmDisclaimerFlag, setConfirmDisclaimerFlag] = useState<boolean>(false)
    const [confirmPrivacyStatementFlag, setConfirmPrivacyStatementFlag] = useState<boolean>(false)

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

                <View style={[styles.disclaimerCard]}>
                    <Pressable onPress={() => {
                        setPrivacyStatementFLag(true)
                        setConfirmPrivacyStatementFlag(true)
                    }}>


                        <View style={{flex: 1, flexDirection: "row"}}>
                            <Text style={styles.disclaimerTitle}>
                                Terms of Service and Privacy Policy.
                            </Text>
                            <Checkbox style={{padding: 12, margin: 2}} value={confirmPrivacyStatementFlag}
                                      onValueChange={setPrivacyStatementFLag}
                            />
                        </View>
                        <PrivacyStatement privacyStatementFlag={privacyStatementFLag}
                                          setPrivacyStatementFlag={setPrivacyStatementFLag}/>
                    </Pressable>
                </View>

                <View style={styles.disclaimerCard}>
                    <Pressable onPress={() => {
                        setBetaDisclaimerFlag(true)
                        setConfirmDisclaimerFlag(true)
                    }
                    }>

                        <View style={{flex: 1, flexDirection: "row"}}>
                            <Text style={styles.disclaimerTitle}>
                                Beta Disclaimer.
                            </Text>
                            <Checkbox style={{marginLeft: 150, padding: 12 }} value={confirmDisclaimerFlag}
                                      onValueChange={setConfirmDisclaimerFlag}
                            />
                        </View>
                        <BetaDisclaimer betaDisclaimerFlag={betaDisclaimerFlag}
                                        setBetaDisclaimerFlag={setBetaDisclaimerFlag}/>
                    </Pressable>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={[styles.primaryButton, isConnecting || !confirmDisclaimerFlag || !confirmPrivacyStatementFlag ? styles.disabledButton : styles.primaryButton]}
                    onPress={handleConnectStrava}
                    disabled={isConnecting || !confirmDisclaimerFlag || !confirmPrivacyStatementFlag}
                >
                    <Text style={styles.primaryButtonText}>
                        {isConnecting ? "Connecting..." : "I Understand — Connect with Strava"}
                    </Text>
                </Pressable>

                <Text style={styles.footerText}>
                    By connecting, you agree to Smart Gauge’s
                    Terms of Service and Privacy Policy.
                </Text>
            </View>

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
        paddingTop: 50
    },
    card: {
        backgroundColor: "#151b1f",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#263238",
        height: 500,
        paddingHorizontal: 20,
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
    confirm: {
        backgroundColor: "#54cd03",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#2a3033",
        marginBottom: 16,
    },
    disclaimerTitle: {
        color: "#e0e3e5",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 10,
        marginLeft: 10
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