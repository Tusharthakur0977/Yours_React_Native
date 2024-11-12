import { Route } from 'features/navigation/routes';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Button, Icon, Pressable, Text, View} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useForogtPasswordApi} from 'foundation/services/ApiHooks';
import { ApiStatusCode } from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import {isValidEmail} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction} from 'react';
import { useTranslation } from 'react-i18next';

type ForgotPAsswordStepProps = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setVerificationKey: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
};

const ForgotPasswordStep: FC<ForgotPAsswordStepProps> = ({
  email,
  setEmail,
  setVerificationKey,
  setCurrentStep,
}) => {
  const { t } = useTranslation();
  const navigation = useNav();

  const ForgotPasswordApi = useForogtPasswordApi();

  const handleOnPress = () => {
    if (!email.trim()) {
      toast('Please enter your email', toastType.ERROR_TOAST);
    } else if (!isValidEmail(email)) {
      toast('Please enter a valid email', toastType.ERROR_TOAST);
    } else {
      ForgotPasswordApi.mutateAsync({email: email})
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            setVerificationKey(res.data.data);
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setCurrentStep('2');
          }
        })
        .catch(err => {
          console.log(err.response.data);
          if (err.response.data.error) {
            toast(err.response.data.message, toastType.ERROR_TOAST);
          } else {
            toast(t('global.something_wrong'),
            toastType.ERROR_TOAST,
          );
          }
        });
    }
  };

  const renderButtonBackToLogin = () => {
    return (
      <Pressable onPress={() => navigation.navigate(Route.Login)} alignItems={'center'} flexDirection={'row'}>
        <Text color={'black'} fontSize={14} fontFamily={fonts.HelveticaRegular}>
          Back to{' '}
        </Text>
         <Text color={'green'} fontFamily={fonts.OpensansBold} fontSize={14}>
            Login
          </Text>
       
      </Pressable>
    );
  };

  return (
    <View width={'100%'} gap={'sp20'}>
      <View flexDirection={'row'}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon
            source={Icons.ArrowLeft}
            svgProps={{
              fill: colors.black,
              width: 25,
              height: 20,
            }}
          />
        </Pressable>
        <View flex={1} justifyContent={'center'}>
          <Text
            color={'black'}
            textAlign={'center'}
            fontSize={24}
            fontFamily={fonts.OpensansBold}>
            Forgot my password!
          </Text>
        </View>
      </View>
      <View width={'100%'} gap={'sp36'}>
        <Text
          color={'black'}
          fontSize={15}
          lineHeight={20}
          textAlign={'center'}
          fontFamily={fonts.HelveticaRegular}>
          {'Enter the email you used to set up your account\nand we’ll email you otp to reset your password.'}
        </Text>
        <LabeledInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Email address"
        />
        <View alignItems={'center'} gap='sp12'>
        <Button
          label="Continue"
          loading={ForgotPasswordApi.isLoading}
          onPress={handleOnPress}
        />
        {renderButtonBackToLogin()}
        </View>
       
         
      </View>
     
    </View>
  );
};

export default ForgotPasswordStep;
