import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Icon, Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import useKeyboardListeners from 'foundation/hooks/useKeyboardListeners';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import {useUpdateUserProfile} from 'foundation/services/ApiHooks';
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
import { useTranslation } from 'react-i18next';
import {ActivityIndicator, Platform, TextInput} from 'react-native';
import Modal from 'react-native-modal';

type QuestionModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  modalQuestionData: {
    index: string;
    title: string;
  };
  questionValue: string;
  setQuestionValue: Dispatch<SetStateAction<string>>;
  setRefreshUserData: Dispatch<SetStateAction<number>>;
};

const QuestionModal: FC<QuestionModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  modalQuestionData,
  questionValue,
  setQuestionValue,
  setRefreshUserData,
}) => {
  const { t } = useTranslation();
  const textInputRef = useRef<TextInput>(null);
  const {setRefreshProfileScreen} = useRefreshContext();

  const isKeyboardOpen = useKeyboardListeners();
  const [error, setError] = useState<string | null>(null);

  const [isValueChanged, setIsValueChanged] = useState(false);

  const UpdateProfileApi = useUpdateUserProfile();

  const handleSave = () => {
    if (!isValueChanged) {
      setIsModalVisible(false);
      return;
    }
    if (!questionValue.trim()) {
      setError('Please add your answer');
      return;
    }
    const payload = {
      [modalQuestionData.index]: questionValue,
    };

    UpdateProfileApi.mutateAsync({
      user_submitted_qa: payload,
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setIsModalVisible(false);
          setRefreshUserData(Math.floor(Math.random() * 101));
          setRefreshProfileScreen(Math.floor(Math.random() * 101));
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

  const renderTextInput = useMemo(
    () => (
      <View gap={'sp10'}>
        <TextInput
          ref={textInputRef}
          value={questionValue}
          onChangeText={text => {
            setQuestionValue(text);
            setError('');
            setIsValueChanged(true);
          }}
          multiline
          numberOfLines={15}
          placeholderTextColor={'black'}
          placeholder="My Answer is...."
          style={{
            width: '100%',
            color: colors.black,
            fontFamily: fonts.OpensansRegular,
            height: 230,
            fontSize: 13,
            textAlignVertical: 'top',
          }}
        />
      </View>
    ),
    [questionValue, setQuestionValue, error],
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
      backdropOpacity={0.7}
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
        backgroundColor={'white'}
        borderRadius={10}
        paddingHorizontal={'sp15'}
        paddingVertical={'sp15'}
        bottom={Platform.OS === 'ios' && isKeyboardOpen ? '12%' : 0}
        gap={'sp10'}>
        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Pressable
            onPress={() => {
              setIsModalVisible(!isModalVisible);
              setIsValueChanged(false);
            }}>
            <Icon
              source={Icons.CloseIcon}
              svgProps={{
                height: 25,
                width: 25,
              }}
            />
          </Pressable>
          {questionValue.trim().length > 1 && (
            <Pressable onPress={handleSave}>
              {UpdateProfileApi.isLoading ? (
                <ActivityIndicator color={'black'} />
              ) : (
                <Icon
                  source={Icons.BlackCheckIcon}
                  svgProps={{
                    height: 25,
                    width: 25,
                  }}
                />
              )}
            </Pressable>
          )}
        </View>
        <View
          gap={'sp10'}
          padding={'sp15'}
          borderRadius={10}
          borderWidth={0.4}
          borderColor={'black'}>
          <Text
            fontSize={15}
            lineHeight={18}
            fontFamily={fonts.OpensansBold}
            color={'black'}>
            {modalQuestionData.title}
          </Text>
          {renderTextInput}
        </View>
      </View>
    </Modal>
  );
};

export default QuestionModal;
