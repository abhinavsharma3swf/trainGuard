import {StyleSheet, Text, View} from "react-native";
import {RecoveryCheckin} from "@/services/recoveryApi";
import {useEffect} from "react";
import {BodyPart} from "@/components/PathPoints";


type RecoveryHistoryCardProps = {
    item: RecoveryCheckin;
};

export function RecoveryHistoryCard({ item }: RecoveryHistoryCardProps) {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const convertingEnumToString = (bodyPartEnum: BodyPart[]) => {
        const bodyPartsEnumStrings = bodyPartEnum.map((part)=> BodyPart[part]).join(", ");
        return bodyPartsEnumStrings.replace(/([A-Z])/g, " $1").trim();
    }

    return (
        <View style={styles.card}>
            {item.sportType === "RUN" && <Text style={styles.title}>🏃 {item.sportType} - Check-in</Text>}
            {item.sportType === "RIDE" &&<Text style={styles.title}>🚴 {item.sportType} - Check-in</Text>}
            {item.sportType === "VIRTUALRIDE" &&<Text style={styles.title}>🚴 {item.sportType} - Check-in</Text>}
            {item.sportType === "WALK" &&<Text style={styles.title}>🚶 {item.sportType} - Check-in</Text>}
            {item.sportType === "WEIGHTTRAINING" &&<Text style={styles.title}>🏋 {item.sportType} - Check-in</Text>}
            {item.sportType === "WORKOUT" &&<Text style={styles.title}>💪 {item.sportType} - Check-in</Text>}
            {item.sportType === "YOGA" &&<Text style={styles.title}>🧘 {item.sportType} - Check-in</Text>}
            {item.sportType === "TENNIS" &&<Text style={styles.title}>🎾 {item.sportType} - Check-in</Text>}
            {item.sportType === "PICKLEBALL" &&<Text style={styles.title}>🏓 {item.sportType} - Check-in</Text>}
            {item.sportType === "PILATES" &&<Text style={styles.title}>🤸‍♂️ {item.sportType} - Check-in</Text>}
            {item.sportType === "TRAILRUN" &&<Text style={styles.title}>🏃‍♂️ {item.sportType} - Check-in</Text>}
            {item.sportType === "SWIM" &&<Text style={styles.title}>🏊‍♂️ {item.sportType} - Check-in</Text>}
            {item.sportType === "OTHER" &&<Text style={styles.title}>🏆 {item.sportType} - Check-in</Text>}
            <Text style={styles.date}>{date}</Text>

            <View style={styles.chipRow}>
                <Chip label={`RPE ${item.rpe}`} />
                <Chip label={`Pain ${item.painScore}`} />
                {item.mood ? <Chip label={item.mood} /> : null}
                {item.painLocation ? <Chip label={item.painLocation} /> : null}
                {item.painLocationEnum ? <Chip label={convertingEnumToString(item.painLocationEnum)}/> : null }
            </View>

            {item.note?.trim() ? (
                <Text style={styles.note}>{item.note}</Text>
            ) : null}

            {item.temperature || item.humidity ||  item.feelsLikeTemperature || item.windSpeed || item.dewPoint ? (
                <Text style={styles.temperature}>{item.temperature}°F feels like {item.feelsLikeTemperature}°F. Humidity {item.humidity}%. Dew point {item.dewPoint}°F and {item.windSpeed}mph wind speed</Text>
            ) : null}
        </View>
    );
}

function Chip({ label }: { label: string }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        marginBottom: 12,
    },
    title: {
        color: "#e0e3e5",
        fontSize: 17,
        fontWeight: "800",
    },
    date: {
        color: "#8f9097",
        fontSize: 13,
        marginTop: 4,
        marginBottom: 12,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    chip: {
        backgroundColor: "#323537",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    chipText: {
        color: "#e0e3e5",
        fontSize: 12,
        fontWeight: "700",
    },
    note: {
        color: "#c5c6cd",
        fontSize: 13,
        lineHeight: 19,
        marginTop: 12,
    },
    temperature: {
        color: "#adadf1",
        fontSize: 12,
        paddingTop: 12,
    }
});