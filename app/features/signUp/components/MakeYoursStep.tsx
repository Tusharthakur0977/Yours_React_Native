import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import ChoooseImageModal from 'foundation/components/ChooseImageModal/ChoooseImageModal';
import {
  Button,
  CheckBox,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from 'foundation/components/kit';
import {LabeledInput} from 'foundation/components/LabelInput/LabelInput';
import ShowWebViewModal from 'foundation/components/ShowWebViewsModals/ShowWebView';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useSignUpApi,
  useUploadProfileIMageApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {storage} from 'foundation/storage';
import {colors} from 'foundation/theme/colors';
import {
  checkInternetConnection,
  requestCameraPermission,
} from 'foundation/utils/Helpers';
import env_constants from 'internals/env/env_constants.json';
import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Text as NativeText, Platform} from 'react-native';
import DatePicker from 'react-native-date-picker';
import * as RNLocalize from 'react-native-localize';
import ImageCropPicker from 'react-native-image-crop-picker';
import {openSettings} from 'react-native-permissions';

type MakeYoursStepProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  sobrietyDate: string;
  setSobrietyDate: Dispatch<SetStateAction<string>>;
  email: string;
  password: string;
  profilePic: any;
  setProfilePic: Dispatch<SetStateAction<any>>;
  profilePicUrl: string | null;
  setProfilePicUrl: Dispatch<SetStateAction<string | null>>;
  location: string;
  birthDate: string;
};

