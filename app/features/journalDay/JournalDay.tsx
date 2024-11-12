import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  FlatList,
  Icon,
  Image,
  Page,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'foundation/components/kit';
import {WeekDayList} from 'foundation/seeds/JournalData';
import {colors} from 'foundation/theme/colors';
import {daysOfWeek, getLastDay} from 'foundation/utils/Helpers';
import React from 'react';
import {Text as NativeText} from 'react-native';

const JournalDay = () => {
  const navigation = useNav();
  const date = new Date();
  const currentDay = date.getDay();
  const dayName = daysOfWeek[currentDay];

  const renderItem = ({item, index}: {item: string; index: number}) => {
    const colorsArray = [colors.lightPink, 'white', colors.green, 'white'];
    const colorIndex = index % 4;
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('JournalStart', {date: getLastDay(item)})
        }
        style={{
          backgroundColor: colorsArray[colorIndex],
        }}
        width={'100%'}
        alignItems={'center'}
        paddingHorizontal={'sp20'}
        paddingVertical={'sp24'}
        justifyContent={'center'}
        opacity={index > currentDay ? 0.25 : 1}
        disabled={index > currentDay}
        borderColor={'green'}
        alignSelf={'center'}>
        <NativeText
          style={{
            color: colorIndex === 2 ? 'white' : colors.green,
            fontFamily: fonts.OpensansBold,
            fontSize: 16,
          }}>
          {item}
        </NativeText>
      </Pressable>
    );
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
            navigation.navigate('Profile', {
              previousRoute: 'journal',
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
        }}>
        <View
          width={'100%'}
          paddingHorizontal={'sp24'}
          paddingVertical={'sp40'}>
          <Text
            textAlign={'center'}
            fontFamily={fonts.OpensansBold}
            fontSize={24}
            color={'green'}>
            Weekly Entries
          </Text>
        </View>
        <FlatList
          width={'100%'}
          nestedScrollEnabled={true}
          scrollEnabled={false}
          data={WeekDayList}
          renderItem={renderItem}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </Page>
  );
};

export default JournalDay;
