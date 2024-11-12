import {useIsFocused} from '@react-navigation/native';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import DeleteAccountModal from 'foundation/components/DeleteAccountModal/DeleteAccountModal';
import {
  Icon,
  Image,
  Page,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useDeleteAccount,
  useGetUserDetails,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {storage} from 'foundation/storage';
import env_constants from 'internals/env/env_constants.json';
import React, {useEffect, useState} from 'react';
import {Linking, Share} from 'react-native';
import BottomButtons from './components/BottomButtons';
import PushNotification from './components/PushNotification';
import { useTranslation } from 'react-i18next';

const SettingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNav();
  const isFocused = useIsFocused();

  const GetUserDetailsAPi = useGetUserDetails();
  const DeleteAccountAPI = useDeleteAccount();

  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);

  const currentDate = new Date();

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then(() => {})
      .catch(err => {
        toast(
          t('global.something_wrong'),
          toastType.ERROR_TOAST,
        );
        console.log(err.response.data, 'GET  API');
      });
  };

  const BottomButtonsData = [
    {
      icon: Icons.UserGroups,
      title: 'Share with Friends',
      onPress: () => onShare(),
    },
    {
      icon: Icons.Webiste,
      title: 'Our Website',
      onPress: () => Linking.openURL(env_constants.WEBSITE),
    },
    {
      icon: Icons.PhoneBubble,
      title: 'Contact Us',
      onPress: () => Linking.openURL(env_constants.CONTACT_US),
    },
    {
      icon: Icons.LockedFile,
      title: 'Privacy Policy',
      onPress: () => Linking.openURL(env_constants.PRIVACY_URL),
    },
    {
      icon: Icons.UserShields,
      title: 'Terms and Conditions',
      onPress: () => Linking.openURL(env_constants.TERMS_URL),
    },
  ];

  // Share funtion
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'I am using YOURS App to write down all my thoughts and memories. Share it with you now. Download it here: https://apps.apple.com/us/app/whatsapp-messenger/id310633997',
      });
      if (result.action === Share.dismissedAction) {
        console.log('execute');
      }
    } catch (error: any) {
      toast(error.message, toastType.ERROR_TOAST);
    }
  };

  const handleDeleteAccount = () => {
    DeleteAccountAPI.mutateAsync()
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          setIsDeleteConfirmModal(false);
          storage.setToken('');
          navigation.replace('Login');
          toast('Your account deleted Successfully', toastType.SUCCESS_TOAST);
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          toast(err.response.data.message, toastType.ERROR_TOAST);
        } else {
          toast(
            t('global.something_wrong'),
            toastType.ERROR_TOAST,
          );
        }
      });
  };

  useEffect(() => {
    if (isFocused) {
      getUserDetails();
    }
    return () => {};
  }, [isFocused]);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'white'}
      safeAreaBackgroundColor="white"
      showsVerticalScrollIndicator={false}>
      <View
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        marginBottom={'sp20'}>
        <Image
          height={40}
          width={100}
          source={IMAGES.splash_logo}
          resizeMode="contain"
        />
        <Pressable
          left={20}
          position={'absolute'}
          zIndex={100}
          onPress={() => navigation.goBack()}>
          <Icon
            source={Icons.ArrowLeftDark}
            svgProps={{
              height: 20,
              width: 20,
            }}
          />
        </Pressable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        width={'100%'}
        contentContainerStyle={{
          paddingBottom: 100,
          gap: 20,
          paddingHorizontal: 24,
        }}>
        <View width={'100%'} gap={'sp20'}>
          <Text fontFamily={fonts.OpensansBold} fontSize={24} color={'black'}>
            Settings
          </Text>
          <PushNotification />
        </View>
        <View width={'100%'} gap={'sp10'}>
          <Text fontFamily={fonts.OpensansBold} fontSize={18} color={'black'}>
            Help & Support
          </Text>
          <BottomButtons
            BottomButtonsData={BottomButtonsData}
            onDeletePress={() => {
              setIsDeleteConfirmModal(true);
            }}
          />
        </View>
      </ScrollView>
      <DeleteAccountModal
        isModalVisible={isDeleteConfirmModal}
        setIsModalVisible={setIsDeleteConfirmModal}
        onConfirm={handleDeleteAccount}
      />
    </Page>
  );
};

export default SettingScreen;
