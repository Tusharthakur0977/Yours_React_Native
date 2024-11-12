import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {
  Button,
  Icon,
  Image,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useChangePasswordApi} from 'foundation/services/ApiHooks';
import {storage} from 'foundation/storage';
import {
  checkInternetConnection,
} from 'foundation/utils/Helpers';
import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {
  const { t } = useTranslation();

    // Custom hook to handle change password API
  const ChangePasswordAPi = useChangePasswordApi();

  const navigation = useNav();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Function to handle password change
  const handleChangePassword = async () => {
        // Validate password fields
    if (!currentPassword.trim()) {
      toast('Please enter your current password', toastType.ERROR_TOAST);
    } else if (!newPassword.trim()) {
      toast('Please enter a new password', toastType.ERROR_TOAST);
    } else if (newPassword.length < 8) {
      toast('Please enter a new password with at least 8 characters', toastType.ERROR_TOAST);
    } else if (!confirmPassword.trim()) {
      toast('Please confirm your new password', toastType.ERROR_TOAST);
    } else if (confirmPassword !== newPassword) {
      toast(
        'New password and confirm password should match',
        toastType.ERROR_TOAST,
      );
    } else {
      // Proceed with password change if all validations pass
      await handlePasswordChange();
    }
  };

  // Function to make API call for password change
  const handlePasswordChange = async () => {
    // Check internet connection before making API call
    if (await checkInternetConnection()) {
        // Make API call to change password
      ChangePasswordAPi.mutateAsync({
        oldPassword: currentPassword,
        newPassword: newPassword,
      })
        .then(res => {
          if (res.status === 201) {
            toast(res.data.message, toastType.SUCCESS_TOAST);
            // Clear token and navigate to login screen after successful password change
             storage.setToken('');
            navigation.replace('Login');
          }
        })
        .catch(err => {
          // Handle API errors
          if (err.response.data.error) {
            toast(err.response.data.message, toastType.ERROR_TOAST);
          } else {
            toast(t('global.something_wrong'),
              toastType.ERROR_TOAST,
            );
          }
        });
    }
  }

  return (
    <Page
      flex={1}
      scrollable={true}
      justifyContent={'space-between'}
      alignItems={'center'}
      backgroundColor={'white'}
      paddingHorizontal={'sp20'}
      safeAreaBackgroundColor="white"
      paddingBottom={'sp10'}
      gap={'sp20'}
      showsVerticalScrollIndicator={false}>
      <View width={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Image
          height={40}
          width={100}
          source={IMAGES.splash_logo}
          resizeMode="contain"
        />
      </View>
      <View
        width={'100%'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}>
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
        <Text color={'black'} fontFamily={fonts.HelveticaBold} fontSize={20}>
          Change Password
        </Text>
      </View>
      <Text marginRight={'sp16'} marginTop={'sp10'} color={'black'} fontFamily={fonts.HelveticaRegular}>
        Password must be at least 8 characters and different from the previous
        password.
      </Text>
      <View gap={'sp24'} marginBottom={'sp10'}>
        <LabeledInput
          label="Current Password"
          value={currentPassword}
          secureTextEntry={true}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
        />
        <LabeledInput
          label="New Password"
          value={newPassword}
          secureTextEntry={true}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
        />
        <LabeledInput
          label="Confirm Password"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
        />
      </View>
      <Button
        label="Change Password"
        loading={ChangePasswordAPi.isLoading}
        onPress={handleChangePassword}
      />
    </Page>
  );
};

export default ChangePassword;
