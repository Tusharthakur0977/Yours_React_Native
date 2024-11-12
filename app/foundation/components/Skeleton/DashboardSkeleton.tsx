import React from 'react';
import {Dimensions, StyleSheet, useWindowDimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View} from '../kit';


const DashboardSkeleton = () => {
  const {width: DimensionWidth} = useWindowDimensions();

  const skeleton = StyleSheet.create({
    main: {
      width: DimensionWidth,
      flexDirection:'row',
      // gap: 1,
      alignItems: 'center',
    },
    cardView: {
      height: Dimensions.get('screen').height* 0.12,
      flex:1,
      borderRadius: 0,
    },
  });

  return (
    <SkeletonPlaceholder>
      <View gap={'sp16'} style={skeleton.main}>
        <View style={skeleton.cardView} />
        <View style={skeleton.cardView} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default DashboardSkeleton;
