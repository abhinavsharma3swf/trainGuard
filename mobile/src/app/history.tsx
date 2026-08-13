import {Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";

import {BottomNav} from "@/components/BottomNav";
import {RecoveryHistoryCard} from "@/components/RecoveryHistoryCard";
import {useHistoryData} from "@/context/HistoryDataContext";
import {Ionicons} from "@expo/vector-icons";

export default function History() {

    const {recoveryItems, isLoading, hasMore, handleLoadMore} = useHistoryData();

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <Text style={styles.appName}>Smart Gauge</Text>
                        <Text style={styles.subtitle}>Recovery History</Text>
                    </View>
                    <Image source={require("@/assets/images/smartGaugeAppIcon.png")}
                           resizeMode="contain"
                           style={{
                               // backgroundColor: "#fd5900",
                               paddingHorizontal: 16,
                               paddingVertical: 10,
                               borderRadius: 12, width: 65, height: 60
                           }}/>
                </View>

                <View style={styles.activityList}>
                    {recoveryItems.map((item) => (
                        <RecoveryHistoryCard
                            key={item.id}
                            item={{
                                id: item.id,
                                activityId: item.id,
                                createdAt: item.createdAt,
                                painScore: item.painScore,
                                painLocation: item.painLocation,
                                painLocationEnum: item.painLocationEnum,
                                rpe: item.rpe ?? 0,
                                mood: item.mood,
                                note: item.note,
                                sportType: item.sportType,
                                temperature: item.temperature,
                                humidity: item.humidity,
                                feelsLikeTemperature: item.feelsLikeTemperature,
                                windSpeed: item.windSpeed,
                                dewPoint: item.dewPoint,
                                trainingLoad: item.trainingLoad,
                            }}
                        />
                    ))}
                </View>

                {hasMore ? (
                    <Pressable
                        style={styles.loadMoreButton}
                        onPress={handleLoadMore}
                        disabled={isLoading}
                    >
                        <Text style={styles.loadMoreText}>
                            {isLoading ? "Loading..." : "Load more"}
                        </Text>
                    </Pressable>
                ) : (
                    <Text style={styles.endText}>No more check-ins</Text>
                )}

            </ScrollView>

            <BottomNav activeRoute="history"/>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#101415",
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 110,
        paddingTop: 56,
    },

    title: {
        color: "#e0e3e5",
        fontSize: 28,
        fontWeight: "900",
        marginBottom: 18,
    },

    activityList: {
        gap: 14,
    },

    loadMoreButton: {
        backgroundColor: "#fd5900",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },

    loadMoreText: {
        color: "#501600",
        fontWeight: "900",
        fontSize: 14,
    },
    endText: {
        color: "#8f9097",
        textAlign: "center",
        marginTop: 20,
        fontSize: 13,
    },
    appName: {
        color: "#fd5900",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 4,
    },
    subtitle: {
        color: "#c5c6cd",
        fontSize: 16,
        marginBottom: 24,
    },
});