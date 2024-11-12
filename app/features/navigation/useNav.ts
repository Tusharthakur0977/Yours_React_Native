import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'features/navigation/RouteParamTypes';

export const useNav = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  return navigation;
};
