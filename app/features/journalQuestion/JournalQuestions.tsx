import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import Dayjs from 'dayjs';
import {JournalStackParams} from 'features/navigation/RouteParamTypes';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import ConfirmModal from 'foundation/components/ConfirmModal/ConfirmModal';
import {
  Button,
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import Loader from 'foundation/components/Loader/Loader';
import OnNotificationPopup from 'foundation/components/OnNotificationPopup/OnNotificationPopup';
import {toast, toastType} from 'foundation/hooks/toastService';
import {WeekDayList} from 'foundation/seeds/JournalData';
import {
  useGetUserDetails,
  useGetUserQuestionsList,
} from 'foundation/services/ApiHooks';
import {formatDate} from 'foundation/utils/Helpers';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import AnswerModal from './components/AnswerModal';
import BottomButtons from './components/BottomButtons';
import BottomStepper from './components/BottomStepper';
import QuestionList, {originalQuestionIndex} from './components/QuestionList';
import RatingModal from './components/RatingModal';

export type Question = {
  QuestionText: string;
  is_answered: boolean;
  AnswerText: null | string | number[];
  questionIndex?: number;
  placeHolder?: string;
  Rating?: string;
};

const JournalQuestions = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const route = useRoute<RouteProp<JournalStackParams, 'JournalQuestion'>>();

  const [isNotificationPopUp, setIsNotificationPopUp] = useState(false);
  const [notificationAnswer, setNotificationAnswer] = useState('');

  const isFocused = useIsFocused();
  const date = new Date(route.params?.date!);
  const currentDate = Dayjs(date).format('YYYY-MM-DD');
  const GetUserDetailsAPi = useGetUserDetails();
  const GetQuestionList = useGetUserQuestionsList(currentDate);
  const dayOfWeek = WeekDayList[date.getDay()];

  const questionsPerStep = [4, 4, 3, 3, 2]; // Array indicating the number of questions per step
  const totalSteps = questionsPerStep.length;

  const [currentQuestionStep, setCurrentQuestionStep] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>({
    AnswerText: '',
    is_answered: false,
    QuestionText: '',
    questionIndex: 0,
    placeHolder: '',
    Rating: '',
  });

  const [answer, setAnswer] = useState<number[] | string>(
    selectedQuestion?.AnswerText || '',
  );
  const [isAnswerModal, setIsAnswerModal] = useState(false);
  const [refreshQuestionList, setRefreshQuestionList] = useState(0);

  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [isRatingModal, setIsRatingModal] = useState(false);
  const [ratingAnswer, setRatingAnswer] = useState(
    selectedQuestion?.AnswerText || '',
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isFromAddIcon, setIsFromAddIcon] = useState(false);

  // function retures QuestionTo show on each page
  const questionsToShow = useMemo(() => {
    const startIndex = questionsPerStep
      ?.slice(0, currentQuestionStep)
      .reduce((acc, num) => acc + num, 0);
    const endIndex = startIndex + questionsPerStep[currentQuestionStep];
    return GetQuestionList.data?.data.data.slice(startIndex, endIndex);
  }, [GetQuestionList.data, currentQuestionStep]);

  // render function for rendering Question card
  const renderQuestions = useCallback(
    () =>
      GetQuestionList.data && (
        <QuestionList
          currentQuestionStep={currentQuestionStep}
          QuestionListData={GetQuestionList.data?.data.data}
          setSelectedQuestion={setSelectedQuestion}
          setIsAnswerModal={setIsAnswerModal}
          setAnswer={setAnswer}
          setRefreshQuestionList={setRefreshQuestionList}
          currenDate={currentDate}
          questionsToShow={questionsToShow}
          setIsRatingModal={setIsRatingModal}
          setRatingAnswer={setRatingAnswer}
          setSelectedRating={setSelectedRating}
        />
      ),
    [
      GetQuestionList.data,
      questionsPerStep,
      setSelectedQuestion,
      currentQuestionStep,
      selectedQuestion,
      questionsToShow,
    ],
  );

  // function to render Bottom Stepper
  const renderBottomStepper = useMemo(() => {
    return (
      <BottomStepper
        totalSteps={totalSteps}
        currentQuestionStep={currentQuestionStep}
      />
    );
  }, [currentQuestionStep]);

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then()
      .catch(err => {
        toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        console.log(err.response.data, 'GET PROFILE API');
      });
  };

  useEffect(() => {
    if (refreshQuestionList) {
      Promise.all([GetQuestionList.refetch(), getUserDetails()])
        .then(() => {
          // Both API calls have been successfully completed
        })
        .catch(error => {
          // Handle errors
          console.error('Error:', error);
        });
    }
  }, [refreshQuestionList]);

  useEffect(() => {
    if (isFocused) {
      setIsFromAddIcon(route.params.isFromAddIcon || false);
      setIsNotificationPopUp(route.params.isFromNotification || false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFromAddIcon && GetQuestionList.data?.data.data.length > 0) {
      setSelectedQuestion({
        AnswerText: GetQuestionList.data?.data.data[0].AnswerText || '',
        is_answered: GetQuestionList.data?.data.data[0].is_answered,
        QuestionText: GetQuestionList.data?.data.data[0].QuestionText,
        questionIndex: originalQuestionIndex[0][0],
        placeHolder: GetQuestionList.data?.data.data[0].placeHolder,
      });
      setAnswer(GetQuestionList.data?.data.data[0]?.AnswerText || '');
    }
    if (isFromAddIcon) {
      setIsAnswerModal(true);
    }
  }, [isFromAddIcon, GetQuestionList.data]);

  const renderAnswerMOdal = useMemo(
    () =>
      GetQuestionList.data?.data && (
        <AnswerModal
          isModalVisible={isAnswerModal}
          setIsModalVisible={setIsAnswerModal}
          selectedQuestion={selectedQuestion}
          formattedDateForModal={currentDate}
          setRefreshQuestionList={setRefreshQuestionList}
          answer={answer}
          setAnswer={setAnswer}
          setIsFromAddIcon={setIsFromAddIcon}
        />
      ),
    [GetQuestionList, selectedQuestion, answer, currentDate, isAnswerModal],
  );

  return (
    <Page
      flex={1}
      scrollable={false}
      alignItems={'center'}
      backgroundColor={'white'}
      safeAreaBackgroundColor="white"
      paddingBottom={'sp96'}
      gap={'sp12'}
      width={'100%'}
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Pressable
          left={20}
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
        <Image
          height={40}
          width={100}
          source={IMAGES.splash_logo}
          resizeMode="contain"
        />
      </View>
      <View
        backgroundColor={'pink'}
        paddingVertical={'sp36'}
        paddingHorizontal={'sp32'}
        gap={'sp4'}
        width={'100%'}>
        <Text
          fontSize={19}
          lineHeight={20}
          fontFamily={fonts.OpensansBold}
          color="black">
          {dayOfWeek}
        </Text>
        <Text
          fontSize={19}
          lineHeight={20}
          fontFamily={fonts.HelveticaRegular}
          color="black">
          {formatDate(date)}
        </Text>
      </View>
      <View
        width={'100%'}
        gap={'sp20'}
        justifyContent={'space-between'}
        paddingHorizontal={'sp24'}
        marginBottom={'sp20'}>
        {currentQuestionStep <= 4 ? (
          renderQuestions()
        ) : (
          <View
            gap={'sp20'}
            marginTop={'sp32'}
            width={'100%'}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text
              color={'black'}
              fontSize={20}
              marginBottom={'sp16'}
              fontFamily={fonts.HelveticaBold}>
              {`Nice work, ${GetUserDetailsAPi?.data?.data?.data?.fullName}!`}
            </Text>
            <Image
              source={IMAGES.highFive}
              height={180}
              width={180}
              resizeMode="contain"
            />
            <Text
              fontFamily={fonts.HelveticaRegular}
              fontSize={17}
              lineHeight={24}
              color={'black'}
              marginTop={'sp20'}
              textAlign={'center'}>
              You’ve completed {''}
              <Text color={'black'} fontFamily={fonts.HelveticaBold}>
                {`${dayOfWeek}'s`.charAt(0).toUpperCase() +
                  `${dayOfWeek}'s`.slice(1).toLowerCase()}
              </Text>{' '}
              journal. Today is YOUR day—make it a great one!.
            </Text>

            <Button
              style={{marginTop: 20}}
              label="Go to Library"
              onPress={() => navigation.navigate('Library')}
            />
          </View>
        )}
      </View>
      {!GetQuestionList.isFetching && currentQuestionStep <= 4 && (
        <View width={'100%'} gap={'sp24'} paddingHorizontal={'sp24'}>
          <BottomButtons
            currentQuestionStep={currentQuestionStep}
            setCurrentQuestionStep={setCurrentQuestionStep}
            QuestionListData={GetQuestionList.data?.data.data}
            setIsConfirmModal={setIsConfirmModal}
          />
          {renderBottomStepper}
        </View>
      )}
      {GetQuestionList.isFetching && (
        <Loader iconBg="green" LoaderColor="white" />
      )}
      {renderAnswerMOdal}
      <RatingModal
        isModalVisible={isRatingModal}
        setIsModalVisible={setIsRatingModal}
        selectedQuestion={selectedQuestion}
        formattedDateForModal={currentDate}
        setRefreshQuestionList={setRefreshQuestionList}
        ratingAnswer={ratingAnswer}
        setRatingAnswer={setRatingAnswer}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
      />

      <ConfirmModal
        isModalVisible={isConfirmModal}
        setIsModalVisible={setIsConfirmModal}
        title="Finish Journal Later?"
        description="You can save your progress now and come back to finish your journal entry later. Do you want to save and continue later?"
        btnText="Save for now"
        onConfirm={() => {
          navigation.replace('JournalDay');
          setIsConfirmModal(false);
        }}
        leftBtnText={'Keep writing'}
      />
      <OnNotificationPopup
        isModalVisible={isNotificationPopUp}
        setIsModalVisible={setIsNotificationPopUp}
        answer={notificationAnswer}
        setAnswer={setNotificationAnswer}
        question={route.params?.question!}
        routeParams={route.params!}
      />
    </Page>
  );
};

export default JournalQuestions;
