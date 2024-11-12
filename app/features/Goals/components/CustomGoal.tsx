import {GoalData} from 'features/setUserGoals/SetGoals';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Icon, Pressable, Text, View} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {
  useCreateGoalsApi,
  useUpdateGoalsApi,
} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {ActivityIndicator, TextInput} from 'react-native';

type CustomGoalProps = {
  otherGoalData: GoalData;
  goalsData: GoalData[];
  setRefreshGoals: Dispatch<SetStateAction<number>>;
};

const CustomGoal: FC<CustomGoalProps> = ({
  otherGoalData,
  goalsData,
  setRefreshGoals,
}) => {
  const { t } = useTranslation();
  const UpdateUserGoalsApi = useUpdateGoalsApi();
  const CreateUserGOalsApi = useCreateGoalsApi();

  const [isOtherGoalChecked, setIsOtherGoalChecked] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const [otherGoal, setOtherGoal] = useState('');

  useEffect(() => {
    if (otherGoalData?.other_goals_text) {
      setOtherGoal(otherGoalData.other_goals_text);
    }
  }, [otherGoalData]);

  const onConFirm = () => {
    if (otherGoal) {
      const isFirstTimeAnswered = !goalsData.some(
        element => element.is_checked,
      );
      const goalsChosen: number[] = [];

      goalsData.forEach((element, index) => {
        if (element.is_checked) {
          goalsChosen.push(index); // Add index to goalsChosen if is_checked is true
        }
        if (element.goalText === 'Other' && !element.is_checked) {
          goalsChosen.push(index); // Add index to goalsChosen if is_checked is true
        }
      });

      if (isFirstTimeAnswered) {
        CreateUserGOalsApi.mutateAsync({
          goals_choosen: goalsChosen,
          other_goals_text: otherGoal,
        })
          .then(res => {
            if (res.status === ApiStatusCode.Success) {
              toast(res.data.message, toastType.SUCCESS_TOAST);
              setRefreshGoals(Math.floor(Math.random() * 101));
              setIsOtherGoalChecked(false);
            }
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
              setRefreshGoals(Math.floor(Math.random() * 101));
            } else {
              toast(t('global.something_wrong'),
              toastType.ERROR_TOAST,
            );
            }
          });
      } else {
        UpdateUserGoalsApi.mutateAsync({
          goals_choosen: goalsChosen,
          other_goals_text: otherGoal,
        })
          .then(res => {
            if (res.status === ApiStatusCode.Success) {
              toast(res.data.message, toastType.SUCCESS_TOAST);
              setRefreshGoals(Math.floor(Math.random() * 101));
              setIsOtherGoalChecked(false);
            }
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.data.error) {
              toast(err.response.data.message, toastType.ERROR_TOAST);
              setRefreshGoals(Math.floor(Math.random() * 101));
            } else {
              toast(t('global.something_wrong'),
            toastType.ERROR_TOAST,
          );
            }
          });
      }
    } else {
      toast('Please Enter your Personal Goal', toastType.ERROR_TOAST);
    }
  };

  useEffect(()=>{
    if(isOtherGoalChecked){
      textInputRef.current?.focus();
    }

  },[isOtherGoalChecked])

  return (
    <View width={'100%'} paddingHorizontal={'sp6'} alignItems={'center'} gap={'sp20'}>
      <View
        width={'100%'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}>
        <Pressable onPress={() => setIsOtherGoalChecked(!isOtherGoalChecked)}  flex={1}>
          <Text
            fontSize={16}
            lineHeight={23}
            numberOfLines={2}
            fontFamily={fonts.OpensansBold}
            color={'black'}>
            {otherGoalData?.is_checked
              ? otherGoalData?.other_goals_text
              : 'Add your goal'}
          </Text>
          <Text fontSize={13} lineHeight={20} color={'black'}>
            {otherGoalData?.is_checked
              ? 'Edit your personal goal'
              : 'Input your own personal goal'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            transform: [{rotate: isOtherGoalChecked ? '180deg' : '0deg'}],
          }}
          padding={'sp2'}
          borderRadius={100}
          onPress={() => setIsOtherGoalChecked(!isOtherGoalChecked)}
          alignItems={'center'}>
          <Icon
            source={Icons.ExpandArrow}
            svgProps={{
              fill: 'white',
              width: 16,
              height: 16,
            }}
          />
        </Pressable>
      </View>
      {isOtherGoalChecked && (
        <View gap={'sp20'} alignItems={'center'} width={'100%'}>
          <TextInput
            value={otherGoal}
            onChangeText={setOtherGoal}
            multiline
            ref={textInputRef}
            numberOfLines={8}
            placeholder="My Goal is...."
            style={{
              width: '100%',
              color: colors.black,
              backgroundColor: colors.lightGreen,
              borderRadius: 5,
              height: 150,
              borderColor: 'green',
              borderWidth: 0.5,
              padding: 12,
              paddingTop:12,
              textAlignVertical: 'top',
            }}
          />
          <View
            width={'100%'}
            flexDirection={'row'}
            gap={'sp36'}
            justifyContent={'flex-end'}
            alignItems={'center'}>
            <Pressable
              borderRadius={10}
              backgroundColor={'green'}
              alignItems={'center'}
              paddingVertical={'sp8'}
              paddingHorizontal={'sp40'}
              onPress={onConFirm}>
              <Text
                color={'white'}
                fontFamily={fonts.HelveticaRegular}
                fontSize={16}>
                {UpdateUserGoalsApi.isLoading ? (
                  <ActivityIndicator color="white" size={'small'} />
                ) : otherGoalData?.other_goals_text ? (
                  'Update'
                ) : (
                  'Add'
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomGoal;
