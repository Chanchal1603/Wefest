import React, {useState} from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
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
  directoryRequest,
  directoryRequestFail,
  directoryRequestSuccess,
} from '../../redux/actions/directoryActions';
import {API_BASE_URL} from '../../constants/ApiUrl';
import {useSelector, useDispatch} from 'react-redux';
import {alert} from "../../utils"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default AddNewDirectoryMemberModal = ({
  directoryData = null,
  onModalClose = () => console.log('modal close Btn'),
}) => {
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const {directory, loading} = useSelector(state => state.directoryState);

  const [directoryForm, setDirectoryForm] = React.useState(
    directoryData
      ? directoryData
      : {
          username: '',
          userRole: '',
          mail: '',
          phone: '',
          id: directory.length,
        },
  );

  const handleInputChange = (key, value) => {
    setDirectoryForm({
      ...directoryForm,
      [key]: value,
    });
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
        console.log(
          'response file-Uri',
          JSON.stringify(response.assets[0].uri),
        );
        setImageFile({
          fileData: response.assets[0],
          fileUri: response.assets[0].uri,
        });
      }
    });
  };

  //return true if empty value..
  const checkValues = () => {
    for (let key in directoryForm) if (directoryForm[key] == '') return true;
    return false;
  };

  const createFormData =  () => {

    const data = new FormData();
 if(imageFile !== null) 
    data.append('sendimage', {
      uri: imageFile.fileData.uri,
      name: imageFile.fileData.fileName,
      type: imageFile.fileData.type,
    });

    Object.keys(directoryForm).forEach((key) => {
      data.append(key, directoryForm[key]);
    });
    return data;
   
  };


  const findIndexofDirectoryForm = () => {
    for(let i = 0; i < directory.length ;i ++) 
    if(directory[i].id == directoryForm.id) return i;
  }

  const updateDirectory = async () => {
    if (!checkValues()) {
    const newDirectory = directory.filter(dir => dir.id != directoryForm.id);
    newDirectory.splice(findIndexofDirectoryForm(),0,directoryForm);
      dispatch(directoryRequest());

      try {
        let response = await fetch(`${API_BASE_URL}/updatedirectory.php`, {
          method: 'POST',
          body: createFormData(),
          headers: {
            'Content-Type': 'multipart/form-data; ',
          }
        });
        console.log("updtaed")
        dispatch(directoryRequestSuccess(newDirectory));
        onModalClose();
      } catch (error) {
        console.error(error);
        alert("Error","Something went wrong");
        dispatch(directoryRequestFail(newDirectory));
        onModalClose();
      }
    }
    else{
      alert('Warning', 'Fields cannot be empty');
    }
  };

  const addNewDirectory = async () => {
    if (!checkValues() && imageFile !== null ) {
      const newDirectory = [...directory, directoryForm];
      dispatch(directoryRequest());

      try {
        let response = await fetch(`${API_BASE_URL}/directoryadmin.php`, {
          method: 'POST',
          body: createFormData(),
          headers: {
            'Content-Type': 'multipart/form-data; ',
          }
        });
        dispatch(directoryRequestSuccess(newDirectory));
        onModalClose();
      } catch (error) {
        console.error(error);
        dispatch(directoryRequestFail(newDirectory));
        onModalClose();
      }
    }
    else{
      alert('Warning', 'Fields cannot be empty');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1, padding: 20}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <TouchableOpacity onPress={onModalClose}>
          <Feather name="x" size={30} />
        </TouchableOpacity>
        <View
          style={[
            globalStyles.screenView,
            {alignItems: 'center', justifyContent: 'space-around'},
          ]}>
          {imageFile === null ? (
            <TouchableOpacity
              onPress={chooseImage}
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
                backgroundColor: '#dd665c',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Feather name="camera" size={50} />
            </TouchableOpacity>
          ) : (
            <Image
              style={{height: 100, width: 100, borderRadius: 50}}
              source={{uri: imageFile.fileUri}}
            />
          )}

          <View
            style={{
              flex: 1,
              width: '100%',
            }}>
            <FormInput
              labelText="UserName"
              name="username"
              value={directoryForm.username}
              onChangeText={value => handleInputChange('username', value)}
            />
            <FormInput
              labelText="UserRole"
              name="userrole"
              value={directoryForm.userRole}
              onChangeText={value => handleInputChange('userRole', value)}
            />
            <FormInput
              labelText="Email "
              name="email"
              value={directoryForm.mail}
              onChangeText={value => handleInputChange('mail', value)}
            />
            <FormInput
              labelText="Phone no."
              name="phone"
              numeric
              value={directoryForm.phone}
              onChangeText={value => handleInputChange('phone', value)}
            />
          </View>

          <View>
            <ContainedButton
              btnText="Submit"
              onPress={() => {
                if (directoryData) updateDirectory();
                else addNewDirectory();
              }}
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
