import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {colors} from 'foundation/theme/colors';
import React, {FC} from 'react';
import {Icon, Image, Pressable, View} from '../kit';

type AuthScreenHeaderProps = {
  isBackButton: boolean;
  onBackPress?: () => void;
};

const AuthScreenHeader: FC<AuthScreenHeaderProps> = ({
  isBackButton,
  onBackPress,
}) => {
  return (
    <View
      width={'100%'}
      minHeight={'18%'}
      backgroundColor={'lightPink'}
      justifyContent={'center'}
      alignItems={'center'}
      position={'relative'}>
      {isBackButton && (
        <Pressable
          onPress={onBackPress}
          position={'absolute'}
          zIndex={1000}
          left={20}
          top={10}>
          <Icon
            source={Icons.ArrowLeft}
            svgProps={{
              fill: colors.green,
              width: 25,
              height: 20,
            }}
          />
        </Pressable>
      )}
      <Image
        height={40}
        width={150}
        source={IMAGES.splash_logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default AuthScreenHeader;
