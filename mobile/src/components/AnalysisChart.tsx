// import React, {Dispatch, SetStateAction, useEffect, useRef} from 'react';
// import {Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
// import {LineChart, lineDataItem} from "react-native-gifted-charts";
//
//
// const SCREEN_WIDTH = Dimensions.get('window').width;
//
// type ChartMetric = "painScore" | "rpe" | "temperature";
//
// type AnalysisChartProps = {
//     checkinData: lineDataItem[];
//     metric: ChartMetric;
//     setGraphFlag: Dispatch<SetStateAction<boolean>>;
// };
//
//
// export default function AnalysisChart({checkinData, metric, setGraphFlag}: AnalysisChartProps) {
//     // Access the underlying native ScrollView inside Gifted Charts
//     const chartScrollRef = useRef<ScrollView>(null);
//
//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             chartScrollRef.current?.scrollToEnd({
//                 animated: false,
//             });
//         }, 150);
//
//         return () => clearTimeout(timeout);
//     }, []);
//
//
//     const chartTitle =
//         metric === "painScore"
//             ? "Pain score trend"
//             : "RPE trend";
//
//     const metricLabel =
//         metric === "painScore"
//             ? "Pain Score"
//             : "RPE";
//
//     return (
//         <View style={styles.container}>
//             <View>
//                 <Text style={styles.cardTitle}>{chartTitle}</Text>
//                <View style={{flex: 1, flexDirection: 'column', flexWrap: 'wrap'}}>
//                     <Pressable onPress={() => setGraphFlag(true)}>
//
//                         <LineChart
//                             // Essential layout configs
//                             scrollRef={chartScrollRef}
//                             data={checkinData}
//                             width={SCREEN_WIDTH - 85}
//                             height={100}
//                             initialSpacing={1}
//                             endSpacing={1}
//                             spacing={55} // Horizontal gap size between data points
//                             noOfSections={4}
//                             stepValue={2.5}
//                             areaChart
//                             color="#FC4C02"
//                             startFillColor="rgba(252, 76, 2, 0.35)"
//                             endFillColor="rgba(252, 76, 2, 0.01)"
//                             thickness={5}
//                             hideRules // Removes harsh grid backgrounds
//                             xAxisColor="white"
//                             yAxisColor='white'
//                             yAxisTextStyle={{color: '#8E8E93', fontSize: 15}}
//                             xAxisLabelTextStyle={{color: '#8E8E93', fontSize: 15, width: 60}}
//                             xAxisLength={290}
//
//
//                             // Tooltip and Drag Selector Line Configurations
//                             // Platform.OS === 'ios' ? undefined :
//                         pointerConfig={{
//                             pointerStripUptoDataPoint: true,
//                                 pointerStripColor: '#FC4C02',
//                                 pointerStripWidth: 2,
//                                 pointerStripHeight: 90,
//                                 pointerColor: '#e31c0a',
//                                 height: 5,
//                                 radius: 10,
//                                 pointerLabelComponent: (items: any) => {
//                                     return (
//                                         <View style={styles.tooltipBox}>
//                                             <Text style={styles.tooltipText}>
//                                                 {items?.[0]?.value ?? "N/A"} {metricLabel}
//                                             </Text>
//                                         </View>
//                                     );
//                                 },
//                             }}
//                         />
//                     </Pressable>
//                 </View>
//             </View>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingVertical: 20,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 4},
//         shadowOpacity: 0.08,
//         shadowRadius: 12,
//         elevation: 3,
//         backgroundColor: "#101415",
//         borderRadius: 18,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.06)",
//     },
//     header: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#8f9097',
//         paddingLeft: 20,
//     },
//     cardTitle: {
//         color: "#e0e3e5",
//         fontSize: 18,
//         fontWeight: "200",
//         marginBottom: 8,
//         paddingLeft: 25,
//     },
//     tooltipBox: {
//         backgroundColor: '#1F1F23',
//         borderRadius: 6,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     tooltipText: {
//         color: '#FFFFFF',
//         fontSize: 12,
//         fontWeight: '600',
//         width: 100,
//     },
// });

import React, {Dispatch, SetStateAction, useEffect, useRef, useState,} from "react";
import {LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View,} from "react-native";
import {LineChart, lineDataItem,} from "react-native-gifted-charts";
import {router} from "expo-router";
import HumanBody from "@/components/HumanBody";
import HumanbodyHeatMap from "@/app/humanbodyHeatMap";
import {BodyPart} from "@/components/PathPoints";
import {useHistoryData} from "@/context/HistoryDataContext";

type ChartMetric =
    | "painScore"
    | "rpe"
    | "temperature";

type AnalysisChartProps = {
    checkinData: lineDataItem[];
    metric: ChartMetric;
    setGraphFlag: Dispatch<SetStateAction<boolean>>;
};

