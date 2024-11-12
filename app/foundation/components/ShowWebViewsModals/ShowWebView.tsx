import {Icons} from 'foundation/assets/icons';
import {colors} from 'foundation/theme/colors';
import React, {FC, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import {Icon, Pressable, Text, TouchableOpacity, View} from '../kit';
import Loader from '../Loader/Loader';
import fonts from 'foundation/assets/fonts';

type ShowWebViewModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  webViewUrl: string;
  title: string;
};

const ShowWebViewModal: FC<ShowWebViewModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  webViewUrl,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Function to handle WebView load finish

  const onLoadEnd = () => {
    setTimeout(() => {
      setIsLoading(false); // Set loading status to false when content is loaded
    }, 1500);
  };

  useEffect(() => {
    setIsLoading(true);

    return () => {
      setIsLoading(false);
    };
  }, [webViewUrl]);

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
        style={{flex: 0.1}}
        activeOpacity={0.5}
        onPress={() => setIsModalVisible(false)}
      />
      <View
        flex={0.9}
        backgroundColor={'white'}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        paddingHorizontal={'sp20'}
        paddingTop={'sp20'}
        paddingBottom={'sp36'}
        gap={'sp24'}>
        <View
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Text fontSize={20} fontFamily={fonts.HelveticaBold} color={'black'}>
            {title}
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

        <WebView
          source={{uri: webViewUrl}}
          style={{flex: 1}}
          onLoadEnd={onLoadEnd}
        />
        {isLoading && <Loader LoaderColor="white" iconBg="green" />}
      </View>
    </Modal>
  );
};

export default ShowWebViewModal;
