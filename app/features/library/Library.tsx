import {useIsFocused} from '@react-navigation/native';
import fonts from 'foundation/assets/fonts';
import IMAGES from 'foundation/assets/images';
import {Image, Input, Page, Text, View} from 'foundation/components/kit';
import LibrarySkeleton from 'foundation/components/Skeleton/LibrarySkeleton';
import {useSearchLibrary} from 'foundation/services/ApiHooks';
import {colors} from 'foundation/theme/colors';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EditAnswerModal from './components/EditAnswerModal';
import EditRatingModal from './components/EditRatingModal';
import LibraryList from './components/LibraryList';

export type JournalData = {
  journal_Date: string;
  question: string;
  answer: string;
  questionId: string;
  type?: string;
  placeHolder?: string;
  Rating?: number | null;
};

const Library = () => {
  const isFocused = useIsFocused();
  const [searchedValue, setSearchedValue] = useState('');
  const [debouncedSearchedValue, setDebouncedSearchedValue] = useState('');

  const {data, isFetching, refetch} = useSearchLibrary(
    debouncedSearchedValue.trim().toLowerCase(),
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<JournalData>({
    answer: '',
    journal_Date: '',
    question: '',
    questionId: '',
    placeHolder: '',
    Rating: null,
  });

  const [answer, setAnswer] = useState<string>(selectedQuestion.answer || '');
  const [isAnswerModal, setIsAnswerModal] = useState(false);
  const [refreshQuestionList, setRefreshQuestionList] = useState(0);
  const formattedDateForModal = selectedQuestion.journal_Date.slice(0, 10);

  const [isRatingModal, setIsRatingModal] = useState(false);
  const [ratingAnswer, setRatingAnswer] = useState(
    selectedQuestion.answer || '',
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handlePress = (question: JournalData, index: number) => {
    const combinedId = `${question.questionId}-${question.journal_Date}${index}`;
    setExpandedId(expId => (expId === combinedId ? null : combinedId));
    setSelectedQuestion(question);
    setSelectedRating(Number(question.Rating));
    setAnswer(question.answer);
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setDebouncedSearchedValue(text);
    }, 1000), // Adjusted debounce time to 1000 ms
    [],
  );

  const handleSearch = (text: string) => {
    setSearchedValue(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    if (refreshQuestionList || isFocused) {
      refetch();
    }
    return () => {
      if (!isFocused) {
        setExpandedId(null);
      }
    };
  }, [refreshQuestionList, isFocused, refetch]);

  useEffect(() => {
    // Ensure the API is called when the search input is cleared
    refetch();
  }, [debouncedSearchedValue, refetch]);

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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          width: '100%',
        }}
        automaticallyAdjustKeyboardInsets>
        <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Image
            height={40}
            width={100}
            source={IMAGES.splash_logo}
            resizeMode="contain"
          />
        </View>
        <View
          backgroundColor={'pink'}
          paddingVertical={'sp28'}
          paddingHorizontal={'sp24'}
          gap={'sp10'}
          width={'100%'}>
          <Text
            fontSize={18}
            lineHeight={18}
            fontFamily={fonts.OpensansBold}
            color="black">
            Search Your Library
          </Text>
          <View zIndex={200}>
            <Input
              inputStyle={{color: 'black'}}
              style={{borderRadius: 10, fontSize: 16, color: colors.black}}
              placeholder="Type something."
              onChangeText={handleSearch}
              value={searchedValue}
            />
          </View>
        </View>
        <View paddingHorizontal={'sp20'} paddingVertical={'sp20'}>
          <Text color={'black'} fontFamily={fonts.OpensansBold} fontSize={18}>
            Your Library
          </Text>
        </View>
        <View width={'100%'} paddingHorizontal={'sp24'}>
          {isFetching ? (
            <LibrarySkeleton />
          ) : (
            <LibraryList
              expandedId={expandedId}
              handlePress={handlePress}
              libraryList={data?.data?.data}
              isAnswerModal={isAnswerModal}
              setIsAnswerModal={setIsAnswerModal}
              setSelectedQuestion={setSelectedQuestion}
              setAnswer={setAnswer}
              selectedQuestion={selectedQuestion}
              setRefreshQuestionList={setRefreshQuestionList}
              searchedValue={searchedValue}
              setIsRatingModal={setIsRatingModal}
              setRatingAnswer={setRatingAnswer}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
      <EditAnswerModal
        isModalVisible={isAnswerModal}
        setIsModalVisible={setIsAnswerModal}
        selectedQuestion={selectedQuestion}
        formattedDateForModal={formattedDateForModal}
        setRefreshQuestionList={setRefreshQuestionList}
        answer={answer}
        setAnswer={setAnswer}
      />

      <EditRatingModal
        isModalVisible={isRatingModal}
        setIsModalVisible={setIsRatingModal}
        selectedQuestion={selectedQuestion}
        formattedDateForModal={formattedDateForModal}
        setRefreshQuestionList={setRefreshQuestionList}
        ratingAnswer={ratingAnswer}
        setRatingAnswer={setRatingAnswer}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
      />
    </Page>
  );
};

export default Library;
