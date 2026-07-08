import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {Activity} from "@/types/activity";
import {Metric} from "./Metric";
import {router} from "expo-router";


type ActivityCardProps = {
    activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
    const isPending = activity.status === "PENDING";

    console.log(activity, "ac");


    return (
        <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
                <View>
                    <Text style={styles.activityType}>{activity.type}</Text>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                </View>

                {isPending ? (
                    <Text style={styles.pendingBadge}>NEW</Text>
                ) : (
                    <Text style={styles.completedBadge}>Completed</Text>
                )}
            </View>

            <View style={styles.metricsRow}>
                <Metric label="Distance" value={activity.distance} />
                <Metric label="Time" value={activity.time} />
                <Metric
                    label={activity.type === "RIDE" ? "Power" : "Pace"}
                    value={activity.paceOrPower}
                />
            </View>

            {isPending ? (
                <View style={styles.checkInRow}>
                    <Text style={styles.checkInText}>Recovery check-in pending</Text>

                    <TouchableOpacity
                        style={styles.checkInButton}
                        onPress={() => router.push(`/recovery/${activity.id}`)}
                        // onPress={() =>
                        //     router.push({
                        //         pathname: "/recovery/$[activityId]",
                        //         params: {
                        //             activityId: String(activity.id),
                        //         },
                        //     })
                        // }
                    >
                        <Text style={styles.checkInButtonText}>Check in</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.chipRow}>
                    <Chip label={`RPE ${activity.rpe}`} />
                    <Chip label={`Pain ${activity.pain}`} />
                    <Chip label={activity.mood ?? "Good"} />
                </View>
            )}
        </View>
    );
}

function Chip({ label }: { label: string }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    activityCard: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },
    activityHeader: {
        padding: 16,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    activityType: {
        color: "#fd5900",
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 4,
    },
    activityName: {
        color: "#e0e3e5",
        fontSize: 18,
        fontWeight: "800",
    },
    activityDate: {
        color: "#8f9097",
        fontSize: 13,
        marginTop: 3,
    },
    pendingBadge: {
        color: "#ffb59a",
        backgroundColor: "rgba(253,89,0,0.14)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: "800",
        alignSelf: "flex-start",
    },
    completedBadge: {
        color: "#4edea3",
        fontSize: 12,
        fontWeight: "800",
    },
    metricsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    checkInRow: {
        backgroundColor: "rgba(253,89,0,0.10)",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    checkInText: {
        color: "#ffb59a",
        fontSize: 13,
        fontWeight: "700",
        flex: 1,
    },
    checkInButton: {
        backgroundColor: "#fd5900",
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
    },
    checkInButtonText: {
        color: "#501600",
        fontWeight: "900",
    },
    chipRow: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    chip: {
        backgroundColor: "#323537",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    chipText: {
        color: "#e0e3e5",
        fontSize: 12,
        fontWeight: "700",
    },
});