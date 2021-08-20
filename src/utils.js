import {Alert} from 'react-native';
import {ToastAndroid} from 'react-native';

export const alert = (title = 'title', message = 'message') =>
  Alert.alert(title, message, [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

export const toast = (message = 'message') => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
  );
};

export const checkEmptyField = (data = {}) => {
  for (let key in data) if (data[key] == '') return true;
  return false;
};
