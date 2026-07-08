import { Pressable, StyleSheet, Text, View } from "react-native";

const moods = ["Great", "Good", "Okay", "Low", "Stressed"];

type MoodSelectorProps = {
    selectedMood: string;
    onSelect: (mood: string) => void;
};

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Mood</Text>

            <View style={styles.row}>
                {moods.map((mood) => {
                    const selected = selectedMood === mood;

                    return (
                        <Pressable
                            key={mood}
                            style={[styles.option, selected && styles.selectedOption]}
                            onPress={() => onSelect(mood)}
                        >
                            <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                                {mood}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    label: {
        color: "#e0e3e5",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    option: {
        backgroundColor: "#1d2022",
        borderWidth: 1,
        borderColor: "#323537",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    selectedOption: {
        backgroundColor: "#fd5900",
        borderColor: "#fd5900",
    },
    optionText: {
        color: "#e0e3e5",
        fontWeight: "800",
    },
    selectedOptionText: {
        color: "#501600",
    },
});