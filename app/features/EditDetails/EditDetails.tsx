import {useIsFocused} from '@react-navigation/native';
import UserDetailsCard from 'features/EditDetails/components/UserDetailsCard';
import {useNav} from 'features/navigation/useNav';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import ChoooseImageModal from 'foundation/components/ChooseImageModal/ChoooseImageModal';
import {
  Icon,
  Image,
  Page,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'foundation/components/kit';
import ProfileInfoSkeleton from 'foundation/components/Skeleton/ProfileInfoSkeleton';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import {
  useGetUserDetails,
  useUpdateUserProfile,
  useUploadProfileIMageApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {
  checkInternetConnection,
  monthNames,
  requestCameraPermission,
} from 'foundation/utils/Helpers';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import DatePicker from 'react-native-date-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import LocationPicker from './components/LocationPicker';
import QuestionList from './components/QuestionList';

const EditDetails = () => {
  const navigation = useNav();
  const autoCompleteRef = useRef<any>(null);

  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const {setRefreshProfileScreen} = useRefreshContext();

  const GetUserDetailsAPi = useGetUserDetails();
  const UpdateProfileApi = useUpdateUserProfile();
  const UploadProfilePicApi = useUploadProfileIMageApi();

  const [isImagePickerModal, setIsImagePickerModal] = useState(false);

  const currentDate = new Date();
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [newName, setNewName] = useState('');

  const [refreshUserData, setRefreshUserData] = useState(0);

  const [openBirthdayDatePicker, setOpenBirthdayDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState('');
  const [birthDate, setbirthDate] = useState('');

  const [locationModal, setLocationModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [location, setlocation] = useState('');
  const [isListView, setIsListView] = useState(false);

  const getUserDetails = () => {
    GetUserDetailsAPi.mutateAsync({currentDate: currentDate.toString()})
      .then(res => {
        setNewName(res.data.data.fullName);
      })
      .catch(err => {
        toast(t('global.something_wrong'), toastType.ERROR_TOAST);
        console.log(err.response.data, 'GET  API');
      });
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
        toast('Camera access denied.', toastType.ERROR_TOAST);
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

  const handleUploadPicture = async (imageData: any) => {
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

    if (await checkInternetConnection()) {
      UploadProfilePicApi.mutateAsync(formdata)
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            UpdateProfileApi.mutateAsync({
              profileImage: res.data.data.imageUrl,
            })
              .then(res => {
                if (res.status === ApiStatusCode.Success) {
                  getUserDetails();
                  setRefreshProfileScreen(Math.floor(Math.random() * 101));

                  toast(res.data.message, toastType.SUCCESS_TOAST);
                }
              })
              .catch(err => {
                if (err.response.data.error) {
                  toast(err.response.data.message, toastType.ERROR_TOAST);
                } else {
                  toast(t('global.something_wrong'), toastType.ERROR_TOAST);
                }
              });
          }
        })
        .catch(err => {
          toast(
            'Image Upload Failed . Please try again.',
            toastType.ERROR_TOAST,
          );
          console.log(err.response.data);
        });
    }
  };

  const QuestionsData = [
    {
      title: 'What is your birthday date?',
      answer:
        GetUserDetailsAPi.data?.data.data.user_submitted_qa[0]?.AnswerText,
      onPress: () => {
        if (
          GetUserDetailsAPi.data?.data.data.user_submitted_qa[0]?.AnswerText
            .length === 0
        ) {
          setOpenBirthdayDatePicker(true);
        } else {
          setbirthDate(
            GetUserDetailsAPi.data?.data.data.user_submitted_qa[0]?.AnswerText,
          );

          setOpenBirthdayDatePicker(true);
        }
      },
    },
    {
      title: 'Where do you live?',
      answer:
        GetUserDetailsAPi.data?.data.data.user_submitted_qa[1]?.AnswerText,
      onPress: () => {
        if (
          GetUserDetailsAPi.data?.data.data.user_submitted_qa[1]?.AnswerText
            .length === 0
        ) {
          setLocationModal(true);
        } else {
          autoCompleteRef.current?.setAddressText(
            GetUserDetailsAPi.data?.data.data.user_submitted_qa[1]?.AnswerText,
          );
          setlocation(
            GetUserDetailsAPi.data?.data.data.user_submitted_qa[1]?.AnswerText,
          );
          setSearchText(
            GetUserDetailsAPi.data?.data.data.user_submitted_qa[1]?.AnswerText,
          );
          setLocationModal(true);
        }
      },
    },
  ];

  useEffect(() => {
    if (isFocused || refreshUserData) {
      setNewName('');
      getUserDetails();
    }
    return () => {};
  }, [isFocused, refreshUserData]);

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
          paddingBottom: 120,
          gap: 20,
          paddingHorizontal: 24,
        }}>
        <View width={'100%'} gap={'sp10'}>
          <View alignItems={'center'} gap={'sp16'}>
            {GetUserDetailsAPi.isLoading ? (
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
                <Pressable onPress={() => setIsImagePickerModal(true)}>
                  <Text
                    textDecorationLine={'underline'}
                    textDecorationColor={'green'}
                    color={'green'}
                    fontSize={16}
                    fontFamily={fonts.OpensansBold}>
                    Change Picture
                  </Text>
                </Pressable>
              </>
            )}
          </View>
          <UserDetailsCard
            data={GetUserDetailsAPi?.data?.data.data}
            loading={GetUserDetailsAPi.isLoading}
            getUserDetails={getUserDetails}
            newName={newName}
            setNewName={setNewName}
            setOpenDatePicker={setOpenDatePicker}
          />
          <QuestionList
            questionListData={QuestionsData}
            loading={GetUserDetailsAPi.isLoading}
            isCompleteProfile={
              GetUserDetailsAPi.data?.data.data.isProfileCompleted
            }
          />
        </View>
      </ScrollView>

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
        date={
          GetUserDetailsAPi.data?.data.data.DOB
            ? new Date(GetUserDetailsAPi.data?.data.data.DOB)
            : date
        }
        onConfirm={pickerDate => {
          setOpenDatePicker(false);
          setDate(pickerDate);
          UpdateProfileApi.mutateAsync({
            DOB: pickerDate.toString(),
          })
            .then(res => {
              if (res.status === ApiStatusCode.Success) {
                getUserDetails();
                toast(res.data.message, toastType.SUCCESS_TOAST);
                setOpenDatePicker(false);
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
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
        maximumDate={new Date()}
      />

      <DatePicker
        mode="date"
        title="Select Birthday Date"
        modal
        open={openBirthdayDatePicker}
        date={pickerDate ? new Date(pickerDate) : new Date()}
        maximumDate={new Date()}
        onConfirm={pickerDate => {
          setPickerDate(pickerDate.toUTCString());
          setbirthDate(
            pickerDate.getDate().toString().padStart(2, '0') +
              ' ' +
              monthNames[pickerDate.getMonth()] +
              ' ' +
              pickerDate.getFullYear().toString(),
          );
          UpdateProfileApi.mutateAsync({
            user_submitted_qa: {
              0:
                pickerDate.getDate().toString().padStart(2, '0') +
                ' ' +
                monthNames[pickerDate.getMonth()] +
                ' ' +
                pickerDate.getFullYear().toString(),
            },
          })
            .then(res => {
              if (res.status === ApiStatusCode.Success) {
                toast(res.data.message, toastType.SUCCESS_TOAST);
                setOpenBirthdayDatePicker(false);
                setRefreshUserData(Math.floor(Math.random() * 101));
                setRefreshProfileScreen(Math.floor(Math.random() * 101));
              }
            })
            .catch(err => {
              if (err.response.data.error) {
                toast(err.response.data.message, toastType.ERROR_TOAST);
              } else {
                toast(t('global.something_wrong'), toastType.ERROR_TOAST);
              }
            });
        }}
        onCancel={() => {
          setOpenBirthdayDatePicker(false);
        }}
      />
      <LocationPicker
        isModalVisible={locationModal}
        setIsModalVisible={setLocationModal}
        initialValue={searchText}
        isListView={isListView}
        setIsListView={setIsListView}
        location={location}
        setlocation={setlocation}
        autoCompleteRef={autoCompleteRef}
        setRefreshProfileScreen={setRefreshProfileScreen}
        setRefreshUserData={setRefreshUserData}
      />
    </Page>
  );
};

export default EditDetails;
