import fonts from 'foundation/assets/fonts';
import {Pressable, ScrollView, Text, View} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import React, {useMemo} from 'react';
import {Linking, Text as NativeText} from 'react-native';

const RecoveryView = () => {
  const recoveryPrograms = [
    {
      id: 1,
      name: 'Alcoholics Anonymous (AA)',
      description:
        'Global peer-led mutual aid fellowship dedicated to abstinence-based recovery from alcoholism through its spiritually inclined 12-step program.',
      url: 'https://www.aa.org/',
    },
    {
      id: 2,
      name: 'Narcotics Anonymous (NA)',
      description:
        'Global peer-led mutual aid fellowship dedicated to abstinence-based recovery from narcotics through its spiritually inclined 12-step program.',
      url: 'https://na.org/',
    },
    {
      id: 3,
      name: 'SMART Recovery',
      description:
        'Peer-led, SMART stands for Self-Management and Recovery Training using self-empowering and evidence-informed tactics to recovery from drug and alcohol.',
      url: 'https://smartrecovery.org/?gad_source=1&gclid=CjwKCAjwx-CyBhAqEiwAeOcTdc2WdsGPbTNMXFLxr0WyQZQQVC2T4GJs-F7yGf-KsYcVNe46FgoJpxoCgeUQAvD_BwE',
    },
    {
      id: 4,
      name: 'Recovery Dharma',
      description:
        'Trauma-informed, empowered approach to recovery based on Buddhist principles.',
      url: 'https://recoverydharma.org/',
    },
  ];

  const renderRecoveryPrograms = useMemo(() => {
    return recoveryPrograms.map((card, index) => {
      return (
        <View
          paddingHorizontal={'sp20'}
          key={card.url + index.toString()}
          gap={'sp10'}
          alignItems={'flex-start'}>
          <Pressable onPress={() => Linking.openURL(card.url)}>
            <NativeText
              style={{
                textAlign: 'left',
                color: colors.green,
                fontSize: 14,
                fontFamily: fonts.OpensansBold,
                textDecorationLine: 'underline',
              }}>
              {card.name}
            </NativeText>
          </Pressable>
          <NativeText
            style={{
              textAlign: 'left',
              color: colors.green,
              fontSize: 13,
              fontFamily: fonts.HelveticaRegular,
            }}>
            {card.description}
          </NativeText>
        </View>
      );
    });
  }, [recoveryPrograms]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      width={'100%'}
      contentContainerStyle={{
        paddingBottom: 120,
        gap: 20,
        alignItems: 'center',
      }}>
      <View width={'88%'} gap={'sp40'} marginTop={'sp32'}>
        <View gap={'sp20'}>
          <Text
            textAlign={'center'}
            fontFamily={fonts.OpensansBold}
            fontSize={15}
            color={'green'}>
            Find a recovery path that works for you
          </Text>
          <Text
            lineHeight={20}
            textAlign={'center'}
            fontFamily={fonts.HelveticaRegular}
            fontSize={15}
            color={'green'}>
            Check out different recovery programs to find which one is the best
            fit for your needs.
          </Text>
        </View>
        <View gap={'sp20'}>{renderRecoveryPrograms}</View>
      </View>
    </ScrollView>
  );
};

export default RecoveryView;
