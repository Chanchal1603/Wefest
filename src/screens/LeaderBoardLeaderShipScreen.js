import React from 'react';
import {Text, View, FlatList, Dimensions, Image} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import {leaderBoardLeaderShipStyles} from '../styles/screens/leaderBoardLeaderShipStyles';
import AppHeaderWithImage from '../components/AppHeaderWithImage';
import {
  leaderBoardRequest,
  leaderBoardRequestFail,
  leaderBoardRequestSuccess,
} from '../redux/actions/leaderBoardAction';
import Loader from "../components/Loader";
import {API_BASE_URL} from "../constants/ApiUrl";
import {useSelector, useDispatch} from 'react-redux';


const LeaderBoardCard = ({imageUrl, userName, userPoints}) => (
  <View style={leaderBoardLeaderShipStyles.container}>
    <View style={[leaderBoardLeaderShipStyles.leaderBoardCardStyle, {flex: 2}]}>
      <Image
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
        }}
        source={{uri: imageUrl}}
      />
      <Text style={leaderBoardLeaderShipStyles.leaderBoardCardTextStyle}>
        {userName}
      </Text>
    </View>
    <View style={leaderBoardLeaderShipStyles.leaderBoardCardStyle}>
      <Text style={leaderBoardLeaderShipStyles.leaderBoardCardTextStyle}>
        {userPoints}
      </Text>
      <Image
        style={{
          height: 30,
          width: 30,
        }}
        source={require('../assets/badge.jpeg')}
      />
    </View>
  </View>
);

function LeaderBoardLeaderShipScreen({navigation}) {
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

  const dispatch = useDispatch();
  const {leaderBoard, loading} = useSelector(state => state.leaderBoardState);

  const getLeadersList = async () => {
    dispatch(leaderBoardRequest());
    try {
      let response = await fetch(`${API_BASE_URL}/leaderboard.php`);
      let json = await response.json();
      console.log(json);
      dispatch(leaderBoardRequestSuccess(json));
      console.log(leaderBoard);
    } catch (error) {
      console.error(error);
      dispatch(leaderBoardRequestFail(json));
    }
  };

  React.useEffect(() => {
    getLeadersList();
  }, []);

  return loading ? <Loader /> : (
    <View style={globalStyles.rootView}>
      <AppHeaderWithImage title={'Leaderboard Chart'} />
      <View
        style={{
          flex: 1,
          marginTop: 20,
        }}>
        <FlatList
          data={leaderBoard}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => `${item.firstname} ${item.lastname}`}
          renderItem={({item}) => (
            <LeaderBoardCard
              userName={`${item.firstname} ${item.lastname}`}
              imageUrl={
                'data:image/png;base64,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'
              }
              userPoints={item.points}
            />
          )}
        />
      </View>
    </View>
  );
}

export default LeaderBoardLeaderShipScreen;
