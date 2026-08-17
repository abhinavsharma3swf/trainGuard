import {Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import React, {useEffect, useMemo, useState} from "react";
import type {lineDataItem} from "react-native-gifted-charts";

import {BottomNav} from "@/components/BottomNav";
import {SummaryCard} from "@/components/SummaryCard";
import AnalysisChart from "@/components/AnalysisChart";
import {useDashboardData} from "@/context/DashboardDataContext";
import {useHistoryData} from "@/context/HistoryDataContext";
import WeatherAnalysisChart from "@/components/WeatherAnalysisChart";
import * as Localization from "expo-localization";
import {BodyPart} from "@/components/PathPoints";

type TimeRange = 7 | 30 | "ALL";

type Insight = {
    title: string;
    message: string;
};

type OpenApiType = {
    averagePain: number;
    averageRpe: number;
    averageTemperature: number;
    averageFeelsLikeTemperature: number;
    painLocationAndCounts: {}
}

// Calculates the average only from values that were actually reported.
// In this app, pain/RPE scores are 1–10. Missing values mean the metric
// was not reported, and 0 is ignored as an invalid/unreported score.
const calculateAverage = (
    values: Array<number | null | undefined>,
): number => {
    const reportedValues = values.filter(
        (value): value is number =>
            value !== null &&
            value !== undefined &&
            value > 0,
    );

    if (reportedValues.length === 0) {
        return 0;
    }

    return (
        reportedValues.reduce((sum, value) => sum + value, 0) /
        reportedValues.length
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

// Formats backend timestamps in the device's timezone.
// Keeping this helper outside the component prevents creating a new function
// on every render and makes all chart labels use the same timezone behavior.
const formatLocalDate = (
    date: string,
    timeZone: string,
): string =>
    new Date(date).toLocaleDateString("en-US", {
        timeZone,
        month: "short",
        day: "numeric",
    });


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
            .filter((item) => item.sportType === "RIDE" || item.sportType === "VIRTUALRIDE")
            .reduce(
                (total, item) => total + item.movingTimeMinutes,
                0,
            ) / 60;


    const bikeDistance = lastSevenDayFeedItems
        .filter(
            (item) =>
                item.sportType === "RIDE" ||
                item.sportType === "VIRTUALRIDE",
        )
        .reduce((total, item) => total + item.distanceMiles, 0);

    // Limit recovery check-ins to the range selected by the user.
    // "ALL" skips date filtering entirely.
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

    const averageDewPoint = calculateAverage(
        filteredCheckins.map((item) => item.dewPoint),
    );


    // Read the device timezone once for this render and reuse it for every chart.
    const deviceTimeZone =
        Localization.getCalendars()[0]?.timeZone ?? "America/Los_Angeles";

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
                    label: formatLocalDate(item.createdAt, deviceTimeZone),
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
                    label: formatLocalDate(item.createdAt, deviceTimeZone),
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
                    label: formatLocalDate(item.createdAt, deviceTimeZone),
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
                    label: formatLocalDate(item.createdAt, deviceTimeZone),
                })),
        [filteredCheckins],
    );

    const dewPoint = useMemo<lineDataItem[]>(
        () =>
            [...filteredCheckins]
                .filter(
                    (item) =>
                        item.dewPoint !== null &&
                        item.dewPoint !== undefined &&
                        item.dewPoint !== 0,
                )
                .sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                .map((item) => ({
                    value: item.dewPoint as number,
                    label: formatLocalDate(item.createdAt, deviceTimeZone),
                })),
        [filteredCheckins],
    );

    const painLocationCounts = useMemo(() => {
        return filteredCheckins
            .flatMap((checkin) => checkin.painLocationEnum ?? [])
            .reduce((acc, part) => {
                // Numeric TypeScript enums support reverse lookup.
                // Guard the result so an unexpected enum value cannot crash
                // the screen when .replace() is called.
                const enumName = BodyPart[part];

                if (typeof enumName !== "string") {
                    return acc;
                }

                const readableName = enumName
                    .replace(/([A-Z])/g, " $1")
                    .trim();

                acc[readableName] =
                    (acc[readableName] ?? 0) + 1;

                return acc;
            }, {} as Record<string, number>);
    }, [filteredCheckins]);


    const moods = useMemo(
        () => [
            ...new Set(
                filteredCheckins
                    .map((item) => item.mood)
                    .filter(
                        (mood): mood is string =>
                            typeof mood === "string" &&
                            mood.trim().length > 0,
                    ),
            ),
        ],
        [filteredCheckins],
    );

    // Compare the selected period with the immediately preceding period.
    // Example: 7D compares the current 7-day window with the previous 7 days.
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

        if (currentItems.length === 0) {
            return null;
        }

        if (previousItems.length === 0) {
            return {
                painChange: null,
                rpeChange: null,
                hasPreviousData: false,
            };
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
            hasPreviousData: true,
        };
    }, [recoveryItems, selectedRange]);

    // Only create a weather/RPE insight when there is enough data in both
    // the hotter and cooler groups. This avoids drawing conclusions from 1 sample.
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

    // Deterministic fallback insight. Conditions are intentionally ordered:
    // the first matching condition wins, so higher-priority concerns come first.
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
            periodComparison.painChange !== null && periodComparison.painChange >= 1
        ) {
            return {
                title: "Pain is trending upward",
                message:
                    "Reported pain increased compared with the previous period. Review the most frequently reported pain locations.",
            };
        }

        if (
            periodComparison && periodComparison.rpeChange !== null &&
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


    useEffect(() => {
        console.log(averagePain, averageRpe, averageTemperature, averageFeelsLike, painData, painLocationCounts);
    }, []);

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content} directionalLockEnabled disableScrollViewPanResponder
                        nestedScrollEnabled>
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

                        {periodComparison.hasPreviousData ? (
                            <>
                                <View style={styles.comparisonRow}>
                                    <Text style={styles.comparisonLabel}>
                                        Pain
                                    </Text>

                                    <Text style={styles.comparisonValue}>
                                        {formatChange(
                                            periodComparison.painChange ?? 0,
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.comparisonRow}>
                                    <Text style={styles.comparisonLabel}>
                                        RPE
                                    </Text>

                                    <Text style={styles.comparisonValue}>
                                        {formatChange(
                                            periodComparison.rpeChange ?? 0,
                                        )}
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.mutedText}>
                                Not enough check-in data from the previous{" "}
                                {selectedRange} days to make a comparison.
                            </Text>
                        )}
                    </View>
                )}

                {filteredCheckins.length <= 7 && (
                    <View style={styles.card}>
                        <Text style={styles.subtitle}>Analysis quality</Text>
                        <Text style={styles.cardTitle}>
                            {filteredCheckins.length} completed check-in
                            {filteredCheckins.length === 1 ? "" : "s"}
                        </Text>
                        <Text style={styles.cardMessage}>{dataQuality}</Text>
                    </View>
                )}

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
                                label="Average Reported Pain"
                                value={averagePain.toFixed(0)}
                            />

                            <View style={styles.painLocationList}>
                                <Text style={styles.summaryText}>
                                    Most reported pain
                                </Text>

                                {Object.keys(painLocationCounts).length === 0 ? (
                                    <Text style={styles.mutedText}>
                                        No pain locations reported
                                    </Text>
                                ) : (
                                    <>
                                        {Object.entries(painLocationCounts).map(([name, count]) => (
                                            <Text
                                                key={name}
                                                style={styles.painLocationText}
                                            >
                                                {name}: {count} {count === 1 ? "report" : "reports"}
                                            </Text>
                                        ))}
                                    </>
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
                                    {averageDewPoint.toFixed(0)}°
                                </Text>
                                <Text style={styles.weatherLabel}>
                                    Dew Point
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
                                          dewPointData={dewPoint}
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
                        Training volume for the last 7 days
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

            <BottomNav activeRoute="analysis"/>
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