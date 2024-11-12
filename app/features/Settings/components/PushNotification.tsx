import fonts from 'foundation/assets/fonts';
import {Text, View} from 'foundation/components/kit';
import {storage} from 'foundation/storage';
import {colors} from 'foundation/theme/colors';
import React, {useState} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';

const PushNotification = () => {
  const [isPushNotification, setIsPushNotification] = useState(
    storage.getIsPushNotification(),
  );

  return (
    <View width={'100%'} gap={'sp20'} marginBottom={'sp10'}>
      <View
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'sp10'}>
        <View flex={1}>
          <Text fontSize={16} fontFamily={fonts.OpensansBold} color={'gray1'}>
            Push notifications
          </Text>
          <Text
            lineHeight={14}
            fontSize={13}
            fontFamily={fonts.HelveticaRegular}
            color={'gray1'}>
            All notifications are on by default, toggle to turn off
          </Text>
        </View>
        <ToggleSwitch
          isOn={isPushNotification}
          onColor={colors.green}
          offColor="#AAAAAA"
          size="medium"
          onToggle={() => {
            setIsPushNotification(!isPushNotification);
            storage.setIsPushNotification(!storage.getIsPushNotification());
          }}
        />
      </View>
    </View>
  );
};

export default PushNotification;
