import {Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {BottomNav} from "@/components/BottomNav";
import {SummaryCard} from "@/components/SummaryCard";
import {useDashboardData} from "@/context/DashboardDataContext";
import React, {useEffect, useState} from "react";
import AnalysisChart from "@/components/AnalysisChart";
import {getRecoveryCheckins} from "@/services/recoveryApi";

export default function AnalysisScreen() {

    const {feedItems} = useDashboardData();
    const [displaySummaryCardInMiles, setDisplaySummaryCardInMiles] = useState(true);
    const [painScoreGraphFlag, setPainScoreGraphFlag] = useState(true)
    const [rpeFlag, setRpeFlag] = useState(true);

    const isWithinLastSevenDays = (stringDate: string) => {
        const activityDate = new Date(stringDate);

        const now = new Date();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        return activityDate >= sevenDaysAgo;
    };

    const lastSevenDayFeedItems = feedItems.filter((item) =>
        isWithinLastSevenDays(item.startDate)
    );

    const runMiles = lastSevenDayFeedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const runHours = lastSevenDayFeedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const bikeHours = lastSevenDayFeedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;

    const bikeDistance = lastSevenDayFeedItems
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

    //removing duplicates//

    const painLocations = [
        ...new Set(
            lastSevenDayFeedItems
                .map((item) => item.painLocation)
                .filter(Boolean)
        ),
    ];
    // calculate average RPE and mood //

    // Calculate average pain score for completed check-ins //
    const rpeScores = completedCheckins
        .map((item) => item.rpe)
        .filter((score): score is number => score !== null && score !== undefined);

    const averageRpe =
        rpeScores.length === 0
            ? 0
            : rpeScores.reduce((sum, score) => sum + score, 0) / rpeScores.length;

    const rpe = averageRpe.toFixed(0);

    //removing duplicates//

    const mood = [
        ...new Set(
            lastSevenDayFeedItems
                .map((item) => item.mood)
                .filter(Boolean)
        ),
    ];
    // calculate average pain score code end //

    //Average temperature//

    const temperatureScores = completedCheckins
        .map((item)=> item.temperature)
        .filter((temperature) => temperature !== null && temperature !== 0);
    console.log(temperatureScores, "temp scores");

    console.log(completedCheckins, "completed checkins");

    //For graph//

    const [recoveryCheckinData, setRecoveryCheckinData] = useState<any>([])
    const [rpeCheckinData, setRpeCheckinData] = useState<any>([])

    useEffect(() => {
        getRecoveryCheckins(0, 20).then(
            data => {
                const fitnessData: { value: number; label: string }[] = data.map((item) => {
                    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                    return {
                        value: item.painScore, label: date
                    }
                })
                const sortedData = fitnessData.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime())
                setRecoveryCheckinData(sortedData)

                const fitnessRpeData: { value: number; label: string }[] = data.map((item) => {
                    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                    return {
                        value: item.rpe, label: date
                    }
                })
                const sortedRpeData = fitnessRpeData.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime())
                setRpeCheckinData(sortedRpeData);
            }
        )

    }, []);
    //code end//

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <Text style={styles.appName}>Smart Gauge</Text>
                        <Text style={styles.subtitle}>Analysis</Text>
                    </View>
                    <Image source={require("@/assets/images/smartGaugeAppIcon.png")}
                           resizeMode="contain"
                           style={{
                               // backgroundColor: "#fd5900",
                               paddingHorizontal: 16,
                               paddingVertical: 10,
                               borderRadius: 12, width: 65, height: 60
                           }}/>
                </View>
                <TouchableOpacity
                    style={styles.card}
                    onPress={handleChangeSummaryCard}>
                    <Text style={styles.subtitle}>Total training volume for the last 7 days </Text>
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


                {painScoreGraphFlag ? <Pressable style={styles.card} onPress={(prev) => setPainScoreGraphFlag(!prev)}>
                        <Text style={styles.subtitle}>Average reported pain analysis</Text>
                        <View style={styles.summaryGrid}>
                            <SummaryCard
                                label="Average Pain Score"
                                value={pain.toLocaleString()}
                            />
                            <View style={styles.painLocationList}>
                                <Text style={styles.summaryText}>You reported pain</Text>

                                {painLocations.map((location) => (
                                    <Text key={location} style={styles.painLocationText}>
                                        {location}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </Pressable> :
                    <AnalysisChart checkinData={recoveryCheckinData} setGraphFlag={setPainScoreGraphFlag}
                                   metric="painScore" painScoreFlag={painScoreGraphFlag}/>}

                {rpeFlag ?
                <Pressable style={styles.card} onPress={(prev) => setRpeFlag(!prev)}>
                    <Text style={styles.subtitle}>Average reported RPE and mood analysis</Text>
                    <View style={styles.summaryGrid}>
                        <SummaryCard
                            label="Average RPE"
                            value={rpe.toLocaleString()}
                        />
                        <View style={styles.painLocationList}>
                            <Text style={styles.summaryText}>Your reported mood</Text>

                            {mood.map((mood) => (
                                <Text key={mood} style={styles.painLocationText}>
                                    {mood}
                                </Text>
                            ))}
                        </View>
                    </View>
                </Pressable> :
                <AnalysisChart checkinData={rpeCheckinData} metric={'rpe'}
                               setGraphFlag={setRpeFlag} rpeFlag={rpeFlag}/>}

                <Pressable style={styles.card}>
                    <Text style={styles.subtitle}>Average temperature and RPE analysis</Text>
                    <View style={styles.summaryGrid}>
                        <SummaryCard
                            label="Average temperature"
                            value={rpe.toLocaleString()}
                        />
                        <View style={styles.painLocationList}>
                            <Text style={styles.summaryText}>Your reported mood</Text>

                            {mood.map((mood) => (
                                <Text key={mood} style={styles.painLocationText}>
                                    {mood}
                                </Text>
                            ))}
                        </View>
                    </View>
                </Pressable>

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
    painLocationList: {
        marginBottom: 24,
    },

    summaryText: {
        color: "#c5c6cd",
        fontSize: 16,
        marginBottom: 8,
    },
    painLocationText: {
        color: "#fd5900",
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 6,
    },
});