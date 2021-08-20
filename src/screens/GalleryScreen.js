import React from 'react';
import {FlatList, View, Text, Image, ActivityIndicator} from 'react-native';
import CheckBox from 'react-native-check-box';
import AppHeader from '../components/AppHeader';
import ContainedButton from '../components/Buttons/ContainedButton';
import {galleryScreenStyles} from '../styles/screens/galleryScreenStyles';
import {globalStyles} from '../styles/globalStyles';
import FilterView from '../components/FilterView';
import {human} from 'react-native-typography';
import {useSelector, useDispatch} from 'react-redux';
import PageLayout from './../containers/PageLayout';
import {
  galleryRequest,
  galleryRequestFail,
  galleryRequestSuccess,
} from '../redux/actions/galleryActions';
import Loader from '../components/Loader';
import {API_BASE_URL} from '../constants/ApiUrl';
import * as ImagePicker from 'react-native-image-picker';
import {alert} from '../utils';

const GalleryItem = ({item, isEdit, markImage}) => {
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

  const addImageToDelete = id => {
    setToggleCheckBox(!toggleCheckBox);
    markImage(id);
  };

  const showCheckBox = () => {
    if (isEdit) {
      return (
        <View style={galleryScreenStyles.checkboxView}>
          <CheckBox
            isChecked={toggleCheckBox}
            unCheckedImage={
              <View
                style={{
                  backgroundColor: '#fafafa',
                  height: 18,
                  width: 18,
                  marginTop: 3,
                  marginRight: 3,
                }}></View>
            }
            addImageToDelete
            onClick={() => addImageToDelete(item.id)}
            uncheckedCheckBoxColor="grey"
            checkBoxColor="#fff"
          />
        </View>
      );
    }
    return null;
  };
  return (
    <View style={galleryScreenStyles.galleryItem}>
      <Image
        style={{height: '100%', width: '100%', borderRadius: 10}}
        source={{uri: `${API_BASE_URL}/upload/${item.image}`}}
        onLoad={()=><ActivityIndicator size="small" color="#FFF" />}
      />
      {showCheckBox()}
    </View>
  );
};

const GalleryScreen = () => {
  const [isEdit, setIsEdit] = React.useState(false);
  const {isAdmin} = useSelector(state => state.authState);
  const dispatch = useDispatch();
  const {gallery, loading} = useSelector(state => state.galleryState);
  const [removeImageid, setRemoveImageId] = React.useState([]);

  const getImageList = async () => {
    dispatch(galleryRequest());
    try {
      let response = await fetch(`${API_BASE_URL}/galleryuser.php`);
      let json = await response.json();
      console.log(json);
      dispatch(galleryRequestSuccess(json));
    } catch (error) {
      console.error(error);
      dispatch(galleryRequestFail(error));
    }
  };

  const addIdToRemoveImage = id => {
    if (!removeImageid.includes(id)) setRemoveImageId([...removeImageid, id]);
    else {
      let newDeleteImage = removeImageid.filter(img => img !== id);
      setRemoveImageId(newDeleteImage);
    }
  };

  const deleteImage = () => {
    removeImageid.map(async id => {
      dispatch(galleryRequest());
      try {
        let res = await fetch(`${API_BASE_URL}/deletegallery.php`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id: id}),
        });
        let responseJson = await res.json();
      } catch (e) {
        console.log(e);
        alert('Error', 'Something went wrong');
        dispatch(galleryRequestFail(error));
      }
    });
    let newImages = gallery.filter(img => !removeImageid.includes(img.id));
    dispatch(galleryRequestSuccess(newImages));
    alert('Successfull', 'Images Deleted...');
  };

  const chooseImage = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        uploadImage(response.assets[0]);
      }
    });
  };

  const uploadImage = async fileData => {
    dispatch(galleryRequest());
    const data = new FormData();

    data.append('sendimage', {
      uri: fileData.uri,
      name: fileData.fileName,
      type: fileData.type,
    });

    try {
      let res = await fetch(`${API_BASE_URL}/galleryadmin.php`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      });
      let responseJson = await res.json();
      let newImages = [
        ...gallery,
        {id: gallery.length, image: responseJson.path},
      ];
      dispatch(galleryRequestSuccess(newImages));
      alert('Successfull', 'Image Uploaded');
    } catch (e) {
      console.log(e);
      alert('Error', 'Something went wrong');
      dispatch(galleryRequestFail(error));
    }
  };

  React.useEffect(() => {
    getImageList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <PageLayout>
      <View style={globalStyles.rootView}>
        <AppHeader title="Gallery" />
        <FilterView
          showBackBtn={isEdit}
          onPressBackBtn={() => setIsEdit(false)}
        />
        <View style={galleryScreenStyles.listView}>
          <FlatList
            numColumns={2}
            data={gallery}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={({item}) => {
              return (
                <GalleryItem
                  markImage={addIdToRemoveImage}
                  item={item}
                  isEdit={isEdit}
                />
              );
            }}
          />
        </View>
        {isAdmin &&
          (isEdit ? (
            <View style={galleryScreenStyles.actionsView1}>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text style={human.body}>Select images to remove or edit.</Text>
              </View>
              <ContainedButton
                btnText="Remove Images"
                onPress={deleteImage}
                variant="secondary"
                btnStyle={{
                  marginBottom: 15,
                }}
              />
              <ContainedButton btnText="Edit Images" variant="secondary" />
            </View>
          ) : (
            <View style={galleryScreenStyles.actionsView}>
              <ContainedButton
                btnText="Remove/Edit Images"
                variant="secondary"
                btnStyle={{
                  marginBottom: 10,
                }}
                onPress={() => setIsEdit(true)}
              />
              <ContainedButton
                btnText="Add Images"
                variant="secondary"
                onPress={chooseImage}
                addIcon={true}
                btnStyle={{
                  marginBottom: 10,
                }}
              />
              <ContainedButton
                btnText="Add Details"
                variant="secondary"
                addIcon={true}
              />
            </View>
          ))}
      </View>
    </PageLayout>
  );
};

export default GalleryScreen;
