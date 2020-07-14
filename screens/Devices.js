import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default function Devices({item, navigation}) {
  useEffect(() => {
    const fetchData = async () => {
      const user_id = await AsyncStorage.getItem('id');
      const api_key = await AsyncStorage.getItem('api_key');

      setData({user_id: user_id, api_key: api_key});
    };

    fetchData();
  }, []);

  const [data, setData] = React.useState({
    user_id: '',
    api_key: '',
  });

  var tempColor = item.last_alarm_status;
  if (tempColor == 'ok') {
    tempColor = 'green';
  } else {
    tempColor = 'red';
  }

  handleDelete = async id => {
    const userInfo = {
      user_id: data.user_id,
      api_key: data.api_key,
    };
    await axios
      .put('https://www.gzc24.com/api-mobi/device/remove/' + id, userInfo)
      .then(res => {
        console.warn('Success');
      })
      .catch(err => {
        console.warn('Error', id);
      });
  };

  return (
    <TouchableOpacity>
      <View style={styles.item}>
        <View style={styles.FontAwesome}>
          <Text style={styles.id}>{item.id}</Text>
          <Text
            style={{
              marginLeft: 40,
              fontSize: 16,
              fontWeight: 'bold',
              color: tempColor,
            }}>
            {item.last_temperature ? item.last_temperature + ' °C' : ''}
          </Text>
          <View style={styles.buttonsView}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <FontAwesome
                style={{marginRight: 10}}
                name="trash-o"
                color="red"
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate('EditDevice', {p: 'Profile'});
              }}>
              <FontAwesome
                style={{marginRight: 10}}
                name="edit"
                color="black"
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DeviceInfor', {
                  id: {id: item.id},
                });
              }}>
              <FontAwesome name="eye" color="black" size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lastDateTime}>
          <Text numberOfLines={1} style={styles.shipmentName}>
            {item.shipment_name}
          </Text>
          <Text>{item.last_date_time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    flex: 1,
  },
  FontAwesome: {
    flexDirection: 'row',
    flex: 1,
  },
  lastTemperature: {
    marginLeft: 40,
    fontSize: 16,
    fontWeight: 'bold',
  },
  shipmentName: {
    marginRight: 10,
    width: 80,
  },
  lastDateTime: {
    flexDirection: 'row',
  },
  buttonsView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addNewDevice: {
    backgroundColor: '#FDEF69',

    borderRadius: 10,
  },
  addNewDeviceText: {
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
