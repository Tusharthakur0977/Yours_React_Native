import {Icons} from 'foundation/assets/icons';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction} from 'react';
import Modal from 'react-native-modal';
import {Icon, Pressable, Text, TouchableOpacity, View} from '../kit';
import fonts from 'foundation/assets/fonts';

type ChooseImageModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  handleChooseImage: () => void;
  handleChooseCamera: () => void;
};

const ChoooseImageModal: FC<ChooseImageModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  handleChooseCamera,
  handleChooseImage,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.2}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
      animationOut={'fadeOutDown'}
      style={{flex: 1, marginHorizontal: 0, marginVertical: 0}}>
      <TouchableOpacity
        style={{flex: 1}}
        activeOpacity={1}
        onPress={() => setIsModalVisible(false)}
      />
      <View
        backgroundColor={'white'}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        paddingHorizontal={'sp20'}
        paddingTop={'sp20'}
        paddingBottom={'sp20'}
        gap={'sp16'}>
        <View
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Text fontFamily={fonts.OpensansBold} fontSize={18} color={'black'}>
            Choose Profile Picture
          </Text>
          <Pressable onPress={() => setIsModalVisible(false)}>
            <Icon
              source={Icons.CloseIcon}
              svgProps={{
                fill: colors.green,
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        </View>
        <View gap={'sp24'} flexDirection={'row'} alignItems={'center'}>
          <View alignItems={'center'} gap={'sp4'}>
            <Pressable
              onPress={handleChooseImage}
              alignItems={'center'}
              backgroundColor={'green'}
              borderRadius={90}
              padding={'sp16'}>
              <Icon
                source={Icons.ImageIcon}
                svgProps={{
                  fill: colors.white,
                  width: 21,
                  height: 21,
                }}
              />
            </Pressable>
            <Text fontFamily={fonts.OpensansRegular} fontSize={13} color={'black'}>
              Gallery
            </Text>
          </View>
          <View alignItems={'center'} gap={'sp4'}>
            <Pressable
              onPress={handleChooseCamera}
              alignItems={'center'}
              backgroundColor={'green'}
              borderRadius={100}
              padding={'sp16'}>
              <Icon
                source={Icons.CameraIcon}
                svgProps={{
                  fill: colors.white,
                  width: 21,
                  height: 21,
                }}
              />
            </Pressable>
            <Text fontFamily={fonts.OpensansRegular} fontSize={13} color={'black'}>
              Camera
            </Text>
          </View>
        </View>
        <View flexDirection={'row'} gap={'sp4'} alignItems={'center'}>
          <Text color={'black'} fontSize={14} fontFamily={fonts.OpensansBold}>
            Note* :
          </Text>
          <Text fontFamily={fonts.OpensansRegular} color={'darkgray'} fontSize={14}>
            Max Image Upload Size Allowed is 5MB
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ChoooseImageModal;
