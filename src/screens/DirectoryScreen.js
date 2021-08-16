import React from 'react';

import {
  Text,
  View,
  Image,
  FlatList,
  Modal,
  Linking,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import ContainedButton from '../components/Buttons/ContainedButton';
import FilterView from '../components/FilterView';
import {globalStyles} from '../styles/globalStyles';
import ExpandedCard from '../components/ExpandedCard';
import IconButton from '../components/Buttons/IconButton';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';
import {human} from 'react-native-typography';
import AddNewDirectoryMemberModal from './components/AddNewDirectoryMemberModal';
import {useSelector, useDispatch} from 'react-redux';
import PageLayout from '../containers/PageLayout';
import Loader from '../components/Loader';

import {
  directoryRequest,
  directoryRequestFail,
  directoryRequestSuccess,
} from '../redux/actions/directoryActions';
import {API_BASE_URL} from '../constants/ApiUrl';

const DirectoryItem = ({item, isAdmin, onEditDetailsPress}) => {
  const [open, setOpen] = React.useState(false);

  const contentLeft = () => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        source={{
          uri: item.imgpath,
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          marginRight: 10,
        }}
      />
      <View>
        <Text style={human.title3White}>{item.username}</Text>
        <Text style={{...human.bodyWhiteObject, marginTop: 5}}>
          {`${item.userRole}`.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  const contentRight = () => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <IconButton
        onPress={() => {
          console.log('pressed');
          Linking.openURL(`mailto:${item.mail}`);
        }}
        icon={
          <FeatherIcon
            name="mail"
            style={{
              color: '#fff',
              fontSize: 32,
            }}
          />
        }
        btnStyle={{
          backgroundColor: '#ED4435',
          borderRadius: 25,
          marginRight: 10,
        }}
      />
      <IconButton
        onPress={() => Linking.openURL(`tel:${item.phone}`)}
        icon={
          <FeatherIcon
            name="phone"
            style={{
              color: '#fff',
              fontSize: 32,
            }}
          />
        }
        btnStyle={{
          backgroundColor: '#35C635',
          borderRadius: 25,
        }}
      />
    </View>
  );
  return (
    <ExpandedCard
      cardColor={Colors.secondary}
      expanded={open}
      onPress={() => setOpen(!open)}
      onEditPress={()=>onEditDetailsPress(item)}
      disabled={!isAdmin}
      cardContent={
        <View style={{...globalStyles.rowSb, flex: 1}}>
          {contentLeft()}
          {contentRight()}
        </View>
      }
      buttonStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

const DirectoryScreen = () => {
  const {isAdmin} = useSelector(state => state.authState);
  const [directoryModalVisiblity, setDirectoryModalVisiblity] =
    React.useState(false);

  const [editDirectoryData, setEditDirectoryData] = React.useState(null);

  const dispatch = useDispatch();
  const {directory, loading} = useSelector(state => state.directoryState);

  const changeAddDirectoryModalVisiblity = () => {
    setDirectoryModalVisiblity(!directoryModalVisiblity);
  };

  const onEditDetailsPress = (item) => {
    setEditDirectoryData(item);
    changeAddDirectoryModalVisiblity();
  }

  const renderSeparator = () => (
    <View
      style={{
        backgroundColor: 'grey',
        height: 1,
      }}
    />
  );

  const getDirectoryList = async () => {
    dispatch(directoryRequest());

    try {
      let response = await fetch(`${API_BASE_URL}/directoryuser.php`);
      let json = await response.json();
      dispatch(directoryRequestSuccess(json));
    } catch (error) {
      console.error(error);
      dispatch(directoryRequestFail(json));
    }
  };

  React.useEffect(() => {
    getDirectoryList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <View style={globalStyles.rootView}>
        <AppHeader title="Directory" />
        <FilterView />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
          <FlatList
            data={directory}
            keyExtractor={(item, index) => 'key' + index}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({item}) => {
              return <DirectoryItem 
              onEditDetailsPress={onEditDetailsPress}
              item={item} isAdmin={isAdmin} />;
            }}
          />
        </View>
        {isAdmin && (
          <View
            style={{
              paddingVertical: 30,
              paddingHorizontal: 30,
            }}>
            <ContainedButton
              onPress={()=>{
                setEditDirectoryData(null);
                changeAddDirectoryModalVisiblity();
              }}
              btnText="Add New Member"
              addIcon={true}
              variant="secondary"
              btnStyle={{
                ...globalStyles.rowCenter,
                height: 55,
                borderRadius: 15,
              }}
            />
          </View>
        )}

        <Modal
          animationType="slide"
          visible={directoryModalVisiblity}
          onRequestClose={() => {
            changeAddDirectoryModalVisiblity();
          }}>
          <AddNewDirectoryMemberModal
            directoryData={editDirectoryData}
            onModalClose={changeAddDirectoryModalVisiblity}
          />
        </Modal>
      </View>
    </PageLayout>
  );
};

export default DirectoryScreen;
