import {usePushNotifications} from 'foundation/hooks/usePushNotification';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface NotificationContextProps {
  notification: boolean;
  setNotification: (value: boolean) => void;
  requestNotificationPermissions: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const pushNotifications = usePushNotifications();

  const [notification, setNotification] = useState(false);

  const requestNotificationPermissions = useCallback(async () => {
    await pushNotifications.requestNotificationPermissions();
    const token = await pushNotifications.getNotificationToken();
    console.log(`APNS TOKEN:\n${token}`);
  }, [pushNotifications]);

  const handleNotificationReceived = useCallback(() => {
    setNotification(true);
  }, []);

  useEffect(() => {
    pushNotifications.initNotificationListeners(handleNotificationReceived);
  }, [pushNotifications, handleNotificationReceived]);

  useEffect(() => {
    requestNotificationPermissions();
  }, [requestNotificationPermissions]);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
        requestNotificationPermissions,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
