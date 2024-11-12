import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  CheckBox,
  FlatList,
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {
  useCreateGoalsApi,
  useGetUserGoalsList,
  useUpdateGoalsApi,
} from 'foundation/services/ApiHooks';
import React, {useEffect, useMemo, useState} from 'react';
import CustomGoal from './components/CustomGoal';
import {GoalData} from 'features/setUserGoals/SetGoals';
import {toast, toastType} from 'foundation/hooks/toastService';
import {ApiStatusCode} from 'foundation/services/constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions, Keyboard} from 'react-native';
import {useTranslation} from 'react-i18next';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';

const Goals = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const UpdateUserGoalsApi = useUpdateGoalsApi();
  const CreateUserGOalsApi = useCreateGoalsApi();

  const {setRefreshProfileScreen} = useRefreshContext();

  const {data, isFetching, refetch} = useGetUserGoalsList();
  const [goalsData, setGoalsData] = useState<GoalData[]>(data?.data.data || []);
  const [refreshGoals, setRefreshGoals] = useState(0);

  const handleCheck = (goalText: string) => {
    const isFirstTimeAnswered = !goalsData.some(element => element.is_checked);

    const newData = goalsData.map(item => {
      if (item.goalText === goalText) {
        return {...item, is_checked: !item.is_checked};
      }
      return item;
    });

    setGoalsData(newData);

    const goalsChosen: number[] = [];

    newData.forEach((element, index) => {
      if (element.is_checked) {
        goalsChosen.push(index); // Add index to goalsChosen if is_checked is true
      }
    });

    const apiCall = isFirstTimeAnswered
      ? CreateUserGOalsApi
      : UpdateUserGoalsApi;

    apiCall
      .mutateAsync(
        newData[newData.length - 1].other_goals_text
          ? {
              goals_choosen: goalsChosen,
              other_goals_text:
                newData[newData.length - 1]?.other_goals_text || '',
            }
          : {
              goals_choosen: goalsChosen,
            },
      )
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setRefreshGoals(Math.floor(Math.random() * 101));
        }
      })
      .catch(err => {
        if (err.response?.data?.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
        } else {
          toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        }
        setRefreshGoals(Math.floor(Math.random() * 101));
      })
      .finally(() => {
        setRefreshProfileScreen(Math.floor(Math.random() * 101));
      });
  };

  const renderGoals = ({item, index}: {item: GoalData; index: number}) => {
    return (
      <View
        flexDirection={'row'}
        key={item.goalText + index}
        borderColor={'gray2'}
        borderWidth={1}
        paddingHorizontal={'sp15'}
        paddingVertical={'sp16'}
        borderRadius={10}
        alignItems={'center'}
        gap={'sp10'}>
        <Pressable
          onPress={() => handleCheck(item.goalText)}
          flexDirection={'row'}
          flex={1}
          alignItems={'center'}>
          <Text
            fontSize={15}
            fontFamily={fonts.HelveticaRegular}
            lineHeight={20}
            color={'black'}>
            {item.goalText}
          </Text>
        </Pressable>
        <CheckBox
          disabled={isFetching}
          value={item.is_checked}
          onChange={() => handleCheck(item.goalText)}
          borderRadius={5}
          width={19}
          height={19}
          iconWidth={13}
          iconHeight={13}
          marginRight={false}
        />
      </View>
    );
  };

  const renderFooterComponent = useMemo(() => {
    const otherGoalsData = data?.data.data[data.data.data.length - 1];
    return (
      goalsData && (
        <CustomGoal
          otherGoalData={otherGoalsData}
          goalsData={goalsData}
          setRefreshGoals={setRefreshGoals}
        />
      )
    );
  }, [data?.data, goalsData, refreshGoals]);

  const memoizedGoalList = useMemo(
    () => (
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={goalsData?.slice(0, -1)}
        renderItem={renderGoals}
        keyboardShouldPersistTaps="always"
        keyExtractor={item => item.goalText.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
        }}
        style={{marginTop: 8}}
        ListFooterComponent={renderFooterComponent}
        ListEmptyComponent={
          <View gap={'sp12'}>
            {Array.from({length: 8}).map((_, index) => (
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
    [goalsData, isFetching],
  );

  useEffect(() => {
    if (refreshGoals) {
      refetch();
    }
  }, [refreshGoals]);

  useEffect(() => {
    if (data?.data.data) {
      setGoalsData(data.data.data);
    }
  }, [data?.data]);

  return (
    <Page
      flex={1}
      backgroundColor={'white'}
      paddingHorizontal={'sp20'}
      safeAreaBackgroundColor="white"
      paddingBottom={'sp10'}
      scrollable={false}
      showsVerticalScrollIndicator={false}>
      <View
        marginBottom={'sp40'}
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}>
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 20,
          paddingBottom: Keyboard.isVisible() ? 0 : 100,
        }}
        style={{
          width: '100%',
        }}
        automaticallyAdjustKeyboardInsets>
        <View width={'98%'} justifyContent={'center'}>
          <Text
            color={'black'}
            fontFamily={fonts.OpensansBold}
            fontSize={18}
            lineHeight={20}
            textAlign={'left'}>
            Goals
          </Text>

          <Text
            color={'black'}
            marginTop={'sp4'}
            fontFamily={fonts.HelveticaRegular}
            fontSize={13}
            lineHeight={20}
            textAlign={'left'}>
            What brings you to YOURS? Why are you here?
          </Text>
        </View>
        <View width={'98%'}>{memoizedGoalList}</View>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default Goals;
