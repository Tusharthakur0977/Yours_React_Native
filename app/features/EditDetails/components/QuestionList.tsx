import fonts from 'foundation/assets/fonts';
import IMAGES from 'foundation/assets/images';
import {Image, Pressable, Text, View} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {colors} from 'foundation/theme/colors';
import React, {FC} from 'react';
import {Dimensions, Text as NativeText} from 'react-native';

type QuestionListProps = {
  questionListData: {title: string; onPress: () => void; answer: string}[];
  loading: boolean;
  isCompleteProfile: boolean;
};

const QuestionList: FC<QuestionListProps> = ({
  questionListData,
  loading,
  isCompleteProfile,
}) => {
  return (
    <View gap={'sp6'} width={'100%'}>
      <View width={'100%'}>
        {loading ? (
          <CardViewSkeleton
            alignItems="flex-start"
            height={85}
            borderRadius={10}
            width={Dimensions.get('screen').width * 1}
          />
        ) : (
          <View gap={'sp4'}>
            <Text
              marginTop={'sp4'}
              fontFamily={fonts.OpensansBold}
              fontSize={17}
              color={'black'}>
              About You:-
            </Text>
            <Text
              fontFamily={fonts.OpensansBold}
              fontSize={13}
              marginTop={'sp4'}
              lineHeight={16}
              color={'gray1'}>
              {isCompleteProfile
                ? 'Let others know more about you, such as your birthday and where you live.'
                : 'Complete your profile by providing answers to these questions. Let others know more about you, such as your birthday and where you live.'}
            </Text>
          </View>
        )}
      </View>
      <View gap={'sp16'} marginTop={'sp8'} width={'100%'} alignItems={'center'}>
        {questionListData.map((question, index) => {
          return loading ? (
            <CardViewSkeleton
              key={index.toString()}
              alignItems="flex-start"
              height={85}
              borderRadius={10}
              width={Dimensions.get('screen').width}
            />
          ) : (
            <Pressable
              key={question.title + index.toString()}
              onPress={question.onPress}
              borderWidth={1}
              backgroundColor={!question?.answer?.trim() ? 'white' : 'pink'}
              borderRadius={10}
              borderColor={'gray2'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              paddingHorizontal={'sp10'}
              paddingVertical={'sp12'}
              gap={'sp10'}>
              <View flex={1}>
                <Text
                  color={'black'}
                  fontSize={15}
                  fontFamily={fonts.HelveticaRegular}>
                  {question.title}
                </Text>
                {question?.answer?.length > 0 && (
                  <NativeText
                    style={{
                      color: colors.gray1,
                      fontSize: 13,
                      lineHeight: 18,
                      fontFamily: fonts.HelveticaRegular,
                    }}>
                    {`${
                      question.answer.length > 80
                        ? question.answer.slice(0, 80) + '....'
                        : question.answer
                    }`}
                  </NativeText>
                )}
              </View>
              <Image source={IMAGES.shortRightArrow} height={14} width={14} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default QuestionList;
