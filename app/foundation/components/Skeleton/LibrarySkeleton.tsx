import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {View} from '../kit';

const LibrarySkeleton = () => {
  const {width} = useWindowDimensions();

  const skeleton = StyleSheet.create({
    main: {
      width,
      gap: 20,
    },
  });

  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={skeleton.main}>
        <View style={{gap: 20}}>
          <View height={50} width={'88%'} borderRadius={10} />
          <View
            style={{
              gap: 15,
              alignItems: 'flex-start',
              width: '88%',
            }}>
            <View height={'20%'} width={'100%'} borderRadius={10} />
            <View height={'20%'} width={'100%'} borderRadius={10} />
            <View height={'20%'} width={'100%'} borderRadius={10} />
            <View height={'20%'} width={'100%'} borderRadius={10} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LibrarySkeleton;
