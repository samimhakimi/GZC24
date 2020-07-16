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
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditDevice = ({route, navigation}) => {
  const {id} = route.params;
  const deviceId = JSON.stringify(id.id);

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
    gzc24Id: deviceId,
    ShipmentName: '',
    minTemprature: '-10',
    maxTemprature: '40',
    plateNumber: '',
    transport_company: '',
    from: '',
    to: '',
    typeOfGood: '',
    isIdProvided: true,
  });

  const [notifyUserData, setNotifyUserData] = React.useState({
    email: '',
    notifyUserBtn: true,
    color: '',
  });

  const handleNotifyUser = val => {
    setNotifyUserData({
      ...notifyUserData,
      email: val,
      notifyUserBtn: false,
    });
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
      .put('https://www.gzc24.com/api-mobi/device/update/' + id.id, deviceData)
      .then(res => {
        const toast = Toast.showLoading('Loading...');
        setTimeout(() => {
          Toast.hide(toast);
          Toast.showSuccess('Device Updated Succesfully...');
          clearState();

          navigation.navigate('Home');
        }, 1000);
      })
      .catch(err => {
        Toast.show(err.response.data.error);
      });
  };

  const notify = async () => {
    const notifyUser = {
      user_id: data.user_id,
      api_key: data.api_key,
      viewers: notifyUserData.email,
    };

    await axios
      .put('https://www.gzc24.com/api-mobi/device/viewers/' + id.id, notifyUser)
      .then(res => {
        Toast.showSuccess('User Notification is enabled');
        clearState();
      })
      .catch(err => {
        Toast.show('Error');
        clearState();
      });
  };

  const clearState = () => {
    textInput.clear();
    textInput2.clear();
    textInput3.clear();
    textInput4.clear();
    textInput5.clear();
    textInput6.clear();
    textInput7.clear();
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: '#1D1D1B'}} />
      <View style={styles.goBack}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon.Button
            name="long-arrow-left"
            size={35}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
      </View>
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
                  placeholder={deviceId}
                  editable={false}
                  selectTextOnFocus={false}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="Shipment Name"
                  ref={input => {
                    this.textInput = input;
                  }}
                  onChangeText={val => handleShipmentName(val)}
                />
              </View>
              <TextInput
                placeholder="Email Address"
                style={styles.notifyUser}
                onChangeText={val => handleNotifyUser(val)}
                ref={input => {
                  this.textInput7 = input;
                }}
              />
              <TouchableOpacity
                disabled={notifyUserData.notifyUserBtn}
                onPress={notify}
                style={styles.notifyUserBtn}>
                <Text style={styles.addNewDeviceText}>
                  <FontAwesome name="info-circle" size={18} />
                  {'  '}Notify User
                </Text>
              </TouchableOpacity>
              <Text style={styles.alertLimits}>Alert Limits</Text>

              <View style={styles.textInputDesign}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Min. Temperature Limit (°C)"
                  keyboardType="number-pad"
                  onChangeText={val => handleMinTemprature(val)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Max. Tempretaure Limit (°C)"
                  keyboardType="number-pad"
                  onChangeText={val => handleMaxTemprature(val)}
                />
              </View>
              <Text style={styles.alertLimits}>Shipping Info</Text>
              <View style={styles.textInputDesign}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Truck Plate Number"
                  ref={input => {
                    this.textInput4 = input;
                  }}
                  onChangeText={val => handleTruckNumber(val)}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="Transport Company"
                  ref={input => {
                    this.textInput3 = input;
                  }}
                  onChangeText={val => handleTCompany(val)}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="From"
                  ref={input => {
                    this.textInput2 = input;
                  }}
                  onChangeText={val => handleFrom(val)}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="To"
                  ref={input => {
                    this.textInput5 = input;
                  }}
                  onChangeText={val => handleTo(val)}
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="Type of Good"
                  ref={input => {
                    this.textInput6 = input;
                  }}
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
    </>
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
  notifyUser: {
    padding: 10,
    width: '50%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
  },
  goBack: {
    width: '100%',
    backgroundColor: '#1D1D1B',
    height: '6%',
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
  notifyUserBtn: {
    marginTop: 8,
    backgroundColor: '#FDEF69',
    borderRadius: 10,
    width: '40%',
    alignContent: 'center',
    alignSelf: 'center',
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
