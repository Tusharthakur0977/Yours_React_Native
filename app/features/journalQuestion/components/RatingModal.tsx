import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Icon, Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
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
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, Platform, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {Question} from '../JournalQuestions';
import { useTranslation } from 'react-i18next';

type RatingModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedQuestion: Question | any;
  setRefreshQuestionList: Dispatch<SetStateAction<number>>;
  ratingAnswer: any;
  setRatingAnswer: Dispatch<SetStateAction<any>>;
  formattedDateForModal: string;
  setSelectedRating: Dispatch<SetStateAction<number | null>>;
  selectedRating: number | null;
};

export const ratings = [
  {id: 1, title: 'Not good'},
  {id: 2, title: 'Below average'},
  {id: 3, title: 'Neutral'},
  {id: 4, title: 'Good'},
  {id: 5, title: 'Great'},
];

const RatingModal: FC<RatingModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  selectedQuestion,
  setRefreshQuestionList,
  ratingAnswer,
  setRatingAnswer,
  formattedDateForModal,
  selectedRating,
  setSelectedRating,
}) => {
  const { t } = useTranslation();
  const SaveAnswerAPi = useSaveAnswerApi();
  const UpdateAnswerAPi = useUpdateAnswerApi();
  const textInputRef = useRef<TextInput>(null);

  const [isSaveActive, setIsSaveActive] = useState(false);

  // Define a callback function to handle cross icon press
  const handleCrossIconPress = useCallback(() => {
    setIsModalVisible(!isModalVisible); // Toggle the modal visibility state
    setSelectedRating(null); // Reset selected rating state
  }, [isModalVisible, setIsModalVisible, setSelectedRating]);

  const handleSave = () => {
    SaveAnswerAPi.mutateAsync({
      Journal_Date: formattedDateForModal,
      user_submitted_response: {
        id: selectedQuestion?.questionIndex?.toString()!,
        user_answer: ratingAnswer,
        user_rating: selectedRating!,
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

  const handleUpdate = () => {
    UpdateAnswerAPi.mutateAsync({
      Journal_Date: formattedDateForModal,
      user_submitted_response: {
        id: selectedQuestion?.questionIndex?.toString()!,
        user_answer: ratingAnswer,
        user_rating: selectedRating!,
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
    setRatingAnswer(text);
    setIsSaveActive(text.trim().length >= 2); // Activate save button when there are 2 or more characters
  };

  const renderTextInput = useMemo(
    () => (
      <View gap={'sp10'}>
        <TextInput
          ref={textInputRef}
          value={ratingAnswer!.toString()}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={8}
          placeholder={selectedQuestion?.placeHolder}
          placeholderTextColor={colors.gray1}
          style={{
            color: colors.black,
            backgroundColor: colors.lightGreen,
            borderRadius: 5,
            fontSize: 14,
            fontFamily: fonts.HelveticaRegular,
            height: 130,
            borderColor: 'green',
            borderWidth: 0.4,
            paddingHorizontal: 10,
            paddingTop: 12,
            textAlignVertical: 'top',
          }}
        />
      </View>
    ),
    [selectedQuestion, ratingAnswer],
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
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => {
        setIsModalVisible(false);
        setSelectedRating(null);
      }}
      animationOut={'fadeOutDown'}
      style={{
        flex: 1,
        marginHorizontal: 0,
        marginVertical: 0,
      }}>
      <View
        width={'100%'}
        flex={1}
        borderRadius={15}
        paddingHorizontal={'sp20'}
        backgroundColor={'white'}
        paddingTop={'sp20'}>
        <Pressable
          onPress={handleCrossIconPress}
          style={{
            marginTop: Platform.OS === 'ios' ? 28 : 4,
          }}>
          <Icon source={Icons.CloseIcon} height={24} width={24} />
        </Pressable>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            gap: 20,
          }}
          style={{
            width: '100%',
          }}
          automaticallyAdjustKeyboardInsets>
          <View flexDirection={'row'} marginTop={'sp20'} alignItems={'center'}>
            <View flex={1}>
              <Text
                fontSize={19}
                fontFamily={fonts.OpensansBold}
                color={'black'}>
                {selectedQuestion?.QuestionText || selectedQuestion?.question}
              </Text>
            </View>
          </View>

          {renderTextInput}

          <View width={'100%'} gap={'sp15'}>
            <Text
              color={'black'}
              fontFamily={fonts.OpensansBold}
              textAlign={'left'}
              fontSize={16}>
              Feel free to rate your experience.
            </Text>
            <View gap={'sp12'}>
              {ratings.map((item, index) => {
                return (
                  <Pressable
                    flexDirection={'row'}
                    alignItems={'center'}
                    borderRadius={10}
                    padding={'sp15'}
                    borderWidth={selectedRating === item.id ? 0 : 0.5}
                    bg={selectedRating === item.id ? 'lightPink' : 'white'}
                    key={item.id.toString()}
                    onPress={() => {
                      setSelectedRating(item.id);
                      setIsSaveActive(true);
                    }}>
                    <Text
                      color={'black'}
                      fontFamily={fonts.OpensansRegular}
                      textAlign={'left'}
                      fontSize={16}
                      marginRight={'sp8'}>
                      {index + 1}.
                    </Text>
                    <View flex={1}>
                      <Text
                        color={'black'}
                        fontFamily={fonts.OpensansRegular}
                        textAlign={'left'}
                        fontSize={16}>
                        {item.title}
                      </Text>
                    </View>
                    <View
                      height={20}
                      width={20}
                      borderRadius={50}
                      borderWidth={selectedRating === item.id ? 6 : 2}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Pressable
            width={'100%'}
            borderRadius={10}
            marginTop={'sp12'}
            backgroundColor={
              ratingAnswer.trim() && !!selectedRating ? 'green' : 'greyLight'
            }
            alignItems={'center'}
            minHeight={45}
            justifyContent={'center'}
            paddingHorizontal={'sp12'}
            onPress={() =>
              selectedQuestion?.is_answered ? handleUpdate() : handleSave()
            }
            disabled={!isSaveActive && selectedRating === null}>
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
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

export default RatingModal;
