import {RouteProp, useRoute} from '@react-navigation/native';
import Dayjs from 'dayjs';
import {ProfileStackParams} from 'features/navigation/RouteParamTypes';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import ConfirmModal from 'foundation/components/ConfirmModal/ConfirmModal';
import {
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import ProfileInfoSkeleton from 'foundation/components/Skeleton/ProfileInfoSkeleton';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import {
  useGetUserDetails,
  useUpdateUserProfile,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {storage} from 'foundation/storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import BottomButtons from './components/BottomButtons';
import ExportJournalModal from './components/ExportJournalModal';

const Profile = () => {
  const {t} = useTranslation();
  const navigation = useNav();
  const route = useRoute<RouteProp<ProfileStackParams, 'Profile'>>();

  const {refreshProfileScreen} = useRefreshContext();
  const [isLogoutConfirmModal, setIsLogoutConfirmModal] = useState(false);

  const [showExportJournal, setShowExportJournal] = useState(false);
  const [pdfDate, setPdfDate] = useState(
    Dayjs(new Date()).format('YYYY-MM-DD'),
  );
  const GetUserDetailsAPi = useGetUserDetails();
  const UpdateProfileApi = useUpdateUserProfile();

  const currentDate = new Date();

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then(() => {})
      .catch(err => {
        toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        console.log(err.response.data, 'GET  API');
      });
  };

  const BottomButtonsData = [
    {
      icon: Icons.User,
      title: GetUserDetailsAPi.data?.data.data.isProfileCompleted
        ? 'Update Profile'
        : 'Complete Profile',
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'ProfileStack',
          params: {screen: 'EditDetails'},
        });
      },
    },
    {
      icon: Icons.BellIcon,
      title: 'Customize Notifications',
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'ProfileStack',
          params: {screen: 'Notifications'},
        });
      },
    },
    {
      icon: Icons.GreenCheck,
      title: GetUserDetailsAPi?.data?.data.data.isGoalExist
        ? 'Update Goals'
        : 'Set Goals',
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'ProfileStack',
          params: {screen: 'Goals'},
        });
      },
    },
    {
      icon: Icons.LockIcon,
      title: 'Change password',
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'ProfileStack',
          params: {screen: 'ChangePassword'},
        });
      },
    },
    {
      icon: Icons.ExportFIle,
      title: 'Export Journal Entry',
      onPress: () => {
        setShowExportJournal(true);
      },
    },
    {
      icon: Icons.SettingsIcon,
      title: 'Change Settings',
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'ProfileStack',
          params: {screen: 'Settings'},
        });
      },
    },
  ];

  const onLogout = () => {
    setIsLogoutConfirmModal(false);
    storage.setToken('');
    navigation.replace('Login');
  };

  const handleLogout = () => {
    const fcmTokensFromAPI = GetUserDetailsAPi.data?.data?.data.fcmToken;
    // Ensure fcmTokensFromAPI is an array
    let fcmTokensArray = [];
    if (typeof fcmTokensFromAPI === 'string') {
      fcmTokensArray = [fcmTokensFromAPI];
    } else if (Array.isArray(fcmTokensFromAPI)) {
      fcmTokensArray = fcmTokensFromAPI;
    }

    // Check if fcmTokensArray includes the current device's token
    if (fcmTokensArray.includes(storage.getFcmToken())) {
      const newTokens = fcmTokensArray.filter(
        token => token !== storage.getFcmToken(),
      );

      UpdateProfileApi.mutateAsync({
        fcmToken: newTokens,
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            onLogout();
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      onLogout();
    }
  };

  useEffect(() => {
    if (refreshProfileScreen === 0 || refreshProfileScreen) {
      getUserDetails();
    }
    return () => {};
  }, [refreshProfileScreen]);

  return (
    <Page
      scrollable={true}
      backgroundColor={'white'}
      paddingHorizontal={'sp20'}
      safeAreaBackgroundColor="white"
      justifyContent={'space-between'}
      height={Dimensions.get('screen').height}
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} gap={'sp12'} minHeight={'83%'}>
        <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Pressable
            left={0}
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
          <Image
            height={40}
            width={100}
            source={IMAGES.splash_logo}
            resizeMode="contain"
          />
        </View>

        <View marginBottom={'sp20'} alignItems={'center'} gap={'sp16'}>
          {/* Display skeleton if either profile image or full name is not available */}
          {!GetUserDetailsAPi.data?.data.data.profileImage ||
          !GetUserDetailsAPi.data?.data.data.fullName ? (
            <ProfileInfoSkeleton />
          ) : (
            <>
              {/* Render profile image if available */}
              <Image
                style={{
                  borderRadius: 100,
                }}
                height={110}
                width={110}
                source={{uri: GetUserDetailsAPi.data?.data.data.profileImage}}
                resizeMode="cover"
              />

              {/* Render full name if available */}
              <Text
                color={'newGray'}
                fontSize={18}
                fontFamily={fonts.OpensansBold}>
                {GetUserDetailsAPi.data?.data.data.fullName}
              </Text>
            </>
          )}
        </View>

        <BottomButtons
          BottomButtonsData={BottomButtonsData}
          loading={GetUserDetailsAPi.isLoading}
          onLogoutPress={() => setIsLogoutConfirmModal(true)}
        />
      </View>
      <ConfirmModal
        isModalVisible={isLogoutConfirmModal}
        setIsModalVisible={setIsLogoutConfirmModal}
        title="Log out"
        description="Ready to leave? Confirm to log out of your account."
        btnText="Log out"
        onConfirm={handleLogout}
        isLoading={UpdateProfileApi.isLoading}
      />
      <ExportJournalModal
        isModalVisible={showExportJournal}
        setIsModalVisible={setShowExportJournal}
        pdfDate={pdfDate}
        setPdfDate={setPdfDate}
      />
    </Page>
  );
};

export default Profile;
