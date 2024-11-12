import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {ProfileStackParams} from 'features/navigation/RouteParamTypes';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  Icon,
  Image,
  Page,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Sound from 'react-native-sound';
import {daysOfWeek, getLastDay} from 'foundation/utils/Helpers';

const TimerNotification = () => {
  const navigation = useNav();
  const isFocused = useIsFocused();
  const route = useRoute<RouteProp<ProfileStackParams>>();

  const date = new Date();
  const currentDay = date.getDay();
  const dayName = daysOfWeek[currentDay];

  const title = route.params?.title;

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [key, setKey] = useState(0); // Key to force reset the timer
  const [timerCompleted, setTimerCompleted] = useState(false); // State to track timer completion

  // Function to toggle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prevIsPlaying => {
      const newState = !prevIsPlaying;
      if (sound) {
        if (newState) {
          sound.play(success => {
            if (!success) {
              console.log('Playback failed due to audio decoding errors');
              // Consider resetting everything if the play fails
            }
          });
        } else {
          sound.pause();
        }
      }
      return newState;
    });
  }, [sound]);

  const formatTime = useCallback(({remainingTime}: {remainingTime: number}) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return (
      <Text
        color="green"
        fontFamily={fonts.OpensansBold}
        fontSize={70}
        lineHeight={80}>
        {`${minutes < 10 ? '0' + minutes : minutes}:${
          seconds < 10 ? '0' + seconds : seconds
        }`}
      </Text>
    );
  }, []);

  const resetAll = useCallback(() => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }
    setKey(prevKey => prevKey + 1); // Increment key to reset the timer
    setSound(null);
    setIsPlaying(false);
    setTimerCompleted(false);
    // Optionally reload the sound here if needed
  }, [sound]);

  const onTimerComplete = () => {
    setTimerCompleted(true);
    if (sound && sound.isLoaded()) {
      sound.play(success => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
      });
    }
    return {shouldRepeat: false, delay: 1.5};
  };

  useEffect(() => {
    setIsPlaying(true);

    // setting sound in Soundstate
    const newSound = new Sound('timer.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      if (newSound.isLoaded()) {
        setSound(newSound);
      }
    });
    return () => {
      resetAll();
    };
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && sound) {
      resetAll();
    }
  }, [isFocused, sound]);

  // Handle the back button press
  useEffect(() => {
    const onBackPress = () => {
      resetAll();
      navigation.replace('Tabs', {
        screen: 'HomeStack',
        params: {
          screen: 'Home',
        },
      });
      return true; // Prevent the default back button behavior
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [navigation, resetAll]);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'lightPink'}
      safeAreaBackgroundColor="green"
      showsVerticalScrollIndicator={false}>
      <View
        backgroundColor={'green'}
        height={'18%'}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Pressable
          top={20}
          left={20}
          borderWidth={1}
          borderColor={'white'}
          borderRadius={100}
          position={'absolute'}
          zIndex={100}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'JournalStack',
              params: {
                screen: 'JournalQuestion',
                params: {date: getLastDay(dayName), isFromAddIcon: true},
              },
            })
          }>
          <Icon
            source={Icons.PluseIcon}
            width={23}
            height={23}
            svgProps={{
              height: 12,
              width: 12,
              fill: 'white',
            }}
          />
        </Pressable>
        <Image
          height={40}
          width={100}
          source={IMAGES.logoWhite}
          resizeMode="contain"
        />
        <Pressable
          top={20}
          right={20}
          position={'absolute'}
          zIndex={100}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'ProfileStack',
              params: {
                screen: 'Profile',
              },
            })
          }>
          <Image
            source={IMAGES.WhiteProfilePlaceholder}
            height={23}
            width={23}
          />
        </Pressable>
      </View>
      <View
        flex={1}
        alignItems={'center'}
        backgroundColor={'white'}
        width={'100%'}>
        <View paddingVertical={'sp48'} width={'65%'} alignItems={'center'}>
          <Text
            textAlign={'center'}
            fontSize={18}
            lineHeight={25}
            fontFamily={fonts.HelveticaBold}
            color="green">
            {title}
          </Text>
        </View>
        <View
          backgroundColor={'lightPink'}
          width={'100%'}
          flex={0.85}
          gap={'sp32'}
          justifyContent={'center'}
          alignItems={'center'}>
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            duration={10} // Duration in seconds
            trailColor="#FAF1F4"
            colors={'#FAF1F4'}
            onComplete={onTimerComplete}>
            {formatTime}
          </CountdownCircleTimer>
          {timerCompleted && (
            <Pressable
              onPress={togglePlayPause}
              alignItems={'center'}
              justifyContent={'center'}
              backgroundColor={'green'}
              padding={'sp20'}
              borderRadius={100}>
              {isPlaying ? (
                <Icon
                  height={30}
                  width={30}
                  source={Icons.Pause}
                  svgProps={{
                    fill: colors.white,
                  }}
                />
              ) : (
                <Icon
                  height={30}
                  width={30}
                  source={Icons.Play}
                  svgProps={{
                    fill: colors.white,
                  }}
                />
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Page>
  );
};

export default TimerNotification;
