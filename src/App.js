import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import UserStackScreen from './navigation/UserStack';
import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuthState} from './redux/actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import UserHomeStackScreen from './navigation/userHomeStack';

const RootApp = () => (
  <NavigationContainer>
    <UserStackScreen />
  </NavigationContainer>
);

const RootUserHomeStack = () => (
  <NavigationContainer>
    <UserHomeStackScreen />
  </NavigationContainer>
);

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);
  const [isLoggedIn, setIsLoggedin] = React.useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.authState);

  const getUserDetails = async () => {

    try {
      let result = await AsyncStorage.getItem('authState');
      result = await JSON.parse(result);
      if (result.isLoggedIn) {
        dispatch(
          setAuthState({
            isAdmin: result.isAdmin,
            user: result.user,
          }),
        );
      }
    } catch (error) {}

    const timeOut = setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000);
    checkLoggedIn();
    return () => {
      clearTimeout(timeOut);
    };
  };

  const checkLoggedIn = () => {
    if (user) setIsLoggedin(true);
  };

  React.useEffect(() => {
    console.log('cheking');
    checkLoggedIn();
  }, [user]);

  React.useEffect(() => {
    getUserDetails();
  }, []);

  if (showSplashScreen) return <SplashScreen />;
  if (isLoggedIn && user) return <RootUserHomeStack />;
  return <RootApp />;
};

export default App;
