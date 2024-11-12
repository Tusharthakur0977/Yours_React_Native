import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction} from 'react';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Pressable, Text, View} from '../kit';

type ConfirmModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  btnText: string;
  leftBtnText?: string;
  onConfirm: () => void;
  isCancelBtn?: boolean;
  isLoading?: boolean;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  title,
  description,
  btnText,
  leftBtnText = 'Cancel',
  onConfirm,
  isCancelBtn = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
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
        paddingHorizontal={'sp20'}
        paddingTop={'sp20'}
        paddingBottom={'sp20'}
        gap={'sp28'}>
        <View
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Text fontSize={20} fontFamily={fonts.OpensansBold} color={'black'}>
            {title}
          </Text>
          <Pressable onPress={() => setIsModalVisible(false)}>
            <Icon
              source={Icons.CloseIcon}
              svgProps={{
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        </View>
        <Text
          fontFamily={fonts.HelveticaRegular}
          fontSize={16}
          lineHeight={20}
          color={'black'}>
          {title === 'Log out'
            ? description.split('.')[0] +
              '\n' +
              description.split('.')[1].trim()
            : description}
        </Text>
        <View flexDirection={'row'} gap={'sp10'} alignItems={'center'}>
          <Pressable
            borderRadius={10}
            flex={0.5}
            borderWidth={1}
            borderColor={'green'}
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={isLoading ? 'sp12' : 'sp10'}
            onPress={() => setIsModalVisible(!isModalVisible)}>
            <Text color={'green'} fontSize={18}>
              {leftBtnText}
            </Text>
          </Pressable>

          <Pressable
            borderRadius={10}
            backgroundColor={'green'}
            flex={!isCancelBtn ? 1 : 0.5}
            alignItems={'center'}
            paddingVertical={'sp10'}
            paddingHorizontal={'sp12'}
            onPress={onConfirm}>
            {!isLoading ? (
              <View flex={1}>
                <ActivityIndicator size={'small'} color={colors.white} />
              </View>
            ) : (
              <Text
                fontFamily={fonts.HelveticaRegular}
                color={'white'}
                fontSize={18}>
                {btnText}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
