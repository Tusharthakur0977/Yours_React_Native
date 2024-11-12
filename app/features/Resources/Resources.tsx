import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {daysOfWeek, getLastDay} from 'foundation/utils/Helpers';
import React, {useMemo, useState} from 'react';
import MeetingView from './components/MeetingView';
import RecoveryView from './components/RecoveryView';

const Resources = () => {
  const navigation = useNav();

  const date = new Date();
  const currentDay = date.getDay();
  const dayName = daysOfWeek[currentDay];

  const [currentView, setCurrentView] = useState(0);

  const renderView = useMemo(() => {
    return currentView === 0 ? <MeetingView /> : <RecoveryView />;
  }, [currentView]);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'white'}
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
                params: {previousRoute: 'resources'},
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
      <View width={'100%'} flexDirection={'row'} alignItems={'center'}>
        <Pressable
          onPress={() => setCurrentView(0)}
          flex={0.5}
          backgroundColor={'lightPink'}
          alignItems={'center'}
          padding={'sp15'}>
          <Text color={'green'} fontSize={16} fontFamily={fonts.OpensansBold}>
            Meetings
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentView(1)}
          flex={0.5}
          backgroundColor={'white'}
          alignItems={'center'}
          padding={'sp15'}>
          <Text color={'green'} fontSize={16} fontFamily={fonts.OpensansBold}>
            Types of Recovery
          </Text>
        </Pressable>
      </View>
      {renderView}
    </Page>
  );
};

export default Resources;
