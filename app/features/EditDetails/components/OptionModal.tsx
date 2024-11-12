import fonts from 'foundation/assets/fonts';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'foundation/components/kit';
import React, {FC} from 'react';
import {Platform} from 'react-native';
import Modal from 'react-native-modal';

type OptionModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  title: string;
  onSelectUpdate: () => void;
  onSelectRemove: () => void;
};

const OptionModal: FC<OptionModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  onSelectUpdate,
  onSelectRemove,
}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.2}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
      animationOut={'slideOutDown'}
      style={{flex: 1, marginHorizontal: 0, marginVertical: 0}}>
      <TouchableOpacity
        style={{flex: 1}}
        activeOpacity={0.5}
        onPress={() => setIsModalVisible(false)}
      />
      <View
        backgroundColor={'transparent'}
        paddingBottom={Platform.OS === 'ios' ? 'sp20' : 'sp10'}
        alignItems={'center'}
        paddingHorizontal={'sp8'}
        gap={'sp6'}>
        <View
          width={'100%'}
          borderRadius={10}
          style={{backgroundColor: '#efefef'}}>
          <View
            justifyContent={'center'}
            paddingVertical={'sp15'}
            alignItems={'center'}>
            <Text
              fontSize={15}
              lineHeight={16}
              fontFamily={fonts.HelveticaRegular}
              color={'black'}>
              {'What would you like to do with your response?'}
            </Text>
          </View>
          <View width={'100%'}>
            <Pressable
              onPress={onSelectUpdate}
              paddingVertical={'sp15'}
              borderTopColor={'gray2'}
              borderTopWidth={0.6}>
              <Text
                textAlign={'center'}
                fontSize={14}
                lineHeight={16}
                fontFamily={fonts.HelveticaRegular}
                color={'black'}>
                Update
              </Text>
            </Pressable>
            <Pressable
              onPress={onSelectRemove}
              borderTopColor={'gray2'}
              paddingVertical={'sp15'}
              borderTopWidth={0.6}>
              <Text
                textAlign={'center'}
                fontSize={14}
                lineHeight={16}
                fontFamily={fonts.HelveticaRegular}
                color={'red'}>
                Remove
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          borderRadius={10}
          width={'100%'}
          backgroundColor={'white'}
          onPress={() => setIsModalVisible(false)}
          paddingVertical={'sp15'}>
          <Text
            textAlign={'center'}
            fontSize={15}
            lineHeight={16}
            fontFamily={fonts.HelveticaRegular}
            color={'black'}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default OptionModal;
