import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const userDocument = await firestore()
        .collection('user_data')
        .doc(auth().currentUser.uid)
        .get();

      if (userDocument.exists) {
        setUsername(userDocument.data().username);
      }
    };

    fetchUsername();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={require('../../src/assets/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../src/assets/settings-icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back{username ? `, ${username}` : ''}!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mood')}>
          <Text style={styles.buttonText}>Mood Check</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1F1F1F',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  icon: {
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    backgroundColor: '#1F1F1F',
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#0f9d58',
    padding: 20,
    borderRadius: 7,
    width: '30%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
