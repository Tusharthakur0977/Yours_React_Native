import React from 'react';
import { ToastConfig } from 'react-native-toast-message';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from 'foundation/theme/colors';


interface ToastComponentProps {
  backgroundColor: any;
  text: any;
  textColor?: string;
  image?: any; // Add image prop
}

// Function to generate the toast component based on provided props.
const generateToastComponent = ({
  backgroundColor,
  text,
  textColor = colors.chestnut_rose,
}: ToastComponentProps) => (
  <View style={[styles.toastContainer, { backgroundColor }]}>
    <View style={styles.rowContainer}>
      <Text style={[styles.toastText, { color: textColor }]}>{text}</Text>
    </View>
  </View>
);

// Configuration object for different toast types.
const toastConfig: ToastConfig = {
  successToast: ({ text1 }) =>
    generateToastComponent({
      backgroundColor: colors.greenLoader,
      text: text1,
      textColor: 'white',
    }),
  errorToast: ({ text1 }) =>
    generateToastComponent({
      backgroundColor: colors.darkPink,
      text: text1,
    }),
};

// Component that renders the Toast component with the specified configuration.
const CustomToast = () => {
  return <Toast config={toastConfig} />;
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '95%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Center items vertically
  },
  toastText: {
    textAlign: 'center',
    fontSize: 16,
  },
  toastImage: {
    width: 50, // Adjust width of image as needed
    height: 50, // Adjust height of image as needed
    marginRight: 10, // Add margin to separate image and text
  },
});

export default CustomToast;
