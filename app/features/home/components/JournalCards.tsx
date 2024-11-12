import fonts from 'foundation/assets/fonts';
import {Text, View} from 'foundation/components/kit';
import DashboardSkeleton from 'foundation/components/Skeleton/DashboardSkeleton';
import React, {FC} from 'react';

type JournalCardsProps = {
  journalData: {title: string; value: string}[];
  isLodaing: boolean;
};

const JournalCards: FC<JournalCardsProps> = ({journalData, isLodaing}) => {
  const renderItem = (item: {title: string; value: string}, index: number) =>
    isLodaing ? (
      <DashboardSkeleton key={item.title + index.toString()} />
    ) : (
      <View
        flex={1}
        key={item.title + index.toString()}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'sp8'}
        paddingVertical={'sp28'}
        style={{
          backgroundColor: index === 0 ? '#f8f1f4' : '#e6d7dd',
        }}>
        <Text
          fontSize={26}
          lineHeight={26}
          color={'green'}
          fontFamily={fonts.OpensansBold}>
          {item.value}
        </Text>
        <Text
          fontSize={16}
          lineHeight={18}
          color={'green'}
          fontFamily={fonts.OpensansBold}>
          {item.title}
        </Text>
      </View>
    );

  return (
    <View flexDirection={'row'} alignItems={'center'}>
      {journalData.map((card, index) => renderItem(card, index))}
    </View>
  );
};

export default JournalCards;
