import React from 'react';
import {Text, View} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import {globalStyles} from '../styles/globalStyles';
import IconButton from '../components/Buttons/IconButton';
import {human} from 'react-native-typography';

const FilterView = ({
  title = '',
  showBackBtn = false,
  onPressFilterBtn,
  onPressBackBtn,
}) => {
  return (
    <View
      style={[
        title !== '' || showBackBtn ? globalStyles.rowSb : globalStyles.rowEnd,
        {
          paddingVertical: 10,
          paddingHorizontal: 18,
        },
      ]}>
      {title !== '' && (
        <View>
          <Text style={human.title2}>{title}</Text>
        </View>
      )}
      {showBackBtn && (
        <IconButton
          onPress={onPressBackBtn}
          icon={
            <MaterialIcon
              name="chevron-left"
              style={{
                fontSize: 32,
                color: Colors.secondary,
              }}
            />
          }
        />
      )}

    </View>
  );
};

export default FilterView;
