import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {View} from '../kit';

const DashBoardItemSkeleton = () => {
  const {width} = useWindowDimensions();

  const skeleton = StyleSheet.create({
    main: {
      paddingHorizontal : 24,
      width,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 28,
      gap: 20,
    },
  });

  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={skeleton.main}>
      <View height={80} width={'20%'} />
        <View height={80} width={'78%'} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default DashBoardItemSkeleton;
