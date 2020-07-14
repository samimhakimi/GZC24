/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider as PaperProvider} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';

import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

Icon2.loadFont();

Icon.loadFont();

import {DrawerContent} from './screens/DrawerContent';
import {AuthContext} from './components/context';
import RootStackScreen from './screens/RootStackScreen';
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from './screens/HomeScreen';
import AddNewDeviceScreen from './screens/AddNewDeviceScreen';
import EditDevice from './screens/EditDevice';
import AccountScreen from './screens/AccountScreen';
import ArchivedScreen from './screens/ArchivedScreeen';
import DeviceInfo from './screens/DeviceInfor';

const HomeStack = createStackNavigator();
const AddDevice = createStackNavigator();
const ArchivedDevice = createStackNavigator();
const Account = createStackNavigator();
const Drawer = createDrawerNavigator();
const ArchivedScreens = createStackNavigator();
const DeviceInfor = createStackNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1D1D1B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'GZC24',
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </HomeStack.Navigator>
);

const AddNewDeviceStack = ({navigation}) => (
  <AddDevice.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1D1D1B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <AddDevice.Screen
      name="AddNewDeviceScreeen"
      component={AddNewDeviceScreen}
      options={{
        title: 'Add New Device',
        headerLeft: () => (
          <Icon3.Button
            name="long-arrow-left"
            size={30}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    />
  </AddDevice.Navigator>
);

const ArchivedDevicesStack = ({navigation}) => (
  <ArchivedDevice.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1D1D1B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ArchivedDevice.Screen
      name="Edit Device"
      component={EditDevice}
      options={{
        title: 'Edit Device',
        headerLeft: () => (
          <Icon3.Button
            name="long-arrow-left"
            size={30}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    />
  </ArchivedDevice.Navigator>
);
const AccountStack = ({navigation}) => (
  <Account.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1D1D1B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Account.Screen
      name="Account"
      component={AccountScreen}
      options={{
        title: 'Account',
        headerLeft: () => (
          <Icon3.Button
            name="long-arrow-left"
            size={30}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    />
  </Account.Navigator>
);

const ArchivedScreen2 = ({navigation}) => (
  <ArchivedScreens.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1D1D1B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ArchivedScreens.Screen
      name="ArchivedScreen"
      component={ArchivedScreen}
      options={{
        title: 'ArchivedScreen',
        headerLeft: () => (
          <Icon3.Button
            name="long-arrow-left"
            size={30}
            backgroundColor="#1D1D1B"
            onPress={() => navigation.goBack()}
          />
        ),
      }}
    />
  </ArchivedScreens.Navigator>
);

///
const App = () => {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: 'sss',
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        try {
          var userToken = AsyncStorage.getItem('id');
          var userName = AsyncStorage.getItem('api_key');
        } catch (e) {}

        dispatch({type: 'LOGIN', id: userName, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('id');
          await AsyncStorage.removeItem('api_key');
        } catch (e) {}
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {},
    }),
    [],
  );

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('id');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <PaperProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.userToken !== null ? (
            <Drawer.Navigator
              drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="Home" component={HomeStackScreen} />
              <Drawer.Screen
                name="AddNewDeviceScreen"
                component={AddNewDeviceStack}
              />
              <Drawer.Screen
                name="ArchivedScreen"
                component={ArchivedScreen2}
              />
              <Drawer.Screen
                name="EditDevice"
                component={ArchivedDevicesStack}
              />
              <Drawer.Screen name="DeviceInfor" component={DeviceInfo} />
              <Drawer.Screen name="Account" component={AccountStack} />
            </Drawer.Navigator>
          ) : (
            <React.Fragment>
              <RootStackScreen />
            </React.Fragment>
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export default App;
