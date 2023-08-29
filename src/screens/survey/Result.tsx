import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/native';

const ResultScreen = ({ route }) => {
  const { sessionId, mentalHealthStatus, severityLevel, surveyResults } = route.params;

  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState('');

  // Get the currently authenticated user
  const currentUser = firebase.auth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser) {
      try {
        const screeningHistoryRef = firestore()
          .collection('screeningHistory')
          .doc(currentUser.uid)
          .collection('screeningSessions')
          .doc(sessionId);

        // Update the existing session document with result data
        screeningHistoryRef.update({
          mentalHealthStatus,
          severityLevel,
          surveyResults,
        });

        // Send POST request to the provided URL
        screeningHistoryRef.get()
          .then(sessionDoc => {
            const inputMentalIssues = sessionDoc.data()?.inputMentalIssues || '';
            const postData = {
              mentalStatus: mentalHealthStatus,
              severity: severityLevel,
              inputIssues: inputMentalIssues,
            };

            axios.post('https://mentalscreen.axesys.repl.co/result', postData)
              .then(response => {
                setApiResponse(response.data);
              })
              .catch(error => {
                console.error('POST request error:', error);
                const errorMessage = `Error: ${error.message}`;
                setApiResponse(errorMessage);
              })
              .finally(() => {
                setLoading(false);
              });
          })
          .catch(error => {
            console.error('Error fetching session document:', error);
          });
      } catch (error) {
        console.error('Error updating screening result:', error);
      }
    }
  }, [currentUser, sessionId, mentalHealthStatus, severityLevel, surveyResults]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.resultTitle}>Your Result</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loaderText}>Processing your results, please wait</Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.severityText}>{severityLevel}</Text>
          <Markdown style={styles.apiResponse}>{apiResponse}</Markdown>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    marginTop: 16,
    color: 'white',
  },
  resultContainer: {
    alignItems: 'center',
  },
  severityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textTransform: 'uppercase',
  },
  apiResponse: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'monospace',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ResultScreen;
