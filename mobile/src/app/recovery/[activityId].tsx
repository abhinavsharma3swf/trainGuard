import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {Controller, useForm} from "react-hook-form";
import * as Localization from 'expo-localization';
import {NumberSelector} from "@/components/NumberSelector";
import {MoodSelector} from "@/components/MoodSelector";
import {API_BASE_URL} from "@/constants/api";
import {useDashboardData} from "@/context/DashboardDataContext";
import {getSessionToken} from "@/services/athleteStorage";
import {fetchWeatherApi} from "openmeteo";

type RecoveryCheckinForm = {
    rpe: number | null;
    painScore: number | null;
    painLocation: string;
    mood: string;
    note: string;
};

type WeatherData = {
    temperature: number;
    humidity: number;
    feelsLikeTemperature: number;
    windSpeed: number;
    dewPoint: number;
}

export default function RecoveryCheckInScreen() {
    const {activityId} = useLocalSearchParams<{ activityId: string }>();
    const {feedItems, refreshDashboardFeed} = useDashboardData();

    const [weatherData, setWeatherData] = useState<WeatherData>({
        temperature: 0,
        humidity: 0,
        feelsLikeTemperature: 0,
        windSpeed: 0,
        dewPoint: 0,
    });

    const currentActivity = feedItems.find(
        (item) => item.activityId === Number(activityId)
    );


    if (currentActivity?.startDate === undefined) return
    const activityStart = new Date(currentActivity.startDate);

    const locales = Localization.getCalendars();
    const deviceTimeZone = locales[0].timeZone ?? "America/Los_Angeles";
    const activityEnd = new Date(activityStart);
    activityEnd.setHours(activityEnd.getHours() + 1);
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
        latitude: currentActivity?.start_latlng,
        longitude: currentActivity?.start_latlng,
        hourly: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "wind_speed_10m",
            "dewpoint_2m",
        ],
        start_hour: activityStart.toISOString().slice(0, 16),
        end_hour: activityEnd.toISOString().slice(0, 16),
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
        timezone: deviceTimeZone,
    };



    async function fetchWeatherData() {

        try {
            const response = await fetchWeatherApi(url, params);
            const weatherResponse = response[0];

            if (!weatherResponse) {
                return;
            }

            const hourly = response[0].hourly();

            const temperature =
                hourly?.variables(0)?.valuesArray()?.[0];

            const humidity =
                hourly?.variables(1)?.valuesArray()?.[0];

            const apparentTemperature =
                hourly?.variables(2)?.valuesArray()?.[0];

            const windSpeed =
                hourly?.variables(3)?.valuesArray()?.[0];

            const dewPoint =
                hourly?.variables(4)?.valuesArray()?.[0];

            setWeatherData({
                temperature: temperature ? temperature : 0,
                humidity: humidity ? humidity : 0,
                feelsLikeTemperature: apparentTemperature ? apparentTemperature : 0,
                windSpeed: windSpeed ? windSpeed : 0,
                dewPoint: dewPoint ? dewPoint : 0,
            })
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }

    }
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
    } = useForm<RecoveryCheckinForm>({
        defaultValues: {
            rpe: null,
            painScore: null,
            painLocation: "",
            mood: "",
            note: "",
        },
    });

    useEffect(() => {
        if (!currentActivity) {
            return;
        }
        if (currentActivity.start_latlng === null) {
            return;
        }
        fetchWeatherData();
        reset({
            rpe: currentActivity.rpe ?? null,
            painScore: currentActivity.painScore ?? null,
            painLocation: currentActivity.painLocation ?? "",
            mood: currentActivity.mood ?? "",
            note: currentActivity.description ?? "",
        });
    }, [currentActivity, reset]);

    const handleSave = async (formValues: RecoveryCheckinForm) => {
        if (formValues.rpe === null) {
            setError("rpe", {message: "Select an RPE score."});
            return;
        }

        if (formValues.painScore === null) {
            setError("painScore", {message: "Select a pain score."});
            return;
        }

        if (!formValues.mood) {
            setError("mood", {message: "Select a mood."});
            return;
        }

        clearErrors();

        const token = await getSessionToken();

        if (!token) {
            setError("root", {message: "Missing session token. Please reconnect Strava."});
            return;
        }

        const payload = {
            activityId: Number(activityId),
            rpe: formValues.rpe,
            painScore: formValues.painScore,
            painLocation: formValues.painLocation.trim().toUpperCase() ?? '',
            mood: formValues.mood ?? '',
            note: formValues.note.trim() ?? '',
            sportType: currentActivity?.sportType,
            temperature: weatherData.temperature.toFixed(0),
            feelsLikeTemperature: weatherData.feelsLikeTemperature.toFixed(0),
            humidity: weatherData.humidity.toFixed(0),
            windSpeed: weatherData.windSpeed.toFixed(0),
            dewPoint: weatherData.dewPoint.toFixed(0),

        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/recovery-checkins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save recovery check-in.");
            }

            await refreshDashboardFeed();

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setError("root", {
                message: "Could not save check-in. Make sure the backend is running.",
            });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.screen}>
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableOpacity onPress={() => router.replace("/dashboard")}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {currentActivity?.checkinStatus === "COMPLETED"
                                ? "Edit Check-In"
                                : "Recovery Check-In"}
                        </Text>

                        {currentActivity?.name ? (
                            <Text style={styles.subtitle}>{currentActivity.name}</Text>
                        ) : null}
                    </View>

                    <View style={styles.card}>
                        <Controller
                            control={control}
                            name="rpe"
                            render={({field: {onChange, value}}) => (
                                <NumberSelector
                                    label="RPE"
                                    helper="How hard did this feel? 1–10"
                                    values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                    selectedValue={value}
                                    onSelect={(selectedValue) => {
                                        onChange(selectedValue);
                                        clearErrors("rpe");
                                    }}
                                />
                            )}
                        />
                        {errors.rpe?.message ? (
                            <Text style={styles.errorText}>{errors.rpe.message}</Text>
                        ) : null}

                        <Controller
                            control={control}
                            name="painScore"
                            render={({field: {onChange, value}}) => (
                                <NumberSelector
                                    label="Pain Score"
                                    helper="Pain level from 0–10"
                                    values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                    selectedValue={value}
                                    onSelect={(selectedValue) => {
                                        onChange(selectedValue);
                                        clearErrors("painScore");
                                    }}
                                />
                            )}
                        />
                        {errors.painScore?.message ? (
                            <Text style={styles.errorText}>{errors.painScore.message}</Text>
                        ) : null}

                        <Text style={styles.label}>Pain Location</Text>
                        <Controller
                            control={control}
                            name="painLocation"
                            render={({field: {onChange, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder="Example: right adductor, hip, knee"
                                    placeholderTextColor="#8f9097"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="mood"
                            render={({field: {onChange, value}}) => (
                                <MoodSelector
                                    selectedMood={value}
                                    onSelect={(selectedValue) => {
                                        onChange(selectedValue);
                                        clearErrors("mood");
                                    }}
                                />
                            )}
                        />
                        {errors.mood?.message ? (
                            <Text style={styles.errorText}>{errors.mood.message}</Text>
                        ) : null}

                        <Text style={styles.label}>Note</Text>
                        <Text style={styles.label}>Note</Text>

                        <View style={styles.noteContainer}>
                            <Controller
                                control={control}
                                name="note"
                                render={({field: {onChange, value}}) => (
                                    <TextInput
                                        style={styles.noteInput}
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder="Optional note"
                                        placeholderTextColor="#8f9097"
                                        multiline
                                    />
                                )}
                            />

                            <View style={styles.weatherRow}>
                                <Text style={styles.weatherText}>
                                    Temp:{" "}
                                    {weatherData?.temperature !== undefined
                                        ? `${weatherData.temperature.toFixed(0)}°F`
                                        : "N/A"}
                                </Text>

                                <Text style={styles.weatherText}>
                                    Feels Like Temp:{" "}
                                    {weatherData?.feelsLikeTemperature !== undefined
                                        ? `${weatherData.feelsLikeTemperature.toFixed(0)}°F`
                                        : "N/A"}
                                </Text>

                                <Text style={styles.weatherText}>
                                    Humidity:{" "}
                                    {weatherData?.humidity !== undefined
                                        ? `${weatherData.humidity.toFixed(0)}%`
                                        : "N/A"}
                                </Text>

                                <Text style={styles.weatherText}>
                                    Wind:{""}
                                    {weatherData?.windSpeed !== undefined
                                        ? `${weatherData.windSpeed.toFixed(0)} mph`
                                        : "N/A"}
                                </Text>

                                <Text style={styles.weatherText}>
                                    DewPoint:{""}
                                    {weatherData?.dewPoint !== undefined
                                        ? `${weatherData.dewPoint.toFixed(0)}°F`
                                        : "N/A"}
                                </Text>
                            </View>
                        </View>

                        {errors.root?.message ? (
                            <Text style={styles.errorText}>{errors.root.message}</Text>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.saveButton, isSubmitting && styles.disabledButton]}
                            onPress={handleSubmit(handleSave)}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.saveButtonText}>
                                {isSubmitting ? "Saving..." : "Save Check-In"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
    disabledButton: {
        opacity: 0.6,
    },
    noteContainer: {
        backgroundColor: "#1d2022",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#323537",
        overflow: "hidden",
    },
    noteInput: {
        color: "#e0e3e5",
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 100,
        fontSize: 16,
        textAlignVertical: "top",
    },

    weatherRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#323537",
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    weatherText: {
        color: "#8f9097",
        fontSize: 11,
    },
});

