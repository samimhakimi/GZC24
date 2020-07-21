import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import HighchartsReactNative from '@highcharts/highcharts-react-native';

import Datatable from './Datatable';

const DeviceInfo = ({navigation, route}) => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [animating, setAnimating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const {id} = route.params;
  const modalId = JSON.stringify(id.id);

  const closeActivityIndicator = () =>
    setTimeout(() => setAnimating(false), 3000);

  const [device, setDeviceInfo] = useState([
    {
      date: '13.05.2020 01:29',
      temp: '15.0',
      lat: '55.912278',
      lng: '39.124434',
    },
    {
      date: '13.05.2020 01:29',
      temp: '1',
      lat: '55.912278',
      lng: '39.124434',
    },
  ]);
  const [deviceTable, setDeviceTable] = useState([
    {
      date: '13.05.2020 01:29',
      temp: '1',
      lat: '55.912278',
      lng: '39.124434',
    },
    {
      date: '13.15.2020 01:29',
      temp: '1',
      lat: '55.912278',
      lng: '39.124434',
    },
  ]);

  var finalArray = deviceTable
    .map(function(obj) {
      return parseFloat(obj.temp);
    })
    .reverse();
  var finalArray2 = deviceTable.map(function(obj) {
    return obj.date;
  });

  const options = {
    title: {
      text: 'Sıcaklık Grafiği',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: finalArray2,
      scrollbar: {
        enabled: true,
      },
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
    closeActivityIndicator();
  });

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('https://gzc24.com/api-mobi/device/info/' + id.id)
        .then(res => {
          setDeviceInfo(res.data);
          setLoading(true);
        })
        .catch(err => {
          Alert.alert('Network error, please try agian...');
        });

      await axios
        .get(`https://gzc24.com/api-mobi/device/data/${id.id}/all`)
        .then(res => {
          if (res.data != 'error') {
            setDeviceTable(res.data);
            setLat(res.data[0].lat);
            setLong(res.data[0].lng);
            setLoading2(true);
          }
        })
        .catch(err => {
          Alert.alert('Network error, please try agian...');
        });
    };

    fetchData();
  }, []);

  const [page, setPage] = React.useState(1);

  if (loading && loading2) {
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
                  {device.plate_no
                    ? 'Plaka No:              ' + device.plate_no
                    : null}
                </Text>
                <Text style={styles.fromTo}>
                  {device.shipped_from
                    ? 'Nereden / Gideceği Yer    \n      ' +
                      device.shipped_from +
                      '   / ' +
                      device.shipped_to
                    : null}
                </Text>

                <Text style={styles.minMax}>
                  {device.transport_company
                    ? 'Nakliyeci:              ' + device.transport_company
                    : null}
                </Text>
                <Text style={styles.minMax}>
                  {device.goods
                    ? 'Ürün Cinsi:              ' + device.goods
                    : null}
                </Text>

                <Text style={styles.minMax}>
                  {device.start_date
                    ? 'Başlama Tarihi:              ' + device.start_date
                    : null}
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
                height: '20%',
              }}>
              {finalArray.length > 2 ? (
                <HighchartsReactNative
                  styles={styles.container2}
                  options={options}
                  useCDN={true}
                  useSSL={true}
                  loader={true}
                />
              ) : null}
            </View>
            <View
              style={{
                marginTop: Platform.OS == 'android' ? 200 : 100,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Datatable
                header={[
                  {
                    name: 'Date/Time',
                    attr: 'date',
                  },
                  {
                    name: 'Temperature',
                    attr: 'temp',
                  },
                ]}
                datatable={deviceTable}
                page={page}
                perPage={8}
                style={{backgroundColor: '#fff'}}
              />
            </View>
          </View>
        </ScrollView>
      </>
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
        <View style={styles.waitContainer}>
          <Text>henüz hiçbir veri mevcut değil</Text>
        </View>
        {/* 
        <View style={styles.ActivityIndicator}>
          <ActivityIndicator
            animating={animating}
            color="#bc2b78"
            size="large"
            style={styles.activityIndicator}
          />
        </View> */}
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
  waitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 4,
  },
  fromTo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 4,
  },
  minMax: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 2,
  },
  location: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  map: {
    height: '55%',
    margin: 12,
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
