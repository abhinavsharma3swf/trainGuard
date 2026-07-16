import { Stack } from "expo-router";
import {DashboardDataProvider} from "@/context/DashboardDataContext";


export default function RootLayout() {
    return (
        <DashboardDataProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }} />
        </DashboardDataProvider>
    );
}