import React, {Dispatch, SetStateAction, useEffect, useRef} from 'react';
import {Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LineChart, lineDataItem} from "react-native-gifted-charts";


const SCREEN_WIDTH = Dimensions.get('window').width;

type ChartMetric = "painScore" | "rpe";

type AnalysisChartProps = {
    checkinData: lineDataItem[];
    metric: ChartMetric;
    setGraphFlag: Dispatch<SetStateAction<boolean>>;
    // rpeFlag?: boolean;
    // painScoreFlag?: boolean;
    // temperatureFlag?: boolean;
};


export default function AnalysisChart({checkinData, metric, setGraphFlag}: AnalysisChartProps) {
    // Access the underlying native ScrollView inside Gifted Charts
    const chartScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            chartScrollRef.current?.scrollToEnd({
                animated: false,
            });
        }, 150);

        return () => clearTimeout(timeout);
    }, []);


    const chartTitle =
        metric === "painScore"
            ? "Pain score trend"
            : "RPE trend";

    const metricLabel =
        metric === "painScore"
            ? "Pain Score"
            : "RPE";

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.cardTitle}>{chartTitle}</Text>
               <View style={{flex: 1, flexDirection: 'column', flexWrap: 'wrap'}}>
                    <Pressable onPress={() => setGraphFlag(true)}>

                        <LineChart
                            // Essential layout configs
                            scrollRef={chartScrollRef}
                            data={checkinData}
                            width={SCREEN_WIDTH - 85}
                            height={100}
                            initialSpacing={1}
                            endSpacing={1}
                            spacing={55} // Horizontal gap size between data points
                            noOfSections={4}
                            stepValue={2.5}
                            areaChart
                            color="#FC4C02"
                            startFillColor="rgba(252, 76, 2, 0.35)"
                            endFillColor="rgba(252, 76, 2, 0.01)"
                            thickness={5}
                            hideRules // Removes harsh grid backgrounds
                            xAxisColor="white"
                            yAxisColor='white'
                            yAxisTextStyle={{color: '#8E8E93', fontSize: 15}}
                            xAxisLabelTextStyle={{color: '#8E8E93', fontSize: 15, width: 60}}
                            xAxisLength={310}


                            // Tooltip and Drag Selector Line Configurations
                            pointerConfig={Platform.OS === 'ios' ? undefined : {
                                pointerStripColor: '#FC4C02',
                                pointerStripWidth: 2,
                                pointerStripHeight: 90,
                                pointerColor: '#e31c0a',
                                height: 1,
                                radius: 10,
                                pointerLabelComponent: (items: any) => {
                                    return (
                                        <View style={styles.tooltipBox}>
                                            <Text style={styles.tooltipText}>
                                                {items?.[0]?.value ?? "N/A"} {metricLabel}
                                            </Text>
                                        </View>
                                    );
                                },
                                tooltipShiftX: -55,
                                tooltipShiftY: -25
                            }}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        backgroundColor: "#101415",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },
    header: {
        fontSize: 18,
        fontWeight: '700',
        color: '#8f9097',
        paddingLeft: 20,
    },
    cardTitle: {
        color: "#e0e3e5",
        fontSize: 18,
        fontWeight: "200",
        marginBottom: 8,
        paddingLeft: 25,
    },
    tooltipBox: {
        backgroundColor: '#1F1F23',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        width: 100,
    },
});