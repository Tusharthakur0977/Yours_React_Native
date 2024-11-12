import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { View } from '../kit';

const ImageSkeleton = () => {
  const {width} = useWindowDimensions();

  const skeleton = StyleSheet.create({
    main: {
      marginBottom: 6,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 20,
      width,
      gap: 10,
      justifyContent: 'center',
    },
    text: {
      height: 60,
      width: 170,
      borderRadius: 10,
    },
    imageSkeleton: {
      height: 65,
      width: 65,
      borderRadius: 100,
    },
  });

  return (
    <SkeletonPlaceholder>
      <View style={skeleton.main}>
        <View style={skeleton.text} />
        <View style={skeleton.imageSkeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default ImageSkeleton;
