import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Button, Text, View} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import {toast, toastType} from 'foundation/hooks/toastService';
import { useDeepLinkContext } from 'foundation/provider/DeepLinkProvider';
import {useResetPasswordApi} from 'foundation/services/ApiHooks';
import {
  checkInternetConnection
} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction} from 'react';
import { useTranslation } from 'react-i18next';

type CreateNewPasswordStepProps = {
  newPassword: string;
  setNewPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  email: string;
};

const CreateNewPasswordStep: FC<CreateNewPasswordStepProps> = ({
  confirmPassword,
  setConfirmPassword,
  newPassword,
  setNewPassword,
  email,
}) => {
  const { t } = useTranslation();
  const {setDeepLinkUrl, setAppEntry} = useDeepLinkContext();
  const navigation = useNav();
  const ResetPasswordAPi = useResetPasswordApi();

  const handleOnPress = async () => {
    if (!newPassword.trim()) {
      toast('Please enter new Password', toastType.ERROR_TOAST);
    } else if (newPassword.length < 8) {
      toast('Please enter a new Password with atleast 8 characters', toastType.ERROR_TOAST);
    } else if (confirmPassword !== newPassword) {
      toast(
        'Confirm Password and Passowrd should be same',
        toastType.ERROR_TOAST,
      );
    } else {
      if (await checkInternetConnection()) {
        ResetPasswordAPi.mutateAsync({
          email: email,
          newPassword: newPassword,
        })
          .then(res => {
            if (res.status === 201) {
              toast(res.data.message, toastType.SUCCESS_TOAST);
              setDeepLinkUrl('');
              setAppEntry('normal');
              navigation.replace('Login');
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
          });
      }
    }
  };

  return (
    <View width={'100%'} gap={'sp20'} alignItems={'center'}>
      <View flexDirection={'row'}>
        <View flex={1} justifyContent={'center'}>
          <Text
            color={'black'}
            textAlign={'center'}
            fontSize={23}
            fontFamily={fonts.OpensansBold}>
            Create New Password
          </Text>
        </View>
      </View>
      <View width={'90%'} justifyContent={'center'}>
        <Text
          color={'black'}
          fontSize={16}
          lineHeight={20}
          fontFamily={fonts.HelveticaRegular}
          textAlign={'center'}>
          Must be at least 8 characters and different from the previous
          password.
        </Text>
      </View>
      <LabeledInput
        secureTextEntry={true}
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
      />
      <LabeledInput
        secureTextEntry={true}
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
      />
      <Button
        marginTop={'sp10'}
        label="Reset Password"
        loading={ResetPasswordAPi.isLoading}
        onPress={handleOnPress}
      />
    </View>
  );
};

export default CreateNewPasswordStep;
