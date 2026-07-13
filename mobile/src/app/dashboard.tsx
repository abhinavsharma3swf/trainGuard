import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

// import { getActivities, ActivityResponse } from "@/services/activityApi";
import {DashboardFeedItem, getDashboardFeed} from "@/services/dashboardApi";
import {useEffect, useState} from "react";
import {ActivityCard} from "@/components/ActivityCard";
import {SummaryCard} from "@/components/SummaryCard";
import {syncStravaActivities} from "@/services/stravaApi";
import {router} from "expo-router";
import {BottomNav} from "@/components/BottomNav";
import {clearSessionToken, getSessionToken} from "@/services/athleteStorage";
import {API_BASE_URL} from "@/constants/api";


export default function HomeScreen() {

    // const [recoveryCheckins, setRecoveryCheckins] = useState<RecoveryCheckin[]>([]);
    // const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [feedItems, setFeedItems] = useState<DashboardFeedItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    // useEffect(() => {
    //   async function loadRecoveryCheckins() {
    //     try {
    //       const data = await getRecoveryCheckins();
    //       setRecoveryCheckins(data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    //
    //   loadRecoveryCheckins();
    // }, []);

    // useEffect(() => {
    //   async function loadData() {
    //     try {
    //       const activitiesData = await getActivities();
    //       const recoveryData = await getRecoveryCheckins();
    //
    //       setActivities(activitiesData);
    //       setRecoveryCheckins(recoveryData);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    //
    //   loadData();
    // }, []);

    // const athleteId = 49461647

    // const loadDashboardFeed = async () => {
    //     try {
    //         setError("");
    //         const data = await getDashboardFeed(athleteId);
    //         setFeedItems(data);
    //     } catch (error) {
    //         console.error(error);
    //         setError("Could not load dashboard feed. Make sure the backend is running.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    useEffect(() => {
        // loadDashboardFeed();
        const loadDashboardFeed = async () => {

            try {
                setError("");
                const data = await getDashboardFeed();
                setFeedItems(data);
            } catch (error) {
                console.error(error);
                router.replace("/");
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardFeed();
    }, []);

    // const handleSync = async () => {
    //     try {
    //         setIsSyncing(true);
    //         setError("");
    //
    //         await syncStravaActivities(athleteId);
    //         await loadDashboardFeed();
    //     } catch (error) {
    //         console.error(error);
    //         setError("Could not sync Strava activities. Check your Strava connection and backend.");
    //     } finally {
    //         setIsSyncing(false);
    //     }
    // };

    async function loadDashboardFeed() {
        try {
            const data = await getDashboardFeed();
            setFeedItems(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            setError("");

            await syncStravaActivities();
            await loadDashboardFeed();
        } catch (error) {
            console.error(error);
            setError("Could not sync Strava activities. Check your Strava connection and backend.");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
      loadDashboardFeed();
    }, []);

    const runMiles = feedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const bikeHours = feedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const pendingCheckins = feedItems.filter(
        (item) => item.checkinStatus === "PENDING"
    ).length;

    const painScores = feedItems
        .filter((item) => item.painScore !== null)
        .map((item) => item.painScore as number);

    const averagePain =
        painScores.length > 0
            ? painScores.reduce((total, pain) => total + pain, 0) / painScores.length
            : 0;

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.appName}>Smart Gauge</Text>
                        <Text style={styles.subtitle}>Effort tracked. Injury skipped</Text>
                        {/*<Text style={styles.subtitle}>Activity Feed</Text>*/}
                    </View>

                    <TouchableOpacity
                        style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
                        onPress={handleSync}
                        disabled={isSyncing}
                    >
                        <Text style={styles.syncText}>
                            {isSyncing ? "Syncing..." : "Sync"}
                        </Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={styles.syncButton}>*/}
                    {/*  <Text style={styles.syncText}>Sync</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.statusCard}>
                    <Text style={styles.label}>Training Status</Text>
                    <Text style={styles.statusTitle}>
                        {pendingCheckins > 5 ? "Red" : pendingCheckins >=0 ? "Yellow" : "Green"}
                    </Text>
                    {/*<Text style={styles.statusTitle}>Yellow</Text>*/}
                    {/*<Text style={styles.statusMessage}>*/}
                    {/*  One activity needs a recovery check-in. Complete it to update your risk status.*/}
                    {/*</Text>*/}

                    <Text style={styles.statusMessage}>
                        {pendingCheckins > 0
                            ? `${pendingCheckins} activity${pendingCheckins > 1 ? "ies need" : " needs"} a recovery check-in. Complete ${pendingCheckins > 1 ? "them" : "it"} to update your risk status.`
                            : "All recent activities have recovery check-ins."}
                    </Text>

                </View>

                {/*<View style={styles.summaryGrid}>*/}
                {/*  <SummaryCard label="Run Miles" value="32.4" unit="mi" />*/}
                {/*  <SummaryCard label="Bike Time" value="5.2" unit="hr" />*/}
                {/*  <SummaryCard label="Pending" value="2" unit="check-ins" />*/}
                {/*  <SummaryCard label="Pain" value="3" unit="/10" />*/}
                {/*</View>*/}

                <View style={styles.summaryGrid}>
                    <SummaryCard
                        label="Run Miles"
                        value={runMiles.toFixed(1)}
                        unit="mi"
                    />

                    <SummaryCard
                        label="Bike Time"
                        value={bikeHours.toFixed(1)}
                        unit="hr"
                    />

                    <SummaryCard
                        label="Pending"
                        value={String(pendingCheckins)}
                        unit="check-ins"
                    />

                    <SummaryCard
                        label="Pain"
                        value={averagePain.toFixed(1)}
                        unit="/10"
                    />
                </View>

                <Text style={styles.sectionTitle}>Recent Activities</Text>

                {isLoading ? (
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
                                        type: item.sportType === "RIDE" ? "RIDE" : "RUN",
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
                                    }}
                                />
                            );
                        })}

                        {/*{activities.map((activity) => {*/}
                        {/*  // const hasCheckin = recoveryCheckins.some(*/}
                        {/*  //     (checkin) => checkin.activityId === activity.id*/}
                        {/*  // );*/}
                        {/*  const recoveryCheckin = recoveryCheckins.find(*/}
                        {/*      (checkin) => checkin.activityId === activity.id*/}
                        {/*  );*/}

                        {/*  const hasCheckin = recoveryCheckin !== undefined;*/}

                        {/*  return (*/}
                        {/*      <ActivityCard*/}
                        {/*          key={activity.id}*/}
                        {/*          activity={{*/}
                        {/*            id: activity.id,*/}
                        {/*            type: activity.sportType === "RIDE" ? "RIDE" : "RUN",*/}
                        {/*            name: activity.name,*/}
                        {/*            date: activity.startDate,*/}
                        {/*            distance: `${activity.distanceMiles} mi`,*/}
                        {/*            time: `${activity.movingTimeMinutes} min`,*/}
                        {/*            paceOrPower: activity.pacePerMile,*/}
                        {/*            status: hasCheckin ? "COMPLETED" : "PENDING",*/}

                        {/*            rpe: recoveryCheckin ? String(recoveryCheckin.rpe) : undefined,*/}
                        {/*            pain: recoveryCheckin ? String(recoveryCheckin.painScore) : undefined,*/}
                        {/*            mood: recoveryCheckin?.mood,*/}
                        {/*          }}*/}
                        {/*      />*/}
                        {/*  );*/}
                        {/*})}*/}
                    </View>
                )}
            </ScrollView>
            <BottomNav activeRoute="dashboard" />
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
    statusCard: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: "#fd5900",
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
});