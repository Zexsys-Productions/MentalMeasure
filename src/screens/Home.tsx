import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 
  const [username, setUsername] = useState('');
  const [recentScreenings, setRecentScreenings] = useState([]);

  useEffect(() => {
    const fetchUsername = async () => {
      const userDocument = await firestore()
        .collection('user_data')
        .doc(auth().currentUser.uid)
        .get();

      if (userDocument.exists) {
        setUsername(userDocument.data().username);
      }

      if (isFocused) {
        fetchUsername();
        fetchRecentScreenings();
      }
    };

    const fetchRecentScreenings = async () => {
      try {
        const screeningSessionsSnapshot = await firestore()
          .collection('screeningHistory')
          .doc(auth().currentUser.uid)
          .collection('screeningSessions')
          .orderBy('date', 'desc')
          .limit(4)
          .get();

        const recentScreeningsData = screeningSessionsSnapshot.docs.map((doc) => doc.data());
        setRecentScreenings(recentScreeningsData);
      } catch (error) {
        console.error('Error fetching recent screenings:', error);
      }
    };

    fetchUsername();
    fetchRecentScreenings();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={require('../../src/assets/transparent-logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../src/assets/settings-icon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back{username ? `, ${username}` : ''}!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Survey')}>
            <Text style={styles.buttonText}>Start Survey</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.recentTitle}>Recent Screenings:</Text>
        {recentScreenings.map((screening, index) => (
        <View key={index} style={styles.recentScreening}>
          <Text>Date: {new Date(screening.date).toLocaleString()}</Text>
          <Text>Mental Health Status: {screening.mentalHealthStatus}</Text>
          <Text>Severity Level: {screening.severityLevel}</Text>
          {/* Display other screening information */}
        </View>
      ))}
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
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0f9d58',
    padding: 20,
    borderRadius: 7,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  recentScreening: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '95%', 
  },
});

export default HomeScreen;
