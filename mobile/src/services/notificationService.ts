import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {API_BASE_URL} from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";

export async function syncNotificationPermission(): Promise<void> {
    const permission = await Notifications.getPermissionsAsync();
    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({
        projectId,
    })).data;

    if (permission.status !== 'denied') {
        return;
    }
    await deleteNotificationToken(token);
}


export async function registerForRemoteNotifications(): Promise<void> {

    if (Platform.OS !== 'ios') {
        return;
    }

    if (!Device.isDevice) {
        console.log('Push notifications require a physical device.');
        return;
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
        return;
    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

    const token = (await Notifications.getExpoPushTokenAsync({
        projectId,
    })).data;

    if (!projectId) {
        throw new Error('EAS project ID is missing.');
    }

    if(currentPermission.status === 'denied') {
        await deleteNotificationToken(token);
    }
    else{
        await saveUserNotificationToken(token)
    }



    // const sessionToken = await getSessionToken();
    //
    // if (!sessionToken) {
    //     throw new Error('Session token is missing.');
    // }
    //
    // const response = await fetch(
    //     `${API_BASE_URL}/api/contactUs/notification`,
    //     {
    //         method: 'POST',
    //         headers: {
    //             Authorization: `Bearer ${sessionToken}`,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             token,
    //         }),
    //     },
    // );

    // if (!response.ok) {
    //     const error = await response.text();
    //
    //     throw new Error(
    //         `Could not save push token: ${response.status} ${error}`,
    //     );
    // }
}


//   export async function scheduleTestNotification(pendingCheckins: number): Promise<void> {
//
//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title: 'Smart Gauge',
//             body: pendingCheckins === 1
//             ? 'You have 1 pending check-in.'
//             : `You have ${pendingCheckins} pending check-ins.`,
//             sound: 'default',
//             data: {
//                 route: '/dashboard',
//             },
//         },
//         trigger: {
//             type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//             seconds: 3,
//         },
//     });
// }

export async function saveUserNotificationToken(notificationToken: string): Promise<void> {
    const token = await getSessionToken();

    const response = await fetch(`${API_BASE_URL}/api/contactUs/notification`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({notificationToken}),
    })

    if(response.ok) {
        console.log("token saved successfully.");
    }
    else
        throw new Error("Unable to save notification token.");
}


export async function deleteNotificationToken(notificationToken: string): Promise<void> {
    const token = await getSessionToken();

    const response = await fetch(`${API_BASE_URL}/api/contactUs/token_deletion`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({notificationToken}),
    })

    if(response.ok) {
        console.log("token removed successfully.");
    }
    else
        throw new Error("Unable to remove notification token.");
}


export async function requestTestPush(): Promise<void> {
    const token = await getSessionToken();

    if (!token) {
        throw new Error('Session token is missing.');
    }

    const response = await fetch(
        `${API_BASE_URL}/api/contactUs/notification/test`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Test push failed: ${response.status} ${body}`,
        );
    }
}
