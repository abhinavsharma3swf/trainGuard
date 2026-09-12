import { router } from "expo-router";
import {
    createContext,
    ReactNode, useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getDashboardFeed } from "@/services/dashboardApi";
import { getSessionToken, SessionExpiredError } from "@/services/athleteStorage";
import {AppState} from "react-native";
import {BodyPart} from "@/components/PathPoints";

export type DashboardFeedItem = {
    activityId: number | null;
    sportType: string;
    name: string;
    startDate: string;
    distanceMiles: number | null;
    movingTimeMinutes: number | null;
    pacePerMile: string | null;
    checkinStatus: "COMPLETED" | "PENDING";
    rpe?: number |null;
    painScore?: number | null;
    painLocation?: string | null;
    painLocationEnum?: BodyPart[] | [];
    mood?: string | null;
    note?: string | null;
    averageWatts: number | null;
    start_latlng?: number | null;
    description?: string | null;
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

            const token = await getSessionToken();
            if (!token) {
                setFeedItems([]);
                return;
            }

            const data = await getDashboardFeed(0, 100);

            const sortedData = [...data].sort(
                (a, b) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            );

            setFeedItems(sortedData);
        } catch (error) {
            console.error(error);
            if (error instanceof SessionExpiredError) {
                router.replace("/");
                return;
            }
            setError("Could not load dashboard data.");
        } finally {
            setIsLoading(false);
        }
    }

    // useEffect(() => {
    //      void refreshDashboardFeed();
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
    }, []);

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