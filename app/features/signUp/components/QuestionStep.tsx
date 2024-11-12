import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Button, Icon, Pressable, Text, View} from 'foundation/components/kit';
import ToolTipView from 'foundation/components/ToolTipView';
import {colors} from 'foundation/theme/colors';
import {monthNames} from 'foundation/utils/Helpers';
import env_constants from 'internals/env/env_constants.json';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, PermissionsAndroid, Platform} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type MakeYoursStepProps = {
  setCurrentStep: Dispatch<SetStateAction<string>>;
  birthDate: string;
  setbirthDate: Dispatch<SetStateAction<string>>;
  initialValue: string;
  location: string;
  setlocation: Dispatch<SetStateAction<string>>;
  isListView: boolean;
  setIsListView: Dispatch<SetStateAction<boolean>>;
};

const QuestionStep: FC<MakeYoursStepProps> = ({
  setCurrentStep,
  birthDate,
  setbirthDate,
  initialValue,
  setlocation,
  isListView,
  setIsListView,
}) => {
  const handleNext = () => {
    setCurrentStep('3');
  };

  const autoCompleteRef = useRef<any>(null);
  const [searchText, setSearchText] = useState(initialValue || '');

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const [locationLooading, setLocationLooading] = useState(false);

  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

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

  return (
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
            fontFamily={fonts.OpensansBold}
            color={'green'}
            fontSize={26}
            lineHeight={30}>
            Complete profile
          </Text>
        </View>
        <View gap={'sp32'} width={'100%'}>
          <View>
            <Text
              marginBottom={'sp10'}
              color={'black'}
              fontFamily={fonts.HelveticaBold}
              fontSize={16}>
              When is your birthday?
            </Text>
            <Pressable
              onPress={() => setOpenDatePicker(true)}
              backgroundColor={'lightGreen'}
              borderRadius={5}
              borderWidth={0.3}
              borderColor={'green'}
              paddingVertical={'sp10'}
              paddingHorizontal={'sp12'}>
              <Text
                color={'black'}
                fontSize={14}
                fontFamily={fonts.OpensansRegular}>
                {birthDate.length > 0 ? birthDate : 'Select your birthday'}
              </Text>
            </Pressable>
          </View>
          <View>
            <View
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              marginBottom={'sp10'}
              paddingRight={'sp10'}>
              <Text
                color={'black'}
                fontFamily={fonts.HelveticaBold}
                fontSize={16}>
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
                    lineHeight={21}
                    fontSize={15}
                    fontFamily={fonts.HelveticaRegular}
                    color={'white'}>
                    Enter location to receive information about recovery
                    meetings near you.
                  </Text>
                </View>
              </ToolTipView>
            </View>

            <GooglePlacesAutocomplete
              ref={autoCompleteRef}
              placeholder="Enter your city and state..."
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
                  paddingVertical: 5,
                  backgroundColor: colors.lightGreen,
                  borderColor: colors.green,
                  borderWidth: 0.3,
                  borderRadius: 5,
                  color: colors.black,
                },
                separator: {
                  height: 0.7,
                },
                listView: {
                  marginTop: 10,
                  backgroundColor: colors.lightGreen,
                  padding: 5,
                  borderRadius: 10,
                },
                row: {
                  backgroundColor: 'transparent',
                  paddingHorizontal: 0,
                  zIndex: 999,
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
        </View>
        <View marginTop={'sp16'} width={'100%'}>
          <Button label="Next" onPress={handleNext} />
        </View>
        <DatePicker
          mode="date"
          title="Select Birthday Date"
          modal
          open={openDatePicker}
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
            setOpenDatePicker(false);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default QuestionStep;
