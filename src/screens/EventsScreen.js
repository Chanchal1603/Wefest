import React from 'react';
import {View, FlatList, Modal} from 'react-native';
import AppHeader from '../components/AppHeader';
import {globalStyles} from '../styles/globalStyles';
import FilterView from '../components/FilterView';
import ContainedButton from '../components/Buttons/ContainedButton';
import EventCard from '../components/EventCard';
import {cardColors} from '../styles/components/eventCardStyles';
import {eventEditRoute} from '../navigation/screenNames';
import AddEventModal from './components/AddEventModal';
import {useSelector, useDispatch} from 'react-redux';
import PageLayout from '../containers/PageLayout';
import {
  eventRequest,
  eventRequestFail,
  eventRequestSuccess,
} from '../redux/actions/eventActions';
import {API_BASE_URL} from '../constants/ApiUrl';
import Loader from '../components/Loader';
import {setEventState} from './../redux/actions/eventActions';

const EventsScreen = ({navigation}) => {
  const [addEventModalVisible, setAddEventModalVisible] = React.useState(false);
  const {isAdmin} = useSelector(state => state.authState);
  const changeAddEventModalVisiblity = () => {
    setAddEventModalVisible(!addEventModalVisible);
  };
  const dispatch = useDispatch();
  const {events, loading, isEdit} = useSelector(state => state.eventsState);

  const getEventList = async () => {
    dispatch(eventRequest());
    try {
      let response = await fetch(`${API_BASE_URL}/eventuser.php`);
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

  console.log(events.length);
  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <View style={{flex: 1}}>
        <AppHeader title="Events" />
        <FilterView title="Earlier Events" />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}>
          <FlatList
            data={events}
            keyExtractor={(item, index) => 'key' + index}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <EventCard
                  date={item.date}
                  name={item.event}
                  showEdit={isAdmin}
                  onPressEdit={() => {
                    // navigation.navigate(eventEditRoute);
                    dispatch(
                      setEventState({
                        selectedEvent: item,
                        isEdit: true,
                      }),
                    );
                  }}
                  titleColor={cardColors[index % 4].titleColor}
                  cardColor={cardColors[index % 4].cardBg}
                  decorationColors={cardColors[index % 4].gradient}
                />
              );
            }}
          />
        </View>
        {isAdmin && (
          <View
            style={{
              paddingHorizontal: 35,
              paddingVertical: 15,
            }}>
            <ContainedButton
              onPress={changeAddEventModalVisiblity}
              btnText="Add New Event"
              isUpperCase={true}
              variant="secondary"
              btnStyle={{
                ...globalStyles.rowCenter,
              }}
              addIcon={true}
            />
          </View>
        )}

        <Modal
          animationType="slide"
          visible={addEventModalVisible || isEdit}
          onRequestClose={() => {
            changeAddEventModalVisiblity();
          }}>
          <AddEventModal onModalClose={changeAddEventModalVisiblity} />
        </Modal>
      </View>
    </PageLayout>
  );
};

export default EventsScreen;
