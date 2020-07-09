import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import Modal, {
  ModalContent,
  ModalFooter,
  ModalTitle,
  ModalButton,
} from 'react-native-modals';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {AuthContext} from '../components/context';
import Toast from 'react-native-tiny-toast';
import Users from '../model/users';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    reg: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    modalVal: '',
  });

  const {signIn} = React.useContext(AuthContext);

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleModalVal = val => {
    setData({
      ...data,
      modalVal: val,
    });
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = (userName, password) => {
    const data = {
      email: userName,
      password: password,
    };

    axios
      .post('https://www.gzc24.com/api-mobi/user/auth', data)
      .then(res => {
        const foundUser = Users.filter(item => {
          if (res.data.id != null) {
            return true;
          }
        });

        AsyncStorage.setItem('id', res.data.id);
        AsyncStorage.setItem('api_key', res.data.api_key);

        const toast = Toast.showLoading('Loading...');
        setTimeout(() => {
          Toast.hide(toast);
        }, 1000);
        signIn(foundUser);
      })
      .catch(err => {
        Toast.show('Credential error, Please try again.');
      });
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [searchId, setSearchId] = useState(null);

  const anotherScreen = () => {
    if (searchId != null) {
      navigation.navigate('DeviceInfo', {
        id: {id: searchId},
      });
      setModalVisible(false);
    } else {
      Alert.alert('Device id required!');
    }
  };

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
        style={styles.container}>
        <StatusBar backgroundColor="#1D1D1B" barStyle="light-content" />

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.header}>
              <Text style={styles.text_header}>SEARCH DEVICE BY ID</Text>
            </TouchableOpacity>
          </View>

          <Modal
            width={300}
            onTouchOutside={() => setModalVisible(false)}
            footer={
              <ModalFooter>
                <ModalButton
                  text="CANCEL"
                  onPress={() => setModalVisible(false)}
                />
                <ModalButton text="SEARCH" onPress={anotherScreen} />
              </ModalFooter>
            }
            modalTitle={<ModalTitle title=" SEARCH DEVICE BY ID" />}
            visible={isModalVisible}
            swipeDirection={['up', 'down']}
            swipeThreshold={100}
            onSwipeOut={() => setModalVisible(false)}>
            <ModalContent>
              <Text style={styles.modalSearchText}>Search</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={e => setSearchId(e)}
                maxLength={8}
                placeholder="cihaz"
                style={styles.modalTextInput}
              />
            </ModalContent>
          </Modal>

          <Animatable.View
            animation="fadeInUpBig"
            style={[
              styles.footer,
              {
                backgroundColor: '#1D1D1B',
              },
            ]}>
            <Text
              style={[
                styles.text_footer,
                {
                  color: '#fff',
                },
              ]}>
              Email
            </Text>
            <View style={styles.action}>
              <FontAwesome name="envelope-o" color="#fff" size={20} />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => this.passwordInput.focus()}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={[
                  styles.textInput,
                  {
                    color: '#fff',
                  },
                ]}
                autoCapitalize="none"
                onChangeText={val => textInputChange(val)}
                onEndEditing={e => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidUser ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Email should be correct</Text>
              </Animatable.View>
            )}

            <Text
              style={[
                styles.text_footer,
                {
                  color: '#fff',
                  marginTop: 3,
                },
              ]}>
              Password
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#fff" size={20} />
              <TextInput
                returnKeyType="go"
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={[
                  styles.textInput,
                  {
                    color: '#fff',
                  },
                ]}
                autoCapitalize="none"
                onChangeText={val => handlePasswordChange(val)}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {data.isValidPassword ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Password must be 6 characters long.
                </Text>
              </Animatable.View>
            )}

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  loginHandle(data.username, data.password);
                }}>
                <LinearGradient
                  colors={['#FDEF69', '#FDEF69']}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: 'black',
                      },
                    ]}>
                    LOGIN
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#FDEF69',
                      fontSize: 15,
                      marginTop: 10,
                    },
                  ]}>
                  Not Having Account Yet!
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1B',
  },
  logo: {
    width: 300,
    height: 130,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? '30%' : '10%',
  },

  footer: {
    flex: 3,
    backgroundColor: '#1D1D1B',
    paddingHorizontal: 30,
    marginTop: 80,
  },

  text_header: {
    color: '#FDEF69',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0200',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 40,
  },
  signIn: {
    width: '100%',
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  textSign: {
    fontSize: 18,
  },

  modalParent: {
    backgroundColor: '#000000aa',
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 60,
    padding: 40,
    borderRadius: 10,
    flex: 0.4,
  },
  modalTextInput: {
    borderBottomColor: 'yellow',
    borderBottomWidth: 2,
    padding: 15,
  },
  modalSearchText: {
    padding: 15,
  },
});
