import {RouteProp, useRoute} from '@react-navigation/native';
import Dayjs from 'dayjs';
import {HomeStackParams} from 'features/navigation/RouteParamTypes';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  Button,
  CheckBox,
  FlatList,
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useAddSingleNotificationApi} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface MCQData {
  optionText: string;
  is_checked: boolean;
}

const WeeklyNotification = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const route = useRoute<RouteProp<HomeStackParams, 'WeeklyNotification'>>();
  const textInputRef = useRef<TextInput>(null);
  const otherTextInputRef = useRef<TextInput>(null);

  const SaveAnswerAPi = useAddSingleNotificationApi();

  const [currentStep, setCurrentStep] = useState(0);
  const [firstQuestion, setFirstQuestion] = useState('');
  const [firstQuestionData, setFirstQuestionData] = useState<any>();

  const [secondQuestionData, setSecondQuestionData] = useState<any>();
  const [mcqData, setMcqData] = useState<MCQData[]>([]);
  const [otherOptionValue, setOtherOptionValue] = useState('');
  const [otherExpanded, setOtherExpanded] = useState(false);

  const renderTextInput = useMemo(
    () => (
      <TextInput
        ref={textInputRef}
        value={firstQuestion}
        autoFocus
        onChangeText={setFirstQuestion}
        multiline
        numberOfLines={20}
        placeholderTextColor={colors.gray1}
        placeholder={firstQuestionData?.placeHolder}
        style={{
          width: '100%',
          color: colors.black,
          height: 330,
          fontFamily: fonts.HelveticaRegular,
          textAlignVertical: 'top',
        }}
      />
    ),
    [firstQuestion, setFirstQuestion, firstQuestionData, textInputRef],
  );

  const saveFirstQuestion = () => {
    const date = Dayjs(firstQuestionData.journal_Date).format('YYYY-MM-DD');
    if (!firstQuestion.toString().trim()) {
      toast('Please add your answer', toastType.ERROR_TOAST);
    } else {
      SaveAnswerAPi.mutateAsync({
        Journal_Date: date.toString(),
        notification_type: 'WEEKLY_INTENTION',
        user_submitted_response: {
          id: '0',
          user_answer: firstQuestion,
        },
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setFirstQuestion('');
            setCurrentStep(1);
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

  const handleCheck = (mcqText: string) => {
    const newData = mcqData.map((item: MCQData) => {
      if (item.optionText === mcqText) {
        return {...item, is_checked: !item.is_checked};
      }
      return item;
    });

    setMcqData(newData);
  };

  const saveSecondQuestion = () => {
    const goalsChosen: number[] = [];

    mcqData.forEach((element, index) => {
      if (element.is_checked) {
        goalsChosen.push(index); // Add index to goalsChosen if is_checked is true
      }
    });

    if (otherOptionValue?.length > 0) {
      goalsChosen.push(mcqData.length - 1);
    }

    const date = Dayjs(firstQuestionData.journal_Date).format('YYYY-MM-DD');
    if (goalsChosen.length === 0) {
      toast('Please select a answer', toastType.ERROR_TOAST);
    } else {
      SaveAnswerAPi.mutateAsync({
        Journal_Date: date.toString(),
        notification_type: 'WEEKLY_INTENTION',
        user_submitted_response: {
          id: '1',
          user_answer: goalsChosen,
        },
        other_journaling_notification_text: otherOptionValue,
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setFirstQuestion('');
            navigation.replace('Tabs', {
              screen: 'HomeStack',
              params: {
                screen: 'Home',
              },
            });
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

  const renderMcqs = ({item, index}: {item: MCQData; index: number}) => {
    return item.optionText !== 'Other' ? (
      <View
        flexDirection={'row'}
        key={item.optionText + index}
        borderColor={'gray2'}
        borderWidth={1}
        paddingHorizontal={'sp15'}
        paddingVertical={'sp16'}
        borderRadius={10}
        alignItems={'center'}
        gap={'sp10'}>
        <CheckBox
          value={item.is_checked}
          onChange={() => handleCheck(item.optionText)}
        />
        <Pressable
          onPress={() => handleCheck(item.optionText)}
          flexDirection={'row'}
          flex={1}
          alignItems={'center'}>
          <Text
            fontSize={15}
            fontFamily={fonts.HelveticaRegular}
            lineHeight={20}
            color={'black'}>
            {item.optionText}
          </Text>
        </Pressable>
      </View>
    ) : (
      <View gap={'sp10'} marginVertical={'sp10'}>
        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          paddingRight={'sp10'}>
          <Text
            fontSize={16}
            fontFamily={fonts.HelveticaRegular}
            lineHeight={23}
            color={'black'}>
            {item.optionText}
          </Text>
          <Pressable
            onPress={() => {
              setOtherExpanded(!otherExpanded);
            }}>
            <Icon
              source={Icons.ExpandArrow}
              svgProps={{
                fill: colors.red,
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        </View>
        {otherExpanded && (
          <TextInput
            ref={otherTextInputRef}
            value={otherOptionValue}
            onChangeText={setOtherOptionValue}
            multiline
            numberOfLines={5}
            placeholderTextColor={colors.gray1}
            placeholder="My Answer is...."
            style={{
              color: colors.black,
              fontFamily: fonts.HelveticaRegular,
              textAlignVertical: 'top',
              borderWidth: 0.4,
              padding: 10,
              height: 150,
              borderColor: colors.green,
              borderRadius: 10,
            }}
          />
        )}
      </View>
    );
  };

  const memoizedMcqList = useMemo(
    () =>
      mcqData && (
        <FlatList
          nestedScrollEnabled={true}
          scrollEnabled={true}
          data={mcqData}
          renderItem={renderMcqs}
          keyExtractor={item => item.optionText.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View
              alignItems={'center'}
              justifyContent={'center'}
              marginTop={'sp10'}>
              <Button
                label="Submit"
                onPress={saveSecondQuestion}
                loading={SaveAnswerAPi.isLoading}
                loaderColor={colors.white}
              />
            </View>
          }
          contentContainerStyle={{
            gap: 20,
          }}
          style={{marginTop: 8}}
        />
      ),
    [mcqData, otherOptionValue, otherExpanded, otherTextInputRef],
  );

  useEffect(() => {
    setFirstQuestionData(JSON.parse(route?.params?.questions!)[0]);
    setFirstQuestion(JSON.parse(route?.params?.questions!)[0]?.answer);
    setSecondQuestionData(
      JSON.stringify(JSON.parse(route.params?.questions!)[1]),
    );
    setMcqData(JSON.parse(route.params?.questions!)[1]?.answer);
    setOtherOptionValue(
      JSON.parse(route.params?.questions!)[1]?.answer[
        JSON.parse(route.params?.questions!)[1]?.answer.length - 1
      ]?.other_journaling_notification_text,
    );
    textInputRef?.current?.focus();
  }, [route.params]);

  useEffect(() => {
    if (otherExpanded) {
      otherTextInputRef.current?.focus();
    }

    return () => {
      otherTextInputRef.current?.blur();
    };
  }, [otherExpanded]);

  return (
    <Page
      scrollable={false}
      backgroundColor={'white'}
      paddingHorizontal={'sp20'}
      safeAreaBackgroundColor="white"
      justifyContent={'space-between'}
      paddingBottom={'sp96'}
      height={Dimensions.get('screen').height}
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Image
          height={40}
          width={100}
          source={IMAGES.splash_logo}
          resizeMode="contain"
        />
        <Pressable
          position={'absolute'}
          left={0}
          onPress={() => {
            if (currentStep === 1) {
              setCurrentStep(currentStep - 1);
            } else {
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate('Tabs', {
                    screen: 'HomeStack',
                    params: {screen: 'Home'},
                  });
            }
          }}>
          <Icon
            source={Icons.ArrowLeftDark}
            svgProps={{
              height: 25,
              width: 25,
            }}
          />
        </Pressable>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          // flexGrow: 1,
          paddingBottom: 100,
          gap: 50,
        }}
        style={{
          width: '100%',
        }}
        automaticallyAdjustKeyboardInsets>
        {currentStep === 0 ? (
          <>
            <View
              gap={'sp10'}
              padding={'sp15'}
              borderRadius={10}
              borderWidth={0.4}
              borderColor={'black'}>
              <Text
                fontSize={16}
                lineHeight={16}
                fontFamily={fonts.HelveticaBold}
                color={'black'}>
                {firstQuestionData?.question}
              </Text>
              {renderTextInput}
            </View>
            <View flexDirection={'row'} gap={'sp10'} alignItems={'center'}>
              <Pressable
                borderRadius={10}
                flex={0.5}
                borderWidth={1}
                borderColor={'green'}
                alignItems={'center'}
                justifyContent={'center'}
                paddingVertical={'sp10'}
                onPress={() => setCurrentStep(1)}>
                <Text
                  fontFamily={fonts.HelveticaRegular}
                  color={'green'}
                  fontSize={18}>
                  Skip
                </Text>
              </Pressable>
              <Pressable
                borderRadius={10}
                backgroundColor={'green'}
                flex={0.5}
                alignItems={'center'}
                paddingVertical={'sp10'}
                paddingHorizontal={'sp12'}
                onPress={saveFirstQuestion}>
                <Text
                  color={'white'}
                  fontFamily={fonts.HelveticaRegular}
                  fontSize={18}>
                  Next
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View width={'98%'}>
            <Text
              fontSize={16}
              lineHeight={16}
              fontFamily={fonts.HelveticaBold}
              color={'black'}>
              {secondQuestionData?.question}
            </Text>
            {memoizedMcqList}
          </View>
        )}
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default WeeklyNotification;
