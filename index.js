/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import notifee from '@notifee/react-native';
import {name as appName} from './app.json';
import App from './app/App';
import foregrounfNotificationPress from './app/foundation/push_notifications/foregrounfNotificationPress';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// need to import to ensure bundling
import i18n from './app/foundation/i18n';

notifee.onBackgroundEvent(async event => {
  foregrounfNotificationPress(event);
});

AppRegistry.registerComponent(appName, () => App);
