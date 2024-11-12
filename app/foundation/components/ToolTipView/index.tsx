import React, {FC, ReactElement} from 'react';
import ToolTipComp from 'react-native-walkthrough-tooltip';
import {TouchableOpacity} from '../kit';

type ToolTipProps = {
  children: ReactElement;
  onClose: () => void;
  onPress: () => void;
  icon?: ReactElement;
  isVisible?: boolean;
};

const ToolTipView: FC<ToolTipProps> = ({
  children,
  onClose,
  onPress,
  icon,
  isVisible,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ToolTipComp
        contentStyle={{
          backgroundColor: 'black',
          borderRadius: 14,
        }}
        arrowSize={{height: 10, width: 10}}
        showChildInTooltip
        isVisible={isVisible}
        content={children}
        placement="top"
        onClose={onClose}>
        {icon}
      </ToolTipComp>
    </TouchableOpacity>
  );
};

export default ToolTipView;
