import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {
  Icon,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'foundation/components/kit';
import ToolTipView from 'foundation/components/ToolTipView';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useUpdateUserProfile} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import {t} from 'i18next';
import env_constants from 'internals/env/env_constants.json';
import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {ActivityIndicator, PermissionsAndroid, Platform} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';

type LocationModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  initialValue: string;
  location: string;
  setlocation: Dispatch<SetStateAction<string>>;
  isListView: boolean;
  setIsListView: Dispatch<SetStateAction<boolean>>;
  autoCompleteRef: any;
  setRefreshUserData: Dispatch<SetStateAction<number>>;
  setRefreshProfileScreen: Dispatch<SetStateAction<number>>;
};

const LocationPicker: FC<LocationModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  isListView,
  setIsListView,
  initialValue,
  location,
  setlocation,
  autoCompleteRef,
  setRefreshProfileScreen,
  setRefreshUserData,
}) => {
  const [searchText, setSearchText] = useState(initialValue || '');
  const [showTooltip, setShowTooltip] = useState(false);
  const UpdateProfileApi = useUpdateUserProfile();

  const [locationLooading, setLocationLooading] = useState(false);

  const getLocation = async () => {
    setLocationLooading(true);
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (hasPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        getAddress(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getAddress = async (latitude: any, longitude: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env_constants.GOOGLE_MAPS_API_KEY}`,
      );
      const address = response.data.results[0].formatted_address;
      autoCompleteRef.current?.setAddressText(address);
      setlocation(address);
      setSearchText(address);
    } catch (error) {
      console.error(error);
    } finally {
      setLocationLooading(false);
    }
  };

  const handleSaveLocation = () => {
    UpdateProfileApi.mutateAsync({
      user_submitted_qa: {
        1: location,
      },
    })
      .then(res => {
        if (res.status === ApiStatusCode.Success) {
          toast(res.data.message, toastType.SUCCESS_TOAST);
          setIsModalVisible(false);
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
  };

  useEffect(() => {
    autoCompleteRef.current?.setAddressText(initialValue);
  }, [initialValue, isModalVisible]);

  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.8}
      backdropColor={'#000'}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
      animationOut={'slideOutDown'}
      style={{flex: 1, marginHorizontal: 0, marginVertical: 0}}>
      <TouchableOpacity
        style={{flex: 0.3}}
        activeOpacity={0.4}
        onPress={() => setIsModalVisible(false)}
      />
      <View
        flex={0.7}
        padding={'sp12'}
        borderTopStartRadius={10}
        borderTopEndRadius={10}
        backgroundColor={'white'}
        alignItems={'center'}
        gap={'sp6'}>
        <View
          width={'100%'}
          flexDirection={'row'}
          gap={'sp10'}
          justifyContent={'flex-start'}
          paddingVertical={'sp15'}
          paddingHorizontal={'sp10'}>
          <Text
            fontSize={20}
            lineHeight={20}
            fontFamily={fonts.OpensansBold}
            color={'black'}>
            Where do you live?
          </Text>
          <ToolTipView
            isVisible={showTooltip}
            onClose={() => setShowTooltip(false)}
            onPress={() => setShowTooltip(true)}
            icon={
              <Icon
                source={Icons.InfoIcon}
                svgProps={{fill: 'red'}}
                height={15}
                width={15}
              />
            }>
            <View padding={'sp8'} backgroundColor={'black'}>
              <Text
                lineHeight={15}
                fontSize={15}
                fontFamily={fonts.HelveticaRegular}
                color={'white'}>
                Enter location to receive information about recovery meetings
                near you.
              </Text>
            </View>
          </ToolTipView>

          <Pressable
            position={'absolute'}
            top={5}
            right={10}
            borderRadius={10}
            padding={'sp6'}
            backgroundColor={'white'}
            onPress={() => setIsModalVisible(false)}>
            <Icon source={Icons.CloseIcon} height={20} width={20} />
          </Pressable>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            width: '100%',
          }}
          automaticallyAdjustKeyboardInsets>
          <View width={'100%'} paddingHorizontal={'sp10'}>
            <GooglePlacesAutocomplete
              ref={autoCompleteRef}
              placeholder="Enter your city and state..."
              fetchDetails={true}
              enablePoweredByContainer={false}
              onPress={data => {
                setlocation(data.description);
                setIsListView(false);
              }}
              renderRow={props => {
                return (
                  <View
                    paddingVertical={'sp10'}
                    borderRadius={10}
                    flex={1}
                    flexDirection={'row'}
                    gap={'sp10'}
                    alignItems={'flex-start'}
                    key={props?.place_id}>
                    <Icon
                      source={Icons.LocationDot}
                      height={20}
                      width={20}
                      marginTop={'sp2'}
                      marginLeft={'sp4'}
                      svgProps={{
                        fill: colors.green,
                      }}
                    />
                    <View marginLeft={'sp6'} flex={1}>
                      <Text
                        color={'green'}
                        fontFamily={fonts.HelveticaRegular}
                        fontSize={15}>
                        {props.description}
                      </Text>
                    </View>
                  </View>
                );
              }}
              query={{
                key: env_constants.GOOGLE_MAPS_API_KEY,
                language: 'en',
                components: `country:us`,
              }}
              isRowScrollable={false}
              listViewDisplayed={isListView}
              styles={{
                textInput: {
                  marginBottom: 0,
                  backgroundColor: colors.lightGreen,
                  borderColor: colors.green,
                  borderWidth: 0.3,
                  borderRadius: 5,
                  color: colors.black,
                  fontSize: 15,
                },
                separator: {
                  height: 0.7,
                },
                listView: {
                  backgroundColor: colors.lightGreen,
                  padding: 5,
                  borderRadius: 10,
                  position: 'absolute',
                  top: 90,
                },
                row: {
                  backgroundColor: 'transparent',
                  paddingHorizontal: 0,
                  zIndex: 999999,
                  paddingVertical: 5,
                },
              }}
              textInputProps={{
                value: searchText,
                onChangeText: e => {
                  setIsListView(true);
                  setSearchText(e);
                },
                placeholderTextColor: colors.black,
              }}
            />
            <Pressable
              onPress={getLocation}
              flexDirection={'row'}
              gap={'sp10'}
              marginVertical={'sp12'}
              alignItems={'center'}>
              <Icon source={Icons.LocationIcon} height={15} width={15} />
              <Text
                color={'black'}
                fontSize={14}
                fontFamily={fonts.OpensansRegular}>
                Use my location
              </Text>
              {locationLooading && (
                <ActivityIndicator color={colors.black} size={14} />
              )}
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
        <Pressable
          marginBottom={'sp12'}
          onPress={handleSaveLocation}
          width={'100%'}
          disabled={searchText.trim().length === 0}
          backgroundColor={searchText.trim().length === 0 ? 'greyLight' : 'green'}
          paddingVertical={'sp10'}
          alignItems={'center'}
          borderRadius={10}>
          {UpdateProfileApi.isLoading ? (
            <ActivityIndicator size={24} color={'white'} />
          ) : (
            <Text color={'white'} fontSize={14} fontFamily={fonts.OpensansBold}>
              Save
            </Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

export default LocationPicker;
