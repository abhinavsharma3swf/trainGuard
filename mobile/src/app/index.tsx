// import { router } from "expo-router";
// import { useState } from "react";
// import {
//     KeyboardAvoidingView,
//     Platform,
//     Pressable,
//     StyleSheet,
//     Text,
//     TextInput,
//     View,
// } from "react-native";
//
// export default function LoginScreen() {
//     const [email, setEmail] = useState("");
//     const [error, setError] = useState("");
//
//     const handleLogin = () => {
//         if (!email.trim()) {
//             setError("Enter your email to continue.");
//             return;
//         }
//
//         setError("");
//         router.push("/");
//     };
//
//     return (
//         <KeyboardAvoidingView
//             style={styles.screen}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//         >
//             <View style={styles.card}>
//                 <View style={styles.logoMark}>
//                     <Text style={styles.logoText}>SG</Text>
//                 </View>
//
//                 <Text style={styles.appName}>Smart Gauge</Text>
//
//                 <Text style={styles.subtitle}>
//                     Connect your training data, track recovery, and monitor risk before your next workout.
//                 </Text>
//
//                 <View style={styles.form}>
//                     {/*<Text style={styles.label}>Email</Text>*/}
//
//                     {/*<TextInput*/}
//                     {/*    style={styles.input}*/}
//                     {/*    placeholder="you@example.com"*/}
//                     {/*    placeholderTextColor="#6f7a80"*/}
//                     {/*    value={email}*/}
//                     {/*    onChangeText={(value) => {*/}
//                     {/*        setEmail(value);*/}
//                     {/*        setError("");*/}
//                     {/*    }}*/}
//                     {/*    autoCapitalize="none"*/}
//                     {/*    keyboardType="email-address"*/}
//                     {/*/>*/}
//
//                     {error ? <Text style={styles.errorText}>{error}</Text> : null}
//
//                     {/*<Pressable style={styles.primaryButton} onPress={handleLogin}>*/}
//                     {/*    <Text style={styles.primaryButtonText}>Continue</Text>*/}
//                     {/*</Pressable>*/}
//
//                     <Pressable onPress={()=> router.push("/dashboard")} style={styles.secondaryButton}>
//                         <Text style={styles.secondaryButtonText}>Continue with Strava</Text>
//                     </Pressable>
//                 </View>
//
//                 <Text style={styles.footerText}>
//                     Smart Gauge uses your recent activities and recovery check-ins to help you make better training decisions.
//                 </Text>
//             </View>
//         </KeyboardAvoidingView>
//     );
// }
//
// const styles = StyleSheet.create({
//     screen: {
//         flex: 1,
//         backgroundColor: "#101415",
//         justifyContent: "center",
//         padding: 20,
//     },
//     card: {
//         backgroundColor: "#151b1f",
//         borderRadius: 24,
//         padding: 24,
//         borderWidth: 1,
//         borderColor: "#263238",
//     },
//     logoMark: {
//         width: 64,
//         height: 64,
//         borderRadius: 20,
//         backgroundColor: "#fd5900",
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: 18,
//     },
//     logoText: {
//         color: "#501600",
//         fontSize: 24,
//         fontWeight: "900",
//     },
//     appName: {
//         color: "#e0e3e5",
//         fontSize: 34,
//         fontWeight: "900",
//         marginBottom: 10,
//     },
//     subtitle: {
//         color: "#c5c6cd",
//         fontSize: 16,
//         lineHeight: 24,
//         marginBottom: 28,
//     },
//     form: {
//         gap: 12,
//     },
//     label: {
//         color: "#c5c6cd",
//         fontSize: 13,
//         fontWeight: "700",
//         textTransform: "uppercase",
//         letterSpacing: 1,
//     },
//     input: {
//         backgroundColor: "#101415",
//         borderWidth: 1,
//         borderColor: "#263238",
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 14,
//         color: "#e0e3e5",
//         fontSize: 16,
//     },
//     errorText: {
//         color: "#ffb4ab",
//         fontSize: 14,
//         fontWeight: "700",
//     },
//     primaryButton: {
//         backgroundColor: "#fd5900",
//         borderRadius: 14,
//         paddingVertical: 15,
//         alignItems: "center",
//         marginTop: 8,
//     },
//     primaryButtonText: {
//         color: "#501600",
//         fontSize: 16,
//         fontWeight: "900",
//     },
//     secondaryButton: {
//         borderWidth: 1,
//         borderColor: "#fd5900",
//         borderRadius: 14,
//         paddingVertical: 15,
//         alignItems: "center",
//     },
//     secondaryButtonText: {
//         color: "#fd5900",
//         fontSize: 16,
//         fontWeight: "800",
//     },
//     footerText: {
//         color: "#7d8a91",
//         fontSize: 13,
//         lineHeight: 20,
//         marginTop: 24,
//     },
// });

import {router} from "expo-router";
import {useEffect, useState} from "react";
import {Linking, Pressable, StyleSheet, Text, View,} from "react-native";

import {getStravaAuthorizationUrl} from "@/services/stravaApi";
import {getAthleteId, saveAthleteId} from "@/services/athleteStorage";
import {BottomNav} from "@/components/BottomNav";

export default function ConnectScreen() {
    const [error, setError] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [athleteId, setAthleteId] = useState<number | undefined>();


    async function checkExistingConnection() {
        const storedAthleteId = await getAthleteId();

        if (storedAthleteId) {
            setAthleteId(storedAthleteId);
            router.replace("/dashboard");
        }
    }


    useEffect(() => {
        checkExistingConnection();
    }, []);

    // useEffect(() => {
    //     function handleUrl(event: { url: string }) {
    //         handleDeepLink(event.url);
    //     }
    //
    //     const subscription = Linking.addEventListener("url", handleUrl);
    //
    //     Linking.getInitialURL().then((url) => {
    //         if (url) {
    //             handleDeepLink(url);
    //         }
    //     });
    //
    //     return () => {
    //         subscription.remove();
    //     };
    // }, []);

    const handleDeepLink = async (url: string) => {
        if (!url.includes("strava-connected")) {
            return;
        }

        const parsedUrl = new URL(url);
        const athleteIdParam = parsedUrl.searchParams.get("athleteId");

        if (!athleteIdParam) {
            setError("Strava connected, but athlete ID was missing.");
            return;
        }

        const athleteId = Number(athleteIdParam);

        if (Number.isNaN(athleteId)) {
            setError("Invalid athlete ID returned from Strava.");
            return;
        }

        await saveAthleteId(athleteId);
        router.replace("/dashboard");
    };

    const handleConnectStrava = async () => {
        try {
            setIsConnecting(true);
            setError("");

            const url = await getStravaAuthorizationUrl();

            console.log("strava", url);
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
                    Connect Strava to import your latest activities and track your recovery status.
                </Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={[styles.primaryButton, isConnecting && styles.disabledButton]}
                    onPress={handleConnectStrava}
                    disabled={isConnecting}
                >
                    <Text style={styles.primaryButtonText}>
                        {isConnecting ? "Connecting..." : "Connect with Strava"}
                    </Text>
                </Pressable>
            </View>
            <BottomNav activeRoute="login" storedAthleteId={athleteId}/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
        justifyContent: "center",
        padding: 20,
        paddingBottom: 110
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
        marginBottom: 18,
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
        marginBottom: 10,
    },
    subtitle: {
        color: "#c5c6cd",
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 28,
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
});