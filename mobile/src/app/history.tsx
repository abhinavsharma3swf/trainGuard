import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "@/components/BottomNav";
import { RecoveryHistoryCard } from "@/components/RecoveryHistoryCard";
import {
    getRecoveryCheckins,
    RecoveryCheckin,
} from "@/services/recoveryApi";

export default function History() {
    const [recoveryHistory, setRecoveryHistory] = useState<RecoveryCheckin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 20;

    // async function loadRecoveryHistory(pageToLoad = 0) {
    //     try {
    //         setIsLoading(true);
    //
    //         const data = await getRecoveryCheckins(pageToLoad, 20);
    //
    //         if (pageToLoad === 0) {
    //             setRecoveryHistory(data);
    //         } else {
    //             setRecoveryHistory((currentHistory) => [
    //                 ...currentHistory,
    //                 ...data,
    //             ]);
    //         }
    //
    //         setPage(pageToLoad);
    //     } catch (error) {
    //         console.error("Could not load recovery history:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    async function loadRecoveryHistory(pageToLoad = 0) {
        if (isLoading || !hasMore) {
            return;
        }

        try {
            setIsLoading(true);

            const data = await getRecoveryCheckins(pageToLoad, pageSize);

            if (pageToLoad === 0) {
                setRecoveryHistory(data);
            } else {
                setRecoveryHistory((currentHistory) => {
                    const existingIds = new Set(currentHistory.map((item) => item.id));

                    const newItems = data.filter((item) => !existingIds.has(item.id));

                    return [...currentHistory, ...newItems];
                });
            }

            setPage(pageToLoad);

            if (data.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Could not load recovery history:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleLoadMore() {
        if (!hasMore) {
            return;
        }

        loadRecoveryHistory(page + 1);
    }

    useEffect(() => {
        loadRecoveryHistory(0);
    }, []);

    // function handleLoadMore() {
    //     loadRecoveryHistory(page + 1);
    // }

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.appName}>Smart Gauge</Text>
                <Text style={styles.subtitle}>Recovery History</Text>

                <View style={styles.activityList}>
                    {recoveryHistory.map((item) => (
                        <RecoveryHistoryCard
                            key={item.id}
                            item={{
                                checkinId: item.id,
                                createdAt: item.createdAt,
                                painScore: item.painScore ?? 0,
                                painLocation: item.painLocation,
                                rpe: item.rpe ?? 0,
                                mood: item.mood,
                                note: item.note,
                                sportType: item.sportType,
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

                {/*<Pressable*/}
                {/*    style={styles.loadMoreButton}*/}
                {/*    onPress={handleLoadMore}*/}
                {/*    disabled={isLoading}*/}
                {/*>*/}
                {/*    <Text style={styles.loadMoreText}>*/}
                {/*        {isLoading ? "Loading..." : "Load more"}*/}
                {/*    </Text>*/}
                {/*</Pressable>*/}
            </ScrollView>

            <BottomNav activeRoute="history" />
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