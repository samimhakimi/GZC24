import React from 'react';
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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Toast from 'react-native-tiny-toast';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../components/context';

import Users from '../model/users';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    name: '',
    email: '',
    password: '',
    company: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const {colors} = useTheme();

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const companyChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        company: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        company: val,
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

  const signUpHandle = (name, email, password, company) => {
    const data = {
      name: name,
      email: email,
      password: password,
      company: company,
    };

    axios
      .post('https://www.gzc24.com/api-mobi/user/register', data)
      .then(res => {
        Toast.showSuccess('Successfuly registered');
      })
      .catch(err => {
        Toast.show('Credential error, Please try again.');
      });
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
          </View>

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
              Name
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#fff" size={20} />
              <TextInput
                placeholder="Name"
                returnKeyType="next"
                onSubmitEditing={() => this.EmailInput.focus()}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={[
                  styles.textInput,
                  {
                    color: '#fff',
                  },
                ]}
                autoCapitalize="none"
              />
            </View>

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

            <Text
              style={[
                styles.text_footer,
                {
                  color: '#fff',
                },
              ]}>
              Company Name (Optional)
            </Text>
            <View style={styles.action}>
              <FontAwesome name="building-o" color="#fff" size={20} />
              <TextInput
                placeholder="Company Name"
                returnKeyType="next"
                placeholderTextColor="rgba(255,255,255,0.5)"
                onChangeText={companyChange}
                style={[
                  styles.textInput,
                  {
                    color: '#fff',
                  },
                ]}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  signUpHandle(
                    data.name,
                    data.email,
                    data.password,
                    data.company,
                  );
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
                    SIGN UP
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignInScreen')}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#FDEF69',
                      fontSize: 15,
                      marginTop: 10,
                    },
                  ]}>
                  Already Have an Account!
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
    marginTop: Platform.OS === 'ios' ? '30%' : 0,
  },

  footer: {
    flex: 3,
    backgroundColor: '#1D1D1B',
    paddingHorizontal: 30,
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
});
