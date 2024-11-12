import {RouteProp, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import {JournalStackParams} from 'features/navigation/RouteParamTypes';
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
import {JournalPoints, WeekDayList} from 'foundation/seeds/JournalData';
import {colors} from 'foundation/theme/colors';
import {formatDate} from 'foundation/utils/Helpers';
import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import DateMenu from './components/DateMenu';

const StartJournal = () => {
  const navigation = useNav();
  const route = useRoute<RouteProp<JournalStackParams>>();

  const initialDate = new Date(route.params?.date!);
  const [date, setDate] = useState(initialDate);

  const [openDatePicker, setOpenDatePicker] = useState(false);

  // Add this useEffect hook
  useEffect(() => {
    const newDate = new Date(route.params?.date!);
    setDate(newDate);
  }, [route.params?.date]);

  const dayOfWeek = WeekDayList[date.getDay()];
  const dayPoints = JournalPoints[date.getDay()];

  const [isDateMenu, setIsDateMenu] = useState(false);

  // Calculate the date one year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const getDateText = () => {
    return (
      dayOfWeek.charAt(0).toUpperCase() +
      dayOfWeek.slice(1).toLocaleLowerCase() +
      ', ' +
      formatDate(date).split(',')[0]
    );
  };

  const getTitle = () => {
    const today = dayjs().startOf('day');
    const initialDateDay = dayjs(date).startOf('day');

    if (initialDateDay.isSame(today, 'day')) {
      return "Today's Motivation";
    } else {
      return `YOUR ${
        dayOfWeek.charAt(0).toUpperCase() +
        dayOfWeek.slice(1).toLocaleLowerCase()
      } Motivation`;
    }
  };

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
                params: {
                  previousRoute: 'journal',
                },
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={'100%'}
        contentContainerStyle={{
          paddingBottom: 100,
          gap: 12,
        }}>
        <View
          width={'100%'}
          alignItems={'center'}
          paddingVertical={'sp30'}
          backgroundColor={'lightPink'}>
          <Pressable
            flexDirection={'row'}
            alignItems={'center'}
            gap={'sp4'}
            onPress={() => setIsDateMenu(true)}>
            <Text
              textAlign={'center'}
              color={'green'}
              fontSize={16}
              lineHeight={16}
              fontFamily={fonts.OpensansBold}>
              {getDateText()}
            </Text>
            <Icon
              marginBottom={'sp4'}
              source={Icons.ExpandArrow}
              svgProps={{
                width: 18,
                height: 18,
                color: colors.primary,
              }}
            />
          </Pressable>
          <DateMenu
            setDate={setDate}
            isDateMenu={isDateMenu}
            setIsDateMenu={setIsDateMenu}
            setOpenDatePicker={setOpenDatePicker}
          />
        </View>
        <View
          gap={'sp32'}
          marginTop={'sp48'}
          alignItems={'center'}
          paddingHorizontal={'sp20'}>
          <View width={'85%'} gap={'sp8'}>
            <Text
              textDecorationLine={'underline'}
              textAlign={'left'}
              color={'green'}
              fontFamily={fonts.OpensansBold}
              fontSize={20}>
              {getTitle()}
            </Text>
          </View>
          <View gap={'sp24'} width={'100%'} paddingHorizontal={'sp32'}>
            {dayPoints.map((_, index) => {
              return (
                <View
                  key={_ + index}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  gap={'sp15'}>
                  <Image
                    height={21}
                    width={21}
                    source={IMAGES.GreenTick}
                    resizeMode="contain"
                  />
                  <View flex={1}>
                    <Text
                      fontSize={16}
                      fontFamily={fonts.HelveticaRegular}
                      lineHeight={18}
                      color={'green'}>
                      {_}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View
            marginTop={'sp40'}
            gap={'sp24'}
            alignItems={'center'}
            width={'100%'}>
            <Text
              textAlign={'center'}
              color={'green'}
              fontFamily={fonts.HelveticaRegular}
              fontSize={18}>
              Ready to spend time with yourself?
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate('Tabs', {
                  screen: 'JournalStack',
                  params: {
                    screen: 'JournalQuestion',
                    params: {date: date.toString()},
                  },
                })
              }
              width={'60%'}
              paddingVertical={'sp12'}
              borderRadius={10}
              borderColor={'green'}
              flexDirection={'row'}
              backgroundColor={'green'}
              justifyContent={'center'}
              alignItems={'center'}
              gap={'sp10'}>
              <Image
                height={13}
                width={13}
                source={IMAGES.WhitePencil}
                resizeMode="contain"
              />
              <Text
                fontSize={13}
                color={'white'}
                fontFamily={fonts.OpensansBold}>
                Start Writing
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <DatePicker
        mode="date"
        title="Select Journal Date"
        modal
        open={openDatePicker}
        date={date ? date : new Date()}
        maximumDate={new Date()}
        onConfirm={pickerDate => {
          setOpenDatePicker(false);
          setDate(pickerDate);
          setIsDateMenu(false);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
        minimumDate={oneYearAgo}
      />
    </Page>
  );
};

export default StartJournal;
