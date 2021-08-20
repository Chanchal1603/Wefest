import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FormInput from '../../components/FormComponents/FormInput';
import {globalStyles} from '../../styles/globalStyles';
import Feather from 'react-native-vector-icons/Feather';
import ContainedButton from '../../components/Buttons/ContainedButton';
import {human} from 'react-native-typography';
import {useSelector, useDispatch} from 'react-redux';
import Loader from '../../components/Loader';
import {API_BASE_URL} from '../../constants/ApiUrl';
import {alert, checkEmptyField, toast} from '../../utils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default ForgotPasswordModal = ({
  onModalClose = () => console.log('modal close Btn'),
}) => {
  const [email, setEmail] = React.useState('');
  const [forgotPassForm, setForgotPassForm] = React.useState({
    email: '',
    password: '',
    sended_otp: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [recievedOtp, setRecievedOtp] = React.useState('');

  const handleInputChange = (key, value) => {
    setForgotPassForm({
      ...forgotPassForm,
      [key]: value,
    });
  };

  const requestOtp = async () => {
    if (email === '') {
      alert('Warning', 'Fields cannot be empty');
      return;
    }

    setLoading(true);
    try {
      let response = await fetch(`${API_BASE_URL}/passreset1.php`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      let result = await response.json();

      if (result[0].message == 'Message sent!') {
        onSuccess(result[0].OTP);
      } else {
        setLoading(false);
        alert('Error', 'Email not registered...');
      }
    } catch (error) {
      console.error(error);
      alert('Error', 'Something went wrong');
      setLoading(false);
    }
  };

  const onSuccess = (otp) => {
    console.log(otp);
    alert('Success', 'Otp sent to email...');
    setRecievedOtp(otp);
    setLoading(false);
  };

  const resetPassword = async () => {
    
    if (checkEmptyField(forgotPassForm)) {
      alert('Warning', 'Fields cannot be empty');
      return;
    }
    setLoading(true);
    try {

      const data = {...forgotPassForm,otp:recievedOtp};
      let response = await fetch(`${API_BASE_URL}/passreset2.php`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      let result = await response.json();
      if (result[0].mssg == 'Password reset successfully!') {
        toast("Password reset successful")
        onModalClose();
      } else {
        setLoading(false);
        alert('Error', 'Invalid email or Otp');
      }
    } catch (error) {
      console.error(error);
      alert('Error', 'Something went wrong');
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <KeyboardAvoidingView style={{flex: 1, padding: 20}}>
      <TouchableOpacity onPress={onModalClose}>
        <Feather name="x" size={30} />
      </TouchableOpacity>
      <View style={[globalStyles.screenView, {alignItems: 'center'}]}>
        {recievedOtp ? (
          <View
            style={{
              flex: 1,
              width: '100%',
            }}>
            <FormInput
              labelText="Enter Email"
              name="email"
              value={forgotPassForm.email}
              onChangeText={value => handleInputChange('email', value)}
            />
            <FormInput
              labelText="Enter New Password"
              name="password"
              value={forgotPassForm.password}
              onChangeText={value => handleInputChange('password', value)}
            />
            <FormInput
              labelText="Enter Otp"
              name="otp"
              value={forgotPassForm.sended_otp}
              onChangeText={value => handleInputChange('sended_otp', value)}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
            }}>
            <FormInput
              labelText="Enter Email"
              name="email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        )}

        <View>
          <ContainedButton
            btnText="Submit"
            onPress={() => {
              if (recievedOtp) resetPassword();
              else requestOtp();
            }}
            isUpperCase={true}
            variant="secondary"
            btnStyle={{
              elevation: 6,
              height: 40,
              paddingHorizontal: 10,
            }}
            textStyle={{
              ...human.body,
              color: 'white',
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
