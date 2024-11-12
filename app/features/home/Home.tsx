import {useIsFocused} from '@react-navigation/native';
import Dayjs from 'dayjs';
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
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import handleNotificationPress from 'foundation/push_notifications/notificationPressHandler';
import {
  useGetUserDetails,
  useUpdateUserProfile,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {daysOfWeek, formatDate, getLastDay} from 'foundation/utils/Helpers';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import DashboardCards, {CardData} from './components/DashboardCards';
import JournalCards from './components/JournalCards';

const Home = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const isFocused = useIsFocused();
  const UpdateProfileApi = useUpdateUserProfile();

  const {notificationData, clearNotificationData} = useRefreshContext();

  const [timeZoneChecked, setTimeZoneChecked] = useState(false);

  const GetUserDetailsAPi = useGetUserDetails();

  const currentDate = Dayjs().format('YYYY-MM-DD');
  const todayDate = new Date();
  const currentDay = todayDate.getDay();
  const dayName = daysOfWeek[currentDay];

  const getDateText = () => {
    return (
      dayName.charAt(0).toUpperCase() +
      dayName.slice(1).toLocaleLowerCase() +
      ', ' +
      formatDate(todayDate).split(',')[0]
    );
  };

  const formatAuthor = (author: any) => {
    return author ? `— ${author}` : '';
  };

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then()
      .catch(err => {
        toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        console.log(err.response.data, 'GET PROFILE API');
      });
  };

  const DashboardData: CardData[] = [
    {
      icon: IMAGES.WhitePencil,
      text: 'Start Writing',
      onPress: () => {
        navigation.navigate('JournalStart', {date: getLastDay(dayName)});
      },
      iconWidth: 13,
      iconHeight: 13,
    },
    {
      icon: IMAGES.GreenTick,
      text: GetUserDetailsAPi?.data?.data.data.isGoalExist
        ? 'View Goals'
        : 'Set Goals',
      onPress: () => {
        navigation.navigate('Goals');
      },
      iconWidth: 17,
      iconHeight: 17,
    },
  ];

  const JournalData: {title: string; value: string}[] = [
    {
      title: 'Days Sober',
      value: GetUserDetailsAPi.data?.data.data.soberDays,
    },
  ];

  useEffect(() => {
    if (isFocused) getUserDetails();
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    if (GetUserDetailsAPi.data?.data?.data.timezone && !timeZoneChecked) {
      const storedTimeZone = GetUserDetailsAPi.data?.data.data.timezone;
      const localTimeZone = RNLocalize.getTimeZone();
      if (storedTimeZone !== localTimeZone) {
        console.log('Not matched');
        UpdateProfileApi.mutateAsync({
          timezone: localTimeZone,
        })
          .then(res => {
            if (res.status === ApiStatusCode.Success) {
              console.log('Update');
            }
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
            } else {
              toast(t('global.something_wrong'), toastType.ERROR_TOAST);
            }
          });
      } else {
        console.log('Matched, No Need');
      }

      setTimeZoneChecked(true);
    }
  }, [GetUserDetailsAPi.data?.data?.data.timezone]);

  useEffect(() => {
    if (notificationData) {
      // If there's notification data, handle the notification
      handleNotificationPress(notificationData, navigation);
      clearNotificationData();
    }
  }, [notificationData]);

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
            navigation.navigate('JournalQuestion', {
              date: getLastDay(dayName),
              isFromAddIcon: true,
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
            navigation.navigate('Profile', {previousRoute: 'home'})
          }>
          <Image
            source={IMAGES.WhiteProfilePlaceholder}
            height={23}
            width={23}
          />
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={'100%'}
        contentContainerStyle={{
          paddingBottom: 100,
          alignItems: 'center',
        }}>
        <View
          width={'100%'}
          paddingVertical={GetUserDetailsAPi.isLoading ? 'sp24' : 'sp30'}
          backgroundColor={'lightPink'}
          gap={'sp20'}>
          {GetUserDetailsAPi.isLoading ? (
            <CardViewSkeleton
              height={25}
              borderRadius={10}
              width={200}
              alignItems="center"
            />
          ) : (
            <Text
              textAlign={'center'}
              color={'green'}
              fontSize={16}
              lineHeight={16}
              fontFamily={fonts.OpensansBold}>
              {getDateText()}
            </Text>
          )}
        </View>

        <View
          paddingVertical={'sp40'}
          width={'100%'}
          gap={'sp15'}
          alignItems={'center'}
          justifyContent={'center'}>
          <Text
            color={'green'}
            fontFamily={fonts.OpensansBold}
            textDecorationLine={'underline'}
            fontSize={15}
            lineHeight={18}>
            {GetUserDetailsAPi.data?.data?.data.ThoughTitle}
          </Text>
          {GetUserDetailsAPi.isLoading ? (
            <CardViewSkeleton
              height={35}
              borderRadius={10}
              width={200}
              alignItems="center"
            />
          ) : (
            <Text
              textAlign={'center'}
              color={'green'}
              marginTop={'sp6'}
              fontFamily={fonts.OpensansBold}
              fontSize={23}
              lineHeight={26}>
              {GetUserDetailsAPi.data?.data?.data.Thought}
            </Text>
          )}
          {GetUserDetailsAPi.isLoading ? (
            <CardViewSkeleton
              height={80}
              borderRadius={10}
              width={300}
              alignItems="center"
            />
          ) : (
            <View width={'70%'} gap={'sp20'}>
              <Text
                textAlign={'center'}
                color={'newGray'}
                fontFamily={fonts.OpensansBold}
                fontSize={13}
                lineHeight={14}>
                {`"${GetUserDetailsAPi.data?.data?.data.ThoughtDesciption}"`}
              </Text>
              {GetUserDetailsAPi.data?.data?.data.ThoughtAuthor && (
                <Text
                  textAlign={'center'}
                  color={'newGray'}
                  fontFamily={fonts.OpensansBold}
                  fontSize={13}
                  lineHeight={14}>
                  {formatAuthor(
                    GetUserDetailsAPi.data?.data?.data.ThoughtAuthor,
                  )}
                </Text>
              )}
            </View>
          )}
        </View>

        <View width={'100%'} marginBottom={'sp24'}>
          <JournalCards
            isLodaing={GetUserDetailsAPi.isLoading}
            journalData={JournalData}
          />
        </View>
        <View width={'100%'}>
          <DashboardCards data={DashboardData} />
        </View>
      </ScrollView>
    </Page>
  );
};

export default Home;
