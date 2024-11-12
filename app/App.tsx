import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import Routes from 'features/navigation';
import {navigationRef} from 'features/navigation/handlers';
import NetworkLogger from 'foundation/components/NetworkLogger/NetworkLogger';
import CustomToast from 'foundation/components/Toast';
import {DeepLinkProvider} from 'foundation/provider/DeepLinkProvider';
import {NotificationProvider} from 'foundation/provider/NotificationProvider';
import {RefreshProvider} from 'foundation/provider/RefreshProvider';
import {ThemeProvider} from 'foundation/theme';
import {colors} from 'foundation/theme/colors';
import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MenuProvider} from 'react-native-popup-menu';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

function App(): JSX.Element {
  const colorScheme = useColorScheme();
  /**
   * Change the color of the status bar based on the theme mode selected.
   */

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.white,
    },
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (colorScheme === 'dark') {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#ffffff');
      } else {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('#ffffff');
      }
    }
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <DeepLinkProvider>
          <RefreshProvider>
            <NotificationProvider>
              <StatusBar />
              <ThemeProvider>
                <MenuProvider>
                  <Routes />
                  <CustomToast />
                  {__DEV__ && <NetworkLogger />}
                </MenuProvider>
              </ThemeProvider>
            </NotificationProvider>
          </RefreshProvider>
        </DeepLinkProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default App;
