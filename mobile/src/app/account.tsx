import React, {useState} from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import {BottomNav} from "@/components/BottomNav";
import {clearSessionToken} from "@/services/athleteStorage";
import {deleteAccount, deleteApi} from "@/services/deleteApi";
import {useDashboardData} from "@/context/DashboardDataContext";

export default function AccountScreen() {
    const [isProcessing, setIsProcessing] = useState(false);

    const {feedItems} = useDashboardData()

    const handleLogout = async () => {
        try {
            setIsProcessing(true);

            await clearSessionToken();

            router.replace("/");
        } catch (error) {
            console.error("Logout failed:", error);

            Alert.alert(
                "Logout failed",
                "Unable to log out. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteData = async () => {
        await deleteApi();
        Alert.alert(
            "Delete recovery data?",
            "This will permanently delete your stored recovery check-ins and analysis data. Your account will remain active.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete data",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsProcessing(true);
                            await deleteApi();
                            Alert.alert(
                                "Data deleted",
                                "Your stored recovery data has been deleted."
                            );
                        } catch (error) {
                            console.error(
                                "Delete data failed:",
                                error
                            );

                            Alert.alert(
                                "Deletion failed",
                                "Unable to delete your data."
                            );
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        await deleteAccount();
        Alert.alert(
            "Delete account?",
            "You must login in Strava and revoke access in the setting -> App for Smart Gauge. This action permanently deletes your account and cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete account",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsProcessing(true);
                            await deleteAccount();

                            await clearSessionToken();

                            router.replace("/");
                        } catch (error) {
                            console.error(
                                "Delete account failed:",
                                error
                            );

                            Alert.alert(
                                "Deletion failed",
                                "Unable to delete your account."
                            );
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.appName}>
                    Smart Gauge
                </Text>

                <Text style={styles.pageTitle}>
                    Account
                </Text>

                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="person-circle-outline"
                            size={54}
                            color="#fd5900"
                        />
                    </View>

                    <Text style={styles.cardTitle}>
                        Account settings
                    </Text>

                    <Text style={styles.cardDescription}>
                        Manage your session, stored recovery
                        information, and Smart Gauge account.
                    </Text>
                </View>

                <View style={styles.optionsCard}>
                    <Pressable
                        style={styles.option}
                        onPress={handleLogout}
                        disabled={isProcessing}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons
                                name="log-out-outline"
                                size={24}
                                color="#c5c6cd"
                            />

                            <View>
                                <Text style={styles.optionTitle}>
                                    Log out
                                </Text>

                                <Text
                                    style={
                                        styles.optionDescription
                                    }
                                >
                                    Sign out of Smart Gauge on
                                    this device
                                </Text>
                            </View>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#7d8a91"
                        />
                    </Pressable>

                    <View style={styles.divider}/>

                    <Pressable
                        style={styles.option}
                        onPress={handleDeleteData}
                        disabled={isProcessing}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color="#f0a44b"
                            />

                            <View>
                                <Text style={styles.optionTitle}>
                                    Delete stored data
                                </Text>

                                <Text
                                    style={
                                        styles.optionDescription
                                    }
                                >
                                    Delete recovery and analysis
                                    data without deleting the
                                    account
                                </Text>
                            </View>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#7d8a91"
                        />
                    </Pressable>

                    <View style={styles.divider}/>

                    <Pressable
                        style={styles.option}
                        onPress={handleDeleteAccount}
                        disabled={isProcessing}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons
                                name="warning-outline"
                                size={24}
                                color="#ff4d4f"
                            />

                            <View>
                                <Text
                                    style={[
                                        styles.optionTitle,
                                        styles.dangerText,
                                    ]}
                                >
                                    Delete account
                                </Text>

                                <Text
                                    style={
                                        styles.optionDescription
                                    }
                                >
                                    Permanently delete your
                                    account and all associated
                                    data
                                </Text>
                            </View>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#7d8a91"
                        />
                    </Pressable>
                </View>
            </ScrollView>

            <BottomNav activeRoute="account"/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },

    content: {
        padding: 20,
        paddingTop: 56,
        paddingBottom: 120,
    },

    appName: {
        color: "#fd5900",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 4,
    },

    pageTitle: {
        color: "#c5c6cd",
        fontSize: 18,
        marginBottom: 24,
    },

    card: {
        backgroundColor: "#151b1f",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#263238",
        padding: 20,
        marginBottom: 16,
    },

    iconContainer: {
        marginBottom: 12,
    },

    cardTitle: {
        color: "#e0e3e5",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 8,
    },

    cardDescription: {
        color: "#8f9097",
        fontSize: 15,
        lineHeight: 22,
    },

    optionsCard: {
        backgroundColor: "#151b1f",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#263238",
        overflow: "hidden",
    },

    option: {
        minHeight: 82,
        paddingHorizontal: 18,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    optionLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingRight: 12,
    },

    optionTitle: {
        color: "#e0e3e5",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },

    optionDescription: {
        color: "#7d8a91",
        fontSize: 13,
        lineHeight: 18,
        maxWidth: 245,
    },

    divider: {
        height: 1,
        backgroundColor: "#263238",
        marginLeft: 56,
    },

    dangerText: {
        color: "#ff4d4f",
    },
});