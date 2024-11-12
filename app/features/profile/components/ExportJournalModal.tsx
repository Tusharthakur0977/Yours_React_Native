import Dayjs from 'dayjs';
import {ratings} from 'features/journalQuestion/components/RatingModal';
import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {
  Icon,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'foundation/components/kit';
import {toast, toastType} from 'foundation/hooks/toastService';
import {useGetUserQuestionsList} from 'foundation/services/ApiHooks';
import {colors} from 'foundation/theme/colors';
import {formatDate, sharePDF} from 'foundation/utils/Helpers';
import React, {FC, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Platform} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Modal from 'react-native-modal';

type ExportJournalModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  pdfDate: string;
  setPdfDate: (pdfDate: string) => void;
};
const ExportJournalModal: FC<ExportJournalModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  pdfDate,
  setPdfDate,
}) => {
  const [loading, setLoading] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const GetQuestionList = useGetUserQuestionsList(pdfDate);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const htmlContent = `
  <div style='padding:40px;'>
    <div style='
      display: flex;
      justify-content: space-between;
      align-items: center;            
      margin-bottom: 40px;
      background: #FAF1F4;
      padding: 40px;
    '>
      <p style='
        font-size: 20px;
        color: #000;
        font-weight: bold;
      '>${formatDate(new Date(pdfDate))}</p>
      <img src="https://firebasestorage.googleapis.com/v0/b/yours-251b3.appspot.com/o/audio%2FYOURS%20app%20logo%20green%20final.png?alt=media&token=0edf8279-ed8c-445a-9190-ab5401f26487" alt="Logo" height="40" />
    </div>
    <div style='
      margin-top: 20px;
      gap: 20px;
      padding: 0px 15px 0px 15px;
    '">
      ${GetQuestionList.data?.data.data
        .filter((questions: any) => questions.is_answered)
        .map(
          (
            el: {
              is_answered: any;
              QuestionText: any;
              AnswerText: any[];
              Rating: any;
            },
            index: number,
          ) => {
            return el.is_answered
              ? `<div style='
              display: flex;
              flex-direction: column;
              border-radius: 10px;
              padding: 10px 10px 20px 10px;
              margin-bottom: 5px;
            '>
              <p style='
                font-family: "Inter", sans-serif;
                font-weight: 800;
                color: #595959; 
                font-size: 16px;
                width: 100%;
              '>${index + 1}. ${el.QuestionText}</p> 
              ${
                typeof el.AnswerText === 'string'
                  ? `
                  <div style='
                      font-family: "Inter", sans-serif;
                      font-weight: normal;
                      color: black; 
                      font-size: 14px;
                      text-transform: capitalize;
                      width: 70%;
                      flex-wrap: wrap;
                    '>${el.AnswerText}</div>
          ${
            typeof el.Rating === 'number'
              ? `<div style='
                      font-family: "Inter", sans-serif;
                      font-weight: normal;
                      color: black; 
                      font-size: 14px;
                      text-transform: capitalize;
                      width: 70%;
                      flex-wrap: wrap;
                    '>Rating : ${ratings[el.Rating - 1]?.title}</div>`
              : ''
          }`
                  : `<ul style='padding-left: 20px;'>${el.AnswerText.map(
                      (mcq: any) =>
                        mcq.is_checked
                          ? `<li style='
                              font-family: "Inter", sans-serif;
                              font-weight: normal;
                              color: black;
                              font-size: 13px;
                              line-height: 1.2;
                              text-transform: capitalize;
                            '>${mcq.optionText}</li>`
                          : '',
                    ).join('')}</ul>`
              }
            </div>`
              : '';
          },
        )
        .join('')}
    </div>
  </div>
