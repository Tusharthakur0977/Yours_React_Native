import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Button, Icon, Pressable, Text, View} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useForogtPasswordApi,
  useOtpVerificationApi,
} from 'foundation/services/ApiHooks';
import { ApiStatusCode } from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import {checkInternetConnection, getTimer} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import BackgroundTimer from 'react-native-background-timer';

type OtpVerificationStepProps = {
  email: string;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  verificationKey: string;
  setVerificationKey: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
};

const OtpVerificationStep: FC<OtpVerificationStepProps> = ({
  email,
  otp,
  setOtp,
  verificationKey,
  setVerificationKey,
  setCurrentStep,
}) => {
  const { t } = useTranslation();
  const OtpVerificationAPi = useOtpVerificationApi();
  const ForgotPasswordApi = useForogtPasswordApi();

  const [globleTimer, setGlobleTimer] = useState<number>(180);
  const [timerExpired, setTimerExpired] = useState(false);

  const handleOnPress = async () => {
    if (otp.length !== 6) {
      toast('Please enter 6 digit OTP.', toastType.ERROR_TOAST);
    } else {
      if (await checkInternetConnection()) {
        OtpVerificationAPi.mutateAsync({
          otp: otp,
          verification_key: verificationKey,
          check: email,
        })
          .then(res => {
            if (res.status === ApiStatusCode.Success) {
              toast(res.data.message, toastType.SUCCESS_TOAST);
              setCurrentStep('3');
            }
          })
          .catch(err => {
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
            } else {
              toast(t('global.something_wrong'),
              toastType.ERROR_TOAST,
            );
            }
            console.log(err.response.data);
          });
      }
    }
  };

  const handleResendOtp = () => {
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
  };

  useEffect(() => {
    let timerId: number;

    const timerFunc = () => {
      timerId = BackgroundTimer.setInterval(() => {
        if (globleTimer === 0) {
          BackgroundTimer.clearInterval(timerId);
          setTimerExpired(true); // Set timer expired when timer reaches 0
        } else {
          setGlobleTimer(prevTimer => prevTimer - 1);
        }
      }, 1000);
    };

    if (globleTimer > 0) {
      timerFunc();
    }

    // Cleanup function to clear the timer when the component unmounts
    return () => {
      BackgroundTimer.clearInterval(timerId);
    };
  }, [globleTimer]);

  // Update timerExpired state when timer reaches 0
  useEffect(() => {
    if (globleTimer === 0) {
      setTimerExpired(true);
    }
  }, [globleTimer]);

  return (
    <View width={'100%'} gap={'sp20'} alignItems={'center'}>
      <View flexDirection={'row'}>
        <Pressable onPress={() => setCurrentStep('1')}>
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
            fontSize={23}
            fontFamily={fonts.OpensansBold}>
            OTP Verification
          </Text>
        </View>
      </View>
      <View width={'80%'} justifyContent={'center'}>
        <Text
          color={'black'}
          fontSize={16}
          lineHeight={20}
          textAlign={'center'}
          fontFamily={fonts.HelveticaRegular}>
          We sent a reset code to
        </Text>
        <Text
          color={'black'}
          fontSize={16}
          lineHeight={20}
          textAlign={'center'}
          fontFamily={fonts.OpensansBold}>
          {email}
        </Text>
      </View>
      <LabeledInput
        keyboardType="number-pad"
        label="Enter OTP"
        value={otp}
        maxLength={6}
        onChangeText={setOtp}
        placeholder="Enter 6 digit OTP"
      />
      <View width={'100%'} gap={'sp6'}>
        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          paddingHorizontal={'sp10'}>
          {!timerExpired && (
            <Text
              color={'black'}
              fontSize={14}
              fontFamily={fonts.HelveticaRegular}>
              OTP valid for {getTimer(globleTimer)}
            </Text>
          )}
          {timerExpired && (
            <Pressable onPress={handleResendOtp}>
              <Text
                color={'green'}
                fontSize={14}
                fontFamily={fonts.OpensansBold}>
                Resend OTP
              </Text>
            </Pressable>
          )}
        </View>
        <Button
          marginTop={'sp12'}
          label="Continue"
          loading={OtpVerificationAPi.isLoading}
          onPress={handleOnPress}
        />
      </View>
    </View>
  );
};

export default OtpVerificationStep;
