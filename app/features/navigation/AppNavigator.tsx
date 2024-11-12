import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@shopify/restyle';
import ChangePassword from 'features/ChangePassword/ChangePassword';
import EditDetails from 'features/EditDetails/EditDetails';
import Goals from 'features/Goals/Goals';
import Notifications from 'features/Notifications/Notifications';
import Resources from 'features/Resources/Resources';
import SetNotifications from 'features/SetNotification/SetNotifications';
import SettingScreen from 'features/Settings/SettingScreen';
import TimerNotification from 'features/TimerNotification/TimerNotification';
import WeeklyNotification from 'features/WeeklyNotification/WeeklyNotification';
import ForgotPassword from 'features/forgotPassword/ForgotPassword';
import Home from 'features/home/Home';
import JournalDay from 'features/journalDay/JournalDay';
import JournalQuestions from 'features/journalQuestion/JournalQuestions';
import Library from 'features/library/Library';
import Login from 'features/login/Login';
import Profile from 'features/profile/Profile';
import SetGoals from 'features/setUserGoals/SetGoals';
import SignUp from 'features/signUp/SignUp';
import Splash from 'features/splash';
import StartJournal from 'features/startJournal/StartJournal';
import fonts from 'foundation/assets/fonts';
import IMAGES from 'foundation/assets/images';
import {Image, Text, View} from 'foundation/components/kit';
import {useDeepLinkContext} from 'foundation/provider/DeepLinkProvider';
import {Theme} from 'foundation/theme';
import {useCallback, useEffect} from 'react';
import {Linking, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParams} from './RouteParamTypes';
import {Route} from './routes';

const Stack = createStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<RootStackParams>();

const WelcomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SetGoals"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SetGoals" component={SetGoals} />
      <Stack.Screen name="setNotification" component={SetNotifications} />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.Resources}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.Resources} component={Resources} />
      <Stack.Screen name={Route.Profile} component={Profile} />
      <Stack.Screen name={Route.ChangePassword} component={ChangePassword} />
      <Stack.Screen name={Route.Goals} component={Goals} />
      <Stack.Screen name={Route.Notifications} component={Notifications} />
      <Stack.Screen name={Route.EditDetails} component={EditDetails} />
      <Stack.Screen name={Route.Settings} component={SettingScreen} />

      <Stack.Screen name={Route.JournalQuestion} component={JournalQuestions} />
    </Stack.Navigator>
  );
};

const JournalStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.JournalDay}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.Profile} component={Profile} />
      <Stack.Screen name={Route.JournalDay} component={JournalDay} />
      <Stack.Screen name={Route.JournalStart} component={StartJournal} />
      <Stack.Screen name={Route.JournalQuestion} component={JournalQuestions} />
    </Stack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.Home}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.Home} component={Home} />
      <Stack.Screen
        name={Route.WeeklyNotification}
        component={WeeklyNotification}
      />
      <Stack.Screen name={Route.JournalQuestion} component={JournalQuestions} />
      <Stack.Screen name={Route.Goals} component={Goals} />
      <Stack.Screen
        name={Route.TimerNotification}
        component={TimerNotification}
      />
      <Stack.Screen name={Route.Profile} component={Profile} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const {colors} = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  const getRouteName = (routeName: any) => {
    switch (routeName) {
      case Route.HomeStack:
        return 'Home';
      case Route.JournalStack:
        return 'Journal';
      case Route.Library:
        return 'Library';
      case Route.ProfileStack:
        return 'Resources';
    }
  };

  const getTabIcon = (focused: boolean, routeName: string) => {
    switch (routeName) {
      case Route.HomeStack: {
        return focused ? IMAGES.homeFillIcon : IMAGES.homeIcon;
      }
      case Route.Library: {
        return focused ? IMAGES.LibraryFilIcon : IMAGES.Library;
      }
      case Route.JournalStack: {
        return focused ? IMAGES.journalFillIcon : IMAGES.journalIcon;
      }
      case Route.ProfileStack: {
        return focused ? IMAGES.ResourcesFilIcon : IMAGES.Resources;
      }
    }
  };

  const getIconSize = (routeName: string) => {
    switch (routeName) {
      case Route.HomeStack:
        return {width: 20, height: 20};
      case Route.Library:
        return {width: 20, height: 20};
      case Route.JournalStack:
        return {width: 18, height: 18};
      case Route.ProfileStack:
        return {width: 19, height: 19};
      default:
        return {width: 20, height: 20};
    }
  };

  const getIcon = useCallback(
    (focused: boolean, routeName: string) => {
      const iconSize = getIconSize(routeName);
      return (
        <View alignItems={'center'} justifyContent={'center'}>
          <Image
            width={iconSize.width}
            height={iconSize.height}
            resizeMode="contain"
            source={getTabIcon(focused, routeName)}
          />
          <Text
            fontSize={12}
            maxFontSizeMultiplier={1}
            allowFontScaling={false}
            marginBottom={'sp2'}
            style={{
              color: focused ? colors.green : '#999999',
            }}
            fontFamily={fonts.OpensansBold}>
            {getRouteName(routeName)}
          </Text>
          <View
            backgroundColor={focused ? 'green' : 'transparent'}
            height={1.5}
            width={50}
            borderRadius={10}
          />
        </View>
      );
    },
    [colors],
  );

  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={Route.HomeStack}
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FAF1F4',
          width: '90%',
          alignSelf: 'center',
          marginBottom: 20,
          elevation: 2,
          borderRadius: 10,
          minHeight: Platform.OS === 'android' ? 75 : 0 + insets.bottom,
          paddingBottom: 10,
          paddingTop: 15,
          position: 'absolute',
          left: '5%',
          right: '5%',
        },
        headerShown: false,
        tabBarIcon: ({focused}) => getIcon(focused, route.name),
      })}>
      <Tab.Screen
        name={Route.HomeStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('HomeStack');
          },
        })}
        component={HomeStackNavigator}
      />
      <Tab.Screen
        name={Route.JournalStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('JournalStack');
          },
        })}
        component={JournalStackNavigator}
      />
      <Tab.Screen name={Route.Library} component={Library} />
      <Tab.Screen name={Route.ProfileStack} component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default () => {
  const {setDeepLinkUrl, setAppEntry} = useDeepLinkContext();
  useEffect(() => {
    // notificationListner();
  }, []);

  useEffect(() => {
    const handleUrl = ({url}: {url: string}) => {
      if (url) {
        console.log('Url', url);

        setDeepLinkUrl(url);
        setAppEntry('deepLink');
      }
    };

    const handleInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          console.log('initialUrl', initialUrl);

          setDeepLinkUrl(initialUrl);
          setAppEntry('deepLink');
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    handleInitialUrl();
    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.Splash} component={Splash} />
      <Stack.Screen name={Route.Login} component={Login} />
      <Stack.Screen name={Route.SignUp} component={SignUp} />
      <Stack.Screen name={Route.Resetpassword} component={ForgotPassword} />
      <Stack.Screen
        name={Route.WelcomeStack}
        component={WelcomeStackNavigator}
      />
      <Stack.Screen name={Route.Tabs} component={TabNavigator} />
    </Stack.Navigator>
  );
};
