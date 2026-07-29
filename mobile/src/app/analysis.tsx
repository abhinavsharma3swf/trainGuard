// import {Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
// import {BottomNav} from "@/components/BottomNav";
// import {SummaryCard} from "@/components/SummaryCard";
// import {useDashboardData} from "@/context/DashboardDataContext";
// import React, {useEffect, useMemo, useState} from "react";
// import AnalysisChart from "@/components/AnalysisChart";
// import {useHistoryData} from "@/context/HistoryDataContext";
// import {lineDataItem} from "react-native-gifted-charts";
//
// type TimeRange = 7 | 30 | "ALL";
//
// export default function AnalysisScreen() {
//
//     const {feedItems} = useDashboardData();
//     const {recoveryItems, isLoading, hasMore, handleLoadMore} = useHistoryData();
//     const [displaySummaryCardInMiles, setDisplaySummaryCardInMiles] = useState(true);
//     const [painScoreGraphFlag, setPainScoreGraphFlag] = useState(true)
//     const [rpeFlag, setRpeFlag] = useState(true);
//     const [temperatureFlag, setTemperatureFlag] = useState(true);
//     const [painData, setPainData] = useState<lineDataItem[]>([])
//     const [rpeData, setRpeData] = useState<lineDataItem[]>([])
//     const [temperatureData, setTemperatureData] = useState<lineDataItem[]>([])
//     const [selectedRange, setSelectedRange] = useState<TimeRange>(7);
//     const [averageTemperatureForTheCard, setAverageTemperatureForTheCard] = useState<number>(0)
//
//
//     const isWithinLastSevenDays = (stringDate: string) => {
//         const activityDate = new Date(stringDate);
//
//         const now = new Date();
//
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(now.getDate() - 7);
//
//         return activityDate >= sevenDaysAgo;
//     };
//
//     const lastSevenDayFeedItems = feedItems.filter((item) =>
//         isWithinLastSevenDays(item.startDate)
//     );
//
//     const runMiles = lastSevenDayFeedItems
//         .filter((item) => item.sportType === "RUN")
//         .reduce((total, item) => total + item.distanceMiles, 0);
//
//     const runHours = lastSevenDayFeedItems
//         .filter((item) => item.sportType === "RUN")
//         .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;
//
//     const bikeHours = lastSevenDayFeedItems
//         .filter((item) => item.sportType === "RIDE")
//         .reduce((total, item) => total + item.movingTimeMinutes, 0) / 60;
//
//     const bikeDistance = lastSevenDayFeedItems
//         .filter((item) => item.sportType === "RIDE")
//         .reduce((total, item) => total + item.distanceMiles, 0);
//
//     const handleChangeSummaryCard = () => {
//         setDisplaySummaryCardInMiles(!displaySummaryCardInMiles);
//     }
//
//     //Only calculate average pain score for completed check-ins
//     const completedCheckins = feedItems.filter(
//         (item) => item.checkinStatus === "COMPLETED"
//     );
//
//     // Calculate average pain score for completed check-ins //
//     const painScores = completedCheckins
//         .map((item) => item.painScore)
//         .filter((score): score is number => score !== null && score !== undefined);
//
//     const averagePain =
//         painScores.length === 0
//             ? 0
//             : painScores.reduce((sum, score) => sum + score, 0) / painScores.length;
//
//     const pain = averagePain.toFixed(0);
//
//     //removing duplicates//
//
//     const painLocations = [
//         ...new Set(
//             lastSevenDayFeedItems
//                 .map((item) => item.painLocation)
//                 .filter(Boolean)
//         ),
//     ];
//     // calculate average RPE and mood //
//
//     // Calculate average pain score for completed check-ins //
//     const rpeScores = completedCheckins
//         .map((item) => item.rpe)
//         .filter((score): score is number => score !== null && score !== undefined);
//
//     const averageRpe =
//         rpeScores.length === 0
//             ? 0
//             : rpeScores.reduce((sum, score) => sum + score, 0) / rpeScores.length;
//
//     const rpe = averageRpe.toFixed(0);
//
//     //removing duplicates//
//
//     const mood = [
//         ...new Set(
//             lastSevenDayFeedItems
//                 .map((item) => item.mood)
//                 .filter(Boolean)
//         ),
//     ];
//     // calculate average pain score code end //
//
//     // average temperatures//
//
//     const avgTemp = recoveryItems
//         .map((item) => item.temperature)
//         .filter((score) => score !== null && score !== undefined);
//
//     const averageTemp =
//         avgTemp.length === 0
//             ? 0
//             : avgTemp.reduce((sum, score) => sum + score, 0) / avgTemp.length;
//
//     // const temp = averageTemp.toFixed(0);
//     // setAverageTemperatureForTheCard(30)
//
//
//     //average temperatures//
//
//
//     const filteredCheckins = useMemo(() => {
//         if (selectedRange === 'ALL') {
//             return recoveryItems;
//         }
//         const cutOffDate = new Date();
//         cutOffDate.setHours(0, 0, 0, 0);
//         cutOffDate.setDate(cutOffDate.getDate() - selectedRange)
//         return recoveryItems.filter(item => new Date(item.createdAt) >= cutOffDate)
//     }, [selectedRange, recoveryItems])
//
//
//     useEffect(() => {
//         const painDataForTheAnalysisChart: lineDataItem[] =
//             filteredCheckins
//                 .filter(
//                     (item) =>
//                         item.painScore !== null &&
//                         item.painScore !== undefined &&
//                         item.painScore !== 0
//                 )
//                 .sort(
//                     (a, b) =>
//                         new Date(a.createdAt).getTime() -
//                         new Date(b.createdAt).getTime()
//                 )
//                 .map((item) => ({
//                     value: item.painScore as number,
//                     label: new Date(item.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                             month: "short",
//                             day: "numeric",
//                         }
//                     ),
//                 }));
//         setPainData(painDataForTheAnalysisChart);
//
//         const rpeDataForTheAnalysisChart: lineDataItem[] =
//             filteredCheckins
//                 .filter(
//                     (item) =>
//                         item.rpe !== null &&
//                         item.rpe !== undefined &&
//                         item.rpe !== 0
//                 )
//                 .sort(
//                     (a, b) =>
//                         new Date(a.createdAt).getTime() -
//                         new Date(b.createdAt).getTime()
//                 )
//                 .map((item) => ({
//                     value: item.rpe as number,
//                     label: new Date(item.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                             month: "short",
//                             day: "numeric",
//                         }
//                     ),
//                 }));
//         setRpeData(rpeDataForTheAnalysisChart);
//
//         const temperatureDataForTheAnalysisChart: lineDataItem[] =
//             filteredCheckins
//                 .filter(
//                     (item) =>
//                         item.temperature !== null &&
//                         item.temperature !== undefined &&
//                         item.temperature !== 0
//                 )
//                 .sort(
//                     (a, b) =>
//                         new Date(a.createdAt).getTime() -
//                         new Date(b.createdAt).getTime()
//                 )
//                 .map((item) => ({
//                     value: item.temperature as number,
//                     label: new Date(item.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                             month: "short",
//                             day: "numeric",
//                         }
//                     ),
//                 }));
//         setTemperatureData(temperatureDataForTheAnalysisChart);
//     }, [recoveryItems, selectedRange]);
//
//
//     return (
//         <View style={styles.screen}>
//             <ScrollView contentContainerStyle={styles.content}>
//                 <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <View>
//                         <Text style={styles.appName}>Smart Gauge</Text>
//                         <Text style={styles.subtitle}>Analysis</Text>
//                     </View>
//                     <Image source={require("@/assets/images/smartGaugeAppIcon.png")}
//                            resizeMode="contain"
//                            style={{
//                                // backgroundColor: "#fd5900",
//                                paddingHorizontal: 16,
//                                paddingVertical: 10,
//                                borderRadius: 12, width: 65, height: 60
//                            }}/>
//                 </View>
//
//                 <View style={styles.rangeSelector}>
//                     {[7, 30, "ALL"].map((range) => {
//                         const isSelected = selectedRange === range;
//
//                         return (
//                             <Pressable
//                                 key={range}
//                                 style={[
//                                     styles.rangeButton,
//                                     isSelected && styles.rangeButtonSelected,
//                                 ]}
//                                 onPress={() => {
//                                     setSelectedRange(range as TimeRange)
//                                 }
//                                 }
//                             >
//                                 <Text
//                                     style={[
//                                         styles.rangeButtonText,
//                                         isSelected &&
//                                         styles.rangeButtonTextSelected,
//                                     ]}
//                                 >
//                                     {range === "ALL" ? "All" : `${range}D`}
//                                 </Text>
//                             </Pressable>
//                         );
//                     })}
//                 </View>
//
//
//                 <TouchableOpacity
//                     style={styles.card}
//                     onPress={handleChangeSummaryCard}>
//                     <Text style={styles.subtitle}>Total training volume for the last 7 days </Text>
//                     <View style={styles.summaryGrid}>
//                         {
//                             displaySummaryCardInMiles ?
//                                 <>
//                                     <SummaryCard
//                                         label="Run Miles"
//                                         value={runMiles.toFixed(2)}
//                                         unit="mi"
//                                         instructions="Click for hours"
//                                     />
//                                     <SummaryCard
//                                         label="Bike Miles"
//                                         value={bikeDistance.toFixed(2)}
//                                         unit="mi"
//                                         instructions="Click for hours"
//                                     />
//                                 </>
//                                 :
//                                 <>
//                                     <SummaryCard
//                                         label="Run Hours"
//                                         value={runHours.toFixed(2)}
//                                         unit="hr"
//                                         instructions="Click for miles"
//                                     />
//                                     <SummaryCard
//                                         label="Bike Hours"
//                                         value={bikeHours.toFixed(2)}
//                                         unit="hr"
//                                         instructions="Click for miles"
//                                     />
//                                 </>
//                         }
//                     </View>
//                 </TouchableOpacity>
//
//
//                 {painScoreGraphFlag ? <Pressable style={styles.card} onPress={(prev) => setPainScoreGraphFlag(!prev)}>
//                         <Text style={styles.subtitle}>Average reported pain analysis</Text>
//                         <View style={styles.summaryGrid}>
//                             <SummaryCard
//                                 label="Average Pain Score"
//                                 value={pain}
//                             />
//                             <View style={styles.painLocationList}>
//                                 <Text style={styles.summaryText}>You reported pain</Text>
//
//                                 {painLocations.map((location) => (
//                                     <Text key={location} style={styles.painLocationText}>
//                                         {location}
//                                     </Text>
//                                 ))}
//                             </View>
//                         </View>
//                     </Pressable> :
//                     <AnalysisChart checkinData={painData} setGraphFlag={setPainScoreGraphFlag}
//                                    metric="painScore"/>}
//
//                 {rpeFlag ?
//                     <Pressable style={styles.card} onPress={(prev) => setRpeFlag(!prev)}>
//                         <Text style={styles.subtitle}>Average reported RPE and mood analysis</Text>
//                         <View style={styles.summaryGrid}>
//                             <SummaryCard
//                                 label="Average RPE"
//                                 value={rpe}
//                             />
//                             <View style={styles.painLocationList}>
//                                 <Text style={styles.summaryText}>Your reported mood</Text>
//
//                                 {mood.map((mood) => (
//                                     <Text key={mood} style={styles.painLocationText}>
//                                         {mood}
//                                     </Text>
//                                 ))}
//                             </View>
//                         </View>
//                     </Pressable> :
//                     <AnalysisChart checkinData={rpeData} metric={'rpe'}
//                                    setGraphFlag={setRpeFlag}/>}
//
//                 {/*{temperatureFlag ?*/}
//                 {/*    <Pressable style={styles.card} onPress={(prev) => setTemperatureFlag(!prev)}>*/}
//                 {/*    <Text style={styles.subtitle}>Average temperature and RPE analysis</Text>*/}
//                 {/*    <View style={styles.summaryGrid}>*/}
//                 {/*        <SummaryCard*/}
//                 {/*            label="Average temperature"*/}
//                 {/*            value={averageTemperatureForTheCard.toLocaleString()}*/}
//                 {/*        />*/}
//                 {/*        <View style={styles.painLocationList}>*/}
//                 {/*            <Text style={styles.summaryText}>Weather trend</Text>*/}
//                 {/*            <Text style={styles.painLocationText}>*/}
//                 {/*            </Text>*/}
//
//                 {/*        </View>*/}
//                 {/*    </View>*/}
//                 {/*</Pressable> : null}*/}
//
//             </ScrollView>
//
//
//             <BottomNav activeRoute="analysis"/>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     screen: {
//         flex: 1,
//         backgroundColor: "#101415",
//     },
//     summaryGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 10,
//         marginBottom: 24,
//     },
//     content: {
//         padding: 20,
//         paddingTop: 56,
//         paddingBottom: 110,
//     },
//     appName: {
//         color: "#fd5900",
//         fontSize: 30,
//         fontWeight: "900",
//         marginBottom: 4,
//     },
//     subtitle: {
//         color: "#c5c6cd",
//         fontSize: 16,
//         marginBottom: 24,
//     },
//     card: {
//         backgroundColor: "#151b1f",
//         borderRadius: 18,
//         padding: 18,
//         borderWidth: 1,
//         borderColor: "#263238",
//         marginBottom: 14,
//     },
//     cardTitle: {
//         color: "#e0e3e5",
//         fontSize: 20,
//         fontWeight: "900",
//         marginBottom: 8,
//     },
//     cardMessage: {
//         color: "#c5c6cd",
//         fontSize: 15,
//         lineHeight: 22,
//     },
//     painLocationList: {
//         marginBottom: 24,
//     },
//
//     summaryText: {
//         color: "#c5c6cd",
//         fontSize: 16,
//         marginBottom: 8,
//         width: 150
//     },
//     painLocationText: {
//         color: "#fd5900",
//         fontSize: 16,
//         fontWeight: "800",
//         marginBottom: 6,
//     },
//     rangeSelector: {
//         flexDirection: "row",
//         backgroundColor: "#151b1f",
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: "#263238",
//         padding: 4,
//         marginBottom: 14,
//     },
//
//     rangeButton: {
//         flex: 1,
//         alignItems: "center",
//         paddingVertical: 9,
//         borderRadius: 9,
//     },
//
//     rangeButtonSelected: {
//         backgroundColor: "#fd5900",
//     },
//
//     rangeButtonText: {
//         color: "#8f9097",
//         fontSize: 13,
//         fontWeight: "700",
//     },
//
//     rangeButtonTextSelected: {
//         color: "#101415",
//     },
// });

