import {useNav} from 'features/navigation/useNav';
import {NotificationData} from 'features/SetNotification/SetNotifications';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  Divider,
  FlatList,
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useGetUserNotificationList,
  useUpdateNotificationApi,
  useUpdatenotificationTimeApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import {
  convertTimeStringToDate,
  convertTo12Hour,
} from 'foundation/utils/Helpers';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import DatePicker from 'react-native-date-picker';
import * as RNLocalize from 'react-native-localize';
import ToggleSwitch from 'toggle-switch-react-native';

const Notifications = () => {
  const {t} = useTranslation();
  const navigation = useNav();

  const {data, isFetching, refetch} = useGetUserNotificationList();
  const UpdateUserNotification = useUpdateNotificationApi();
  const UpdateNotificationtime = useUpdatenotificationTimeApi();

  const [notificationData, setNotificationData] = useState<NotificationData[]>(
    data?.data.data,
  );
  const [timePicker, setTimePicker] = useState(false);

  const [selectedNotificationTime, setSelectedNotificationTime] = useState<any>(
    new Date(),
  );
  const [selectedNotificationData, setSelectedNotificationData] = useState({
    index: 0,
    is_checked: false,
    notificationText: '',
  });

  const handleCheck = (notificationText: string) => {
    const checkedIndices: number[] = [];

    const newData = notificationData.map(item => {
      if (item.notificationText === notificationText) {
        return {...item, is_checked: !item.is_checked};
      }
      return item;
    });

    setNotificationData(newData);

    // add only enabled notification in check indeices
    newData.forEach((item, index) => {
      if (item.is_checked) {
        checkedIndices.push(index);
      }
    });

    UpdateUserNotification.mutateAsync({
      notification_choosen: checkedIndices,
      timezone: RNLocalize.getTimeZone(),
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          refetch();
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
        } else {
          toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        }
      });
  };

  const renderNotification = ({
    item,
    index,
  }: {
    item: NotificationData;
    index: number;
  }) => {
    return (
      <View
        style={{
          backgroundColor: '#F4F4F4',
        }}
        padding={'sp10'}
        borderRadius={10}
        gap={'sp10'}
        alignItems={'center'}
        key={item.notificationText + index}>
        <View gap={'sp4'} flexDirection={'row'} alignItems={'center'}>
          <View flex={1} flexDirection={'row'}>
            <Text
              fontSize={16}
              fontFamily={fonts.HelveticaRegular}
              lineHeight={16}
              color={'black'}>
              {item.notificationText}
            </Text>
          </View>
          <ToggleSwitch
            isOn={item.is_checked}
            onColor={colors.green}
            offColor="#AAAAAA"
            size="medium"
            onToggle={() => handleCheck(item.notificationText)}
          />
        </View>
        <Divider />
        <Pressable
          disabled={!item.is_checked}
          onPress={() => {
            if (item.is_checked) {
              setSelectedNotificationTime(
                convertTimeStringToDate(item.notificationTiming),
              );
              setSelectedNotificationData({
                index,
                is_checked: item.is_checked,
                notificationText: item.notificationText,
              });
              setTimePicker(true);
            }
          }}
          width={'100%'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          paddingVertical={'sp4'}>
          <Text
            fontSize={12}
            fontFamily={fonts.OpensansBold}
            lineHeight={16}
            color={item.is_checked ? 'black1' : 'gray2'}>
            Update Reminder Time:
          </Text>
          <View flexDirection={'row'} alignItems={'center'} gap={'sp4'}>
            <Text
              fontSize={12}
              fontFamily={fonts.OpensansBold}
              lineHeight={16}
              color={item.is_checked ? 'black1' : 'gray2'}>
              {convertTo12Hour(item.notificationTiming)}
            </Text>
            <Icon
              source={Icons.AngleRight}
              height={14}
              width={14}
              svgProps={{
                fill: item.is_checked ? colors.black : colors.gray2,
              }}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  const memoizedNotificationList = useMemo(
    () => (
      <FlatList
        width={'97%'}
        data={notificationData}
        renderItem={renderNotification}
        keyExtractor={item => item.notificationText.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View gap={'sp12'}>
            {Array.from({length: 6}).map((_, index) => (
              <CardViewSkeleton
                key={`skeleton-${index}`}
                alignItems="flex-start"
                height={90}
                borderRadius={10}
                width={Dimensions.get('screen').width * 0.9}
              />
            ))}
          </View>
        }
        contentContainerStyle={{
          gap: 15,
        }}
      />
    ),
    [notificationData, selectedNotificationTime, timePicker, isFetching],
  );

  const handleUpdateTime = (
    newTime: string,
    data: {
      index: number;
      is_checked: boolean;
      notificationText: string;
    },
  ) => {
    UpdateNotificationtime.mutateAsync({
      user_preferred_notification_timings: [
        {notificationId: data.index, preferredTime: newTime},
      ],
      timezone: RNLocalize.getTimeZone(),
    })
      .then(res => {
        if (!data.is_checked) {
          handleCheck(data.notificationText);
        } else {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            refetch();
          }
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
        } else {
          toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        }
      });
  };

  useEffect(() => {
    setNotificationData(data?.data.data);
  }, [data?.data]);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'space-between'}
      alignItems={'center'}
      backgroundColor={'white'}
      paddingHorizontal={'sp20'}
      safeAreaBackgroundColor="white"
      paddingBottom={'sp10'}
      gap={'sp20'}
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Image
          height={40}
          width={100}
          source={IMAGES.splash_logo}
          resizeMode="contain"
        />
        <Pressable
          left={0}
          position={'absolute'}
          zIndex={100}
          onPress={() => navigation.goBack()}>
          <Icon
            source={Icons.ArrowLeftDark}
            svgProps={{
              height: 20,
              width: 20,
            }}
          />
        </Pressable>
      </View>
      <View width={'97%'} justifyContent={'center'}>
        <Text
          color={'black'}
          fontFamily={fonts.OpensansBold}
          fontSize={18}
          lineHeight={20}
          textAlign={'left'}>
          Reminders
        </Text>
      </View>
      {memoizedNotificationList}
      <DatePicker
        date={selectedNotificationTime}
        mode="time"
        modal
        open={timePicker}
        onConfirm={pickerDate => {
          const hours = pickerDate.getHours();
          const minutes = pickerDate.getMinutes();
          const formattedMinutes = minutes;
          const newTime = `${hours}:${formattedMinutes}`;
          handleUpdateTime(newTime, selectedNotificationData);
          setTimePicker(false);
        }}
        onCancel={() => {
          setTimePicker(false);
        }}
      />
    </Page>
  );
};

export default Notifications;
