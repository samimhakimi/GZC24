import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Devices from './Devices';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation}) => {
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
  }, []);

  const [devices, setDevices] = useState([]);

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
          {devices ? (
            <FlatList
              data={devices}
              renderItem={({item}) => (
                <Devices navigation={navigation} item={item} key={1} />
              )}
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
});
