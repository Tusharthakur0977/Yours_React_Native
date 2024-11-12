import {navigationRef} from './handlers';

export const resetStack = (name: string, params: any) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [
      {
        name: name,
        params: params,
      },
    ],
  });
};
