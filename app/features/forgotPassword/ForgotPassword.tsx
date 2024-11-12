import AuthScreenHeader from 'foundation/components/AuthScreenHeader/AuthScreenHeader';
import {Page, Text, View} from 'foundation/components/kit';
import React, {useEffect, useMemo, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CreateNewPasswordStep from './components/CreateNewPasswordStep';
import ForgotPasswordStep from './components/ForgotPasswordStep';
import OtpVerificationStep from './components/OtpVerificationStep';
import fonts from 'foundation/assets/fonts';
import {useDeepLinkContext} from 'foundation/provider/DeepLinkProvider';

// Define an interface for the expected parameters
interface QueryParams {
  otp?: string;
  check?: string;
  verification_key?: string;
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('1');

  const {appEntry, deepLinkUrl} = useDeepLinkContext();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationKey, setVerificationKey] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const renderSteps = useMemo(() => {
    switch (currentStep) {
      case '1':
        return (
          <ForgotPasswordStep
            email={email}
            setEmail={setEmail}
            setVerificationKey={setVerificationKey}
            setCurrentStep={setCurrentStep}
          />
        );
      case '2':
        return (
          <OtpVerificationStep
            email={email}
            otp={otp}
            setOtp={setOtp}
            verificationKey={verificationKey}
            setVerificationKey={setVerificationKey}
            setCurrentStep={setCurrentStep}
          />
        );
      case '3':
        return (
          <CreateNewPasswordStep
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            email={email}
          />
        );
      default:
        return <></>;
    }
  }, [currentStep, email, otp, newPassword, confirmPassword]);

  const renderStepper = useMemo(() => {
    return (
      <View
        flexDirection={'row'}
        alignItems={'center'}
        gap={'sp10'}
        width={'100%'}>
        <View
          alignItems={'center'}
          borderBottomColor={Number(currentStep) >= 1 ? 'green' : 'gray2'}
          borderBottomWidth={4}
          flex={1}
          paddingVertical={'sp8'}>
          <Text
            fontSize={16}
            fontFamily={fonts.OpensansBold}
            color={Number(currentStep) >= 1 ? 'green' : 'gray2'}>
            Step 1
          </Text>
        </View>
        <View
          alignItems={'center'}
          borderBottomColor={Number(currentStep) >= 2 ? 'green' : 'gray2'}
          borderBottomWidth={4}
          flex={1}
          paddingVertical={'sp8'}>
          <Text
            fontSize={16}
            fontFamily={fonts.OpensansBold}
            color={Number(currentStep) >= 2 ? 'green' : 'gray2'}>
            Step 2
          </Text>
        </View>
        <View
          alignItems={'center'}
          borderBottomColor={Number(currentStep) >= 3 ? 'green' : 'gray2'}
          borderBottomWidth={4}
          flex={1}
          paddingVertical={'sp8'}>
          <Text
            fontSize={16}
            fontFamily={fonts.OpensansBold}
            color={Number(currentStep) >= 3 ? 'green' : 'gray2'}>
            Step 3
          </Text>
        </View>
      </View>
    );
  }, [currentStep]);

  const extractParametersUsingSplit = (urlString: string): QueryParams => {
    const queryParamsString = urlString.split('?')[1];
    const queryParams = queryParamsString.split('&');
    const params: QueryParams = {};

    queryParams.forEach((param) => {
      const [key, value] = param.split('=');
      params[key as keyof QueryParams] = decodeURIComponent(value);
    });

    return params;
  };

  useEffect(() => {
    console.log("deepLinkUrl", deepLinkUrl);
    
    if (appEntry === 'deepLink' && deepLinkUrl?.includes('forgotPassword')) {
      setCurrentStep('2');
      const params = extractParametersUsingSplit(deepLinkUrl!);
      if (params) {
        console.log("##params", params);
        setOtp(params.otp!);
        setEmail(params.check!);
        setVerificationKey(params.verification_key!);
      }
    }
  }, [deepLinkUrl, appEntry]);


  return (
    <Page
      flex={1}
      scrollable={false}
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}
      backgroundColor={'lightPink'}
      safeAreaBackgroundColor="lightPink"
      showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps={'handled'}
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
          paddingTop={'sp32'}
          paddingBottom={'sp32'}
          paddingHorizontal={'sp24'}
          width={'100%'}
          gap={'sp40'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          {renderSteps}
          {renderStepper}
        </View>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default ForgotPassword;
