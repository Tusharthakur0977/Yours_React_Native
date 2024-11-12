import fonts from 'foundation/assets/fonts';
import {Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import useKeyboardListeners from 'foundation/hooks/useKeyboardListeners';
import {
  useSaveAnswerApi,
  useUpdateAnswerApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Platform, TextInput} from 'react-native';
import Modal from 'react-native-modal';
import {Question} from '../JournalQuestions';

type AnswerModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedQuestion: Question | any;
  formattedDateForModal: string;
  setRefreshQuestionList: Dispatch<SetStateAction<number>>;
  answer: any;
  setAnswer: Dispatch<SetStateAction<any>>;
  setIsFromAddIcon: Dispatch<SetStateAction<any>>;
};

const AnswerModal: FC<AnswerModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  selectedQuestion,
  formattedDateForModal,
  setRefreshQuestionList,
  answer,
  setAnswer,
  setIsFromAddIcon,
}) => {
  const {t} = useTranslation();
  const SaveAnswerAPi = useSaveAnswerApi();
  const UpdateAnswerAPi = useUpdateAnswerApi();
  const textInputRef = useRef<TextInput>(null);
  const isKeyboardOpen = useKeyboardListeners();
  const [isSaveActive, setIsSaveActive] = useState(false);

  const handleSave = () => {
    SaveAnswerAPi.mutateAsync({
      Journal_Date: formattedDateForModal,
      user_submitted_response: {
        id: selectedQuestion?.questionIndex?.toString()!,
        user_answer: answer,
      },
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setIsFromAddIcon(false);
          setIsModalVisible(false);
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
  };

  const handleUpdate = () => {
    UpdateAnswerAPi.mutateAsync({
      Journal_Date: formattedDateForModal,
      user_submitted_response: {
        id: selectedQuestion?.questionIndex?.toString()!,
        user_answer: answer,
      },
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setIsFromAddIcon(false);
          setIsModalVisible(false);
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
  };

  const handleTextChange = (text: string) => {
    setAnswer(text);
    setIsSaveActive(text.trim().length >= 2); // Activate save button when there are 2 or more characters
  };

  const renderTextInput = useMemo(
    () => (
      <View gap={'sp10'}>
        <TextInput
          ref={textInputRef}
          value={answer!.toString()}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={8}
          placeholder={selectedQuestion?.placeHolder}
          placeholderTextColor={colors.gray1}
          style={{
            width: '100%',
            color: colors.black,
            backgroundColor: colors.lightGreen,
            borderRadius: 5,
            fontSize: 14,
            fontFamily: fonts.HelveticaRegular,
            height: 150,
            borderColor: 'green',
            borderWidth: 0.4,
            paddingHorizontal: 10,
            paddingTop: 12,
            textAlignVertical: 'top',
          }}
        />
      </View>
    ),
    [selectedQuestion, answer],
  );

  return (
    <Modal
      onShow={() => {
        if (Platform.OS === 'ios') {
          textInputRef?.current?.focus();
        } else {
          setTimeout(() => {
            textInputRef?.current?.focus();
          }, 40);
        }
      }}
      isVisible={isModalVisible}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => {
        setIsModalVisible(false);
        setIsFromAddIcon(false);
      }}
      onBackdropPress={() => {
        setIsModalVisible(false);
        setIsFromAddIcon(false);
      }}
      animationOut={'fadeOutDown'}
      style={{
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
        alignItems: 'center',
      }}>
      <View
        width={'90%'}
        backgroundColor={'white'}
        borderRadius={10}
        paddingHorizontal={'sp20'}
        paddingTop={'sp20'}
        bottom={Platform.OS === 'ios' && isKeyboardOpen ? '10%' : 0}
        paddingBottom={'sp20'}
        gap={'sp20'}>
        <Text fontSize={19} fontFamily={fonts.OpensansBold} color={'black'}>
          {selectedQuestion?.QuestionText || selectedQuestion?.question}
        </Text>

        {renderTextInput}

        <View flexDirection={'row'} gap={'sp10'} alignItems={'center'}>
          <Pressable
            borderRadius={10}
            flex={0.5}
            borderWidth={1}
            borderColor={'green'}
            alignItems={'center'}
            justifyContent={'center'}
            minHeight={45}
            onPress={() => {
              setIsModalVisible(!isModalVisible);
              setIsFromAddIcon(false);
            }}>
            <Text
              fontFamily={fonts.HelveticaRegular}
              color={'green'}
              fontSize={18}>
              Finish Later
            </Text>
          </Pressable>
          <Pressable
            borderRadius={10}
            backgroundColor={isSaveActive ? 'green' : 'greyLight'}
            flex={0.5}
            alignItems={'center'}
            minHeight={45}
            justifyContent={'center'}
            paddingHorizontal={'sp12'}
            onPress={() =>
              selectedQuestion?.is_answered ? handleUpdate() : handleSave()
            }
            disabled={!isSaveActive}>
            {SaveAnswerAPi.isLoading || UpdateAnswerAPi.isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                fontFamily={fonts.HelveticaRegular}
                color={'white'}
                fontSize={18}>
                Save
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AnswerModal;
