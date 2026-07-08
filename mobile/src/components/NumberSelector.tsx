import { Pressable, StyleSheet, Text, View } from "react-native";

type NumberSelectorProps = {
    label: string;
    helper?: string;
    values: number[];
    selectedValue: number | null;
    onSelect: (value: number) => void;
};

export function NumberSelector({
                                   label,
                                   helper,
                                   values,
                                   selectedValue,
                                   onSelect,
                               }: NumberSelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {helper ? <Text style={styles.helper}>{helper}</Text> : null}

            <View style={styles.row}>
                {values.map((value) => {
                    const selected = selectedValue === value;

                    return (
                        <Pressable
                            key={value}
                            style={[styles.option, selected && styles.selectedOption]}
                            onPress={() => onSelect(value)}
                        >
                            <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                                {value}
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
        marginBottom: 4,
    },
    helper: {
        color: "#8f9097",
        fontSize: 13,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    option: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#1d2022",
        borderWidth: 1,
        borderColor: "#323537",
        alignItems: "center",
        justifyContent: "center",
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