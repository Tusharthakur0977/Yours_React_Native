import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import IMAGES from 'foundation/assets/images';
import {Icon, Image, Pressable, Text, View} from 'foundation/components/kit';
import CardViewSkeleton from 'foundation/components/Skeleton/CardViewSkeleton';
import ToolTipView from 'foundation/components/ToolTipView';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useRefreshContext} from 'foundation/provider/RefreshProvider';
import {useUpdateUserProfile} from 'foundation/services/ApiHooks';
import {ApiStatusCode} from 'foundation/services/constants';
import {colors} from 'foundation/theme/colors';
import {formatDate} from 'foundation/utils/Helpers';
import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Dimensions, TextInput} from 'react-native';

type UserDetailCardProps = {
  data: any;
  getUserDetails: () => void;
  newName: string;
  setNewName: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setOpenDatePicker: Dispatch<SetStateAction<boolean>>;
};

const UserDetailsCard: FC<UserDetailCardProps> = ({
  data,
  getUserDetails,
  newName,
  setNewName,
  loading,
  setOpenDatePicker,
}) => {
  const {t} = useTranslation();
  const [isEditName, setIsEditName] = useState(false);
  const {setRefreshProfileScreen} = useRefreshContext();
  const UpdateProfileApi = useUpdateUserProfile();

  const [isToolTip, setIsToolTip] = useState(false);
  const handleUpdateDetails = () => {
    if (newName === data.fullName) {
      setIsEditName(false);
    } else {
      UpdateProfileApi.mutateAsync({
        fullName: newName,
      })
        .then(res => {
          if (res.status === ApiStatusCode.Success) {
            getUserDetails();
            setRefreshProfileScreen(Math.floor(Math.random() * 101));
            toast(res.data.message, toastType.SUCCESS_TOAST);
            setIsEditName(false);
          }
        })
        .catch(err => {
          console.log(err.response.data);
          if (err.response.data.error) {
            toast(err.response.data.message, toastType.ERROR_TOAST);
          } else {
            toast(t('global.something_wrong'), toastType.ERROR_TOAST);
          }
        });
    }
  };

  return (
    <View width={'100%'} gap={'sp10'} marginVertical={'sp12'}>
      {loading ? (
        <CardViewSkeleton
          alignItems="flex-start"
          height={55}
          borderRadius={10}
          width={Dimensions.get('screen').width * 0.9}
        />
      ) : (
        <>
          <View
            width={'100%'}
            borderBottomColor={'gray2'}
            borderBottomWidth={0.3}>
            <Text color={'black'} fontFamily={fonts.OpensansBold} fontSize={15}>
              User Name
            </Text>
            <View
              gap={'sp20'}
              justifyContent={'space-between'}
              flexDirection={'row'}
              alignItems={'center'}>
              {isEditName ? (
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  style={{
                    flex: 1,
                    color: colors.black,
                    height: 40,
                    fontFamily: fonts.HelveticaRegular,
                    backgroundColor: colors.lightGreen,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}
                />
              ) : (
                <Text
                  color={'black'}
                  fontSize={16}
                  marginBottom={'sp6'}
                  fontFamily={fonts.HelveticaRegular}
                  letterSpacing={0.7}>
                  {newName}
                </Text>
              )}
              <Pressable onPress={() => setIsEditName(!isEditName)}>
                {isEditName ? (
                  <Pressable onPress={handleUpdateDetails}>
                    {UpdateProfileApi.isLoading ? (
                      <ActivityIndicator size={'small'} />
                    ) : (
                      <Icon
                        source={Icons.TickIcon}
                        svgProps={{
                          height: 22,
                          width: 22,
                        }}
                      />
                    )}
                  </Pressable>
                ) : (
                  <Image
                    height={15}
                    width={15}
                    source={IMAGES.pencil}
                    resizeMode="contain"
                  />
                )}
              </Pressable>
            </View>
          </View>
        </>
      )}
      {loading ? (
        <CardViewSkeleton
          alignItems="flex-start"
          height={55}
          borderRadius={10}
          width={Dimensions.get('screen').width * 0.9}
        />
      ) : (
        <View
          borderBottomColor={'gray2'}
          borderBottomWidth={0.3}
          width={'100%'}
          paddingVertical={'sp6'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <View>
            <View flexDirection={'row'} gap={'sp6'} alignItems={'center'}>
              <Text
                color={'black'}
                fontFamily={fonts.OpensansBold}
                fontSize={15}>
                E-mail
              </Text>
              {data?.is_email_verified && (
                <Icon
                  height={15}
                  width={15}
                  svgProps={{
                    fill: colors.green,
                  }}
                  source={Icons.VerifiedBadge}
                />
              )}
            </View>
            <Text
              color={'black'}
              fontSize={16}
              numberOfLines={1}
              fontFamily={fonts.HelveticaRegular}
              letterSpacing={0.7}>
              {data?.email}
            </Text>
          </View>
          {!data?.is_email_verified && (
            <ToolTipView
              isVisible={isToolTip}
              onClose={() => setIsToolTip(false)}
              onPress={() => setIsToolTip(true)}
              icon={
                <Icon height={16} width={16} source={Icons.CircleExclam} />
              }>
              <View padding={'sp8'} backgroundColor={'black'}>
                <Text
                  lineHeight={18}
                  fontSize={13}
                  fontFamily={fonts.HelveticaRegular}
                  color={'white'}>
                  Please check your inbox {data?.email} for the confirmation
                  email.
                </Text>
              </View>
            </ToolTipView>
          )}
        </View>
      )}
      {loading ? (
        <CardViewSkeleton
          alignItems="flex-start"
          height={55}
          borderRadius={10}
          width={Dimensions.get('screen').width * 0.9}
        />
      ) : (
        <View
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          borderBottomColor={'gray2'}
          borderBottomWidth={0.3}
          paddingVertical={'sp6'}>
          <View>
            <Text color={'black'} fontFamily={fonts.OpensansBold} fontSize={15}>
              Sobriety date
            </Text>
            <Text
              color={'black'}
              fontFamily={fonts.HelveticaRegular}
              fontSize={16}
              letterSpacing={0.7}>
              {data?.DOB ? formatDate(data?.DOB) : ''}
            </Text>
          </View>

          <Pressable
            height={40}
            width={40}
            justifyContent={'flex-end'}
            alignItems={'flex-end'}
            onPress={() => setOpenDatePicker(true)}>
            <Image
              height={15}
              width={15}
              source={IMAGES.pencil}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default UserDetailsCard;
