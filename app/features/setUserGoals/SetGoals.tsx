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
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useCreateGoalsApi,
  useGetUserGoalsList,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Dimensions, Text as NativeText} from 'react-native';

export type GoalData = {
  goalText: string;
  is_checked: boolean;
  other_goals_text?: string;
};

const SetGoals = () => {
  const {t} = useTranslation();
  const navigation = useNav();

  const {data, isLoading} = useGetUserGoalsList();
  const CreateUserGOalsApi = useCreateGoalsApi();

  const [goalsData, setGoalsData] = useState<GoalData[]>(data?.data.data);

  const handleCheck = (goalText: string) => {
    const newData = goalsData.map(item => {
      if (item.goalText === goalText) {
        return {...item, is_checked: !item.is_checked};
      }
      return item;
    });
    setGoalsData(newData);
  };

  const handleCreateUserGoals = async () => {
    if (goalsData.every(item => item.is_checked === false)) {
      navigation.navigate('WelcomeStack', {screen: 'setNotification'});
    } else {
      const goalsChosen: number[] = [];

      goalsData.forEach((element, index) => {
        if (element.is_checked) {
          if (index < goalsData.length - 1) {
            goalsChosen.push(index); // Add index to goalsChosen if is_checked is true
          }
        }
      });

      CreateUserGOalsApi.mutateAsync({
        goals_choosen: goalsChosen,
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            navigation.replace('WelcomeStack', {screen: 'setNotification'});
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

  const renderGoals = ({item, index}: {item: GoalData; index: number}) => {
    return (
      <Pressable
        key={item.goalText + index.toString()}
        onPress={() => handleCheck(item.goalText)}
        flexDirection={'row'}
        borderColor={'gray2'}
        borderWidth={1}
        justifyContent={'space-between'}
        paddingHorizontal={'sp15'}
        paddingVertical={'sp16'}
        borderRadius={10}
        gap={'sp15'}
        alignItems={'center'}>
        <View flex={1}>
          <Text
            fontSize={16}
            fontFamily={fonts.HelveticaRegular}
            lineHeight={22}
            color={'black'}>
            {item.goalText}
          </Text>
        </View>
        <CheckBox
          value={item.is_checked}
          onChange={() => handleCheck(item.goalText)}
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

  const memoizedGoalList = useMemo(
    () => (
      <FlatList
        width={'100%'}
        data={goalsData?.slice(0, goalsData?.length - 1)}
        renderItem={renderGoals}
        keyExtractor={item => item.goalText.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 18,
          paddingHorizontal: 20,
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
    [goalsData],
  );

  useEffect(() => {
    setGoalsData(data?.data.data);
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
        marginTop={'sp24'}
        alignItems={'flex-start'}
        justifyContent={'center'}>
        <Text color={'black'} fontFamily={fonts.HelveticaBold} fontSize={24}>
          Set Your Goals
        </Text>
      </View>
      <View
        width={'100%'}
        flex={1}
        alignItems={'center'}
        justifyContent={'center'}
        paddingVertical={'sp12'}
        paddingBottom={'sp20'}
        gap={'sp20'}>
        <View
          paddingHorizontal={'sp20'}
          width={'100%'}
          alignItems={'flex-start'}
          justifyContent={'center'}
          gap={'sp10'}>
          <Text
            color={'black'}
            fontFamily={fonts.HelveticaRegular}
            fontSize={15}
            lineHeight={23}>
            Before we get started, select one or more goals you would like to
            accomplish.
          </Text>
          <Text
            color={'gray1'}
            fontFamily={fonts.HelveticaRegular}
            fontSize={13}
            lineHeight={13}>
            You can select more than one option:
          </Text>
        </View>
        {memoizedGoalList}
        <View
          width={'100%'}
          alignItems={'center'}
          gap={'sp20'}
          marginTop={'sp10'}
          alignSelf={'flex-end'}>
          <Pressable
            onPress={handleCreateUserGoals}
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
            {CreateUserGOalsApi.isLoading ? (
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
              navigation.replace('WelcomeStack', {screen: 'setNotification'})
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

export default SetGoals;
