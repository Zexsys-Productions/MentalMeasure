import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AnxietySurvey = ({ route }) => {
  const { sessionId } = route.params;
  const navigation = useNavigation();
  const [answers, setAnswers] = useState({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    q10: 0,
    q11: 0,
    q12: 0,
    q13: 0,
    q14: 0,
    q15: 0,
    q16: 0,
    q17: 0,
    q18: 0,
    q19: 0,
    q20: 0,
    q21: 0,
    q22: 0,
  });

  const questions = [
    'Numbness or tingling',
    'Feeling hot',
    'Wobbliness in legs',
    'Unable to relax',
    'Fear of worst happening',
    'Dizzy or lightheaded',
    'Heart pounding / racing',
    'Unsteady',
    'Terrified or afraid',
    'Nervous',
    'Feeling of choking',
    'Hands trembling',
    'Shaky / unsteady',
    'Fear of losing control',
    'Difficulty in breathing',
    'Fear of dying',
    'Scared',
    'Indigestion',
    'Faint / lightheaded',
    'Face flushed',
    'Hot / cold sweats',
  ];

  const handleSliderChange = (questionId: string, value: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const renderQuestions = () => {
    return questions.map((question, index) => (
      <View key={`question_${index}`} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={answers[`q${index + 1}`] || 0}
          onValueChange={(value) => handleSliderChange(`q${index + 1}`, value)}
          minimumTrackTintColor="#0f9d58"
          maximumTrackTintColor="#AAA"
          thumbTintColor="#0f9d58"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Not at all</Text>
          <Text style={styles.sliderLabel}>Severely</Text>
        </View>
        <Text style={styles.sliderValue}>
          {['Not at all', 'Mildly', 'Moderately', 'Severely'][answers[`q${index + 1}`] || 0]}
        </Text>
      </View>
    ));
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    Object.values(answers).forEach((value) => {
      totalScore += value;
    });
    return totalScore;
  };

  const getSeverityColor = (totalScore: number) => {
    if (totalScore <= 21) {
      return 'Green';
    } else if (totalScore >= 22 && totalScore <= 35) {
      return 'Yellow';
    } else {
      return 'Red';
    }
  };  

  const getMentalHealthStatus = (totalScore: number) => {
    if (totalScore >= 0 && totalScore <= 21) {
      return 'Low anxiety';
    } else if (totalScore >= 22 && totalScore <= 35) {
      return 'Moderate anxiety';
    } else {
      return 'Potentially concerning levels of anxiety';
    }
  };

  const showMentalHealthStatus = async () => {
    const totalScore = calculateTotalScore();
    const mentalHealthStatus = getMentalHealthStatus(totalScore);

    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      try {
        const sessionRef = firestore()
          .collection('screeningHistory')
          .doc(currentUser.uid)
          .collection('screeningSessions')
          .doc(sessionId);

        const severityLevel = getSeverityColor(totalScore);

        await sessionRef.update({
          mentalHealthStatus,
          severityLevel,
        });

        navigation.navigate('ResultScreen', {
          sessionId,
          mentalHealthStatus,
          severityLevel,
          surveyResults: answers,
        });
      } catch (error) {
        console.error('Error updating session:', error);
      }
    } else {
      Alert.alert('User not authenticated.');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.middleContainer}>
          <Text style={styles.title}>Anxiety Survey</Text>
          <Text style={styles.introText}>
            During the last 30 days, please rate how often you experienced the following:
          </Text>
        </View>
        <View style={styles.questionsContainer}>{renderQuestions()}</View>
        <TouchableOpacity style={styles.submitButton} onPress={showMentalHealthStatus}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  introText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionsContainer: {
    marginBottom: 35,
    marginTop: 50,
  },
  questionContainer: {
    marginBottom: 75,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: 'white',
  },
  sliderValue: {
    alignSelf: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  submitButton: {
    alignSelf: 'center',
    backgroundColor: '#0f9d58',
    borderRadius: 50,
    width: 350,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },

  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default AnxietySurvey;
