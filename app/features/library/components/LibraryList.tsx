import {TextHighlight} from 'ar-react-native-text-highlight';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {
  CheckBox,
  FlatList,
  Icon,
  Pressable,
  SectionList,
  Text,
  View,
} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import {formatDate} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction, useMemo} from 'react';
import {JournalData} from '../Library';
import {ratings} from 'features/journalQuestion/components/RatingModal';

type LibraryListProps = {
  libraryList: JournalData[];
  handlePress: (item: JournalData, index: number) => void;
  expandedId: string | null;
  isAnswerModal: boolean;
  setIsAnswerModal: Dispatch<SetStateAction<boolean>>;
  setSelectedQuestion: Dispatch<SetStateAction<JournalData>>;
  setAnswer: Dispatch<SetStateAction<string>>;
  selectedQuestion: JournalData;
  setRefreshQuestionList: Dispatch<SetStateAction<number>>;
  searchedValue: string;
  setIsRatingModal: Dispatch<SetStateAction<boolean>>;
  setRatingAnswer: Dispatch<SetStateAction<string>>;
};

const transformData = (data: any) => {
  const grouped = data?.reduce(
    (acc: {[x: string]: any[]}, item: {journal_Date: string}) => {
      const date = item.journal_Date; // Simplify date to 'YYYY-MM-DD'
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {},
  );

  return grouped
    ? Object.keys(grouped).map(key => ({
        title: key,
        data: grouped[key],
      }))
    : [];
};

const emptyListView = () => (
  <View
    width={'100%'}
    gap={'sp10'}
    justifyContent={'center'}
    alignItems={'center'}
    paddingVertical={'sp120'}>
    <Icon source={Icons.NotePad} height={100} width={40} />
    <Text
      color={'gray1'}
      lineHeight={20}
      fontSize={20}
      fontFamily={fonts.HelveticaBold}>
      No Journal Found
    </Text>
  </View>
);

const LibraryList: FC<LibraryListProps> = ({
  libraryList,
  handlePress,
  expandedId,
  isAnswerModal,
  setIsAnswerModal,
  setSelectedQuestion,
  selectedQuestion,
  searchedValue,
  setIsRatingModal,
  setRatingAnswer,
}) => {
  const sections = useMemo(() => transformData(libraryList), [libraryList]);
  return (
    <SectionList
      sections={sections}
      nestedScrollEnabled={true}
      scrollEnabled={false}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      ListEmptyComponent={emptyListView}
      renderItem={({item, index}) => {
        const combinedId = `${item.questionId}-${item.journal_Date}${index}`;
        return (
          <Pressable
            onPress={() => handlePress(item, index)}
            borderColor={'green'}
            backgroundColor={item.is_answered ? 'pink' : 'white'}
            borderWidth={1}
            paddingHorizontal={'sp15'}
            paddingVertical={'sp20'}
            marginVertical={'sp10'}
            borderRadius={10}
            gap={'sp10'}>
            <View
              flexDirection={'row'}
              alignItems={'center'}
              gap={'sp10'}
              justifyContent={'space-between'}>
              <View flex={1}>
                <Text
                  color={'black'}
                  lineHeight={20}
                  fontFamily={fonts.OpensansBold}
                  fontSize={15.5}>
                  {item.question}
                </Text>
              </View>
              <View
                style={{
                  transform: [
                    {
                      rotate: expandedId === combinedId ? '180deg' : '0deg',
                    },
                  ],
                }}
                padding={'sp2'}
                borderRadius={100}
                alignItems={'center'}>
                <Icon
                  source={Icons.ExpandArrow}
                  svgProps={{
                    fill: 'white',
                    width: 20,
                    height: 20,
                  }}
                />
              </View>
            </View>

            {expandedId === combinedId &&
              (item.type === 'mcq' ? (
                <FlatList
                  data={item.answer}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        key={index}
                        alignItems={'center'}
                        flexDirection={'row'}
                        paddingVertical={'sp10'}>
                        <CheckBox disabled value={item?.is_checked} />
                        <View flex={1}>
                          <Text
                            fontFamily={fonts.HelveticaRegular}
                            fontSize={15}
                            lineHeight={23}
                            color={'black'}>
                            {item?.optionText}
                          </Text>
                          {item?.other_journaling_notification_text?.length >
                            0 && (
                            <Text
                              fontFamily={fonts.HelveticaRegular}
                              fontSize={13}
                              lineHeight={20}
                              color={'gray1'}>
                              {item?.other_journaling_notification_text}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) =>
                    item?.optionText?.toString() + index
                  }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: 'center',
                  }}
                />
              ) : (
                <View gap={'sp10'} justifyContent={'space-between'}>
                  <TextHighlight
                    text={item?.answer}
                    isSearchable
                    highlightedColor={colors.darkPink}
                    searchText={searchedValue}
                    style={{
                      fontSize: 15,
                      color: colors.black,
                      fontFamily: fonts.HelveticaRegular,
                    }}
                  />
                  {item.type === 'rating' && (
                    <View
                      flexDirection={'row'}
                      alignItems={'center'}
                      gap={'sp4'}>
                      <Text
                        color={'black'}
                        fontFamily={fonts.OpensansBold}
                        fontSize={15}>
                        Rating :-
                      </Text>
                      <Text
                        color={'black'}
                        fontFamily={fonts.OpensansRegular}
                        fontSize={15}>
                        {ratings[Number(item.Rating) - 1]?.title}
                      </Text>
                    </View>
                  )}
                  

                  {selectedQuestion.placeHolder !== '' && (
                    <Pressable
                      onPress={() => {
                        setSelectedQuestion(item);
                        if (item?.type === 'rating') {
                          setIsRatingModal(true);
                          setRatingAnswer(item.answer);
                        } else {
                          setIsAnswerModal(!isAnswerModal);
                        }
                      }}
                      alignItems={'flex-end'}>
                      <Text
                        color={'green'}
                        fontSize={16}
                        fontFamily={fonts.OpensansBold}
                        textDecorationLine={'underline'}
                        textDecorationColor={'green'}>
                        Edit
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
          </Pressable>
        );
      }}
      renderSectionHeader={({section: {title}}) => (
        <View
          style={{backgroundColor: '#EAFAF1'}}
          marginVertical={'sp8'}
          padding={'sp10'}
          borderRadius={10}
          width={'100%'}>
          <Text
            fontSize={17.5}
            fontFamily={fonts.OpensansBold}
            color={'darkgray'}>
            {formatDate(title)}
          </Text>
        </View>
      )}
    />
  );
};

export default LibraryList;
