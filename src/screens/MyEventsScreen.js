import React from 'react';
import {View, FlatList} from 'react-native';
import AppHeader from '../components/AppHeader';
import EventCard from '../components/EventCard';
import PageLayout from '../containers/PageLayout';
import {cardColors} from '../styles/components/eventCardStyles';
import {useSelector, useDispatch} from 'react-redux';
import {
  eventRequest,
  eventRequestFail,
  eventRequestSuccess,
} from '../redux/actions/eventActions';
import {API_BASE_URL} from '../constants/ApiUrl';
import Loader from '../components/Loader';
import {setEventState} from './../redux/actions/eventActions';

const MyEventsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {events, loading, isEdit} = useSelector(state => state.eventsState);
  const {user} = useSelector(state => state.authState);


  const getEventList = async () => {
    dispatch(eventRequest());
    try {
      let response = await fetch(`${API_BASE_URL}/myevents.php`,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"email":user.email}),
      });
      let json = await response.json();
      dispatch(eventRequestSuccess(json));
    } catch (error) {
      console.error(error);
      dispatch(eventRequestFail(json));
    }
  };

  React.useEffect(() => {
    getEventList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <View style={{flex: 1}}>
        <AppHeader title="My Events" />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 15,
          }}>
          <FlatList
            data={events}
            keyExtractor={item => item}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <EventCard
                  date={item.date}
                  name={item.event}
                  onPressEdit={() => {
                    navigation.navigate(eventEditRoute);
                  }}
                  titleColor={cardColors[index % 4].titleColor}
                  cardColor={cardColors[index % 4].cardBg}
                  decorationColors={cardColors[index % 4].gradient}
                  showEdit={false}
                />
              );
            }}
          />
        </View>
      </View>
    </PageLayout>
  );
};

export default MyEventsScreen;
