import fonts from 'foundation/assets/fonts';
import {Image, Pressable, Text, View} from 'foundation/components/kit';
import React, {FC} from 'react';
import {Source} from 'react-native-fast-image';

export type CardData = {
  icon: Source;
  text: string;
  onPress: () => void;
  iconWidth?: number;  // Optional width for the icon
  iconHeight?: number; // Optional height for the icon
};

type DashboardCardProps = {
  data: CardData[];
};

const DashboardCards: FC<DashboardCardProps> = ({data}) => {
  const renderItem = (item: CardData, index: number) => (
    <Pressable
      key={item.text + index.toString()}
      onPress={item.onPress}
      width={'70%'}
      paddingVertical={'sp12'}
      borderRadius={10}
      borderColor={'green'}
      borderWidth={index === 1 ? 1 : 0}
      flexDirection={'row'}
      backgroundColor={index === 0 ? 'green' : 'white'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'sp10'}>
         <View
          style={{
            width: item.iconWidth || 20, 
            height: item.iconHeight || 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            height={item.iconHeight || 15} 
            width={item.iconWidth || 15} 
            source={item.icon}
            resizeMode="contain"
          />
        </View>
      <Text
        fontSize={13}
        color={index === 1 ? 'green' : 'white'}
        fontFamily={fonts.OpensansBold}>
        {item.text}
      </Text>
     
    </Pressable>
  );

  return (
    <View alignItems={'center'} gap={'sp10'}>
      {data.map((card, index) => renderItem(card, index))}
    </View>
  );
};

export default DashboardCards;
