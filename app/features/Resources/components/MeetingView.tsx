import React, {useMemo} from 'react';
import env_constants from 'internals/env/env_constants.json';
import {Pressable, ScrollView, Text, View} from 'foundation/components/kit';
import fonts from 'foundation/assets/fonts';
import {Linking} from 'react-native';
import {Text as NativeText} from 'react-native';
import { colors } from 'foundation/theme/colors';

const MeetingView = () => {
  const FindMeetingLinks = [
    {
      title: 'Find AA Meetings Near You',
      url: env_constants.MEETINGS_NEAR_YOU,
    },
    {
      title: 'Join an Online NA Meeting',
      url: env_constants.MEETINGS_NEAR_YOU,
    },
    {
      title: 'Join an AA Meeting Now',
      url: env_constants.JOIN_MEETINGS,
    },
    {
      title: 'Find a SMART Recovery Meeting Near You',
      url: env_constants.SMART_RECOVERY_MEET,
    },
    {
      title: 'Find a Recovery Dharma Meeting Near You',
      url: env_constants.RECOVERY_MEET,
    },
  ];

  const JournalInspirationLinks = [
    {
      title: 'How to Journal',
      url: env_constants.YOURS_CREATOR,
    },
    {
      title: '12-step Prayers from AA',
      url: env_constants.TWELVE_STEPS,
    },
  ];

  const renderMeetingCards = useMemo(() => {
    return FindMeetingLinks.map((card, index) => (
      <Pressable
        key={card.url + index.toString()}
        backgroundColor={index % 2 === 0 ? 'green' : 'white'}
        onPress={() => Linking.openURL(card.url)}
        flexDirection={'row'}
        alignItems={'center'}
        borderWidth={index % 2 === 0 ? 0 : 1.5}
        borderColor={'green'}
        paddingHorizontal={'sp12'}
        paddingVertical={'sp12'}
        borderRadius={10}
        gap={'sp6'}
        justifyContent={'center'}
        borderBottomColor={'darkgray'}>
        <NativeText
          style={{
            textAlign: 'center',
            color: index % 2 === 0 ? 'white' : colors.green,
            fontSize: 12.5,
            fontFamily: fonts.OpensansBold,
          }}>
          {card.title}
        </NativeText>
      </Pressable>
    ));
  }, [FindMeetingLinks]);

  const renderJournalInspiraitonCards = useMemo(() => {
    return JournalInspirationLinks.map((card, index) => (
      <Pressable
        key={card.url + index.toString()}
        backgroundColor={index % 2 === 0 ? 'purple' : 'white'}
        onPress={() => Linking.openURL(card.url)}
        flexDirection={'row'}
        alignItems={'center'}
        borderWidth={index % 2 === 0 ? 0 : 1.5}
        borderColor={'purple'}
        paddingHorizontal={'sp12'}
        paddingVertical={'sp12'}
        borderRadius={10}
        gap={'sp6'}
        borderBottomColor={'purple'}>
        <View flex={1}>
          <NativeText
            style={{
              textAlign: 'center',
              color: index % 2 === 0 ? 'white' : colors.darkpurple,
              fontSize: 12.5,
              fontFamily: fonts.OpensansBold,
            }}>
            {card.title}
          </NativeText>
        </View>
      </Pressable>
    ));
  }, [JournalInspirationLinks]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      width={'100%'}
      contentContainerStyle={{
        backgroundColor: colors.lightPink,
        paddingBottom: 100,
        gap: 20,
        alignItems: 'center',
      }}>
      <View width={'95%'} gap={'sp48'} marginTop={'sp32'}>
        <View paddingHorizontal={'sp24'} gap={'sp32'}>
          <Text
            textAlign={'center'}
            fontFamily={fonts.OpensansBold}
            fontSize={20}
            color={'green'}>
            Find a Meeting
          </Text>
          <View gap={'sp20'}>{renderMeetingCards}</View>
        </View>
        <View paddingHorizontal={'sp24'} gap={'sp32'}>
          <Text
            style={{color: '#7C5874'}}
            textAlign={'center'}
            fontFamily={fonts.OpensansBold}
            fontSize={20}>
            Get Journal Inspiration
          </Text>
          <View gap={'sp20'}>{renderJournalInspiraitonCards}</View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MeetingView;
