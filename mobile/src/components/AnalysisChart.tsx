import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, ScrollView, Platform} from 'react-native';
import {LineChart} from "react-native-gifted-charts";
import {getRecoveryCheckins, RecoveryCheckin} from "@/services/recoveryApi";



const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AnalysisChart() {
    // Access the underlying native ScrollView inside Gifted Charts
    const chartScrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Delays slightly to allow layout calculations, then scrolls to the edge
        setTimeout(() => {
            chartScrollRef.current?.scrollToEnd({ animated: false });
        }, 150);
    }, []);

    const [recoveryCheckinData, setRecoveryCheckinData] = useState<any>([])

    useEffect(() => {
        getRecoveryCheckins(0,20).then(
            data => {
                const fitnessData: { value: number; label: string }[] = data.map((item)=> {
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
            }
        )
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.cardTitle}>Pain score trend</Text>
                <LineChart
                    // Essential layout configs
                    scrollRef={chartScrollRef}
                    data={recoveryCheckinData}
                    width={SCREEN_WIDTH - 85}
                    height={100}
                    initialSpacing={20}
                    endSpacing={0}
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
                    yAxisTextStyle={{ color: '#8E8E93', fontSize: 15 }}
                    xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 15, width: 60 }}

                    // Tooltip and Drag Selector Line Configurations
                    pointerConfig={Platform.OS === 'ios' ? undefined : {
                        pointerStripColor: '#FC4C02',
                        pointerStripWidth: 2,
                        pointerStripHeight: 90,
                        pointerColor: '#e31c0a',
                        pointerheight: 1,
                        radius: 10,
                        pointerLabelComponent: (items: any) => {
                            return (
                                <View style={styles.tooltipBox}>
                                    <Text style={styles.tooltipText}>
                                        {items[0].value} Pain Score
                                    </Text>
                                </View>
                            );
                        },
                        tooltipShiftX: -55,
                        tooltipShiftY: -25
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
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
    // chartWrapper: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     // height: 180,
    //     paddingTop: 40,
    //     borderRadius: 18,
    //     maxHeight: "30%",
    //     backgroundColor: "#956c6c",
    // },
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