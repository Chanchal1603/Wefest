import React from 'react';
import {
  FlatList,
  View,
  Dimensions,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import ContainedButton from '../components/Buttons/ContainedButton';
import {systemWeights, human} from 'react-native-typography';
import {BoxShadow} from 'react-native-shadow';
import AppHeader from '../components/AppHeader';
import PageLayout from '../containers/PageLayout';
import FormInput from '../components/FormComponents/FormInput';
import Loader from '../components/Loader';
import {API_BASE_URL} from '../constants/ApiUrl';
import {alert, checkEmptyField, toast} from '../utils';

const Reachus2Routes = [
  {
    screenName: 'Mail ID ',
    routeName: '',
  },
  {
    screenName: 'Name',
    routeName: '',
  },
  {
    screenName: 'Contact No.',
    routeName: '',
  },
  {
    screenName: 'Event Idea',
    routeName: '',
  },
];
const ReachUs2Screen = ({navigation, route}) => {
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

  const [reachUs2Form, setReachUs2Form] = React.useState({
    eventidea: '',
    contact: '',
    email: '',
    name: '',
  });

  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (key, value) => {
    setReachUs2Form({
      ...reachUs2Form,
      [key]: value,
    });
  };

  const onSubmitPress = async () => {
    if (checkEmptyField(reachUs2Form))
      alert('Warning', 'Fields cannot be empty');
    else {
      setLoading(true);
      try {
        let response = await fetch(`${API_BASE_URL}/reachus2.php`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reachUs2Form),
        });

        let result = await response.text();
        console.log(result);
        setLoading(false);
        toast('Event Idea submitted');
      } catch (error) {
        console.error(error);
        setLoading(false);
        alert('Error', 'something went wrong');
      }
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <ScrollView style={globalStyles.rootView}>
        <AppHeader title="Reach Us" />
        <View style={{flex: 0.2, alignItems: 'center', paddingVertical: 20}}>
          <Text
            style={{
              color: '#121212',
              fontSize: 29,
              textAlign: 'center',
            }}>
            IDEA PITCH
          </Text>
          <Text
            style={{
              color: '#121212',
              fontSize: 29,
              textAlign: 'center',
            }}>
            Wish to execute your ideas?
          </Text>
          <Image
            style={{height: 200, width: 200}}
            source={require('../assets/idea.jpg')}
          />
        </View>
        <View
          style={{
            flex: 0.8,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          {/* <FlatList
            keyExtractor={item => item.screenName}
            data={Reachus2Routes}
            style={{flex: 1}}
            contentContainerStyle={{alignItems: 'center'}}
            renderItem={({item}) => {
              return (
                <BoxShadow setting={shadowOpt}>
                  <ContainedButton
                    btnText={item.screenName}
                    onPress={() => {
                      if (item.routeName) {
                        navigation.navigate(item.routeName);
                      }
                    }}
                    isUpperCase={true}
                    btnStyle={{
                      elevation: 6,
                    }}
                    textStyle={{
                      ...systemWeights.regular,
                      color: 'black',
                    }}
                  />
                </BoxShadow>
              );
            }}
          /> */}
          <View style={{flex: 1, padding: 20, width: '100%'}}>
            <FormInput
              labelText="Mail Id"
              name="mail id"
              onChangeText={value => handleInputChange('email', value)}
            />
            <FormInput
              labelText="Name"
              name="name"
              onChangeText={value => handleInputChange('name', value)}
            />
            <FormInput
              labelText="Contact No."
              name="Contact No."
              numeric
              onChangeText={value => handleInputChange('contact', value)}
            />
            <FormInput
              labelText="Event Idea"
              name="Event Idea"
              onChangeText={value => handleInputChange('eventidea', value)}
            />
          </View>
          <ContainedButton
            btnText="Submit"
            onPress={onSubmitPress}
            isUpperCase={true}
            variant="secondary"
            btnStyle={{
              elevation: 6,
              height: 40,
              paddingHorizontal: 10,
              width: '40%',
            }}
            textStyle={{
              ...human.body,
              color: 'white',
            }}
          />
        </View>
      </ScrollView>
    </PageLayout>
  );
};

export default ReachUs2Screen;
