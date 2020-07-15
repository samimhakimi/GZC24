import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Devices from './Devices';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-tiny-toast';

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchData = async () => {
      const user_id = await AsyncStorage.getItem('id');
      const api_key = await AsyncStorage.getItem('api_key');
      if (user_id != null && api_key != null) {
        await axios
          .get(
            'https://www.gzc24.com/api-mobi/devices/' + user_id + '/' + api_key,
          )
          .then(res => {
            setDevices(res.data);
          })
          .catch(err => {});
      } else {
        navigation.push('SignInScreen');
      }
    };

    fetchData();
  }, [isFocused]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = await AsyncStorage.getItem('id');
      const api_key = await AsyncStorage.getItem('api_key');

      setuserData({user_id: user_id, api_key: api_key});
    };

    fetchUserData();
  }, []);

  const [userData, setuserData] = React.useState({
    user_id: '',
    api_key: '',
  });

  const [devices, setDevices] = useState([]);

  handleDelete = async id => {
    const userInfo = {
      user_id: userData.user_id,
      api_key: userData.api_key,
    };
    await axios
      .put('https://www.gzc24.com/api-mobi/device/remove/' + id, userInfo)
      .then(res => {
        let array = [...devices];
        let index = array.findIndex(e => e.id === id);
        array.splice(index, 1);
        setDevices([...array]);
        Toast.showSuccess('Device Archived');
      })
      .catch(err => {
        Toast.show('error', err);
      });
  };

  const renderRow = ({item}) => {
    var tempColor = item.last_alarm_status;
    if (tempColor == 'ok') {
      tempColor = 'green';
    } else {
      tempColor = 'red';
    }
    return (
      <TouchableOpacity>
        <View style={styles.item}>
          <View style={styles.FontAwesome}>
            <Text style={styles.id}>{item.id}</Text>
            <Text
              style={{
                marginLeft: '6%',
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
                  navigation.navigate('EditDevice', {
                    id: {id: item.id},
                  });
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
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addNewDevice}
          onPress={() => {
            navigation.navigate('AddNewDeviceScreen');
          }}>
          <Text style={styles.addNewDeviceText}>Add a new Device</Text>
        </TouchableOpacity>
        <View style={styles.list}>
          {devices.length != 0 &&
          devices.length != null &&
          devices.length != undefined ? (
            <FlatList
              data={devices}
              extraData={devices}
              renderItem={renderRow}
            />
          ) : (
            <View style={styles.noDevices}>
              <Icon name="tablet-cellphone" color="gray" size={25} />
              <Text>No Devices</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 40,
    flex: 1,
  },
  list: {
    marginTop: 20,
    flex: 1,
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
  noDevices: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
