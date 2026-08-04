import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {useDashboardData} from "@/context/DashboardDataContext";
import {API_BASE_URL} from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";


export async function registerForNotifications(): Promise<string | null> {

    const {feedItems} = useDashboardData();
    const theNumberOfActivity = feedItems.filter((feedItem) => feedItem.checkinStatus === 'PENDING').length;

    if (Platform.OS !== 'ios') {
        return null;
    }

    if (!Device.isDevice) {
        console.log('Push notifications require a physical device.');
        return null;
    }

    const currentPermission = await Notifications.getPermissionsAsync();

    let status = currentPermission.status;

    if (status !== 'granted') {
        const requestedPermission =
            await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                },
            });

        status = requestedPermission.status;
    }

    if (status !== 'granted') {
        return null;
    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    if (!projectId) {
        throw new Error('EAS project ID is missing.');
    }

    const token = await Notifications.getExpoPushTokenAsync({
        projectId,
    });

    return token.data;

}


      export async function scheduleTestNotification(): Promise<void> {

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Smart Gauge',
                body: `You have  pending check-in.`,
                sound: 'default',
                data: {
                    route: '/dashboard',
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 3,
            },
        });
    }

    export async function saveUserNotificationToken(notificationToken: string) {
        const token = await getSessionToken();

        await fetch(`${API_BASE_URL}/api/contactUs/notifications`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                contentType: 'application/json',
            },
            body: JSON.stringify(notificationToken),
        })
    }
