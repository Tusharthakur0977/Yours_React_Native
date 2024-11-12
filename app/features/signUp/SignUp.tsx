import {useNav} from 'features/navigation/useNav';
import AuthScreenHeader from 'foundation/components/AuthScreenHeader/AuthScreenHeader';
import {Page, View} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {BackHandler} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import JoinYoursStep from './components/JoinYoursStep';
import MakeYoursStep from './components/MakeYoursStep';
import QuestionStep from './components/QuestionStep';

const SignUp = () => {
  const navigation = useNav();
  const [currentStep, setCurrentStep] = useState('1');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [sobrietyDate, setSobrietyDate] = useState('');

  const [profilePic, setProfilePic] = useState<any>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  const [birthDate, setbirthDate] = useState('');

  const [searchText, setSearchText] = useState('');
  const [location, setlocation] = useState('');
  const [isListView, setIsListView] = useState(false);

  const renderSteps = useMemo(() => {
    if (currentStep === '1') {
      return (
        <JoinYoursStep
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      );
    }
    if (currentStep === '2') {
      return (
        <QuestionStep
          setCurrentStep={setCurrentStep}
          birthDate={birthDate}
          setbirthDate={setbirthDate}
          initialValue={location}
          location={location}
          setlocation={setlocation}
          isListView={isListView}
          setIsListView={setIsListView}
        />
      );
    }
    if (currentStep === '3') {
      return (
        <MakeYoursStep
          name={name}
          setName={setName}
          sobrietyDate={sobrietyDate}
          setSobrietyDate={setSobrietyDate}
          email={email}
          password={password}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          profilePicUrl={profilePicUrl}
          setProfilePicUrl={setProfilePicUrl}
          location={location}
          birthDate={birthDate}
        />
      );
    }
  }, [
    currentStep,
    email,
    password,
    name,
    sobrietyDate,
    profilePic,
    profilePicUrl,
    birthDate,
    searchText,
    location,
    isListView,
  ]);

  useEffect(() => {
    const backAction = () => {
      if (currentStep === '3') {
        setCurrentStep('2');
      } else if (currentStep === '2') {
        setCurrentStep('1');
      } else {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
      }
      return true; // Returning true prevents the event from bubbling up & the default back action from being executed
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); // Clean up the event listener when the component unmounts
  }, [currentStep]);

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
        extraScrollHeight={60}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.white,
        }}
        style={{
          width: '100%',
        }}>
        <AuthScreenHeader
          isBackButton={currentStep === '2' || currentStep === '3'}
          onBackPress={() => {
            if (currentStep === '3') {
              setCurrentStep('2');
            }
            if (currentStep === '2') {
              setCurrentStep('1');
            }
          }}
        />
        <View
          flex={1}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          backgroundColor={'white'}
          paddingTop={'sp32'}
          width={'100%'}
          gap={'sp40'}
          alignItems={'center'}>
          {renderSteps}
        </View>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default SignUp;
