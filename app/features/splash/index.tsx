import {useNav} from 'features/navigation/useNav';
import IMAGES from 'foundation/assets/images';
import {useDeepLinkContext} from 'foundation/provider/DeepLinkProvider';
import {storage} from 'foundation/storage';
import {colors} from 'foundation/theme/colors';
import React, {FC, useEffect, useRef} from 'react';
import {Animated, Easing, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Splash = () => {
  const navigation = useNav();
  const token = storage.getToken();

  const {deepLinkUrl, appEntry} = useDeepLinkContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000, // Adjusted to 3 seconds
      easing: Easing.ease,
      useNativeDriver: true,
    });

    fadeInAnimation.start(({finished}) => {
      // finished is true if the animation completed (not interrupted)
      if (finished) {
        if (appEntry === 'deepLink' && deepLinkUrl) {
          storage.setToken('');
          navigation.replace('ResetPassword');
          return;
        }
        // Check if navigation should occur

        if (token) {
          navigation.replace('Tabs');
        } else {
          navigation.replace('Login');
        }
      } else {
        console.log('Animation was interrupted');
      }
    });
  }, [deepLinkUrl, appEntry, token]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.pink} barStyle={'default'} />
      <Animated.Image
        source={IMAGES.logoWhite}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green,
  },
  logo: {
    width: 240,
    height: 200,
  },
});

export default Splash;
