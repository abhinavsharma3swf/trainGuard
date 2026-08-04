import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {API_BASE_URL} from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";


export async function registerForNotifications(): Promise<string | null> {

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


      export async function scheduleTestNotification(pendingCheckins: number): Promise<void> {

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Smart Gauge',
                body: pendingCheckins === 1
                ? 'You have 1 pending check-in.'
                : `You have ${pendingCheckins} pending check-ins.`,
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

    export async function saveUserNotificationToken(notificationToken: any) {
        const token = await getSessionToken();

        await fetch(`${API_BASE_URL}/api/contactUs/notification`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                contentType: 'application/json',
            },
            body: JSON.stringify(notificationToken),
        })
    }
