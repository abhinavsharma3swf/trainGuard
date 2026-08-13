import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

type WeatherAnalysisChartProps = {
    temperatureData: lineDataItem[];
    feelsLikeData: lineDataItem[];
    dewPointData: lineDataItem[];
    setGraphFlag: Dispatch<SetStateAction<boolean>>;
};

export default function WeatherAnalysisChart({
                                                 temperatureData,
                                                 feelsLikeData,
                                                 dewPointData,
                                                 setGraphFlag,
                                             }: WeatherAnalysisChartProps) {
    const [chartWidth, setChartWidth] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        setChartWidth(event.nativeEvent.layout.width);
    };

    const values = [
        ...temperatureData,
        ...feelsLikeData,
        ...dewPointData,
    ]
        .map((item) => item.value)
        .filter((value): value is number => typeof value === 'number');

    const maxValue =
        Math.ceil((Math.max(...values, 100) || 100) / 10) * 10;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Weather conditions</Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() => setGraphFlag(true)}
                    hitSlop={10}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
            </View>

            <View style={styles.legend}>
                <Legend color="#FC4C02" label="Temperature" />
                <Legend color="#F5B942" label="Feels like" />
                <Legend color="#4EA8DE" label="Dew Point" />
            </View>

            <View style={styles.chart} onLayout={handleLayout}>
                {chartWidth > 0 && temperatureData.length > 0 ? (
                    <LineChart
                        data={temperatureData}
                        data2={feelsLikeData}
                        data3={dewPointData}
                        width={chartWidth - 20}
                        height={180}
                        spacing={55}
                        initialSpacing={10}
                        endSpacing={20}
                        noOfSections={5}
                        maxValue={maxValue}
                        stepValue={maxValue / 5}
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
                        xAxisLabelTextStyle={styles.xAxisLabel}
                        nestedScrollEnabled
                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerStripColor: '#8E8E93',
                            pointerStripWidth: 2,
                            pointerColor: '#FFFFFF',
                            radius: 6,
                            pointerLabelWidth: 165,
                            pointerLabelHeight: 90,
                            autoAdjustPointerLabelPosition: true,
                            activatePointersOnLongPress: true,
                            pointerLabelComponent: (items: lineDataItem[]) => (
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipDate}>
                                        {items?.[0]?.label ?? ''}
                                    </Text>

                                    <Text style={styles.temperature}>
                                        Temperature: {items?.[0]?.value ?? 'N/A'}°F
                                    </Text>

                                    <Text style={styles.feelsLike}>
                                        Feels like: {items?.[1]?.value ?? 'N/A'}°F
                                    </Text>

                                    <Text style={styles.humidity}>
                                        Humidity: {items?.[2]?.value ?? 'N/A'}%
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                ) : (
                    <Text style={styles.empty}>
                        No weather data available for this period.
                    </Text>
                )}
            </View>

            <Text style={styles.notice}>
                Temperature, feels-like and dew points values are in °F.
            </Text>
        </View>
    );
}

function Legend({
                    color,
                    label,
                }: {
    color: string;
    label: string;
}) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 18,
        marginBottom: 20,
        backgroundColor: '#101415',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    title: {
        color: '#e0e3e5',
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
        backgroundColor: 'rgba(252,76,2,0.12)',
    },
    backButtonText: {
        color: '#FC4C02',
        fontSize: 14,
        fontWeight: '700',
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 14,
        marginBottom: 14,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendLine: {
        width: 18,
        height: 3,
        borderRadius: 2,
    },
    legendText: {
        color: '#c5c6cd',
        fontSize: 12,
    },
    chart: {
        width: '100%',
        minHeight: 225,
        paddingLeft: 5,
    },
    axisText: {
        color: '#8E8E93',
        fontSize: 12,
    },
    xAxisLabel: {
        color: '#8E8E93',
        fontSize: 12,
        width: 55,
        textAlign: 'center',
    },
    tooltip: {
        minWidth: 155,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#1F1F23',
        borderRadius: 8,
    },
    tooltipDate: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 5,
    },
    temperature: {
        color: '#FC4C02',
        fontSize: 12,
        marginBottom: 3,
    },
    feelsLike: {
        color: '#F5B942',
        fontSize: 12,
        marginBottom: 3,
    },
    humidity: {
        color: '#4EA8DE',
        fontSize: 12,
    },
    notice: {
        color: '#7d8a91',
        fontSize: 11,
        lineHeight: 16,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    empty: {
        color: '#8E8E93',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 70,
    },
});