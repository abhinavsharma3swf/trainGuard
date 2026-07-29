import React, {Dispatch, SetStateAction, useEffect, useRef, useState,} from "react";
import {LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import {LineChart, lineDataItem,} from "react-native-gifted-charts";

type WeatherAnalysisChartProps = {
    temperatureData: lineDataItem[];
    feelsLikeData: lineDataItem[];
    humidityData: lineDataItem[];
    setGraphFlag: Dispatch<SetStateAction<boolean>>;
};

export default function WeatherAnalysisChart({
                                                 temperatureData,
                                                 feelsLikeData,
                                                 humidityData,
                                                 setGraphFlag,
                                             }: WeatherAnalysisChartProps) {
    const chartScrollRef = useRef<ScrollView>(null);
    const [chartWidth, setChartWidth] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        setChartWidth(event.nativeEvent.layout.width);
    };

    useEffect(() => {
        if (chartWidth === 0 || temperatureData.length === 0) {
            return;
        }

        const timeout = setTimeout(() => {
            chartScrollRef.current?.scrollToEnd({
                animated: false,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        chartWidth,
        temperatureData.length,
        feelsLikeData.length,
        humidityData.length,
    ]);

    const allValues = [
        ...temperatureData.map((item) => item.value),
        ...feelsLikeData.map((item) => item.value),
        ...humidityData.map((item) => item.value),
    ].filter((value): value is number => typeof value === "number");

    const highestValue =
        allValues.length > 0
            ? Math.max(...allValues)
            : 100;

    const chartMaxValue =
        Math.ceil(highestValue / 10) * 10;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.cardTitle}>
                    Weather conditions
                </Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() => setGraphFlag(true)}
                    hitSlop={10}
                >
                    <Text style={styles.backButtonText}>
                        Back
                    </Text>
                </Pressable>
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendLine,
                            styles.temperatureLine,
                        ]}
                    />

                    <Text style={styles.legendText}>
                        Temperature
                    </Text>
                </View>

                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendLine,
                            styles.feelsLikeLine,
                        ]}
                    />

                    <Text style={styles.legendText}>
                        Feels like
                    </Text>
                </View>

                <View style={styles.legendItem}>
                    <View
                        style={[
                            styles.legendLine,
                            styles.humidityLine,
                        ]}
                    />

                    <Text style={styles.legendText}>
                        Humidity
                    </Text>
                </View>
            </View>

            <View
                style={styles.chartContainer}
                onLayout={handleLayout}
            >
                {chartWidth > 0 &&
                temperatureData.length > 0 ? (
                    <LineChart
                        scrollRef={chartScrollRef}
                        data={temperatureData}
                        data2={feelsLikeData}
                        data3={humidityData}

                        width={chartWidth - 20}
                        height={180}

                        initialSpacing={10}
                        endSpacing={20}
                        spacing={55}

                        noOfSections={5}
                        maxValue={chartMaxValue}
                        stepValue={chartMaxValue / 5}

                        color1="#FC4C02"
                        color2="#F5B942"
                        color3="#4EA8DE"

                        thickness1={4}
                        thickness2={3}
                        thickness3={3}

                        dataPointsColor1="#FC4C02"
                        dataPointsColor2="#F5B942"
                        dataPointsColor3="#4EA8DE"

                        dataPointsRadius1={4}
                        dataPointsRadius2={4}
                        dataPointsRadius3={4}

                        curved
                        hideRules

                        xAxisColor="#263238"
                        yAxisColor="#263238"

                        yAxisTextStyle={styles.axisText}
                        xAxisLabelTextStyle={
                            styles.xAxisLabel
                        }

                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerStripColor: "#8E8E93",
                            pointerStripWidth: 2,
                            pointerColor: "#FFFFFF",
                            radius: 6,

                            pointerLabelWidth: 165,
                            pointerLabelHeight: 90,
                            autoAdjustPointerLabelPosition: true,

                            pointerLabelComponent: (
                                items: lineDataItem[]
                            ) => {
                                const temperature =
                                    items?.[0]?.value;

                                const feelsLike =
                                    items?.[1]?.value;

                                const humidity =
                                    items?.[2]?.value;

                                return (
                                    <View style={styles.tooltipBox}>
                                        <Text style={styles.tooltipDate}>
                                            {items?.[0]?.label ?? ""}
                                        </Text>

                                        <Text style={styles.temperatureText}>
                                            Temperature:{" "}
                                            {temperature ?? "N/A"}°F
                                        </Text>

                                        <Text style={styles.feelsLikeText}>
                                            Feels like:{" "}
                                            {feelsLike ?? "N/A"}°F
                                        </Text>

                                        <Text style={styles.humidityText}>
                                            Humidity:{" "}
                                            {humidity ?? "N/A"}%
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                ) : (
                    <Text style={styles.emptyText}>
                        No weather data available for this period.
                    </Text>
                )}
            </View>

            <Text style={styles.axisNotice}>
                Temperature and feels-like values are in °F.
                Humidity is shown as a percentage.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 18,
        marginBottom: 20,
        backgroundColor: "#101415",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        overflow: "hidden",
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 12,
    },

    cardTitle: {
        color: "#e0e3e5",
        fontSize: 18,
        fontWeight: "600",
    },

    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
        backgroundColor: "rgba(252,76,2,0.12)",
    },

    backButtonText: {
        color: "#FC4C02",
        fontSize: 14,
        fontWeight: "700",
    },

    legend: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        gap: 14,
        marginBottom: 14,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    legendLine: {
        width: 18,
        height: 3,
        borderRadius: 2,
    },

    temperatureLine: {
        backgroundColor: "#FC4C02",
    },

    feelsLikeLine: {
        backgroundColor: "#F5B942",
    },

    humidityLine: {
        backgroundColor: "#4EA8DE",
    },

    legendText: {
        color: "#c5c6cd",
        fontSize: 12,
    },

    chartContainer: {
        width: "100%",
        minHeight: 225,
        paddingLeft: 5,
    },

    axisText: {
        color: "#8E8E93",
        fontSize: 12,
    },

    xAxisLabel: {
        color: "#8E8E93",
        fontSize: 12,
        width: 55,
        textAlign: "center",
    },

    tooltipBox: {
        minWidth: 155,
        backgroundColor: "#1F1F23",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },

    tooltipDate: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 5,
    },

    temperatureText: {
        color: "#FC4C02",
        fontSize: 12,
        marginBottom: 3,
    },

    feelsLikeText: {
        color: "#F5B942",
        fontSize: 12,
        marginBottom: 3,
    },

    humidityText: {
        color: "#4EA8DE",
        fontSize: 12,
    },

    axisNotice: {
        color: "#7d8a91",
        fontSize: 11,
        lineHeight: 16,
        paddingHorizontal: 20,
        marginTop: 8,
    },

    emptyText: {
        color: "#8E8E93",
        fontSize: 14,
        textAlign: "center",
        marginTop: 70,
    },
});