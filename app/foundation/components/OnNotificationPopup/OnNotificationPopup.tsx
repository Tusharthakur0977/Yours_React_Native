import Dayjs from 'dayjs';
import fonts from 'foundation/assets/fonts';
import {Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import useKeyboardListeners from 'foundation/hooks/useKeyboardListeners';
import {useAddSingleNotificationApi} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Platform, TextInput} from 'react-native';
import Modal from 'react-native-modal';

type OnNotificationModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  question: string;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  routeParams: any;
};

const OnNotificationPopup: FC<OnNotificationModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  question,
  answer,
  setAnswer,
  routeParams,
}) => {
  const {t} = useTranslation();
  const SaveAnswerAPi = useAddSingleNotificationApi();
  const textInputRef = useRef<TextInput>(null);
  const isKeyboardOpen = useKeyboardListeners();
  const currentDate = Dayjs().format('YYYY-MM-DD');

  const handleSave = () => {
      SaveAnswerAPi.mutateAsync({
      Journal_Date: currentDate.toString(),
      notification_type: routeParams?.type!,
      user_submitted_response: {
        id: '0',
        user_answer: answer,
      },
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setAnswer('');
          setIsModalVisible(false);
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
          setIsModalVisible(false);
          setAnswer('');
        } else {
          toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        }
      });
  };

  const renderTextInput = useMemo(
    () => (
      <View gap={'sp10'}>
        <TextInput
          ref={textInputRef}
          value={answer!.toString()}
          onChangeText={text => {
            setAnswer(text);
          }}
          multiline
          numberOfLines={8}
          placeholder={routeParams.placeholder}
          placeholderTextColor={colors.gray1}
          style={{
            width: '100%',
            color: colors.black,
            backgroundColor: colors.lightGreen,
            borderRadius: 5,
            height: 220,
            borderColor: 'green',
            borderWidth: 0.4,
            paddingHorizontal: 10,
            paddingTop: 12,
            textAlignVertical: 'top',
          }}
        />
      </View>
    ),
    [answer, routeParams],
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
      backdropOpacity={0.8}
      backdropColor="white"
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
      onBackdropPress={() => setIsModalVisible(false)}
      animationOut={'fadeOutDown'}
      style={{
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
        alignItems: 'center',
      }}>
      <View
        width={'90%'}
        borderWidth={1}
        borderColor={'black'}
        backgroundColor={'white'}
        borderRadius={10}
        paddingHorizontal={'sp20'}
        paddingTop={'sp20'}
        bottom={Platform.OS === 'ios' && isKeyboardOpen ? '12%' : 0}
        paddingBottom={'sp20'}
        gap={'sp20'}>
        <Text fontSize={20} fontFamily={fonts.HelveticaBold} color={'black'}>
          {question}
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
              fontFamily={fonts.HelveticaRegular}
              color={'green'}
              fontSize={18}>
              Dismiss
            </Text>
          </Pressable>
          <Pressable
            borderRadius={10}
            backgroundColor={answer.trim().length >= 2 ? 'green' : 'greyLight'}
            flex={0.5}
            disabled={answer.trim().length <= 2}
            alignItems={'center'}
            minHeight={45}
            justifyContent={'center'}
            paddingHorizontal={'sp12'}
            onPress={handleSave}>
            {SaveAnswerAPi.isLoading ? (
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

export default OnNotificationPopup;
