import {createContext, useContext, useEffect, useState} from "react";
import {getRecoveryCheckins, RecoveryCheckin} from "@/services/recoveryApi";

type HistoryDataContextType = {
    recoveryItems: RecoveryCheckin[];
    isLoading: boolean;
    hasMore: boolean;
    handleLoadMore: () => void;
}

const HistoryDataContext = createContext<HistoryDataContextType | undefined>(
    undefined
);

export function HistoryDataProvider({children}: { children: React.ReactNode }) {
    const [recoveryHistory, setRecoveryHistory] = useState<RecoveryCheckin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 20;

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


    return (
        <HistoryDataContext.Provider
            value={{
                recoveryItems: recoveryHistory,
                isLoading,
                hasMore,
                handleLoadMore
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
