import React, {FC} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from '../kit';

type CardViewSkeletonProps = {
  height: number;
  width: number;
  alignItems?: 'flex-end' | 'flex-start' | 'center';
  borderRadius?: number;
};

const CardViewSkeleton: FC<CardViewSkeletonProps> = ({
  height,
  width,
  alignItems = 'center',
  borderRadius = 10,
}) => {
  const skeleton = StyleSheet.create({
    main: {
      width: '100%',
      alignItems: alignItems,
      backgroundColor: 'red',
    },
    cardView: {
      height: height,
      width,
      borderRadius,
      maxWidth: '100%',
    },
  });

  return (
    <SkeletonPlaceholder>
      <View style={skeleton.main}>
        <View style={skeleton.cardView} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default CardViewSkeleton;
