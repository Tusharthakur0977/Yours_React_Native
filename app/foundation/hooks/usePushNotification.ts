import notifee, {
  AndroidImportance,
  AndroidStyle,
  Event as notifeeEvent,
  EventType as notifeeEventType,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import foregrounfNotificationPress from 'foundation/push_notifications/foregrounfNotificationPress';
import {storage} from 'foundation/storage';
import * as React from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

export const isIOS = Platform.OS === 'ios';

interface Options {
  initNotificationListeners: (callback: (notification?: any) => void) => void;
  requestNotificationPermissions: () => Promise<void>;
  getNotificationToken: () => Promise<string>;
}

export const usePushNotifications = (): Options => {
  const {setNotificationData} = useRefreshContext();

  // Function to request notification permissions
  const requestNotificationPermissions = async () => {
    try {
      // Request Android specific permissions if the platform is Android
      if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      }

      // Request Firebase messaging permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      // If permissions are granted, get the notification token
      if (enabled) {
        getNotificationToken();
      } else {
        requestPermission();
        console.log('User declined permissions');
      }
    } catch (error) {
      console.log('Permission request error:', error);
    }
  };

  // Function to request permissions if they were not granted initially
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      getNotificationToken();
    } catch (error) {
      console.log('Permission rejected');
    }
  };

  // Function to get the Firebase Cloud Messaging (FCM) token
  const getNotificationToken = async () => {
    const token = await messaging().getToken();
    storage.setFcmToken(token);
    return token;
  };

  // Function to handle receiving a message while the app is in the foreground
  async function handleMessageReceived(
    message: FirebaseMessagingTypes.RemoteMessage,
  ) {
    try {
      // Create a notification channel if it doesn't exist
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      // Display the notification using Notifee
      if (message.notification) {
        await notifee.displayNotification({
          id: message?.notification.body || new Date().getTime().toString(),
          title: message?.notification.title || 'Notification',
          body: message?.notification.body || 'No content',
          data: message.data,
          android: {
            channelId: channelId,
            importance: AndroidImportance.HIGH,
            groupId: new Date().getTime().toString(),
            style: {
              type: AndroidStyle.BIGTEXT,
              text: message?.notification.body || '',
            },
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: true,
            },
          },
        });
      }

      // // For iOS, cancel all notifications to prevent duplicates
      // if (isIOS) {
      //   await notifee.cancelAllNotifications();
      // }
    } catch (e) {
      console.log(e);
    }
  }

  // Function to handle notifications received when the app is in the background
  const handleBackgroundReceived = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    callback: (notification?: any) => void,
  ) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // Handle the notification press and execute the callback
    foregrounfNotificationPress(remoteMessage.data);
    callback(remoteMessage?.data as unknown as any);
  };

  // Function to handle notifications received when the app was terminated
  const handleTerminatedReceived = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
    callback: (notification?: any) => void,
  ) => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      // Handle the notification press and execute the callback
      setNotificationData({
        type: notifeeEventType.PRESS,
        detail: {notification: remoteMessage.data},
      });
      callback(remoteMessage.data as unknown as any);
    }
  };

  // Function to handle notification events when the app is in the foreground
  const onForegroundEvent = async (props: notifeeEvent) => {
    if (props.type === notifeeEventType.PRESS) {
      foregrounfNotificationPress(props.detail.notification?.data);
    }
  };

  // Initialize notification listeners
  const initNotificationListeners = React.useCallback(
    (callback: (notification?: any) => void) => {
      // Handle foreground notification events
      notifee.onForegroundEvent(onForegroundEvent);

      // Handle messages received while the app is in the foreground
      messaging().onMessage(message => handleMessageReceived(message));

      // Handle notifications opened while the app is in the background
      messaging().onNotificationOpenedApp(message =>
        handleBackgroundReceived(message, callback),
      );

      // Handle notifications opened while the app was terminated
      messaging()
        .getInitialNotification()
        .then(message =>  {
          handleTerminatedReceived(message, callback)
        });
    },
    [],
  );

  return React.useMemo(
    () => ({
      requestNotificationPermissions,
      getNotificationToken,
      initNotificationListeners,
    }),
    [initNotificationListeners],
  );
};
