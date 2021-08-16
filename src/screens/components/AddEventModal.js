import React, {useState} from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FormInput from '../../components/FormComponents/FormInput';
import {globalStyles} from '../../styles/globalStyles';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ContainedButton from '../../components/Buttons/ContainedButton';
import {systemWeights, human} from 'react-native-typography';
import {
  eventRequest,
  eventRequestFail,
  eventRequestSuccess,
} from '../../redux/actions/eventActions';
import {API_BASE_URL} from '../../constants/ApiUrl';
import {useSelector, useDispatch} from 'react-redux';
import {setEventState} from './../../redux/actions/eventActions';
import {updateEventService} from './../../services/eventService';
import {checkEmptyField,alert} from "../../utils"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default AddeventModal = ({
  onModalClose = () => console.log('modal close Btn'),
}) => {
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const {events, loading, isEdit, selectedEvent} = useSelector(
    state => state.eventsState,
  );
  const [eventForm, setEventForm] = React.useState({
    id: selectedEvent ? selectedEvent.id : events.length,
    eventName: selectedEvent ? selectedEvent.event : '',
    eventDetails: selectedEvent ? selectedEvent.details : '',
    eventDate: selectedEvent ? selectedEvent.date : '',
  });

  const handleInputChange = (key, value) => {
    setEventForm({
      ...eventForm,
      [key]: value,
    });
  };



  const addNewEvent = async () => {
    if (!checkEmptyField(eventForm)) {
      const newEvent = [...events, eventForm];
      dispatch(eventRequest());

      try {
        let response = await fetch(`${API_BASE_URL}/eventadmin.php`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventForm),
        });
        dispatch(eventRequestSuccess(newEvent));
        onModalClose();
      } catch (error) {
        console.error(error);
        dispatch(eventRequestFail(newEvent));
        onModalClose();
      }
    }else{
      alert('Warning', 'Fields cannot be empty');
    }
  };


  const updateEvent = async () => {
    const {data, error} = await updateEventService(eventForm);
    if (data) {
      console.log(data);
      const updatedEvents = events.map(item => {
        if (item.id === eventForm.id) {
          return {
            id: eventForm,
            event: eventForm.eventName,
            details: eventForm.eventDetails,
            date: eventForm.eventDate,
          };
        } else {
          return item;
        }
      });
      dispatch(
        setEventState({
          isEdit: false,
          selectedEvent: null,
          events: updatedEvents,
        }),
      );
    }
    console.log(error);
  };
  return (
    <KeyboardAvoidingView style={{flex: 1, padding: 20}}>
      <TouchableOpacity
        onPress={() => {
          if (isEdit) {
            dispatch(
              setEventState({
                isEdit: false,
              }),
            );
          } else {
            onModalClose();
          }
        }}>
        <Feather name="x" size={30} />
      </TouchableOpacity>
      <View style={[globalStyles.screenView, {alignItems: 'center'}]}>
        <View
          style={{
            flex: 1,
            width: '100%',
          }}>
          <FormInput
            value={eventForm.eventName}
            labelText="Event Name"
            name="eventname"
            onChangeText={value => handleInputChange('eventName', value)}
          />
          <FormInput
            value={eventForm.eventDate}
            labelText="Event Date"
            name="eventdate"
            onChangeText={value => handleInputChange('eventDate', value)}
          />
          <FormInput
            value={eventForm.eventDetails}
            labelText="Event Details"
            name="eventdetails"
            onChangeText={value => handleInputChange('eventDetails', value)}
          />
        </View>

        <View>
          {isEdit ? (
            <ContainedButton
              btnText="Update"
              onPress={updateEvent}
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
          ) : (
            <ContainedButton
              btnText="Submit"
              onPress={addNewEvent}
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
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
