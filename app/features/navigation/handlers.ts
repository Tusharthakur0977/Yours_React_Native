import {NavigationContainerRef} from '@react-navigation/native';
import * as React from 'react';
import {RootStackParams} from './RouteParamTypes';

export const navigationRef =
  React.createRef<NavigationContainerRef<RootStackParams>>();

export function navigate(name: any, params?: any): void {
  navigationRef.current?.navigate(name, params);
}
