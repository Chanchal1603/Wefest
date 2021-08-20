import React from 'react';
import {useSelector} from 'react-redux';
import DashboardScreen from './../screens/DashboardScreen';
import StudentDashboardScreen from './../screens/StudentDashBoardScreen';
import {StyleSheet, Animated, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ActionModal = ({slideInTop, closeModal}) => {
  const {isAdmin, user} = useSelector(state => state.authState);
  const navigation = useNavigation();

  return (
    <Animated.View
      style={[
        styles.modal,
        {paddingBottom: 15, transform: [{translateY: slideInTop}]},
      ]}>
      {isAdmin || user ? (
        <DashboardScreen
          navigation={navigation}
          isDrawer={true}
          handleClose={closeModal}
        />
      ) : (
        <StudentDashboardScreen
          navigation={navigation}
          isDrawer={true}
          handleClose={closeModal}
        />
      )}
    </Animated.View>
  );
};

export default ActionModal;

var styles = StyleSheet.create({
  modal: {
    height: deviceHeight,
    width: deviceWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ededed',
    justifyContent: 'center',
  },
});
