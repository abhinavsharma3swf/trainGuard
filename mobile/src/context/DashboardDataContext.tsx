import { router } from "expo-router";
import {
    createContext,
    ReactNode, useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getDashboardFeed } from "@/services/dashboardApi";
import {AppState} from "react-native";

export type DashboardFeedItem = {
    activityId: number | null;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number;
    movingTimeMinutes: number;
    pacePerMile: string;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe?: number |null;
    painScore?: number | null;
    painLocation?: string | null;
    mood?: string | null;
    note?: string | null;
    averageWatts: string;
    start_latlng?: number;
    description?: string;
};

type DashboardDataContextType = {
    feedItems: DashboardFeedItem[];
    isLoading: boolean;
    error: string;
    refreshDashboardFeed: () => Promise<void>;
    clearDashboardData: () => void;
};

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(
    undefined
);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
    const [feedItems, setFeedItems] = useState<DashboardFeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function refreshDashboardFeed() {
        try {
            setIsLoading(true);
            setError("");

            const data = await getDashboardFeed();

            const sortedData = [...data].sort(
                (a, b) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );

            setFeedItems(sortedData);
        } catch (error) {
            console.error(error);
            setError("Could not load dashboard data.");
            router.replace("/");
        } finally {
            setIsLoading(false);
        }
    }

    // useEffect(() => {
    //     refreshDashboardFeed();
    // }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (state) => {
                if (state === 'active') {
                    void refreshDashboardFeed();
                }
            },
        );
        return () => subscription.remove();
    }, [feedItems]);

    const clearDashboardData = useCallback(() => {
        setFeedItems([]);
    },[])

    return (
        <DashboardDataContext.Provider
            value={{
                feedItems,
                isLoading,
                error,
                refreshDashboardFeed,
                clearDashboardData
            }}
        >
            {children}
        </DashboardDataContext.Provider>
    );
}

export function useDashboardData() {
    const context = useContext(DashboardDataContext);

    if (!context) {
        throw new Error("useDashboardData must be used inside DashboardDataProvider");
    }
    return context;
}