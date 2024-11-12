import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {
  CheckBox,
  FlatList,
  Icon,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useSaveAnswerApi,
  useUpdateAnswerApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';
import {Question} from '../JournalQuestions';
import BouncingView from './BounceView';
import {useTranslation} from 'react-i18next';

type QuestionListProps = {
  currentQuestionStep: number;
  QuestionListData: Question[];
  setSelectedQuestion: Dispatch<SetStateAction<Question>>;
  setIsAnswerModal: Dispatch<SetStateAction<boolean>>;
  setAnswer: Dispatch<SetStateAction<number[] | string>>;
  currenDate: string;
  setRefreshQuestionList: Dispatch<SetStateAction<number>>;
  questionsToShow: any;
  setIsRatingModal: Dispatch<SetStateAction<boolean>>;
  setRatingAnswer: Dispatch<SetStateAction<number[] | string>>;
  setSelectedRating: Dispatch<SetStateAction<number | null>>;
};
export const originalQuestionIndex = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
  [11, 12, 13],
  [14, 15],
];

const QuestionList: FC<QuestionListProps> = ({
  currentQuestionStep,
  QuestionListData,
  setSelectedQuestion,
  setIsAnswerModal,
  setAnswer,
  currenDate,
  setRefreshQuestionList,
  questionsToShow,
  setIsRatingModal,
  setRatingAnswer,
  setSelectedRating,
}) => {
  const {t} = useTranslation();
  const SaveAnswerAPi = useSaveAnswerApi();
  const UpdateAnswerAPi = useUpdateAnswerApi();

  const [selectedOptions, setSelectedOptions] = useState<any>(
    questionsToShow[0].AnswerText,
  );

  const completedQuestions = QuestionListData.filter(item => item.is_answered);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheck = (optionText: string) => {
    const newData = selectedOptions.map(
      (item: {optionText: string; is_checked: boolean}) => {
        if (item.optionText === optionText) {
          return {...item, is_checked: !item.is_checked};
        }
        return item;
      },
    );
    setSelectedOptions(newData);
  };

  const saveOptionList = (is_Answered: boolean) => {
    const checkedIndices: number[] = [];
    selectedOptions.forEach((item: any, index: number) => {
      if (item.is_checked) {
        checkedIndices.push(index);
      }
    });

    if (checkedIndices.length === 0) {
      toast(
        "Whoops! It looks like you haven't selected an answer. Please choose at least one option before saving.",
        toastType.ERROR_TOAST,
      );
      return;
    }

    if (is_Answered) {
      UpdateAnswerAPi.mutateAsync({
        Journal_Date: currenDate,
        user_submitted_response: {
          id: originalQuestionIndex[currentQuestionStep][0].toString(),
          user_answer: checkedIndices,
        },
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setIsExpanded(false);
            setRefreshQuestionList(Math.floor(Math.random() * 101));
          }
        })
        .catch(err => {
          if (err.response.data.error) {
            toast(err.response.data.message, toastType.ERROR_TOAST);
          } else {
            toast(t('global.something_wrong'), toastType.ERROR_TOAST);
          }
        });
    } else {
      SaveAnswerAPi.mutateAsync({
        Journal_Date: currenDate,
        user_submitted_response: {
          id: originalQuestionIndex[currentQuestionStep][0].toString(),
          user_answer: checkedIndices,
        },
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setIsExpanded(false);
            setRefreshQuestionList(Math.floor(Math.random() * 101));
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

  const renderEditButton = (item: Question, index: number) => {
    const hasRatingProperty = 'Rating' in item;

    const editButton = (
      <Pressable
        onPress={() => {
          setSelectedQuestion({
            AnswerText: item.AnswerText || '',
            is_answered: item.is_answered,
            QuestionText: item.QuestionText,
            questionIndex: originalQuestionIndex[currentQuestionStep][index],
            placeHolder: item.placeHolder,
          });
          if (hasRatingProperty) {
            setIsRatingModal(true);
            setRatingAnswer(item.AnswerText || '');
            setSelectedRating(Number(item.Rating));
          } else {
            setIsAnswerModal(true);
            setAnswer(item.AnswerText || '');
          }
        }}
        alignItems={'center'}>
        <Text
          fontSize={12}
          fontFamily={fonts.HelveticaBold}
          color={'green'}
          textDecorationLine={'underline'}
          textDecorationColor={'green'}>
          Edit
        </Text>
      </Pressable>
    );

    const addButton = (
      <Pressable
        onPress={() => {
          setSelectedQuestion({
            AnswerText: item.AnswerText || '',
            is_answered: item.is_answered,
            QuestionText: item.QuestionText,
            questionIndex: originalQuestionIndex[currentQuestionStep][index],
            placeHolder: item.placeHolder,
          });
          if (hasRatingProperty) {
            setIsRatingModal(true);
            setRatingAnswer(item.AnswerText || '');
          } else {
            setIsAnswerModal(true);
            setAnswer(item.AnswerText || '');
          }
        }}
        backgroundColor={'green'}
        padding={'sp2'}
        borderRadius={100}>
        <Icon
          source={Icons.PluseIcon}
          svgProps={{
            fill: colors.white,
            width: 10,
            height: 10,
          }}
        />
      </Pressable>
    );

    return item.is_answered ? editButton : addButton;
  };

  const renderQuestion = ({item, index}: {item: Question; index: number}) => {
    return (
      <View
        borderColor={'green'}
        backgroundColor={item.is_answered ? 'pink' : 'white'}
        borderWidth={1}
        borderRadius={10}
        paddingHorizontal={'sp15'}
        paddingBottom={isExpanded ? 'sp20' : 'sp2'}>
        <Pressable
          onPress={() => {
            if (originalQuestionIndex[currentQuestionStep][index] === 14) {
              setSelectedQuestion({
                AnswerText: item.AnswerText || '',
                is_answered: item.is_answered,
                QuestionText: item.QuestionText,
                questionIndex:
                  originalQuestionIndex[currentQuestionStep][index],
              });
              setSelectedOptions(item.AnswerText);
              setIsExpanded(!isExpanded);
            }
          }}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'sp10'}
          paddingTop={'sp20'}
          paddingBottom={isExpanded ? 'sp2' : 'sp20'}
          justifyContent={'space-between'}>
          <View flex={1}>
            <Text
              color={'black'}
              fontFamily={fonts.OpensansBold}
              fontSize={15.5}
              lineHeight={20}
              key={index}>
              {item.QuestionText}
            </Text>
          </View>
          {originalQuestionIndex[currentQuestionStep][index] === 14 ? (
            <View padding={'sp2'} borderRadius={100} alignItems={'center'}>
              <Icon
                source={Icons.ExpandArrow}
                svgProps={{
                  fill: colors.red,
                  width: 20,
                  height: 20,
                }}
              />
            </View>
          ) : (
            renderEditButton(item, index)
          )}
        </Pressable>
        {currentQuestionStep === 4 &&
          originalQuestionIndex[currentQuestionStep][index] === 14 &&
          selectedOptions &&
          isExpanded && (
            <FlatList
              data={item.AnswerText}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    onPress={() => handleCheck(item?.optionText)}
                    key={index}
                    alignItems={'center'}
                    flexDirection={'row'}
                    paddingVertical={'sp10'}>
                    <CheckBox
                      onChange={() => handleCheck(item?.optionText)}
                      value={selectedOptions[index]?.is_checked}
                    />
                    <View flex={1}>
                      <Text
                        fontFamily={fonts.HelveticaRegular}
                        fontSize={15}
                        lineHeight={20}
                        color={'black'}>
                        {item?.optionText}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
              }}
              extraData={selectedOptions}
              ListHeaderComponent={
                <View
                  marginTop={'sp10'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}>
                  <BouncingView />
                  <Pressable onPress={() => saveOptionList(item.is_answered)}>
                    <Text
                      textDecorationLine={'underline'}
                      color={'green'}
                      fontSize={13}
                      lineHeight={13}
                      fontFamily={fonts.HelveticaBold}>
                      Save
                    </Text>
                  </Pressable>
                </View>
              }
              ListFooterComponent={() =>
                currentQuestionStep === 4 &&
                originalQuestionIndex[currentQuestionStep][index] === 14 ? (
                  <Pressable
                    marginTop={'sp20'}
                    alignSelf={'center'}
                    width={130}
                    borderRadius={10}
                    backgroundColor={'green'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={45}
                    paddingHorizontal={'sp12'}
                    onPress={() => saveOptionList(item.is_answered)}>
                    {UpdateAnswerAPi.isLoading || SaveAnswerAPi.isLoading ? (
                      <ActivityIndicator color={'white'} />
                    ) : (
                      <Text color={'white'} fontSize={18}>
                        Save
                      </Text>
                    )}
                  </Pressable>
                ) : null
              }
            />
          )}
      </View>
    );
  };

  return (
    <View gap={'sp10'}>
      <Text color={'black'} fontFamily={fonts.OpensansBold} fontSize={17}>
        {completedQuestions.length}/{QuestionListData.length} Completed
      </Text>
      <FlatList
        data={questionsToShow}
        renderItem={renderQuestion}
        keyExtractor={item => item.QuestionText.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 15,
        }}
        style={{
          height: Dimensions.get('screen').height * 0.43,
        }}
        extraData={selectedOptions}
      />
    </View>
  );
};

export default QuestionList;
