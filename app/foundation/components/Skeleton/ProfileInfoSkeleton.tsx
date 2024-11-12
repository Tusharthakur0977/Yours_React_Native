import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { View } from '../kit';

const ProfileInfoSkeleton = () => {
  const { width } = useWindowDimensions();

  const skeleton = StyleSheet.create({
    main: {
      alignItems: 'center',
      paddingHorizontal: 20,
      width,
      gap: 16,
    },
    imageSkeleton: {
      height: 110,
      width: 110,
      borderRadius: 100,
    },
    textSkeleton: {
      height: 24,
      width: 170,
    },
  });

  return (
    <SkeletonPlaceholder>
      <View style={skeleton.main}>
        <View style={skeleton.imageSkeleton} />
        <View style={skeleton.textSkeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default ProfileInfoSkeleton;
