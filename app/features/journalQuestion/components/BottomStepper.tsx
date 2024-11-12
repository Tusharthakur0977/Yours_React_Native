import {View} from 'foundation/components/kit';
import React, {FC} from 'react';

type BottomStepperProps = {
  totalSteps: number;
  currentQuestionStep: number;
};

const BottomStepper: FC<BottomStepperProps> = ({
  totalSteps,
  currentQuestionStep,
}) => {
  return (
    <View
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'row'}
      alignSelf={'flex-end'}
      gap={'sp10'}>
      {Array.from({length: totalSteps}).map((_, index) => (
        <View
          key={index.toString()}
          flex={100 / totalSteps}
          height={3}
          backgroundColor={currentQuestionStep >= index ? 'green' : 'gray2'}
          borderRadius={10}
        />
      ))}
    </View>
  );
};

export default BottomStepper;
