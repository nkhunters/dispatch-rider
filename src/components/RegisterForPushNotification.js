import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import DispatchApi from '../api/DispatchApi';
import { AsyncStorage } from 'react-native';

export default async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    await AsyncStorage.setItem('notificationToken', token);

    console.log(token);

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    DispatchApi.post('/savePushNotificationTokenRider', { token })
        .then()
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            // always executed
        });;
}