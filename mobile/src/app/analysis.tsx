import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {BottomNav} from "@/components/BottomNav";
import {SummaryCard} from "@/components/SummaryCard";
import {useDashboardData} from "@/context/DashboardDataContext";
import {useState} from "react";

export default function AnalysisScreen() {

    const {feedItems} = useDashboardData();
    const [displaySummaryCardInMiles, setDisplaySummaryCardInMiles] = useState(true);

    const runMiles = feedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const runHours = feedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const bikeHours = feedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const bikeDistance = feedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const handleChangeSummaryCard = () => {
        setDisplaySummaryCardInMiles(!displaySummaryCardInMiles);
    }

    //Only calculate average pain score for completed check-ins
    const completedCheckins = feedItems.filter(
        (item) => item.checkinStatus === "COMPLETED"
    );

    // Calculate average pain score for completed check-ins //
    const painScores = completedCheckins
        .map((item) => item.painScore)
        .filter((score): score is number => score !== null && score !== undefined);

    const averagePain =
        painScores.length === 0
            ? 0
            : painScores.reduce((sum, score) => sum + score, 0) / painScores.length;

    const pain = averagePain.toFixed(0);
    // calculate average pain score code end //

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.appName}>Smart Gauge</Text>
                <Text style={styles.subtitle}>Analysis</Text>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={handleChangeSummaryCard}>
                        <Text style={styles.subtitle}>Total training volume </Text>
                        <View style={styles.summaryGrid}>
                            {
                                displaySummaryCardInMiles ?
                                    <>
                                        <SummaryCard
                                            label="Run Miles"
                                            value={runMiles.toFixed(2)}
                                            unit="mi"
                                            instructions="Click for hours"
                                        />
                                        <SummaryCard
                                            label="Bike Miles"
                                            value={bikeDistance.toFixed(2)}
                                            unit="mi"
                                            instructions="Click for hours"
                                        />
                                    </>
                                    :
                                    <>
                                        <SummaryCard
                                            label="Run Hours"
                                            value={runHours.toFixed(2)}
                                            unit="hr"
                                            instructions="Click for miles"
                                        />
                                        <SummaryCard
                                            label="Bike Hours"
                                            value={bikeHours.toFixed(2)}
                                            unit="hr"
                                            instructions="Click for miles"
                                        />
                                    </>
                            }
                        </View>
                    </TouchableOpacity>


                <TouchableOpacity style={styles.card}>
                    <Text style={styles.subtitle}>Recovery analysis </Text>
                    <SummaryCard
                        label="Pain"
                        value={pain.toLocaleString()}
                        // unit="hr"
                        // instructions="Click for miles"
                    />
                </TouchableOpacity>

            </ScrollView>


            <BottomNav activeRoute="analysis"/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },
    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 24,
    },
    content: {
        padding: 20,
        paddingTop: 56,
        paddingBottom: 110,
    },
    appName: {
        color: "#fd5900",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 4,
    },
    subtitle: {
        color: "#c5c6cd",
        fontSize: 16,
        marginBottom: 24,
    },
    card: {
        backgroundColor: "#151b1f",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#263238",
        marginBottom: 14,
    },
    cardTitle: {
        color: "#e0e3e5",
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 8,
    },
    cardMessage: {
        color: "#c5c6cd",
        fontSize: 15,
        lineHeight: 22,
    },
});