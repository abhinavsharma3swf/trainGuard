import { StyleSheet, Text, View } from "react-native";

type MetricProps = {
    label: string;
    value: string;
};

export function Metric({ label, value }: MetricProps) {
    return (
        <View style={styles.metric}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.metricValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    metric: {
        flex: 1,
    },
    metricLabel: {
        color: "#8f9097",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
        fontWeight: "700",
    },
    metricValue: {
        color: "#e0e3e5",
        fontSize: 16,
        fontWeight: "800",
    },
});