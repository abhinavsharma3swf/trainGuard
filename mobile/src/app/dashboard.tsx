import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {DashboardFeedItem, getDashboardFeed} from "@/services/dashboardApi";
import {useEffect, useState} from "react";
import {ActivityCard} from "@/components/ActivityCard";
import {SummaryCard} from "@/components/SummaryCard";
import {syncStravaActivities} from "@/services/stravaApi";
import {router} from "expo-router";
import {BottomNav} from "@/components/BottomNav";


export default function HomeScreen() {
    const [feedItems, setFeedItems] = useState<DashboardFeedItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    const loadDashboardFeed = async () => {

        try {
            setError("");
            const data = await getDashboardFeed();
            console.log("Dashboard feed data:", data);
            const startdate = data.map((e)=> e.startDate);
            console.log(
                "Start dates:",
                startdate.map((e) => new Date(e).toLocaleDateString())
            )
            const ascendingFeedData = [...data].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
            const test = [...startdate].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
            console.log("Sorted start dates:", test);
            setFeedItems(ascendingFeedData);
        } catch (error) {
            console.error(error);
            router.replace("/");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardFeed();
    }, []);

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

    // const bikeHours = feedItems
    //     .filter((item) => item.sportType === "RIDE")
    //     .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const bikeHours = feedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.distanceMiles, 0);

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
                    {pendingCheckins > 0
                        ? `${pendingCheckins} activit${pendingCheckins > 1 ? "ies need" : " needs"} a recovery check-in. Complete ${pendingCheckins > 1 ? "them" : "it"} to update the status.`
                        : "All recent activities have recovery check-ins."}
                </Text>

        </View>

    <View style={styles.summaryGrid}>

        <SummaryCard
            label="Pending"
            value={String(pendingCheckins)}
            unit="check-ins"
        />

        <SummaryCard
            label="Physical Pain"
            value={averagePain.toFixed(1)}
            unit="/10"
        />

        <SummaryCard
            label="Run Miles"
            value={runMiles.toFixed(1)}
            unit="mi"
        />

        <SummaryCard
            label="Bike Miles"
            value={bikeHours.toFixed(1)}
            unit="mi"
        />


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
        </View>
    )
}
</ScrollView>
    <BottomNav activeRoute="dashboard"/>
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
});