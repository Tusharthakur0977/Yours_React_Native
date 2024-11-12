import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import AuthScreenHeader from 'foundation/components/AuthScreenHeader/AuthScreenHeader';
import {
  CheckBox,
  FlatList,
  Icon,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import ToolTipView from 'foundation/components/ToolTipView';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useCreateNotificationApi,
  useGetUserNotificationList,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import { colors } from 'foundation/theme/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Dimensions, Text as NativeText} from 'react-native';
import * as RNLocalize from 'react-native-localize';

export type NotificationData = {
  notificationText: string;
  is_checked: boolean;
  notificationTiming: string;
};

const ToolTipData = [
  "Select what time you'd like to receive a notification to complete your daily journal.",
  'Set a notification to pause, check in with yourself, and complete one-minute of timed breathing each morning.',
  "Set a notification that prompts you to identify one thing that you're feeling grateful for in the day.",
  'Set a notification to pause, check in with yourself, and complete one-minute of timed breathing in each afternoon.',
  'Set a notification to pause, check in with yourself, and complete one-minute of timed breathing in each evening.',
  'Set a notification to complete your final check-in for the day.',
];

const SetNotifications = () => {
  const {t} = useTranslation();
  const navigation = useNav();

  const {data, isLoading, isError, isFetching} = useGetUserNotificationList();
  const CreateUserNotificationApi = useCreateNotificationApi();

  const [notificationData, setNotificationData] = useState<NotificationData[]>(
    data?.data.data,
  );

  const [showTooltip, setShowTooltip] = useState<boolean[]>(
    ToolTipData?.map(() => false),
  );
  const [selectedToolTip, setSelectedToolTip] = useState<string[]>(
    ToolTipData?.map(item => item),
  );

  const toggleTooltip = (index: number, tooltipText: string) => {
    const newShowTooltip = showTooltip.slice();
    const newSelectedToolTip = selectedToolTip.slice();
    newShowTooltip[index] = !newShowTooltip[index];
    newSelectedToolTip[index] = tooltipText;
    setShowTooltip(newShowTooltip);
    setSelectedToolTip(newSelectedToolTip);
  };

  const handleCheck = (notificationText: string) => {
    const newData = notificationData.map(item => {
      if (item.notificationText === notificationText) {
        return {...item, is_checked: !item.is_checked};
      }
      return item;
    });
    setNotificationData(newData);
  };

  const handleCreateUserNotifications = async () => {
    if (notificationData.every(item => item.is_checked === false)) {
      navigation.reset({index: 0, routes: [{name: 'Tabs'}]});
    } else {
      const notificationChosen: number[] = [];

      notificationData.forEach((element, index) => {
        if (element.is_checked) {
          notificationChosen.push(index); // Add index to notificationChosen if is_checked is true
        }
      });

      CreateUserNotificationApi.mutateAsync({
        notification_choosen: notificationChosen,
        timezone: RNLocalize.getTimeZone(),
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            navigation.reset({index: 0, routes: [{name: 'Tabs'}]});
          }
        })
        .catch(err => {
          if (err.response.data.error) {
            toast(err.response.data.message, toastType.ERROR_TOAST);
          } else {
            toast(t('global.something_wrong'), toastType.ERROR_TOAST);
          }
        });
    }
  };

  const renderNotificationListing = ({
    item,
    index,
  }: {
    item: NotificationData;
    index: number;
  }) => {
    return (
      <Pressable
        key={item.notificationText + index.toString()}
        onPress={() => handleCheck(item.notificationText)}
        width={'100%'}
        flexDirection={'row'}
        alignItems={'center'}
        borderColor={'gray2'}
        borderWidth={1}
        paddingHorizontal={'sp15'}
        paddingVertical={'sp16'}
        borderRadius={10}
        gap={'sp10'}>
        <View flex={1} flexDirection={'row'} alignItems={'center'} gap={'sp10'}>
          <Text
            fontFamily={fonts.HelveticaRegular}
            fontSize={17}
            color={'black'}>
            {item.notificationText}
          </Text>
          <ToolTipView
            isVisible={showTooltip[index]}
            onClose={() => toggleTooltip(index, '')}
            onPress={() => toggleTooltip(index, ToolTipData[index])}
            icon={
              <Icon
                source={Icons.CircleExclam}
                svgProps={{
                  fill: colors.black1,
                }}
                height={15}
                width={15}
              />
            }>
            <View padding={'sp8'} backgroundColor={'black'}>
              <Text
                lineHeight={21}
                fontSize={15}
                fontFamily={fonts.HelveticaRegular}
                color={'white'}>
                {selectedToolTip[index]}
              </Text>
            </View>
          </ToolTipView>
        </View>
        <CheckBox
          value={item.is_checked}
          onChange={() => handleCheck(item.notificationText)}
          borderRadius= {5}
          width = {19}
          height = {19}
          iconWidth = {13}
          iconHeight = {13}
          marginRight = {false}
        />
      </Pressable>
    );
  };

  const memoizedNotificationList = useMemo(
    () => (
      <FlatList
        width={'100%'}
        data={notificationData}
        renderItem={renderNotificationListing}
        keyExtractor={item => item.notificationText.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
        }}
        ListEmptyComponent={
          <View gap={'sp12'}>
            {Array.from({length: 6}).map((_, index) => (
              <CardViewSkeleton
                key={`skeleton-${index}`}
                alignItems="flex-start"
                height={60}
                borderRadius={10}
                width={Dimensions.get('screen').width * 0.9}
              />
            ))}
          </View>
        }
      />
    ),
    [notificationData, showTooltip, ToolTipData, isFetching],
  );

  useEffect(() => {
    setNotificationData(data?.data.data);
  }, [data?.data]);

  return (
    <Page
      flex={1}
      scrollable={false}
      alignContent={'center'}
      alignItems={'center'}
      safeAreaBackgroundColor="lightPink"
      backgroundColor={'white'}
      showsVerticalScrollIndicator={false}>
      <AuthScreenHeader isBackButton={false} />
      <View
        paddingHorizontal={'sp20'}
        width={'100%'}
        gap={'sp10'}
        marginTop={'sp24'}
        alignItems={'flex-start'}
        justifyContent={'center'}>
        <Text color={'black'} fontFamily={fonts.OpensansBold} fontSize={23}>
          Set Your Notifications
        </Text>
        <Text
          color={'black'}
          fontFamily={fonts.HelveticaRegular}
          fontSize={15}
          lineHeight={20}>
          Get check-in reminders throughout YOUR day to keep you present and
          grounded.
        </Text>
        <Text
          color={'gray1'}
          fontFamily={fonts.HelveticaRegular}
          fontSize={13}
          lineHeight={13}>
          You can select more than one option:
        </Text>
      </View>
      <View
        width={'100%'}
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
        paddingVertical={'sp20'}
        paddingHorizontal={'sp20'}
        gap={'sp10'}>
        {memoizedNotificationList}
        <View
          width={'100%'}
          alignItems={'center'}
          gap={'sp20'}
          alignSelf={'flex-end'}>
          <Pressable
            onPress={handleCreateUserNotifications}
            flexDirection={'row'}
            alignItems={'center'}
            gap={'sp10'}
            width="40%"
            backgroundColor={'green'}
            paddingHorizontal={'sp40'}
            paddingVertical={'sp10'}
            justifyContent={'center'}
            borderRadius={10}
            alignSelf={'center'}>
            {CreateUserNotificationApi.isLoading ? (
              <ActivityIndicator color="white" style={{height: 28}} />
            ) : (
              <>
                <NativeText
                  style={{
                    fontSize: 17,
                    color: 'white',
                    fontFamily: fonts.HelveticaRegular,
                  }}>
                  Next
                </NativeText>
                <Icon
                  source={Icons.ArrowRight}
                  svgProps={{
                    fill: 'white',
                    height: 17,
                    width: 17,
                  }}
                />
              </>
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.replace('Tabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'Home',
                },
              })
            }>
            <Text
              color={'black'}
              fontFamily={fonts.HelveticaBold}
              fontSize={16}
              textDecorationLine={'underline'}>
              Skip for now
            </Text>
          </Pressable>
        </View>
      </View>
    </Page>
  );
};

export default SetNotifications;
