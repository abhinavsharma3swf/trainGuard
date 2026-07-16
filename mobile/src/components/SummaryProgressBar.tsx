import { StyleSheet, Text, View } from "react-native";

type SummaryProgressBarProps = {
    label: string;
    value: number;
    total: number;
};

function SummaryProgressBar({
                                label,
                                value,
                                total,
                            }: SummaryProgressBarProps) {
    const rawPercentage = total === 0 ? 0 : Math.round((value / total) * 100);
    const percentage = Math.min(rawPercentage, 100);

    return (
        <View style={styles.progressRow}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{label}</Text>

                <Text style={styles.progressValue}>
                    {value}/{total} · {rawPercentage}%
                </Text>
            </View>

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
        </View>
    );
}

export default SummaryProgressBar;

const styles = StyleSheet.create({
    progressRow: {
        marginTop: 12,
    },

    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    progressLabel: {
        color: "#c5c6cd",
        fontSize: 13,
        fontWeight: "700",
    },

    progressValue: {
        color: "#e0e3e5",
        fontSize: 13,
        fontWeight: "800",
    },

    progressTrack: {
        height: 8,
        backgroundColor: "#323537",
        borderRadius: 999,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#fd5900",
        borderRadius: 999,
    },
});