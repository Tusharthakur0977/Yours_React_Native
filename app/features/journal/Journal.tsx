import {useIsFocused} from '@react-navigation/native';
import Dayjs from 'dayjs';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import IMAGES from 'foundation/assets/images';
import {Button, Image, Page, Text, View} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useGetUserDetails} from 'foundation/services/ApiHooks';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

const Journal = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const isFocused = useIsFocused();

  const GetUserDetailsAPi = useGetUserDetails();

  const currentDate = Dayjs().format('YYYY-MM-DD');

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then()
      .catch(err => {
        toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        console.log(err.response.data, 'GET PROFILE API');
      });
  };

  useEffect(() => {
    if (isFocused) getUserDetails();
    return () => {};
  }, [isFocused]);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'white'}
      safeAreaBackgroundColor="white"
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} flex={1} gap={'sp20'} paddingBottom={'sp96'}>
        <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Image
            height={40}
            width={100}
            source={IMAGES.splash_logo}
            resizeMode="contain"
          />
        </View>
        <View
          backgroundColor={'pink'}
          paddingVertical={'sp40'}
          paddingHorizontal={'sp32'}
          width={'100%'}>
          <Text
            fontSize={22}
            lineHeight={22}
            fontFamily={fonts.HelveticaBold}
            color="black">
            Your Journal
          </Text>
        </View>

        <View gap={'sp48'} flex={0.8} justifyContent={'space-between'}>
          <View width={'95%'} padding={'sp20'} alignItems={'center'}>
            <Text
              fontFamily={fonts.HelveticaBold}
              fontSize={18}
              color={'black'}>
              Hey {GetUserDetailsAPi.data?.data.data.fullName},
            </Text>
            <Text
              fontFamily={fonts.HelveticaRegular}
              fontSize={18}
              lineHeight={18}
              color={'black'}>
              Welcome to Your Journal
            </Text>
          </View>
          <View alignItems={'center'} gap={'sp4'}>
            <Text
              fontFamily={fonts.HelveticaRegular}
              fontSize={16}
              color={'black'}>
              You have completed
            </Text>
            <View
              backgroundColor={
                GetUserDetailsAPi.isLoading ? 'transparent' : 'pink'
              }
              paddingHorizontal={'sp12'}
              paddingVertical={'sp6'}
              borderRadius={10}>
              {GetUserDetailsAPi.isLoading ? (
                <CardViewSkeleton height={30} width={200} />
              ) : (
                <Text
                  fontFamily={fonts.HelveticaBold}
                  fontSize={18}
                  color={'black'}>
                  {GetUserDetailsAPi.data?.data.data.journalEntries} journal
                  entries
                </Text>
              )}
            </View>
          </View>
          <View gap={'sp10'}>
            <Text
              textAlign={'center'}
              color={'black'}
              fontFamily={fonts.HelveticaRegular}
              fontSize={18}>
              Are you ready to get started today?
            </Text>
            <Button
              marginHorizontal={'sp32'}
              borderRadius={10}
              label="Let’s get started"
              onPress={() => {
                navigation.navigate('Tabs', {
                  screen: 'JournalStack',
                  params: {screen: 'JournalDay'},
                });
              }}
            />
          </View>
        </View>
      </View>
    </Page>
  );
};

export default Journal;
