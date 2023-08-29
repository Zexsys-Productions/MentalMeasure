import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('user_data')
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUsername(documentSnapshot.data().username);
        }
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      handleUsernameSave();
    }
  }, [isFocused]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            auth()
              .signOut()
              .then(() => {
                console.log('User signed out!');
                navigation.navigate('Login');
              })
              .catch((error) => console.error('Sign Out Error: ', error));
          },
        },
      ]
    );
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handleUsernameSave = () => {
    firestore()
      .collection('user_data')
      .doc(auth().currentUser.uid)
      .set(
        {
          username: username,
        },
        { merge: true }
      )
      .then(() => {
        console.log('Username updated successfully!');
      })
      .catch((error) => console.error('Update Username Error: ', error));
  };

  const handleClearHistory = () => {
    firestore()
      .collection('screeningHistory')
      .doc(auth().currentUser.uid)
      .collection('screeningSessions')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });

        console.log('Screening history cleared successfully!');
      })
      .catch((error) => {
        console.error('Clear History Error: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={handleUsernameChange}
      />

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearHistoryButton} onPress={handleClearHistory}>
        <Text style={styles.buttonText}>Clear Screening History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  spacer: {
    height: 28,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  label: {
    color: '#ffffff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    color: '#000000',
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0f9d58',
  },
  clearHistoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default SettingsScreen;
