function SummaryProgressBar({
                                label,
                                value,
                                total,
                            }: {
    label: string;
    value: number;
    total: number;
}) {
    const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

    return (
        <View style={styles.progressRow}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{label}</Text>
                <Text style={styles.progressValue}>
                    {value}/{total} · {percentage}%
                </Text>
            </View>

            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
        </View>
    );
}