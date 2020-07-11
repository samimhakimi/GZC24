import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default function ArDevices({item, navigation}) {
  useEffect(() => {
    const fetchData = async () => {
      const user_id = await AsyncStorage.getItem('id');
      const api_key = await AsyncStorage.getItem('api_key');

      setData({user_id: user_id, api_key: api_key});
    };

    fetchData();
  }, []);

  var tempColor = item.last_alarm_status;
  if (tempColor == 'ok') {
    tempColor = 'green';
  } else {
    tempColor = 'red';
  }

  const [data, setData] = React.useState({
    user_id: '',
    api_key: '',
  });

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
          <View style={styles.buttonsView} />
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
});
