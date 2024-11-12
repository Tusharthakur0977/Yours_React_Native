import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Button, Pressable, Text, View} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import {isValidEmail} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction, useState} from 'react';

type JoinYOurStepProps = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
};

const JoinYoursStep: FC<JoinYOurStepProps> = ({
  setCurrentStep,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const navigation = useNav();

  const handleCreateAccount = () => {
    if (!email.trim()) {
      toast('Please enter your email', toastType.ERROR_TOAST);
    } else if (!isValidEmail(email)) {
      toast('Please enter a valid email', toastType.ERROR_TOAST);
    } else if (!password.trim()) {
      toast('Please enter your password', toastType.ERROR_TOAST);
    } else if (password.length < 8) {
      toast(
        'Please enter at least 8 characters password',
        toastType.ERROR_TOAST,
      );
    } else {
      setCurrentStep('2');
    }
  };

  const renderButtonToLogin = () => {
    return (
      <View
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'center'}
        marginTop={'sp10'}>
        <Text color={'black'} fontSize={14} fontFamily={fonts.HelveticaRegular}>
          Already have an account?{' '}
        </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text color={'green'} fontFamily={fonts.HelveticaBold} fontSize={14}>
            Log In{' '}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View
      flex={1}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      backgroundColor={'white'}
      paddingHorizontal={'sp24'}
      width={'100%'}
      gap={'sp40'}
      alignItems={'center'}>
      <View width={'100%'} alignItems={'flex-start'}>
        <Text
          fontFamily={fonts.HelveticaBold}
          color={'green'}
          fontSize={28}
          lineHeight={30}>
          Join YOURS
        </Text>
      </View>
      <View gap={'sp36'}>
        <LabeledInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Email address"
        />
        <LabeledInput
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          placeholder="Password"
        />
      </View>
      <View width={'100%'}>
        <Button label="Create your account" onPress={handleCreateAccount} />
        {renderButtonToLogin()}
      </View>
    </View>
  );
};

export default JoinYoursStep;
