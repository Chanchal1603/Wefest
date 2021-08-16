import React from 'react';
import {Image, Text, View} from 'react-native';
import AppHeader from '../components/AppHeader';
import {leaderpointsScreenStyles as styles} from './../styles/screens/leaderpointsScreenStyles';
import LeaderPointsImage from '../assets/leaderpoints.png';
import {human, systemWeights} from 'react-native-typography';
import {API_BASE_URL} from '../constants/ApiUrl';
import {useSelector, useDispatch} from 'react-redux';
import Loader  from '../components/Loader';

const LeaderpointsScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const [points, setPoints] = React.useState(null);
  const {user} = useSelector(state => state.authState);

  const getPoints = async () => {
    try {
      let response = await fetch(`${API_BASE_URL}/mypoint.php`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"email":user.email}),
      });
      let json = await response.json();
      setLoading(false);
      setPoints(json[0].points);
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  React.useEffect(() => {
    getPoints();
  }, []);

  return loading ? <Loader /> : (
    <View style={{flex: 1}}>
      <AppHeader title="Leaderpoints" />
      <View style={styles.container}>
        <View style={styles.circle}></View>
        <View style={styles.card}>
          <Image source={LeaderPointsImage} style={styles.coins} />
          <View style={styles.titleView}>
            <Text style={[human.title1, styles.titleText]}>Robert</Text>
          </View>
          <View style={styles.pointsView}>
            <Text style={[human.title1White, systemWeights.bold]}>
              {points}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LeaderpointsScreen;
