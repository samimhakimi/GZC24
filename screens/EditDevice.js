import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';

const EditDevice = props => {
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
    gzc24Id: '',
    ShipmentName: '',
    minTemprature: -10,
    maxTemprature: 40,
    plateNumber: '',
    transport_company: '',
    from: '',
    to: '',
    typeOfGood: '',
    isIdProvided: true,
  });

  const handleGzc24IdChange = val => {
    if (val.trim().length != 0) {
      setData({
        ...data,
        gzc24Id: val,
        isIdProvided: true,
      });
    } else if (typeof val == 'number') {
      setData({
        ...data,
        gzc24Id: val,
        isIdProvided: false,
      });
    } else {
      setData({
        ...data,
        gzc24Id: '',
        isIdProvided: false,
      });

      Alert.alert('Only Numbers allowed');
    }
  };

  const handleShipmentName = val => {
    setData({
      ...data,
      ShipmentName: val,
    });
  };

  const handleMinTemprature = val => {
    setData({
      ...data,
      minTemprature: val,
    });
  };

  const handleMaxTemprature = val => {
    setData({
      ...data,
      maxTemprature: val,
    });
  };

  const handleTruckNumber = val => {
    setData({
      ...data,
      plateNumber: val,
    });
  };

  const handleFrom = val => {
    setData({
      ...data,
      from: val,
    });
  };

  const handleTo = val => {
    setData({
      ...data,
      to: val,
    });
  };

  const handleTypeOfGood = val => {
    setData({
      ...data,
      typeOfGood: val,
    });
  };
  const handleTCompany = val => {
    setData({
      ...data,
      transport_company: val,
    });
  };

  const addNow = async () => {
    //{
    // "user_id":"1",
    // "api_key":"10470c3b4b",
    // "shipment_name":"shipment name",
    // "min":5,
    // "max":30,
    // "shipped_from":"Adana",
    // "shipped_to":"stockholm",
    // "transport_company":"Gokdeniz",
    // "goods":"Strawberries",
    // "plate_no":"35 ABC 221"
    // }

    const deviceData = {
      user_id: data.user_id,
      api_key: data.api_key,
      shipment_name: data.ShipmentName,
      min: data.minTemprature,
      max: data.maxTemprature,
      shipped_from: data.from,
      shipped_to: data.to,
      transport_company: data.transport_company,
      goods: data.typeOfGood,
      plate_no: data.plateNumber,
    };

    await axios
      .put(
        'https://www.gzc24.com/api-mobi/device/update/' + data.gzc24Id,
        deviceData,
      )
      .then(res => {
        const toast = Toast.showLoading('Loading...');
        setTimeout(() => {
          Toast.hide(toast);
          Toast.show('Device Updated Succesfully...');
        }, 1000);
      })
      .catch(err => {
        Toast.show(err.response.data.error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ios: 100, android: 500})}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <StatusBar barStyle="light-content" />
          <View>
            <View style={styles.textInputDesign}>
              <TextInput
                style={styles.textInput}
                placeholder="GZC24ID"
                keyboardType="number-pad"
                maxLength={8}
                onChangeText={val => handleGzc24IdChange(val)}
              />

              {data.isIdProvided ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>GZC24 id is Mandatory.</Text>
                </Animatable.View>
              )}

              <TextInput
                style={styles.textInput}
                placeholder="Shipment Name"
                onChangeText={val => handleShipmentName(val)}
              />
            </View>
            <Text style={styles.alertLimits}>Alert Limits</Text>

            <View style={styles.textInputDesign}>
              <TextInput
                style={styles.textInput}
                placeholder="Min. Temperature Limit (°C)"
                defaultValue="-10"
                keyboardType="number-pad"
                onChangeText={val => handleMinTemprature(val)}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Max. Tempretaure Limit (°C)"
                defaultValue="40"
                keyboardType="number-pad"
                onChangeText={val => handleMaxTemprature(val)}
              />
            </View>
            <Text style={styles.alertLimits}>Shipping Info</Text>
            <View style={styles.textInputDesign}>
              <TextInput
                style={styles.textInput}
                placeholder="Truck Plate Number"
                onChangeText={val => handleTruckNumber(val)}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Transport Company"
                onChangeText={val => handleTCompany(val)}
              />

              <TextInput
                style={styles.textInput}
                placeholder="From"
                onChangeText={val => handleFrom(val)}
              />

              <TextInput
                style={styles.textInput}
                placeholder="To"
                onChangeText={val => handleTo(val)}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Type of Good"
                onChangeText={val => handleTypeOfGood(val)}
              />
            </View>

            <TouchableOpacity style={styles.addNewDevice} onPress={addNow}>
              <Text style={styles.addNewDeviceText}>
                <FontAwesome name="plus-circle" size={18} /> Update
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  textInput: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  alertLimits: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },

  addNewDevice: {
    backgroundColor: '#FDEF69',
    borderRadius: 10,
    width: '80%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  addNewDeviceText: {
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  textInputDesign: {
    width: '80%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  errorMsg: {
    color: '#FF0200',
    fontSize: 14,
  },
});
