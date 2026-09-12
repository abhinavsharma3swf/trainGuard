import React, {createContext, useCallback, useContext, useState} from "react";
import {getRecoveryCheckins, RecoveryCheckin} from "@/services/recoveryApi";
import {getSessionToken, SessionExpiredError} from "@/services/athleteStorage";
import {router} from "expo-router";
import {useDashboardData} from "@/context/DashboardDataContext";
import {useFocusEffect} from "expo-router";

type HistoryDataContextType = {
    recoveryItems: RecoveryCheckin[];
    isLoading: boolean;
    error: string;
    hasMore: boolean;
    handleLoadMore: () => void;
    clearHistoricalData: () => void;
    loadRecoveryHistory: () => void;
}

const HistoryDataContext = createContext<HistoryDataContextType | undefined>(
    undefined
);

export function HistoryDataProvider({children}: { children: React.ReactNode }) {
    const [recoveryHistory, setRecoveryHistory] = useState<RecoveryCheckin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");
    const {feedItems} = useDashboardData()

    const pageSize = 20;

    async function loadRecoveryHistory(pageToLoad = 0) {
        if (isLoading || (pageToLoad > 0 && !hasMore)) {
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const token = await getSessionToken();
            if (!token) {
                setRecoveryHistory([]);
                setHasMore(false);
                return;
            }

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
            setHasMore(data.length === pageSize);
            if (data.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Could not load recovery history:", error);
            if (error instanceof SessionExpiredError) {
                router.replace("/");
                return;
            }
            setError("Could not load recovery history. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleLoadMore() {
        if (!hasMore) {
            return;
        }
        void loadRecoveryHistory(page + 1);
    }

    useFocusEffect(
        useCallback(() => {
            void loadRecoveryHistory(page);
        }, [feedItems, page]),)

    const clearHistoricalData = useCallback(() => {
        setRecoveryHistory([]);
    }, []);


    return (
        <HistoryDataContext.Provider
            value={{
                recoveryItems: recoveryHistory,
                isLoading,
                error,
                hasMore,
                handleLoadMore,
                clearHistoricalData,
                loadRecoveryHistory,
            }}>
            {children}
        </HistoryDataContext.Provider>
    )
}

export function useHistoryData() {
    const context = useContext(HistoryDataContext);
    if (!context) {
        throw new Error("useHistoryData must be used inside HistoryDataProvider");
    }
    return (
        context
    )
}
