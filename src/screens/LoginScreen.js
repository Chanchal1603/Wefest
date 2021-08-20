import React from 'react';
import {Text, View, KeyboardAvoidingView, Modal} from 'react-native';
import FormInput from '../components/FormComponents/FormInput';
import {globalStyles} from '../styles/globalStyles';
import GradientButton from '../components/Buttons/GradientButton';
import {human} from 'react-native-typography';
import TextButton from '../components/Buttons/TextButton';
import NavigationHeader from '../components/NavigationHeader';
import {homeScreenRoute} from '../navigation/screenNames';
import {useDispatch} from 'react-redux';
import {setAuthState} from './../redux/actions/authActions';
import {API_BASE_URL} from "../constants/ApiUrl"
import Loader from "../components/Loader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkEmptyField,alert} from "../utils"
import ForgotPasswordModal from './components/ForgotPasswordModal';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: '',
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const changeModalVisiblity = () => {
    console.log("pressed")
    setModalVisible(!modalVisible);
  };

  const handleInputChange = (key, value) => {
    setLoginForm({
      ...loginForm,
      [key]: value,
    });
  };


  const login = async () => {
    if(checkEmptyField(loginForm)){
      alert('Warning', 'Fields cannot be empty');
    }
    else{
      setLoading(true);
    try{
      let response = await fetch(`${API_BASE_URL}/loginvalidate.php`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });
      let result = await response.json();
      
      if(result[0].success){
        
        onLoginSuccess(result[0])
      }
      else{
        setLoading(false);
        alert("Error","Invalid email or password");
      }

    }catch(error){
      console.error(error);
      alert("Error","Something went wrong");
      setLoading(false);
    }
    }
  }

  const onLoginSuccess = async (res) => {

    console.log(res);
    await AsyncStorage.setItem("authState",JSON.stringify({
      isLoggedIn:true,
      user:loginForm,
      isAdmin:res.isadmin
    }))

    dispatch(
      setAuthState({
        isAdmin: res.isadmin,
        user:loginForm
      }),
    );

    setLoading(false);
    navigation.navigate(homeScreenRoute);
    
  }

  return loading ? <Loader /> :  (
    <KeyboardAvoidingView style={{flex: 1}}>
      <NavigationHeader navigation={navigation} />
      <View style={globalStyles.screenView}>
        <View
          style={[
            globalStyles.flexCenter,
            {flex: 0.8, justifyContent: 'flex-start'},
          ]}>
          <Text style={human.title1}>LOGIN</Text>
        </View>
        <View
          style={{
            flex: 2,
            padding: 20,
          }}>
          <FormInput
            labelText="Enter Email"
            onChangeText={(value) => handleInputChange("email",value)}
            name="email"
            value={loginForm.username}
          />
          <FormInput
            labelText="Enter Password"
            onChangeText={(value) => handleInputChange("password",value)}
            name="password"
            value={loginForm.password}
          />
          <TextButton
            btnText="Forgot Password?"
            btnStyle={{
              alignSelf: 'flex-end',
              borderBottomWidth: 1,
              borderBottomColor: 'black',
            }}
            onPress={changeModalVisiblity}
            textStyle={human.headline}
          />
        </View>
        <View
          style={{
            padding: 55,
            flex: 1,
          }}>
          <GradientButton
            btnText="LOG IN"
            gradientContainerStyle={{
              borderRadius: 22,
            }}
            onPress={login}
          />
        </View>
      </View>
      <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            changeModalVisiblity();
          }}>
          <ForgotPasswordModal onModalClose={changeModalVisiblity} />
        </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
