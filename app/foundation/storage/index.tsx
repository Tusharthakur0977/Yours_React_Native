import {observable, ObservableObject} from '@legendapp/state';
import {
  configureObservablePersistence,
  persistObservable,
} from '@legendapp/state/persist';
import {ObservablePersistMMKV} from '@legendapp/state/persist-plugins/mmkv';

// Global configuration
configureObservablePersistence({
  pluginLocal: ObservablePersistMMKV,
});

interface RememberDetails {
  email: string | null;
  password: string | null;
}

interface Storage {
  token: string | null;
  getToken: () => string | null;
  setToken: (token: string) => void;

  rememberDetails: {
    email: string;
    password: string;
  } | null;
  getRememberDetails: () => RememberDetails;
  setRememberDetails: (details: RememberDetails) => void;

  fcmToken: string | null;
  getFcmToken: () => string | null;
  setFcmToken: (fcmToken: string) => void;

  isPushNotification: boolean;
  getIsPushNotification: () => boolean;
  setIsPushNotification: (isPushNotification: boolean) => void;

  reset: () => void;
}

export const storage = observable<Storage>({
  // initial Value
  token: '',
  rememberDetails: null,
  fcmToken: '',
  isPushNotification: true,

  // getters
  getToken: () => storage.token.get(),
  getRememberDetails: () => ({
    email: storage.rememberDetails.email.get(),
    password: storage.rememberDetails.password.get(),
  }),
  getFcmToken: () => storage.fcmToken.get(),
  getIsPushNotification: () => storage.isPushNotification.get(),

  // setters
  setToken: (token: string) => {
    storage.token.set(token);
  },
  setRememberDetails: (details: RememberDetails) => {
    storage.rememberDetails.email.set(details.email);
    storage.rememberDetails.password.set(details.password);
  },
  setFcmToken: (fcmToken: string) => {
    storage.fcmToken.set(fcmToken);
  },
  setIsPushNotification: (isPushNotification: boolean) => {
    storage.isPushNotification.set(isPushNotification);
  },

  // reset
  reset: () => {
    storage.isPushNotification?.set?.(false);
    storage.token?.set?.(null);
  },
}) as ObservableObject<Storage>;

persistObservable(storage, {
  local: 'store',
});
