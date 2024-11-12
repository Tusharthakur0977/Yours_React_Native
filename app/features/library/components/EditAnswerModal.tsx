import {Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useUpdateAnswerApi} from 'foundation/services/ApiHooks';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, TextInput} from 'react-native';
import Modal from 'react-native-modal';
import {JournalData} from '../Library';
import fonts from 'foundation/assets/fonts';
import {ApiStatusCode} from 'foundation/services/constants';
import useKeyboardListeners from 'foundation/hooks/useKeyboardListeners';
import { useTranslation } from 'react-i18next';

type EditModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedQuestion: JournalData;
  formattedDateForModal: string;
  setRefreshQuestionList: Dispatch<SetStateAction<number>>;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
};

const EditAnswerModal: FC<EditModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  selectedQuestion,
  formattedDateForModal,
  setRefreshQuestionList,
  answer,
  setAnswer,
}) => {
  const { t } = useTranslation();
  const UpdateAnswerAPi = useUpdateAnswerApi();
  const textInputRef = useRef<TextInput>(null);
  const isKeyboardOpen = useKeyboardListeners();
  const [isSaveActive, setIsSaveActive] = useState(false);

  const handleUpdate = () => {
    UpdateAnswerAPi.mutateAsync({
      Journal_Date: formattedDateForModal,
      user_submitted_response: {
        id: selectedQuestion?.questionId?.toString()!,
        user_answer: answer,
      },
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setIsModalVisible(false);
          setRefreshQuestionList(Math.floor(Math.random() * 101));
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
        } else {
          toast(t('global.something_wrong'),
          toastType.ERROR_TOAST,
        );
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
          value={answer}
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
      onBackButtonPress={() => setIsModalVisible(false)}
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
        paddingBottom={'sp20'}
        bottom={Platform.OS === 'ios' && isKeyboardOpen ? '10%' : 0}
        gap={'sp28'}>
        <Text fontSize={20} fontFamily={fonts.HelveticaBold} color={'black'}>
          {selectedQuestion?.question}
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
            onPress={() => setIsModalVisible(!isModalVisible)}>
            <Text
              color={'green'}
              fontFamily={fonts.HelveticaRegular}
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
            onPress={handleUpdate}
            disabled={!isSaveActive}>
            {UpdateAnswerAPi.isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                color={'white'}
                fontFamily={fonts.HelveticaRegular}
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

export default EditAnswerModal;
