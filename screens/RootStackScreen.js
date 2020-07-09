import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import DeviceInfo from './DeviceInfo';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <RootStack.Screen
      headerMode="screen"
      options={{
        title: 'Truck Details',
        headerLeft: () => (
          <Icon.Button
            name="ios-arrow-round-back"
            size={30}
            backgroundColor="#1D1D1B"
            onPress={() => {}}
          />
        ),
      }}
      name="DeviceInfo"
      component={DeviceInfo}
    />
  </RootStack.Navigator>
);

export default RootStackScreen;
