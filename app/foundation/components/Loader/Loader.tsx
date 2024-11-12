import React from 'react';
import {ActivityIndicator} from 'react-native';

import {Text} from '../kit';
import {View} from '../kit/View';

type LoadingProps = {
  title?: string;
  position?: any;
  iconBg?: string;
  LoaderColor?: string;
};

export default ({
  title,
  position = 'absolute',
  iconBg = 'gray',
  LoaderColor = 'green',
}: LoadingProps) => {
  return (
    <View
      position={position}
      alignItems={'center'}
      justifyContent={'center'}
      backgroundColor={'transparent'}
      top={0}
      left={0}
      bottom={0}
      right={0}
      zIndex={9999999}>
      <View
        padding={'sp24'}
        gap={'sp4'}
        backgroundColor={iconBg}
        borderRadius={15}>
        <ActivityIndicator size="large" color={LoaderColor} animating={true} />
        {title && (
          <Text
            color={'green'}
            variant={'body1Sans'}
            textTransform={'capitalize'}>
            {title}
          </Text>
        )}
      </View>
    </View>
  );
};
