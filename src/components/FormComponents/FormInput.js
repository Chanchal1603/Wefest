import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {inputFormStyles} from '../../styles/components/formStyles';

const FormInput = ({
  name,
  numeric,
  multiline = false,
  labelText = 'Input Label',
  placeHolder = 'Enter the placeholder',
  value = '',
  onChangeText = ()=>{},
  inputContainerStyle = {},
  inputStyle = {},
  labelStyle = {},
}) => {
  return (
    <View style={[inputFormStyles.inputContainer, inputContainerStyle]}>
      <Text style={[inputFormStyles.inputLabel, labelStyle]}>{labelText}</Text>
      {value ? (
        <TextInput
          placeholder={labelText}
          placeholderTextColor="grey"
          value={value}
          multiline={multiline}
          keyboardType={ numeric ?  "phone-pad" : "default"}
          numeric={numeric}
          onChangeText={onChangeText}
          style={[inputFormStyles.inputStyle, inputStyle]}
          secureTextEntry={name === 'password'}
        />
      ) : (
        <TextInput
         placeholder={labelText}
          placeholderTextColor="grey"
          multiline={multiline}
          onChangeText={onChangeText}
          keyboardType={ numeric ?  "phone-pad" : "default"}
          style={[inputFormStyles.inputStyle, inputStyle]}
          secureTextEntry={name === 'password'}
        />
      )}
    </View>
  );
};

export default FormInput;
