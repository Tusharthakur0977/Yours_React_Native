import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {FlatList, Icon, Pressable, Text, View} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import React, {FC} from 'react';
import {Text as NativeText} from 'react-native';

type BottomButtonProps = {
  BottomButtonsData: {icon: any; title: string; onPress: () => void}[];
  onDeletePress: () => void;
};

const BottomButtons: FC<BottomButtonProps> = ({
  BottomButtonsData,
  onDeletePress,
}) => {
  const renderBottomButtons = ({
    item,
    index,
  }: {
    item: {
      icon: any;
      title: string;
      onPress: () => void;
    };
    index: number;
  }) => {
    return (
      <Pressable
        key={item.title + index}
        onPress={item.onPress}
        flexDirection={'row'}
        alignItems={'center'}
        paddingHorizontal={'sp12'}
        paddingVertical={'sp15'}
        borderRadius={10}
        gap={'sp6'}
        borderBottomColor={'darkgray'}
        borderBottomWidth={index === BottomButtonsData.length - 1 ? 0 : 0.3}>
        <Icon
          source={item.icon}
          svgProps={{
            fill: colors.green,
            height: 20,
            width: 20,
          }}
        />
        <View flex={1}>
          <NativeText
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: fonts.HelveticaRegular,
            }}>
            {item.title}
          </NativeText>
        </View>
        <Icon
          source={index === 0 ? Icons.ShareRounded : Icons.OpenPopup}
          svgProps={{
            fill: colors.green,
            height: 20,
            width: 20,
          }}
        />
      </Pressable>
    );
  };
  const keyExtractor = (item: {
    icon: any;
    title: string;
    onPress: () => void;
  }) => item.title.toString();

  return (
    <View flex={1} width={'100%'} justifyContent={'space-between'} gap={'sp24'}>
      <FlatList
        width={'100%'}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        data={BottomButtonsData}
        keyExtractor={keyExtractor}
        renderItem={renderBottomButtons}
        contentContainerStyle={{
          backgroundColor: '#F4F4F4',
          borderRadius: 10,
          paddingHorizontal: 6,
        }}
      />
      <View alignItems={'center'} marginTop={'sp24'} gap={'sp10'}>
        <Pressable
          style={{
            backgroundColor: '#F4F4F4',
          }}
          width={'100%'}
          onPress={onDeletePress}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'sp10'}
          paddingVertical={'sp10'}
          justifyContent={'center'}
          borderRadius={10}>
          <Icon
            source={Icons.Denied}
            svgProps={{
              fill: colors.white,
              height: 22,
              width: 22,
            }}
          />
          <Text fontSize={14} color={'red'} fontFamily={fonts.OpensansBold}>
            Delete Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BottomButtons;
