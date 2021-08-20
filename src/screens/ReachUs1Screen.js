/* eslint-disable prettier/prettier */
import React from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import AppHeader from '../components/AppHeader';
import PageLayout from './../containers/PageLayout';
import FormInput from '../components/FormComponents/FormInput';
import Loader from '../components/Loader';
import {API_BASE_URL} from '../constants/ApiUrl';
import {alert, checkEmptyField,toast} from '../utils';


const ReachUs1Screen = ({navigation}) => {
  const shadowOpt = {
    height: 50,
    width: Dimensions.get('screen').width - 50,
    color: '#E9948D',
    border: 3,
    radius: 12,
    opacity: 0.2,
    x: 0,
    y: -1,
    style: {marginVertical: 7, borderRadius: 10},
  };
  const [loading, setLoading] = React.useState(false);
  const [reachUs1Form, setReachUs1Form] = React.useState({
    name: '',
    eventname:'',
    feedback:''
  });

  const handleInputChange = (key, value) => {
    setReachUs1Form({
      ...reachUs1Form,
      [key]: value,
    });
  };
  
  const onSubmitPress = async () => {

    if (checkEmptyField(reachUs1Form))
    alert('Warning', 'Fields cannot be empty');
  else {
    setLoading(true);
    try {
      let response = await fetch(`${API_BASE_URL}/reachus1.php`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reachUs1Form),
      });

      let result = await response.json();
      console.log(result);
      setLoading(false);
      toast('Feedback submitted');
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('Error', 'something went wrong');
    }
  }
  }

  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <ScrollView style={globalStyles.rootView}>
        <AppHeader title="Reach Us" />
        <View
          style={{
            alignItems: 'center',
          }}
        />

        <Text
          style={{
            color: '#121212',
            fontSize: 24,
            marginTop: 20,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          EVENT FEEDBACK FORM
        </Text>

        <View style={{flex: 1, padding: 20}}>
          <FormInput
            labelText="Name"
            name="name"
            onChangeText={value => handleInputChange('name', value)}
          />
          <FormInput
            labelText="Event Name"
            name="eventname"
            onChangeText={value => handleInputChange('eventname', value)}
          />
          <FormInput
            labelText="Event Feedback"
            name="eventFeedback"
            multiline={true}
            onChangeText={value => handleInputChange('feedback', value)}
          />
        </View>

        <View
          style={{
            height:Dimensions.get('screen').height*0.35 ,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Image
            source={require('../assets/reachus1.jpg')}
            resizeMode="contain"
            style={{
              height: "50%",
              width: 300,
            }} />
          <TouchableOpacity
            style={{alignItems: 'flex-end', width: '100%', padding: 15}}
            onPress={onSubmitPress}>
            <Text style={{borderBottomWidth: 1, fontSize: 18}}>Submit</Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/bottom-img.jpg')}
            resizeMode="cover"
            style={{
              height: "20%",
              width: "100%",
            }} />
        </View>
      </ScrollView>
    </PageLayout>
  );
};
export default ReachUs1Screen;
