import { Stack } from "expo-router";
import {DashboardDataProvider} from "@/context/DashboardDataContext";
import {HistoryDataProvider} from "@/context/HistoryDataContext";

export default function RootLayout() {
    return (
        <DashboardDataProvider>
            <HistoryDataProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }} />
            </HistoryDataProvider>
        </DashboardDataProvider>
    );
}