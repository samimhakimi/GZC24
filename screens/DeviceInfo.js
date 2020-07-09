import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import HighchartsReactNative from '@highcharts/highcharts-react-native';
//import {DataTable} from 'react-native-paper';
import Datatable from './Datatable';
const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const DeviceInfo = ({navigation, route}) => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [table, setTable] = useState(false);

  const {id} = route.params;
  const modalId = JSON.stringify(id.id);

  const [device, setDeviceInfo] = useState([
    {
      date: '13.05.2020 01:29',
      temp: '15.3',
      lat: '55.912278',
      lng: '39.124434',
    },
    {
      date: '13.05.2020 01:29',
      temp: '15.3111',
      lat: '55.912278',
      lng: '39.124434',
    },
  ]);
  const [deviceTable, setDeviceTable] = useState([
    {
      date: '13.05.2020 01:29',
      temp: '15.3',
      lat: '55.912278',
      lng: '39.124434',
    },
    {
      date: '13.05.2020 01:29',
      temp: '15.3',
      lat: '55.912278',
      lng: '39.124434',
    },
  ]);

  var finalArray = deviceTable.map(function(obj) {
    return parseFloat(obj.temp);
  });
  var finalArray2 = deviceTable.map(function(obj) {
    return obj.date;
  });

  const options = {
    title: {
      text: 'Temprerature',
    },
    xAxis: {
      categories: finalArray2,
    },
    maxPadding: 0.05,
    series: [
      {
        name: 'data',
        data: finalArray,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('https://gzc24.com/api-mobi/device/info/' + modalId)
        .then(res => {
          setDeviceInfo(res.data);
        })
        .catch(err => {
          Alert.alert('Error Please try agian...');
        });

      await axios
        .get(`https://gzc24.com/api-mobi/device/data/${modalId}/all`)
        .then(res => {
          if (res.data[0].temp != null) {
            setDeviceTable(res.data);
            setTable(true);
            setLat(res.data[0].lat);
            setLong(res.data[0].lng);
          }
        })
        .catch(err => {
          Alert.alert('All, Error Please try agian...');
        });
    };

    fetchData();
  }, []);

  const [page, setPage] = React.useState(1);

  if (deviceTable.length == 0) {
    return (
      <View style={styles.ActivityIndicator}>
        <ActivityIndicator size="large" />
        <TouchableOpacity>
          <Text style={styles.goBackk}>Please Wait...</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (device.length == 0) {
    return (
      <View style={styles.ActivityIndicator}>
        <ActivityIndicator size="large" />
        <TouchableOpacity>
          <Text style={styles.goBackk}>Please Wait...</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
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
        <ScrollView>
          <View style={styles.container}>
            <View style={{width: '100%', height: '35%'}}>
              <View>
                <Text style={styles.truckDetails}>
                  Track#{id ? modalId : ''} /
                  {device ? device.shipping_name : ''}
                </Text>
              </View>
              <View>
                <Text style={styles.plateNumber}>
                  Plate No: {'                  '} {device.plate_no}
                </Text>
                <Text style={styles.fromTo}>
                  From / To{'         '} {device.shipped_from} /{' '}
                  {device.shipped_to}
                </Text>

                <Text style={styles.minMax}>
                  Min / Max {'                  '} {device.limit_min} ..{' '}
                  {device.limit_max} °C
                </Text>
              </View>

              <View style={styles.maps}>
                <Text style={styles.location}>Location</Text>

                <MapView
                  style={styles.map}
                  showsUserLocation={false}
                  followUserLocation={false}
                  provider={PROVIDER_GOOGLE}
                  zoomControlEnabled={true}
                  //   zoomTapEnabled={true}
                  zoomControlEnabled={true}
                  region={{
                    latitude: parseFloat(lat) ? parseFloat(lat) : 12.12323,
                    longitude: parseFloat(long) ? parseFloat(long) : -12.12323,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(lat) ? parseFloat(lat) : 12.12323,
                      longitude: parseFloat(long)
                        ? parseFloat(long)
                        : -12.12323,
                    }}
                    title={'GZC24'}
                  />
                </MapView>

                <View>
                  <Text style={styles.temprature}>Temprature</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '80%',
                height: '30%',
              }}>
              <HighchartsReactNative
                provider={PROVIDER_GOOGLE}
                styles={styles.container2}
                options={options}
                useCDN={true}
                useSSL={true}
                loader={true}
                //
              />
            </View>
            <View
              style={{
                marginTop: Platform.OS == 'android' ? 200 : 100,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              {table && (
                <Datatable
                  header={[
                    {
                      name: 'Date/Time',
                      attr: 'date',
                    },
                    {
                      name: 'Temperature',
                      attr: 'temp',
                      sortDirection: 'ascending',
                    },
                  ]}
                  datatable={deviceTable}
                  page={page}
                  perPage={4}
                  style={{backgroundColor: '#fff'}}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
};

export default DeviceInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  goBack: {
    width: '100%',
    backgroundColor: '#1D1D1B',
    height: '6%',
  },
  truckDetails: {
    fontSize: 20,
    marginTop: Platform.OS == 'android' ? '10%' : 10,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  fromTo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  minMax: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  location: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  map: {
    height: '55%',
    margin: 20,
    borderRadius: 10,
  },
  temprature: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  maps: {},
  ActivityIndicator: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackk: {
    margin: 20,
    fontWeight: 'bold',
  },
  container2: {
    flex: 1,
  },
});
