import fonts from 'foundation/assets/fonts';
import { Icons } from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  FlatList,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import {colors} from 'foundation/theme/colors';
import React, {FC} from 'react';
import {Dimensions, Text as NativeText} from 'react-native';
import DeviceInfo from 'react-native-device-info';

type BottomButtonProps = {
  BottomButtonsData: {icon: any; title: string; onPress: () => void}[];
  loading: boolean;
  onLogoutPress: () => void;
};

const BottomButtons: FC<BottomButtonProps> = ({BottomButtonsData, loading, onLogoutPress,
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
    return loading ? (
      <CardViewSkeleton
        alignItems="flex-start"
        height={55}
        borderRadius={10}
        width={Dimensions.get('screen').width * 0.9}
      />
    ) : (
      <Pressable
        backgroundColor={'pink'}
        borderRadius={10}
        key={item.title + index}
        onPress={item.onPress}
        flexDirection={'row'}
        alignItems={'center'}
        paddingHorizontal={'sp12'}
        paddingVertical={'sp15'}
        gap={'sp16'}>
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
              color: colors.green,
              fontSize: 16,
              fontFamily: fonts.OpensansBold,
            }}>
            {item.title}
          </NativeText>
        </View>

        <Image source={IMAGES.shortRightArrow} height={14} width={14} />
        {item.title === 'Complete Profile' && (
          <View
            position={'absolute'}
            top={12}
            right={12}
            backgroundColor={'red'}
            height={5}
            width={5}
            borderRadius={40}
          />
        )}
      </Pressable>
    );
  };
  const keyExtractor = (item: {
    icon: any;
    title: string;
    onPress: () => void;
  }) => item.title.toString();

  return (
    <View width={'100%'}>
      <FlatList
        width={'100%'}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        data={BottomButtonsData}
        keyExtractor={keyExtractor}
        renderItem={renderBottomButtons}
        contentContainerStyle={{
          gap: 9,
        }}
        ListHeaderComponentStyle={{
          backgroundColor: 'white',
        }}
        ListHeaderComponent={
          loading ? (
            <View paddingBottom={'sp16'} width={'100%'}>
              <CardViewSkeleton
                height={23}
                alignItems="flex-start"
                width={Dimensions.get('screen').width * 0.4}
              />
            </View>
          ) : (
            <Text
              fontFamily={fonts.OpensansBold}
              fontSize={16}
              marginBottom={'sp12'}
              marginLeft={'sp2'}
              color={'newGray'}>
              Profile Information
            </Text>
          )
        }
      />
      <View alignItems={'center'} marginTop={'sp28'} gap={'sp8'}>
        <Pressable
          onPress={onLogoutPress}
          width={'75%'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'sp10'}
          backgroundColor={'green'}
          paddingVertical={'sp10'}
          justifyContent={'center'}
          borderRadius={10}>
          <Icon
            source={Icons.Logout}
            svgProps={{
              fill: colors.white,
              height: 15,
              width: 15,
            }}
          />
          <Text fontSize={14} fontFamily={fonts.OpensansBold}>
            Log Out
          </Text>
        </Pressable>
        <View marginTop={'sp4'} alignItems={'center'}>
          <Text
            color={'gray1'}
            fontFamily={fonts.OpensansRegular}
            fontSize={14}>
            App Version:{' '}
            {`${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BottomButtons;
