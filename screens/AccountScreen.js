import React from 'react';
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
} from 'react-native';

const AccountScreen = ({navigation}) => {
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
              <TextInput style={styles.textInput} placeholder="Country" />
              <TextInput style={styles.textInput} placeholder="Name" />
            </View>

            <View style={styles.textInputDesign}>
              <TextInput style={styles.textInput} placeholder="Company Name" />
              <TextInput style={styles.textInput} placeholder="Email" />
            </View>

            <View style={styles.textInputDesign}>
              <TextInput style={styles.textInput} placeholder="Phone" />

              <TextInput style={styles.textInput} placeholder="Extra Emails" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },

  textInput: {
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
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
});
