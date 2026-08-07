import {router} from "expo-router";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import Checkbox from "expo-checkbox";

import {getSessionToken} from "@/services/athleteStorage";
import {getStravaAuthorizationUrl} from "@/services/stravaApi";
import {PrivacyStatement} from "@/components/PrivacyStatement";
import {BetaDisclaimer} from "@/components/BetaDisclaimer";
import {SafeAreaProvider} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {acceptedUserDisclaimers} from "@/services/agreementService";

export default function ConnectScreen() {
    const [error, setError] = useState("");
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    const [isPrivacyStatementVisible, setIsPrivacyStatementVisible] = useState(false);
    const [isBetaDisclaimerVisible, setIsBetaDisclaimerVisible] = useState(false);
    const [checkboxState, setCheckboxState] = useState(false);
    const [checkboxStateForBeta, setCheckboxStateForBeta] = useState(false);

    const PENDING_AGREEMENT = 'pending_agreement';

    const canConnect =
        checkboxState &&
        checkboxStateForBeta &&
        !isConnecting &&
        !isCheckingSession;

    useEffect(() => {
        let isMounted = true;

        const checkExistingConnection = async () => {
            try {
                const sessionToken = await getSessionToken();

                if (sessionToken && isMounted) {
                    router.replace("/dashboard");

                }
            } catch (sessionError) {
                console.error("Failed to check existing session:", sessionError);

                if (isMounted) {
                    setError("Could not verify your existing session.");
                }
            } finally {
                if (isMounted) {
                    setIsCheckingSession(false);
                }
            }
        };

        void checkExistingConnection();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleConnectStrava = async () => {
        if (!canConnect) {
            return;
        }

        try {
            setIsConnecting(true);
            setError("");

            await AsyncStorage.setItem(PENDING_AGREEMENT,
                JSON.stringify({
                    checkboxState: checkboxState,
                    checkboxStateForBeta: checkboxStateForBeta,
                    createdAt: new Date().toLocaleString("en-US"),
                }))

            const authorizationUrl = await getStravaAuthorizationUrl();

            if (!authorizationUrl) {
                setError("Could not get the Strava authorization URL.");
                return;
            }

            const canOpenUrl = await Linking.canOpenURL(authorizationUrl);

            if (!canOpenUrl) {
                setError("This device could not open the Strava authorization page.");
                return;
            }

            await Linking.openURL(authorizationUrl);
        } catch (connectionError) {
            console.error("Failed to open Strava authorization:", connectionError);
            setError("Could not open the Strava connection page.");
        } finally {
            setIsConnecting(false);
        }
    };

    if (isCheckingSession) {
        return (
            <SafeAreaProvider style={styles.screen}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large"/>
                    <Text style={styles.loadingText}>Checking your session...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.logoMark}>
                        <Text style={styles.logoText}>SG</Text>
                    </View>

                    <Text style={styles.appName}>Smart Gauge</Text>

                    <Text style={styles.subtitle}>
                        Connect Strava to temporarily import your recent activities
                        and record private recovery check-ins.
                    </Text>

                    <Text style={styles.retentionText}>
                        Imported Strava activity data is retained for no longer than
                        seven days.
                    </Text>

                    <ConsentRow
                        title="Privacy Policy and Terms of Service"
                        description="Review how Smart Gauge collects, uses, retains, and deletes your data."
                        checked={checkboxState}
                        checkbox={'privacy'}
                        // onCheckedChange={setHasAcceptedPrivacy}
                        onReviewPress={() => {
                            setIsPrivacyStatementVisible(true)
                            setCheckboxState(true)
                        }
                        }
                    />

                    <ConsentRow
                        title="Beta Disclaimer"
                        description="Review the limitations that apply while Smart Gauge is in beta."
                        checked={checkboxStateForBeta}
                        checkbox={'beta'}
                        // onCheckedChange={setHasAcceptedBetaDisclaimer}
                        onReviewPress={() => {
                            setIsBetaDisclaimerVisible(true)
                            setCheckboxStateForBeta(true)
                        }
                        }
                    />

                    {error ? (
                        <Text accessibilityRole="alert" style={styles.errorText}>
                            {error}
                        </Text>
                    ) : null}

                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{disabled: !canConnect}}
                        disabled={!canConnect}
                        onPress={handleConnectStrava}
                        style={({pressed}) => [
                            styles.primaryButton,
                            !canConnect && styles.disabledButton,
                            pressed && canConnect && styles.pressedButton,
                        ]}
                    >
                        {isConnecting ? (
                            <ActivityIndicator/>
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                Connect with Strava
                            </Text>
                        )}
                    </Pressable>

                    <Text style={styles.footerText}>
                        You can disconnect Strava or delete your Smart Gauge account
                        from account settings.
                    </Text>
                </View>
            </ScrollView>

            <PrivacyStatement
                privacyStatementFlag={isPrivacyStatementVisible}
                setPrivacyStatementFlag={setIsPrivacyStatementVisible}
            />

            <BetaDisclaimer
                betaDisclaimerFlag={isBetaDisclaimerVisible}
                setBetaDisclaimerFlag={setIsBetaDisclaimerVisible}
            />
        </SafeAreaProvider>
    );
}

type checkBoxFlags = 'privacy' | 'beta';

type ConsentRowProps = {
    title: string;
    description: string;
    checked: boolean;
    // onCheckedChange: (checked: boolean) => void;
    onReviewPress: () => void;
    checkbox: checkBoxFlags;
};

function ConsentRow({
                        title,
                        description,
                        checked,
                        onReviewPress,
                        checkbox,
                    }: ConsentRowProps) {
    return (
        <View style={styles.consentCard}>
            <View style={styles.consentHeader}>
                <View style={styles.consentTextContainer}>
                    <Text style={styles.disclaimerTitle}>{title}</Text>
                    <Text style={styles.disclaimerDescription}>
                        {description}
                    </Text>
                </View>

                {checkbox && <Checkbox
                    accessibilityLabel={`Accept ${title}`}
                    color={checkbox ? "#fd5900" : undefined}
                    value={checkbox ? checked : false}
                    style={styles.checkbox}
                />}
            </View>

            <Pressable
                accessibilityRole="button"
                onPress={onReviewPress}
                hitSlop={8}
                style={({pressed}) => [
                    styles.reviewButton,
                    pressed && styles.reviewButtonPressed,
                ]}
            >
                <Text style={styles.reviewButtonText}>Press review to continue</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    loadingText: {
        color: "#c5c6cd",
        fontSize: 15,
        marginTop: 12,
    },
    card: {
        width: "100%",
        maxWidth: 520,
        alignSelf: "center",
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
        marginBottom: 8,
    },
    retentionText: {
        color: "#8b949e",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 20,
    },
    consentCard: {
        backgroundColor: "#101415",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#2a3033",
        marginBottom: 14,
    },
    consentHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    consentTextContainer: {
        flex: 1,
        paddingRight: 14,
    },
    disclaimerTitle: {
        color: "#e0e3e5",
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 20,
    },
    disclaimerDescription: {
        color: "#8b949e",
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 5,
    },
    reviewButton: {
        alignSelf: "flex-start",
        marginTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 2,
    },
    reviewButtonPressed: {
        opacity: 0.7,
    },
    reviewButtonText: {
        color: "#fd5900",
        fontSize: 14,
        fontWeight: "700",
    },
    primaryButton: {
        minHeight: 52,
        backgroundColor: "#fd5900",
        borderRadius: 14,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    primaryButtonText: {
        color: "#501600",
        fontSize: 16,
        fontWeight: "900",
        textAlign: "center",
    },
    disabledButton: {
        opacity: 0.45,
    },
    pressedButton: {
        opacity: 0.8,
    },
    errorText: {
        color: "#ffb4ab",
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 20,
        marginBottom: 12,
    },
    footerText: {
        color: "#8b949e",
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
        marginTop: 12,
    },
});