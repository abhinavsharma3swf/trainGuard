import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {NumberSelector} from "@/components/NumberSelector";
import {MoodSelector} from "@/components/MoodSelector";
import {API_BASE_URL} from "@/constants/api";
import {getDashboardFeed} from "@/services/dashboardApi";

export default function RecoveryCheckInScreen() {

    const { activityId } = useLocalSearchParams<{ activityId: string }>();


    const [painLocation, setPainLocation] = useState("");
    const [note, setNote] = useState("");
    const [rpe, setRpe] = useState<number | null>(null);
    const [painScore, setPainScore] = useState<number | null>(null);
    const [mood, setMood] = useState("");
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (rpe === null) {
            setError("Select an RPE score.");
            return;
        }

        if (painScore === null) {
            setError("Select a pain score.");
            return;
        }

        if (!mood) {
            setError("Select a mood.");
            return;
        }

        setError("");

        const payload = {
            activityId: Number(activityId),
            rpe,
            painScore,
            painLocation,
            mood,
            note,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/recovery-checkins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save recovery check-in.");
            }

            const data = await response.json();
            console.log("Recovery check-in saved:", data);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setError("Could not save check-in. Make sure the backend is running.");
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Recovery Check-In</Text>
                    {/*<Text style={styles.subtitle}>Activity ID: {activityId}</Text>*/}
                </View>

                <View style={styles.card}>
                    {/*<Text style={styles.label}>RPE</Text>*/}
                    {/*<Text style={styles.helper}>Your workout check-in</Text>*/}
                    <NumberSelector
                        label="RPE"
                        helper="How hard did this feel? 1–10"
                        values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        selectedValue={rpe}
                        onSelect={(value) => {
                            setRpe(value);
                            setError("")
                        }}
                    />



                    {/*<Text style={styles.label}>Pain Score</Text>*/}
                    {/*<Text style={styles.helper}>Pain level from 0–10</Text>*/}
                    <NumberSelector
                        label="Pain Score"
                        helper="Pain level from 0–10"
                        values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        selectedValue={painScore}
                        onSelect={(value) => {
                            setPainScore(value);
                            setError("")
                        }}
                    />

                    <Text style={styles.label}>Pain Location</Text>
                    <TextInput
                        style={styles.input}
                        value={painLocation}
                        onChangeText={setPainLocation}
                        placeholder="Example: right adductor, hip, knee"
                        placeholderTextColor="#8f9097"
                    />

                    {/*<Text style={styles.label}>Mood</Text>*/}
                    <MoodSelector selectedMood={mood} onSelect={(value)=> {
                        setMood(value)
                        setError("")
                    }}
                    />

                    <Text style={styles.label}>Note</Text>
                    <TextInput
                        style={[styles.input, styles.noteInput]}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Optional note"
                        placeholderTextColor="#8f9097"
                        multiline
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Check-In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    backText: {
        color: "#ffb59a",
        fontSize: 16,
        fontWeight: "700",
        marginTop: 32,
        marginBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        color: "#e0e3e5",
        fontSize: 30,
        fontWeight: "900",
    },
    subtitle: {
        color: "#8f9097",
        fontSize: 14,
        marginTop: 4,
    },
    card: {
        backgroundColor: "#16253b",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },
    label: {
        color: "#e0e3e5",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 4,
        marginTop: 14,
    },
    helper: {
        color: "#8f9097",
        fontSize: 13,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#1d2022",
        color: "#e0e3e5",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#323537",
        fontSize: 16,
    },
    noteInput: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: "#fd5900",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 22,
    },
    saveButtonText: {
        color: "#501600",
        fontSize: 16,
        fontWeight: "900",
    },
    errorText: {
        color: "#ffb4ab",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 18,
        marginBottom: 2,
    },
});

