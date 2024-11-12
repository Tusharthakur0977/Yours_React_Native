import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import AuthScreenHeader from 'foundation/components/AuthScreenHeader/AuthScreenHeader';
import {
  Button,
  CheckBox,
  Page,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useLoginApi} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {storage} from 'foundation/storage';
import {checkInternetConnection, isValidEmail} from 'foundation/utils/Helpers';
import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  // Initialize navigation and translation hooks
  const navigation = useNav();
  const { t } = useTranslation();

  // Retrieve remember me details from storage
  const rememberMeDetails = storage.getRememberDetails();

  // State variables for email, password, and remember me
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(
    rememberMeDetails.email !== null,
  );

  // Initialize login API hook
  const loginApi = useLoginApi();
  // Retrieve FCM token from storage
  const token = storage.getFcmToken();

  // Toggle remember me checkbox state
  const toggleRememberMeSwitch = () => {
    setRememberMe(!rememberMe);
  };

  // Render sign-up button with navigation to SignUp screen
  const renderButtonToSignUp = () => {
    return (
      <View alignItems={'center'} flexDirection={'row'}>
        <Text color={'black'} fontSize={14} fontFamily={fonts.HelveticaRegular}>
        {t('auth.dont_have_account')}{' '}
        </Text>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text color={'green'} fontFamily={fonts.HelveticaBold} fontSize={14}>
          {t('auth.signup')}
          </Text>
        </Pressable>
      </View>
    );
  };

  // Handle login button press
  const handleLogin = async () => {
    if (!email.trim()) {
      // Show error if email is empty
      toast(t('validations.enter_email'), toastType.ERROR_TOAST);
    } else if (!isValidEmail(email)) {
      // Show error if email is invalid
      toast(t('validations.enter_valid_email'), toastType.ERROR_TOAST);
    } else if (!password.trim()) {
      // Show error if password is empty
      toast(t('validations.enter_password'), toastType.ERROR_TOAST);
    } else {
      // Proceed with login if internet connection is available
      if (await checkInternetConnection()) {
        loginApi
          .mutateAsync({email: email, password: password, fcmToken: token!})
          .then(res => {
            if (res.status === ApiStatusCode.Success) {
              // Save login details if remember me is checked
              if (rememberMe) {
                storage.setRememberDetails({email: email, password: password});
              }
              if (!rememberMe) {
                storage.setRememberDetails({email: null, password: null});
              }
              storage.setToken(res.data.data.accessToken);
              toast(res.data.message, toastType.SUCCESS_TOAST);
              // navigation.replace('Tabs', {screen: 'Home'});
            }
          })
          .catch(err => {
            // Show appropriate error message on login failure
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
            } else {
              toast(t('global.something_wrong'), toastType.ERROR_TOAST);
            }
          });
      }
    }
  };

  // Load remembered email and password on component mount
  useEffect(() => {
    if (rememberMeDetails.email && rememberMeDetails.password) {
      setEmail(rememberMeDetails.email);
      setPassword(rememberMeDetails.password);
    }
    return () => {
      setEmail('');
      setPassword('');
    };
  }, []);

  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}
      safeAreaBackgroundColor="lightPink"
      backgroundColor={'lightPink'}
      showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        extraScrollHeight={100}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          width: '100%',
        }}
        automaticallyAdjustKeyboardInsets>
        <AuthScreenHeader isBackButton={false} />
        <View
          flex={1}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          backgroundColor={'white'}
          paddingHorizontal={'sp24'}
          width={'100%'}
          paddingTop={'sp32'}
          gap={'sp40'}
          alignItems={'center'}>
          <View width={'100%'} alignItems={'flex-start'}>
            <Text
              fontFamily={fonts.OpensansBold}
              color={'green'}
              fontSize={28}
              lineHeight={30}>
              {t('auth.log_into_yours')}
            </Text>
          </View>
          <View width={'100%'} gap={'sp10'}>
            <View gap={'sp36'}>
              <LabeledInput
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder={t('auth.email_address')}
              />
              <LabeledInput
                label={t('auth.password')}
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                placeholder={t('auth.password')}
              />
            </View>
            <View
              justifyContent={'space-between'}
              width={'100%'}
              marginTop={'sp4'}
              flexDirection={'row'}
              alignItems={'center'}>
              <CheckBox value={rememberMe} onChange={toggleRememberMeSwitch}>
                <Text
                  fontSize={14}
                  marginLeft="sp2"
                  color={'black'}
                  lineHeight={20}
                  variant={'label1'}>
                  {t('auth.remember_me')}
                </Text>
              </CheckBox>

              <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                <Text lineHeight={24} fontSize={14} color={'skyBlue'}>
                  {t('auth.forgot_password')}
                </Text>
              </Pressable>
            </View>
          </View>
          <View width={'100%'} alignItems={'center'} gap={'sp10'}>
            <Button
              label={t('auth.log_in')}
              loading={loginApi.isLoading}
              onPress={handleLogin}
            />
            {/* Sign-up button */}
            {renderButtonToSignUp()}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default Login;