`;

  useEffect(() => {
    setPdfDate(Dayjs(new Date()).format('YYYY-MM-DD'));
  }, [isModalVisible]);

  const generatePdf = async () => {
    const isAnyQuestionAnswered = GetQuestionList.data?.data.data.some(
      (question: any) => question.is_answered,
    );

    if (isAnyQuestionAnswered) {
      const date = new Date(pdfDate);
      setLoading(true);
      let options = {
        html: htmlContent,
        fileName: `YOURS_Journal_${date.getDate()}${date.getMonth()}${date.getFullYear()}_${new Date().getTime()}`,
        directory: 'Downloads',
        bgColor: '#ffffff',
      };

      RNHTMLtoPDF.convert(options)
        .then(res => {
          if (res.filePath) {
            setIsModalVisible(false);
            setTimeout(
              () => {
                sharePDF(res.filePath);
                toast(
                  'Your journal export has finished.',
                  toastType.SUCCESS_TOAST,
                );
              },
              Platform.OS === 'android' ? 100 : 1000,
            );
          }
        })
        .catch(error => {
          console.error('Failed to create PDF:', error);
        })
        .finally(() => setLoading(false));
    } else {
      const today = Dayjs(new Date()).format('YYYY-MM-DD');
      const alertMessage =
        pdfDate === today
          ? "It looks like you haven't made any journal entries today. Try again later!"
          : 'There are no journal entries for the selected date. Please choose a different date.';

      Alert.alert('No Entries', alertMessage);
    }
  };

  useEffect(() => {
    GetQuestionList.refetch();
  }, [pdfDate]);

  return (
    <Modal
      isVisible={isModalVisible}
      backdropOpacity={0.8}
      backdropColor={'#000'}
      useNativeDriver={true}
      animationIn={'fadeInUp'}
      onBackButtonPress={() => setIsModalVisible(false)}
      animationOut={'slideOutDown'}
      style={{flex: 1, marginHorizontal: 0, marginVertical: 0}}>
      <TouchableOpacity
        style={{flex: 0.6}}
        activeOpacity={0.4}
        onPress={() => setIsModalVisible(false)}
      />
      <View
        flex={0.5}
        padding={'sp12'}
        borderTopStartRadius={10}
        borderTopEndRadius={10}
        backgroundColor={'white'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={'sp6'}>
        <View
          width={'100%'}
          flexDirection={'row'}
          gap={'sp10'}
          justifyContent={'flex-start'}
          paddingVertical={'sp15'}
          paddingHorizontal={'sp10'}>
          <Text
            fontSize={20}
            lineHeight={22}
            fontFamily={fonts.OpensansBold}
            color={'black'}>
            Export Journal to PDF
          </Text>

          <Pressable
            position={'absolute'}
            top={5}
            right={10}
            borderRadius={10}
            padding={'sp6'}
            backgroundColor={'white'}
            onPress={() => setIsModalVisible(false)}>
            <Icon source={Icons.CloseIcon} height={20} width={20} />
          </Pressable>
        </View>

        <View width={'100%'} gap={'sp12'} paddingHorizontal={'sp10'} flex={1}>
          <Text
            color={'black'}
            fontSize={15}
            fontFamily={fonts.OpensansRegular}>
            Choose Journal Date
          </Text>
          <Pressable
            paddingHorizontal={'sp10'}
            onPress={() => setIsDatePicker(true)}
            width={'100%'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            backgroundColor={'white'}
            borderWidth={0.4}
            borderColor={'green'}
            paddingVertical={'sp10'}
            alignItems={'center'}
            borderRadius={5}>
            <Text color={'black'} fontSize={14} fontFamily={fonts.OpensansBold}>
              {pdfDate == Dayjs().format('YYYY-MM-DD')
                ? 'Today'
                : formatDate(new Date(pdfDate))}
            </Text>
            {GetQuestionList.isFetching ? (
              <ActivityIndicator color={colors.green} />
            ) : (
              <Icon source={Icons.CalendarIcon} height={14} width={14} />
            )}
          </Pressable>
        </View>
        <Pressable
          alignSelf={'flex-end'}
          marginBottom={'sp12'}
          onPress={generatePdf}
          width={'100%'}
          disabled={GetQuestionList.isFetching}
          backgroundColor={'green'}
          paddingVertical={'sp10'}
          alignItems={'center'}
          borderRadius={10}>
          {loading ? (
            <ActivityIndicator color={colors.white} size={24} />
          ) : (
            <Text color={'white'} fontSize={14} fontFamily={fonts.OpensansBold}>
              Generate PDF
            </Text>
          )}
        </Pressable>
      </View>
      <DatePicker
        mode="date"
        title="Select Journal Date"
        modal
        open={isDatePicker}
        minimumDate={oneYearAgo}
        date={new Date(pdfDate)}
        onConfirm={pickerDate => {
          setIsDatePicker(false);
          setPdfDate(Dayjs(pickerDate).format('YYYY-MM-DD'));
        }}
        onCancel={() => {
          setIsDatePicker(false);
        }}
        maximumDate={new Date()}
      />
    </Modal>
  );
};

export default ExportJournalModal;
