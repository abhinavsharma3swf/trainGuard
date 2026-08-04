import { Href, router, Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { DashboardDataProvider } from '@/context/DashboardDataContext';
import { HistoryDataProvider } from '@/context/HistoryDataContext';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function RootLayout() {
    useEffect(() => {
        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const route =
                        response.notification.request.content.data?.route;

                    if (typeof route === 'string') {
                        router.push(route as Href);
                    }
                },
            );
        return () => subscription.remove();
    }, []);

    return (
        <DashboardDataProvider>
            <HistoryDataProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'none',
                    }}
                />
            </HistoryDataProvider>
        </DashboardDataProvider>
    );
}