const MakeYoursStep: FC<MakeYoursStepProps> = ({
  name,
  setName,
  sobrietyDate,
  setSobrietyDate,
  email,
  password,
  profilePic,
  setProfilePic,
  profilePicUrl,
  setProfilePicUrl,
  birthDate,
  location,
}) => {
  const {t} = useTranslation();
  const navigation = useNav();

  const SignUpApi = useSignUpApi();
  const token = storage.getFcmToken();

  const UploadProfilePicApi = useUploadProfileIMageApi();

  const [isImagePickerModal, setIsImagePickerModal] = useState(false);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState('');

  const [isShowWebViewModal, setIsShowWebViewModal] = useState(false);
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const [webViewData, setWebViewData] = useState({
    title: 'Terms and Conditions',
    url: env_constants.TERMS_URL,
  });

  const toggleAgreeTermSwitch = () => {
    setIsAgreeTerms(!isAgreeTerms);
  };

  const openImagePicker = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setIsImagePickerModal(false);
        handleUploadPicture({
          fileName: image.path.substring(image.path.lastIndexOf('/') + 1),
          fileSize: image.size,
          height: image.height,
          originalPath: image.sourceURL,
          type: image.mime,
          uri: image.path,
          width: image.width,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Check for camera permission first
  const openCamera = async () => {
    // Check for camera permission first
    const hasCameraPermission = await requestCameraPermission();

    if (Platform.OS === 'android') {
      if (hasCameraPermission) {
        ImageCropPicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          mediaType: 'photo',
        })
          .then(image => {
            setIsImagePickerModal(false);
            handleUploadPicture({
              fileName: image.path.substring(image.path.lastIndexOf('/') + 1),
              fileSize: image.size,
              height: image.height,
              originalPath: image.sourceURL,
              type: image.mime,
              uri: image.path,
              width: image.width,
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        Alert.alert(
          'Permission Required',
          'This app needs camera and library permissions to proceed. Please enable them in the app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => openSettings()},
          ],
        );
      }
    } else {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      })
        .then(image => {
          setIsImagePickerModal(false);
          handleUploadPicture({
            fileName: image.path.substring(image.path.lastIndexOf('/') + 1),
            fileSize: image.size,
            height: image.height,
            originalPath: image.sourceURL,
            type: image.mime,
            uri: image.path,
            width: image.width,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleUploadPicture = (imageData: any) => {
    const formdata = new FormData();
    formdata.append('file', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName,
      size: imageData.fileSize,
    });
    formdata.append('width', imageData.width);
    formdata.append('height', imageData.height);
    formdata.append('size', imageData.fileSize);

    UploadProfilePicApi.mutateAsync(formdata)
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          setProfilePicUrl(res.data.data.imageUrl);
          setProfilePic(imageData);
        }
      })
      .catch(err => {
        toast('Image Upload Failed . Please try again.', toastType.ERROR_TOAST);
        console.log(err.response.data);
        setProfilePicUrl(null);
        setProfilePic(null);
      });
  };

  function createQuestonsPayload(birthDate?: string, location?: string) {
    let payload: any = {};

    // Check each question and add to payload if not null
    if (birthDate !== null && birthDate !== '') {
      payload['0'] = birthDate;
    }
    if (location !== null && location !== '') {
      payload['1'] = location;
    }
    if (Object.keys(payload).length === 0) {
      return null;
    }

    return payload;
  }

  const handleCompleteProfile = async () => {
    if (profilePicUrl === null) {
      toast(
        'Upload your profile picture to get started.',
        toastType.ERROR_TOAST,
      );
    } else if (!name.trim()) {
      toast('Please enter your name.', toastType.ERROR_TOAST);
    } else if (!sobrietyDate.trim()) {
      toast('Please enter sobriety date.', toastType.ERROR_TOAST);
    } else if (!isAgreeTerms) {
      toast(
        'To proceed, please agree to the Privacy Policy and Terms and Conditions.',
        toastType.ERROR_TOAST,
      );
    } else {
      if (await checkInternetConnection()) {
        SignUpApi.mutateAsync({
          email: email,
          password: password,
          DOB: sobrietyDate.slice(0, 10).split('-').reverse().join('-'),
          fullName: name,
          profileImage: profilePicUrl,
          timezone: RNLocalize.getTimeZone(),
          fcmToken: token!,
          user_submitted_qa: createQuestonsPayload(birthDate, location),
        })
          .then(res => {
            if (res.status === 201) {
              toast(res.data.message, toastType.SUCCESS_TOAST);
              storage.setToken(res.data.data.accessToken);
              navigation.reset({index: 0, routes: [{name: 'WelcomeStack'}]});
            }
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
            } else {
              toast(t('global.something_wrong'), toastType.ERROR_TOAST);
            }
          });
      }
    }
  };

  const renderTermsConditionView = () => {
    return (
      <View
        width={'100%'}
        flexDirection={'row'}
        marginBottom={'sp12'}
        justifyContent={'center'}
        alignItems={'center'}>
        <CheckBox value={isAgreeTerms} onChange={toggleAgreeTermSwitch} />

        <NativeText
          style={{
            color: 'black',
            fontSize: 12,
            flex: 1,
          }}>
          By clicking Create account you are agreeing to the{' '}
          <Pressable
            onPress={() => {
              setWebViewData({
                title: 'Privacy Policy',
                url: env_constants.PRIVACY_URL,
              });
              setIsShowWebViewModal(true);
            }}>
            <NativeText
              style={{
                textDecorationLine: 'underline',
                color: 'black',
                fontSize: 13,
              }}>
              Privacy Policy {''}
            </NativeText>
          </Pressable>
          {''}
          <Pressable>
            <NativeText
              style={{
                textDecorationLine: 'underline',
                fontSize: 12,
                textDecorationColor: 'transparent',
              }}>
              and
            </NativeText>
          </Pressable>{' '}
          <Pressable
            onPress={() => {
              setWebViewData({
                title: 'Terms and Conditions',
                url: env_constants.TERMS_URL,
              });
              setIsShowWebViewModal(true);
            }}>
            <NativeText
              style={{
                textDecorationLine: 'underline',
                color: 'black',
                fontSize: 13,
              }}>
              Terms and Conditions.
            </NativeText>
          </Pressable>
          .
        </NativeText>
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
          Make it YOURS
        </Text>
      </View>
      <View width={'100%'} alignItems={'center'} gap={'sp24'}>
        <Pressable
          onPress={() => setIsImagePickerModal(true)}
          backgroundColor={'pink'}
          borderRadius={100}
          width={110}
          minHeight={110}
          justifyContent={'center'}
          alignItems={'center'}
          marginLeft={'sp20'}>
          {profilePic ? (
            <Image
              style={{
                borderRadius: 100,
              }}
              height={110}
              width={110}
              source={{uri: profilePic.uri}}
              resizeMode="cover"
            />
          ) : (
            <Image
              height={40}
              width={40}
              source={IMAGES.camera}
              resizeMode="cover"
            />
          )}
          <Pressable
            onPress={() => setIsImagePickerModal(true)}
            backgroundColor={'green'}
            position={'absolute'}
            padding={'sp1'}
            borderRadius={30}
            bottom={0}
            right={5}>
            <Icon
              source={Icons.PluseIcon}
              svgProps={{
                fill: colors.white,
                width: 15,
                height: 15,
              }}
            />
          </Pressable>
        </Pressable>

        <View gap={'sp36'}>
          <LabeledInput
            label="What is your name?"
            value={name}
            onChangeText={setName}
            placeholder="My name is..."
          />
          <View>
            <Text
              marginBottom={'sp10'}
              color={'black'}
              fontFamily={fonts.HelveticaBold}
              fontSize={16}>
              What is your sobriety date?
            </Text>
            <Pressable
              onPress={() => setOpenDatePicker(true)}
              backgroundColor={'lightGreen'}
              borderRadius={5}
              borderWidth={0.3}
              borderColor={'green'}
              paddingVertical={'sp10'}
              paddingHorizontal={'sp12'}>
              <Text color={'black'} fontSize={14}>
                {sobrietyDate.length > 0
                  ? sobrietyDate
                  : 'My sobriety date is...'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View gap={'sp12'} width={'100%'}>
        {renderTermsConditionView()}
        <Button
          loading={SignUpApi.isLoading || UploadProfilePicApi.isLoading}
          label="Complete Your Setup"
          onPress={handleCompleteProfile}
        />
      </View>
      <ChoooseImageModal
        isModalVisible={isImagePickerModal}
        setIsModalVisible={setIsImagePickerModal}
        handleChooseCamera={openCamera}
        handleChooseImage={openImagePicker}
      />
      <DatePicker
        mode="date"
        title="Select Sobriety Date"
        modal
        open={openDatePicker}
        date={pickerDate ? new Date(pickerDate) : new Date()}
        maximumDate={new Date()}
        onConfirm={pickerDate => {
          setPickerDate(pickerDate.toUTCString());
          setSobrietyDate(
            pickerDate.getDate().toString().padStart(2, '0') +
              '-' +
              (pickerDate.getMonth() + 1).toString().padStart(2, '0') +
              '-' +
              pickerDate.getFullYear().toString(),
          );
          setOpenDatePicker(false);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />
      <ShowWebViewModal
        title={webViewData.title}
        isModalVisible={isShowWebViewModal}
        setIsModalVisible={setIsShowWebViewModal}
        webViewUrl={webViewData.url}
      />
    </View>
  );
};

export default MakeYoursStep;
