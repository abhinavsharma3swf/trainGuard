import { Href, router, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { DashboardDataProvider } from '@/context/DashboardDataContext';
import { HistoryDataProvider } from '@/context/HistoryDataContext';
import { syncNotificationPermission } from '@/services/notificationService';

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

        void syncNotificationPermission();

        const receivedSubscription =
            Notifications.addNotificationReceivedListener(async () => {
                const currentCount =
                    await Notifications.getBadgeCountAsync();

                await Notifications.setBadgeCountAsync(
                    currentCount + 1,
                );
            });

        const notificationSubscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const route =
                        response.notification.request.content.data?.route;

                    if (typeof route === 'string') {
                        router.push(route as Href);
                    }
                },
            );

        const appStateSubscription = AppState.addEventListener(
            'change',
            (state) => {
                if (state === 'active') {
                    Notifications.setBadgeCountAsync(0);
                    void syncNotificationPermission();
                }
            },
        );

        return () => {
            notificationSubscription.remove();
            appStateSubscription.remove();
            receivedSubscription.remove();
        };
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