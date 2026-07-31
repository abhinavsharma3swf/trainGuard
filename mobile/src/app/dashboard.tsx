import {Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {ActivityCard} from "@/components/ActivityCard";
import {SummaryCard} from "@/components/SummaryCard";
import {syncStravaActivities} from "@/services/stravaApi";
import {BottomNav} from "@/components/BottomNav";
import {useDashboardData} from "@/context/DashboardDataContext";
import {useFocusEffect} from "expo-router";
import SummaryProgressBar from "@/components/SummaryProgressBar";


export default function HomeScreen() {

    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState("");
    const {feedItems, isLoading, refreshDashboardFeed} = useDashboardData();

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            setError("");

            await syncStravaActivities();
            await refreshDashboardFeed();
        } catch (error) {
            console.error(error);
            setError("Could not sync Strava activities. Check your Strava connection and backend.");
        } finally {
            setIsSyncing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshDashboardFeed();
        }, [])
    );

    const pendingCheckins = feedItems.filter(
        (item) => item.checkinStatus === "PENDING"
    ).length;

    const completedCheckins = feedItems.filter(item => item.checkinStatus === "COMPLETED").length;

    const completedCheckinsWithPain = feedItems.filter(item => item.checkinStatus === "COMPLETED")
        .filter((item) => item.painScore !== undefined && item.painScore !== null && item.painScore > 0).length;

    const completedCheckinsWithNotes = feedItems.filter(item => item.note?.length !== undefined && item.note?.length > 0);

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(()=> {
            setModalVisible(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, []);


    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>

                {pendingCheckins > 0 ?
                    <View style={styles.container}>
                    {/* Reminder Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)} // Handles Android back button
                    >
                        <View style={styles.overlay}>
                            <View style={styles.modalView}>

                                {/* Reminder Content */}
                                <Text style={styles.reminderTitle}>{pendingCheckins} Check-in Pending</Text>
                                <Text style={styles.reminderText}>
                                   Complete them to update your metrics.
                                </Text>

                                {/* The Only Action: Close Button */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
                </View> : null}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.appName}>Smart Gauge</Text>
                        <Text style={styles.subtitle}>Effort tracked. Injury skipped</Text>
                    </View>

                    {feedItems.length <= 0 && <TouchableOpacity
                        style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
                        onPress={handleSync}
                        disabled={isSyncing || feedItems.length > 0}
                    >
                        <Text style={styles.syncText}>
                            {isSyncing ? "Syncing..." : "Sync"}
                        </Text>
                    </TouchableOpacity>}

                    {feedItems.length > 0 &&
                        <Image source={require("@/assets/images/smartGaugeAppIcon.png")}
                               resizeMode="contain"
                               style={{
                                   paddingHorizontal: 16,
                                   paddingVertical: 10,
                                   borderRadius: 12, width: 65, height: 60
                               }}/>

                    }
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View
                    style={
                        pendingCheckins > 5
                            ? styles.statusCardRed
                            : pendingCheckins > 1
                                ? styles.statusCardYellow
                                : styles.statusCardGreen
                    }
                >
                    <Text style={styles.label}>Check-in Status</Text>
                    <Text style={styles.statusTitle}>
                        {pendingCheckins > 5 ? "Red" : pendingCheckins > 1 ? "Yellow" : "Green"}
                    </Text>
                    <Text style={styles.statusMessage}>
                        {pendingCheckins === 1 ? `${pendingCheckins} activity needs a recovery check-in. Complete it to update the status.`
                            : pendingCheckins > 1 ? `${pendingCheckins} activities need recovery check-ins. Complete them to update the status.`
                                : "All recent activities have recovery check-ins."}
                    </Text>

                </View>

                <View style={styles.summaryGrid}>

                    <SummaryCard
                        label="Pending"
                        value={String(pendingCheckins)}
                        unit="check-ins"
                    />

                    <View>
                        <Text style={styles.subtitle}>7 Day Summary</Text>

                        <SummaryProgressBar
                            label="Completed"
                            value={completedCheckins}
                            total={feedItems.length}
                        />

                        <SummaryProgressBar
                            label="Pain reported"
                            value={completedCheckinsWithPain}
                            total={feedItems.length}
                        />

                        <SummaryProgressBar
                            label="Notes added"
                            value={completedCheckinsWithNotes.length}
                            total={feedItems.length}
                        />
                    </View>

                </View>

                <Text style={styles.sectionTitle}>Recent Activities</Text>

                {
                    isLoading ? (
                        <View style={styles.emptyStateCard}>
                            <Text style={styles.emptyStateTitle}>Loading activities...</Text>
                            <Text style={styles.emptyStateMessage}>
                                Fetching your latest dashboard feed.
                            </Text>
                        </View>
                    ) : feedItems.length === 0 ? (
                        <View style={styles.emptyStateCard}>
                            <Text style={styles.emptyStateTitle}>No activities yet</Text>
                            <Text style={styles.emptyStateMessage}>
                                Tap Sync to import your latest Strava activities.
                            </Text>
                        </View>
                    ) : (

                        <View style={styles.activityList}>

                            {feedItems.map((item) => {
                                return (
                                    <ActivityCard
                                        key={item.activityId}
                                        activity={{
                                            id: item.activityId,
                                            type:
                                                item.sportType === "RIDE"
                                                    ? "RIDE"
                                                    : item.sportType === "VIRTUALRIDE"
                                                        ? "VIRTUALRIDE"
                                                    : item.sportType === "RUN"
                                                        ? "RUN"
                                                        : item.sportType === "WEIGHTTRAINING"
                                                            ? "WEIGHTTRAINING"
                                                            : item.sportType === "WORKOUT"
                                                                ? "WORKOUT"
                                                                : item.sportType === "WALK"
                                                                    ? "WALK"
                                                                    : "OTHER",
                                            name: item.name,
                                            date: item.startDate,
                                            distance: `${item.distanceMiles} mi`,
                                            time: `${item.movingTimeMinutes} min`,
                                            pace: item.pacePerMile,
                                            averageWatts: item.averageWatts,
                                            status: item.checkinStatus,
                                            rpe: item.rpe !== null ? String(item.rpe) : undefined,
                                            pain: item.painScore !== null ? String(item.painScore) : undefined,
                                            mood: item.mood ?? undefined,
                                            note: item.note ?? ''
                                        }}
                                    />
                                );
                            })}
                        </View>
                    )
                }
            </ScrollView>
            <BottomNav activeRoute="weekly"/>
        </View>
    )

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },
    content: {
        padding: 20,
        paddingBottom: 110,
    },
    header: {
        marginTop: 32,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    appName: {
        color: "#fd5900",
        fontSize: 30,
        fontWeight: "800",
    },
    subtitle: {
        color: "#c5c6cd",
        fontSize: 14,
        marginTop: 2,
    },
    syncButton: {
        backgroundColor: "#fd5900",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    syncText: {
        color: "#501600",
        fontWeight: "800",
    },
    statusCardRed: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: "#e31c0a",
    },
    statusCardYellow: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: "#c1952a",
    },
    statusCardGreen: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: "#568c04",
    },
    label: {
        color: "#c5c6cd",
        textTransform: "uppercase",
        fontSize: 12,
        letterSpacing: 1,
        marginBottom: 8,
    },
    statusTitle: {
        color: "#e0e3e5",
        fontSize: 34,
        fontWeight: "800",
        marginBottom: 6,
    },
    statusMessage: {
        color: "#c5c6cd",
        fontSize: 15,
        lineHeight: 22,
    },
    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#c5c6cd",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: 2,
        fontWeight: "700",
        marginBottom: 12,
    },
    activityList: {
        gap: 14,
    },
    errorText: {
        color: "#ffb4ab",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 12,
    },
    syncButtonDisabled: {
        opacity: 0.6,
    },
    emptyStateCard: {
        backgroundColor: "#151b1f",
        borderRadius: 18,
        padding: 22,
        borderWidth: 1,
        borderColor: "#263238",
        alignItems: "center",
    },
    emptyStateTitle: {
        color: "#e0e3e5",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 8,
    },

    emptyStateMessage: {
        color: "#c5c6cd",
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },

    //Modal Styling//
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
        },
        openButton: {
            backgroundColor: '#007AFF',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
        overlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dims the background screen
        },
        modalView: {
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            // Material elevation for Android & Shadow for iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        reminderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
        },
        reminderText: {
            fontSize: 16,
            color: '#333',
            textAlign: 'center',
            marginBottom: 24,
        },
        closeButton: {
            backgroundColor: '#fd5900',
            width: '100%',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
        },
        closeButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
});