export default function AnalysisChart({
                                          checkinData,
                                          metric,
                                          setGraphFlag,
                                      }: AnalysisChartProps) {
    const chartScrollRef = useRef<ScrollView>(null);

    const [chartWidth, setChartWidth] = useState(0);

    const handleChartLayout = (
        event: LayoutChangeEvent
    ) => {
        const measuredWidth =
            event.nativeEvent.layout.width;

        setChartWidth(measuredWidth);
    };

    useEffect(() => {
        if (
            checkinData.length === 0 ||
            chartWidth === 0
        ) {
            return;
        }

        const timeout = setTimeout(() => {
            chartScrollRef.current?.scrollToEnd({
                animated: false,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [checkinData.length, chartWidth]);

    const chartTitle =
        metric === "painScore"
            ? "Pain score trend"
            : metric === "rpe"
                ? "RPE trend"
                : "Temperature trend";

    const metricLabel =
        metric === "painScore"
            ? "Pain Score"
            : metric === "rpe"
                ? "RPE"
                : "Temperature";

    const chartSettings =
        metric === "temperature"
            ? {
                sections: 4,
                stepValue: 10,
            }
            : {
                sections: 4,
                stepValue: 2.5,
            };

    const [heatMapFlag, setHeatMapFlag] = useState<boolean>(false)
    const {recoveryItems} = useHistoryData();
    const [enumsForHumanBodyHeatMapForAnalysisPage, setEnumsForHumanBodyHeatMapForAnalysisPage] = useState<BodyPart[]>([]);

    useEffect(() => {
        const getTheEnums = recoveryItems
            .filter((recordsWithEnum) => recordsWithEnum.painLocationEnum)
            .flatMap((enums) => enums.painLocationEnum)
        setEnumsForHumanBodyHeatMapForAnalysisPage(getTheEnums);

    },[recoveryItems]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.cardTitle}>
                    {chartTitle}
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

                <Pressable
                    style={styles.backButton}
                    onPress={()=> setHeatMapFlag(true)}
                    hitSlop={10}
                >
                    <Text style={styles.backButtonText}>
                        HeatMap
                    </Text>
                </Pressable>
                {heatMapFlag &&
                    <HumanbodyHeatMap heatMapFlag={heatMapFlag} setHeatMapFlag={setHeatMapFlag}
                    enumsForHumanBodyHeatMapForAnalysisPage={enumsForHumanBodyHeatMapForAnalysisPage}
                    />
                }
            </View>

            <View
                style={styles.chartContainer}
                onLayout={handleChartLayout}
            >
                {chartWidth > 0 &&
                checkinData.length > 0 ? (
                    <LineChart
                        scrollRef={chartScrollRef}
                        data={checkinData}
                        width={chartWidth - 20}
                        height={150}
                        initialSpacing={16}
                        endSpacing={20}
                        spacing={55}
                        noOfSections={
                            chartSettings.sections
                        }
                        stepValue={
                            chartSettings.stepValue
                        }
                        areaChart
                        color="#FC4C02"
                        startFillColor="rgba(252, 76, 2, 0.35)"
                        endFillColor="rgba(252, 76, 2, 0.01)"
                        thickness={4}
                        hideRules
                        xAxisColor="#263238"
                        yAxisColor="#263238"
                        yAxisTextStyle={
                            styles.axisText
                        }
                        xAxisLabelTextStyle={
                            styles.xAxisLabel
                        }
                        pointerConfig={{
                            pointerStripUptoDataPoint:
                                true,
                            pointerStripColor:
                                "#FC4C02",
                            pointerStripWidth: 2,
                            pointerColor: "#e31c0a",
                            radius: 7,
                            pointerLabelWidth: 120,
                            pointerLabelHeight: 45,
                            autoAdjustPointerLabelPosition:
                                true,
                            activatePointersOnLongPress: true,
                            pointerLabelComponent: (
                                items: lineDataItem[]
                            ) => (
                                <View
                                    style={
                                        styles.tooltipBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.tooltipText
                                        }
                                    >
                                        {items?.[0]
                                                ?.value ??
                                            "N/A"}{" "}
                                        {metricLabel}
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                ) : (
                    <Text style={styles.emptyText}>
                        No data available for this
                        period.
                    </Text>
                )}
            </View>
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
        borderColor:
            "rgba(255,255,255,0.06)",
        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
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
        backgroundColor:
            "rgba(252,76,2,0.12)",
    },

    backButtonText: {
        color: "#FC4C02",
        fontSize: 14,
        fontWeight: "700",
    },

    chartContainer: {
        width: "100%",
        minHeight: 200,
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
        minWidth: 105,
        backgroundColor: "#1F1F23",
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 7,
    },

    tooltipText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
    },

    emptyText: {
        color: "#8E8E93",
        fontSize: 14,
        textAlign: "center",
        marginTop: 50,
    },
});