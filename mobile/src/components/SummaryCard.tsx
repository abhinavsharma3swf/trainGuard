import { StyleSheet, Text, View } from "react-native";

type SummaryCardProps = {
    label: string;
    value: string;
    unit: string;
};

export function SummaryCard({ label, value, unit }: SummaryCardProps) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{label}</Text>

            <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{value}</Text>
                <Text style={styles.summaryUnit}>{unit}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        width: "48%",
        backgroundColor: "#1d2022",
        borderRadius: 16,
        padding: 16,
        minHeight: 105,
        justifyContent: "space-between",
    },
    summaryLabel: {
        color: "#8f9097",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontWeight: "700",
    },
    summaryValueRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 5,
    },
    summaryValue: {
        color: "#e0e3e5",
        fontSize: 30,
        fontWeight: "800",
    },
    summaryUnit: {
        color: "#4edea3",
        fontSize: 13,
        fontWeight: "700",
    },
});