import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, {useMemo, useState} from "react";
import {lineDataItem} from "react-native-gifted-charts";

import {BottomNav} from "@/components/BottomNav";
import {SummaryCard} from "@/components/SummaryCard";
import AnalysisChart from "@/components/AnalysisChart";
import {useDashboardData} from "@/context/DashboardDataContext";
import {useHistoryData} from "@/context/HistoryDataContext";
import WeatherAnalysisChart from "@/components/WeatherAnalysisChart";

type TimeRange = 7 | 30 | "ALL";

type Insight = {
    title: string;
    message: string;
};

const calculateAverage = (
    values: Array<number | null | undefined>,
): number => {
    const validValues = values.filter(
        (value): value is number=>
            value !== null && value !== undefined && value !== 0,
    );

    if (validValues.length === 0) {
        return 0;
    }
    return (
        validValues.reduce((sum, value) => sum + value, 0) /
        validValues.length
    );
};

const formatChange = (value: number): string => {
    if (Math.abs(value) < 0.5) {
        return "Stable";
    }

    return value > 0
        ? `Increased by ${value.toFixed(0)}`
        : `Decreased by ${Math.abs(value).toFixed(0)}`;
};

export default function AnalysisScreen() {
    const {feedItems} = useDashboardData();
    const {recoveryItems} = useHistoryData();

    const [displaySummaryCardInMiles, setDisplaySummaryCardInMiles] = useState(true);
    const [painScoreGraphFlag, setPainScoreGraphFlag] = useState(true);
    const [rpeFlag, setRpeFlag] = useState(true);
    const [temperatureFlag, setTemperatureFlag] = useState(true);
    const [selectedRange, setSelectedRange] = useState<TimeRange>(7);

    const isWithinLastSevenDays = (stringDate: string) => {
        const activityDate = new Date(stringDate);
        const sevenDaysAgo = new Date();

        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return activityDate >= sevenDaysAgo;
    };

    const lastSevenDayFeedItems = feedItems.filter((item) =>
        isWithinLastSevenDays(item.startDate),
    );

    const runMiles = lastSevenDayFeedItems
        .filter((item) => item.sportType === "RUN")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const runHours =
        lastSevenDayFeedItems
            .filter((item) => item.sportType === "RUN")
            .reduce(
                (total, item) => total + item.movingTimeMinutes,
                0,
            ) / 60;

    const bikeHours =
        lastSevenDayFeedItems
            .filter((item) => item.sportType === "RIDE")
            .reduce(
                (total, item) => total + item.movingTimeMinutes,
                0,
            ) / 60;

    const bikeDistance = lastSevenDayFeedItems
        .filter((item) => item.sportType === "RIDE")
        .reduce((total, item) => total + item.distanceMiles, 0);

    const filteredCheckins = useMemo(() => {
        if (selectedRange === "ALL") {
            return recoveryItems;
        }

        const cutoffDate = new Date();
        cutoffDate.setHours(0, 0, 0, 0);
        cutoffDate.setDate(cutoffDate.getDate() - selectedRange);

        return recoveryItems.filter(
            (item) => new Date(item.createdAt) >= cutoffDate,
        );
    }, [recoveryItems, selectedRange]);

    const averagePain = calculateAverage(
        filteredCheckins.map((item) => item.painScore),
    );

    const averageRpe = calculateAverage(
        filteredCheckins.map((item) => item.rpe),
    );

    const averageTemperature = calculateAverage(
        filteredCheckins.map((item) => item.temperature),
    );


    const averageFeelsLike = calculateAverage(
        filteredCheckins.map((item) => item.feelsLikeTemperature),
    );

    const averageHumidity = calculateAverage(
        filteredCheckins.map((item) => item.humidity),
    );

    const painData = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.painScore !== null &&
                        item.painScore !== undefined,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.painScore as number,
                    label: new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        },
                    ),
                })),
        [filteredCheckins],
    );

    const rpeData = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.rpe !== null &&
                        item.rpe !== undefined &&
                        item.rpe !== 0,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.rpe as number,
                    label: new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        },
                    ),
                })),
        [filteredCheckins],
    );

    const temperatureData = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.temperature !== null &&
                        item.temperature !== undefined &&
                        item.temperature !== 0,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.temperature as number,
                    label: new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        },
                    ),
                })),
        [filteredCheckins],
    );

    const feelsLikeData = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.feelsLikeTemperature !== null &&
                        item.feelsLikeTemperature !== undefined &&
                        item.feelsLikeTemperature !== 0,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.feelsLikeTemperature as number,
                    label: new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        },
                    ),
                })),
        [filteredCheckins],
    );

    const humidityData = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.humidity !== null &&
                        item.humidity !== undefined &&
                        item.humidity !== 0,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.humidity as number,
                    label: new Date(item.createdAt).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        },
                    ),
                })),
        [filteredCheckins],
    );

    const painLocationCounts = useMemo(() => {
        return filteredCheckins.reduce<Record<string, number>>(
            (counts, item) => {
                if (!item.painLocation) {
                    return counts;
                }
                counts[item.painLocation] =
                    (counts[item.painLocation] ?? 0) + 1;

                return counts;
            },
            {},
        );
    }, [filteredCheckins]);

    const frequentPainLocations = useMemo(
        () =>
            Object.entries(painLocationCounts).sort(
                (a, b) => b[1] - a[1],
            ),
        [painLocationCounts],
    );

    const moods = useMemo(
        () => [
            ...new Set(
                filteredCheckins
                    .map((item) => item.mood)
                    .filter(
                        (mood): mood is string =>
                            mood !== null && mood !== undefined,
                    ),
            ),
        ],
        [filteredCheckins],
    );

    const periodComparison = useMemo(() => {
        if (selectedRange === "ALL") {
            return null;
        }

        const currentStart = new Date();
        currentStart.setHours(0, 0, 0, 0);
        currentStart.setDate(currentStart.getDate() - selectedRange);

        const previousStart = new Date(currentStart);
        previousStart.setDate(
            previousStart.getDate() - selectedRange,
        );

        const currentItems = recoveryItems.filter(
            (item) => new Date(item.createdAt) >= currentStart,
        );

        const previousItems = recoveryItems.filter((item) => {
            const createdAt = new Date(item.createdAt);

            return (
                createdAt >= previousStart &&
                createdAt < currentStart
            );
        });

        if (currentItems.length === 0 || previousItems.length === 0) {
            return null;
        }

        return {
            painChange:
                calculateAverage(
                    currentItems.map((item) => item.painScore),
                ) -
                calculateAverage(
                    previousItems.map((item) => item.painScore),
                ),
            rpeChange:
                calculateAverage(
                    currentItems.map((item) => item.rpe),
                ) -
                calculateAverage(
                    previousItems.map((item) => item.rpe),
                ),
        };
    }, [recoveryItems, selectedRange]);

    const weatherRpeInsight = useMemo(() => {
        const validItems = filteredCheckins.filter(
            (item) =>
                item.temperature !== null &&
                item.temperature !== undefined &&
                item.rpe !== null &&
                item.rpe !== undefined,
        );

        if (validItems.length < 6) {
            return null;
        }

        const hotItems = validItems.filter(
            (item) => (item.temperature as number) >= 80,
        );
        const coolerItems = validItems.filter(
            (item) => (item.temperature as number) < 80,
        );

        if (hotItems.length < 2 || coolerItems.length < 2) {
            return null;
        }

        const hotRpe = calculateAverage(
            hotItems.map((item) => item.rpe),
        );
        const coolerRpe = calculateAverage(
            coolerItems.map((item) => item.rpe),
        );

        return {
            hotRpe,
            coolerRpe,
            message:
                hotRpe > coolerRpe + 0.5
                    ? "Hotter workouts were associated with higher reported effort."
                    : hotRpe < coolerRpe - 0.5
                        ? "Cooler workouts were associated with higher reported effort."
                        : "Reported effort was similar across hotter and cooler workouts.",
        };
    }, [filteredCheckins]);

    const currentInsight = useMemo<Insight>(() => {
        if (filteredCheckins.length < 3) {
            return {
                title: "More check-ins needed",
                message:
                    "Complete at least three check-ins to begin identifying recovery patterns.",
            };
        }

        if (averagePain >= 5) {
            return {
                title: "Monitor reported pain",
                message:
                    "Your average reported pain is elevated during this period. Review recurring pain locations and recent workouts.",
            };
        }

        if (averageRpe >= 8) {
            return {
                title: "Training has felt demanding",
                message:
                    "Your average reported effort is high during this period. Continue monitoring pain, mood, and recovery.",
            };
        }

        if (
            periodComparison &&
            periodComparison.painChange >= 1
        ) {
            return {
                title: "Pain is trending upward",
                message:
                    "Reported pain increased compared with the previous period. Review the most frequently reported pain locations.",
            };
        }

        if (
            periodComparison &&
            periodComparison.rpeChange >= 1
        ) {
            return {
                title: "Reported effort increased",
                message:
                    "Training has felt harder than it did during the previous period, even if pain remains stable.",
            };
        }

        return {
            title: "Training response appears stable",
            message:
                "Your reported pain and perceived effort remain within your recent range.",
        };
    }, [
        averagePain,
        averageRpe,
        filteredCheckins.length,
        periodComparison,
    ]);

    const dataQuality =
        filteredCheckins.length < 3
            ? "Not enough data"
            : filteredCheckins.length < 7
                ? "Limited trend data"
                : "Trend analysis available";

    const rangeLabel =
        selectedRange === "ALL"
            ? "all check-ins"
            : `the last ${selectedRange} days`;

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.appName}>Smart Gauge</Text>
                        <Text style={styles.subtitle}>Analysis</Text>
                    </View>

                    <Image
                        source={require("@/assets/images/smartGaugeAppIcon.png")}
                        resizeMode="contain"
                        style={styles.appIcon}
                    />
                </View>

                <View style={styles.rangeSelector}>
                    {[7, 30, "ALL"].map((range) => {
                        const isSelected = selectedRange === range;

                        return (
                            <Pressable
                                key={range}
                                style={[
                                    styles.rangeButton,
                                    isSelected &&
                                    styles.rangeButtonSelected,
                                ]}
                                onPress={() =>
                                    setSelectedRange(range as TimeRange)
                                }
                            >
                                <Text
                                    style={[
                                        styles.rangeButtonText,
                                        isSelected &&
                                        styles.rangeButtonTextSelected,
                                    ]}
                                >
                                    {range === "ALL"
                                        ? "All"
                                        : `${range}D`}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.insightCard}>
                    <Text style={styles.insightLabel}>
                        Current insight
                    </Text>
                    <Text style={styles.insightTitle}>
                        {currentInsight.title}
                    </Text>
                    <Text style={styles.insightMessage}>
                        {currentInsight.message}
                    </Text>
                </View>

                {periodComparison && selectedRange !== "ALL" && (
                    <View style={styles.card}>
                        <Text style={styles.subtitle}>
                            Compared with the previous {selectedRange} days
                        </Text>

                        <View style={styles.comparisonRow}>
                            <Text style={styles.comparisonLabel}>Pain</Text>
                            <Text style={styles.comparisonValue}>
                                {formatChange(
                                    periodComparison.painChange,
                                )}
                            </Text>
                        </View>

                        <View style={styles.comparisonRow}>
                            <Text style={styles.comparisonLabel}>RPE</Text>
                            <Text style={styles.comparisonValue}>
                                {formatChange(
                                    periodComparison.rpeChange,
                                )}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.subtitle}>Analysis quality</Text>
                    <Text style={styles.cardTitle}>
                        {filteredCheckins.length} completed check-in
                        {filteredCheckins.length === 1 ? "" : "s"}
                    </Text>
                    <Text style={styles.cardMessage}>{dataQuality}</Text>
                </View>

                {painScoreGraphFlag ? (
                    <Pressable
                        style={styles.card}
                        onPress={() => setPainScoreGraphFlag(false)}
                    >
                        <Text style={styles.subtitle}>
                            Pain response for {rangeLabel}
                        </Text>
                        <View style={styles.summaryGrid}>
                            <SummaryCard
                                label="Average Pain Score"
                                value={averagePain.toFixed(0)}
                            />

                            <View style={styles.painLocationList}>
                                <Text style={styles.summaryText}>
                                    Most reported pain
                                </Text>

                                {frequentPainLocations.length === 0 ? (
                                    <Text style={styles.mutedText}>
                                        No pain locations reported
                                    </Text>
                                ) : (
                                    frequentPainLocations
                                        .slice(0, 3)
                                        .map(([location, count]) => (
                                            <Text
                                                key={location}
                                                style={styles.painLocationText}
                                            >
                                                {location}: {count} report
                                                {count === 1 ? "" : "s"}
                                            </Text>
                                        ))
                                )}
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <AnalysisChart
                        checkinData={painData}
                        setGraphFlag={setPainScoreGraphFlag}
                        metric="painScore"
                    />
                )}

                {rpeFlag ? (
                    <Pressable
                        style={styles.card}
                        onPress={() => setRpeFlag(false)}
                    >
                        <Text style={styles.subtitle}>
                            RPE and mood for {rangeLabel}
                        </Text>
                        <View style={styles.summaryGrid}>
                            <SummaryCard
                                label="Average RPE"
                                value={averageRpe.toFixed(0)}
                            />

                            <View style={styles.painLocationList}>
                                <Text style={styles.summaryText}>
                                    Reported moods
                                </Text>

                                {moods.length === 0 ? (
                                    <Text style={styles.mutedText}>
                                        No moods reported
                                    </Text>
                                ) : (
                                    moods.slice(0, 3).map((mood) => (
                                        <Text
                                            key={mood}
                                            style={styles.painLocationText}
                                        >
                                            {mood}
                                        </Text>
                                    ))
                                )}
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <AnalysisChart
                        checkinData={rpeData}
                        metric="rpe"
                        setGraphFlag={setRpeFlag}
                    />
                )}

                {temperatureFlag ? (
                    <Pressable
                        style={styles.card}
                        onPress={() => setTemperatureFlag(false)}
                    >
                        <Text style={styles.subtitle}>
                            Weather context for {rangeLabel}
                        </Text>

                        <View style={styles.weatherGrid}>
                            <View style={styles.weatherMetric}>
                                <Text style={styles.weatherValue}>
                                    {averageTemperature.toFixed(0)}°
                                </Text>
                                <Text style={styles.weatherLabel}>
                                    Temperature
                                </Text>
                            </View>

                            <View style={styles.weatherMetric}>
                                <Text style={styles.weatherValue}>
                                    {averageFeelsLike.toFixed(0)}°
                                </Text>
                                <Text style={styles.weatherLabel}>
                                    Feels like
                                </Text>
                            </View>

                            <View style={styles.weatherMetric}>
                                <Text style={styles.weatherValue}>
                                    {averageHumidity.toFixed(0)}%
                                </Text>
                                <Text style={styles.weatherLabel}>
                                    Humidity
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.cardMessage}>
                            {weatherRpeInsight
                                ? weatherRpeInsight.message
                                : "Complete more weather-supported check-ins to compare weather with reported effort."}
                        </Text>

                        {weatherRpeInsight && (
                            <View style={styles.weatherComparison}>
                                <Text style={styles.mutedText}>
                                    RPE at 80°F or above:{" "}
                                    {weatherRpeInsight.hotRpe.toFixed(1)}
                                </Text>
                                <Text style={styles.mutedText}>
                                    RPE below 80°F:{" "}
                                    {weatherRpeInsight.coolerRpe.toFixed(1)}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                ) : (
                    <WeatherAnalysisChart temperatureData={temperatureData}
                                          feelsLikeData={feelsLikeData}
                                          humidityData={humidityData}
                                          setGraphFlag={setTemperatureFlag}
                    />
                )}

                <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                        setDisplaySummaryCardInMiles(
                            (previous) => !previous,
                        )
                    }
                >
                    <Text style={styles.subtitle}>
                        Weekly training volume
                    </Text>

                    <View style={styles.summaryGrid}>
                        {displaySummaryCardInMiles ? (
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
                        ) : (
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
                        )}
                    </View>
                </TouchableOpacity>
            </ScrollView>

            <BottomNav activeRoute="analysis" />
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
        paddingBottom: 110,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    appName: {
        color: "#fd5900",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 4,
    },
    appIcon: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        width: 65,
        height: 60,
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
    insightCard: {
        backgroundColor: "rgba(253,89,0,0.08)",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(253,89,0,0.28)",
        marginBottom: 14,
    },
    insightLabel: {
        color: "#fd5900",
        fontSize: 13,
        fontWeight: "800",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    insightTitle: {
        color: "#e0e3e5",
        fontSize: 21,
        fontWeight: "900",
        marginBottom: 8,
    },
    insightMessage: {
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
    painLocationList: {
        flex: 1,
        minWidth: 145,
        marginBottom: 24,
    },
    summaryText: {
        color: "#c5c6cd",
        fontSize: 16,
        marginBottom: 8,
    },
    painLocationText: {
        color: "#fd5900",
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 6,
    },
    mutedText: {
        color: "#8f9097",
        fontSize: 14,
        lineHeight: 20,
    },
    comparisonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#263238",
    },
    comparisonLabel: {
        color: "#c5c6cd",
        fontSize: 16,
        fontWeight: "700",
    },
    comparisonValue: {
        color: "#fd5900",
        fontSize: 15,
        fontWeight: "800",
    },
    weatherGrid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    weatherMetric: {
        flex: 1,
        backgroundColor: "#101415",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: "center",
    },
    weatherValue: {
        color: "#fd5900",
        fontSize: 22,
        fontWeight: "900",
        marginBottom: 4,
    },
    weatherLabel: {
        color: "#8f9097",
        fontSize: 12,
        textAlign: "center",
    },
    weatherComparison: {
        marginTop: 12,
        gap: 4,
    },
    rangeSelector: {
        flexDirection: "row",
        backgroundColor: "#151b1f",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#263238",
        padding: 4,
        marginBottom: 14,
    },
    rangeButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 9,
        borderRadius: 9,
    },
    rangeButtonSelected: {
        backgroundColor: "#fd5900",
    },
    rangeButtonText: {
        color: "#8f9097",
        fontSize: 13,
        fontWeight: "700",
    },
    rangeButtonTextSelected: {
        color: "#101415",
    },
});