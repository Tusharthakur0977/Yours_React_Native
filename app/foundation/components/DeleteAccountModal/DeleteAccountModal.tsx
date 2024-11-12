import {Icons} from 'foundation/assets/icons';
import React, {Dispatch, FC, SetStateAction} from 'react';
import Modal from 'react-native-modal';
import {Icon, Pressable, Text, View} from '../kit';
import fonts from 'foundation/assets/fonts';

type DeleteModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
};

const DeleteAccountModal: FC<DeleteModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  onConfirm,
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
        paddingBottom={'sp20'}>
        <View
          alignSelf={'center'}
          backgroundColor={'red'}
          borderRadius={100}
          paddingHorizontal={'sp16'}
          paddingTop={'sp15'}
          paddingBottom={'sp16'}>
          <Icon
            source={Icons.AlertTriangle}
            svgProps={{
              width: 25,
              height: 25,
              fill: 'white',
            }}
          />
        </View>
        <Pressable
          position={'absolute'}
          right={15}
          top={15}
          onPress={() => setIsModalVisible(false)}>
          <Icon
            source={Icons.CloseIcon}
            svgProps={{
              width: 20,
              height: 20,
            }}
          />
        </Pressable>
        <View
          flexDirection={'row'}
          justifyContent={'space-between'}
          marginTop={'sp16'}
          alignItems={'center'}>
          <Text lineHeight={24} fontSize={18} fontFamily={fonts.OpensansBold} color={'black'}>
          Confirm Account Deletion
          </Text>
        </View>
        <View marginTop={'sp24'}>
        <Text
          color={'darkgray'}
          fontFamily={fonts.HelveticaRegular}
          fontSize={14}
          lineHeight={16}>
          You are about to delete your Account. You will lose all of your journal entries.This can not be reversed. Do you wish to continue?
        </Text>
        </View>
        <View flexDirection={'row'} marginTop={'sp24'} gap={'sp10'} alignItems={'center'}>
          <Pressable
            borderRadius={10}
            flex={0.5}
            borderWidth={1}
            borderColor={'green'}
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={'sp8'}
            onPress={() => setIsModalVisible(!isModalVisible)}>
            <Text color={'green'} fontFamily={fonts.HelveticaRegular} fontSize={17}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            borderRadius={10}
            backgroundColor={'red'}
            flex={0.5}
            alignItems={'center'}
            paddingVertical={'sp8'}
            paddingHorizontal={'sp12'}
            onPress={onConfirm}>
            <Text numberOfLines={1} fontFamily={fonts.HelveticaRegular} color={'white'} fontSize={16}>
              Delete My Account
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
