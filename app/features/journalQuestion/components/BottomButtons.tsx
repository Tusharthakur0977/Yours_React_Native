import fonts from 'foundation/assets/fonts';
import {Pressable, Text, View} from 'foundation/components/kit';
import React, {Dispatch, FC, SetStateAction} from 'react';
import {Question} from '../JournalQuestions';

type BottomButtonProps = {
  currentQuestionStep: number;
  setCurrentQuestionStep: Dispatch<SetStateAction<number>>;
  QuestionListData: Question[];
  setIsConfirmModal: Dispatch<SetStateAction<boolean>>;
};

const BottomButtons: FC<BottomButtonProps> = ({
  currentQuestionStep,
  setCurrentQuestionStep,
  QuestionListData,
  setIsConfirmModal,
}) => {
  const completedQuestions = QuestionListData?.filter(item => item.is_answered);

  return (
    <View flexDirection={'row'} gap={'sp10'} alignItems={'center'}>
      {currentQuestionStep > 0 && (
        <Pressable
          borderRadius={10}
          flex={0.5}
          borderWidth={1}
          borderColor={'green'}
          alignItems={'center'}
          justifyContent={'center'}
          paddingVertical={'sp10'}
          onPress={() => setCurrentQuestionStep(currentQuestionStep - 1)}>
          <Text
            fontFamily={fonts.HelveticaRegular}
            color={'green'}
            fontSize={18}>
            Previous
          </Text>
        </Pressable>
      )}
      <Pressable
        borderRadius={10}
        backgroundColor={'green'}
        flex={currentQuestionStep > 0 ? 0.5 : 1}
        alignItems={'center'}
        paddingVertical={'sp10'}
        paddingHorizontal={'sp12'}
        onPress={() => {
          if (currentQuestionStep < 4) {
            setCurrentQuestionStep(currentQuestionStep + 1);
          } else {
            if (completedQuestions.length === QuestionListData.length) {
              setCurrentQuestionStep(currentQuestionStep + 1);
            } else {
              setIsConfirmModal(true);
            }
          }
        }}>
        <Text color={'white'} fontFamily={fonts.HelveticaRegular} fontSize={18}>
          {currentQuestionStep === 4 ? 'Finish' : 'Next'}
        </Text>
      </Pressable>
    </View>
  );
};

export default BottomButtons;
