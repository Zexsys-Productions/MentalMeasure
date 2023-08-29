import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

const GeneralSurvey = ({ route }) => {
  const [answers, setAnswers] = useState({
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
    q5: 3,
    q6: 3,
    q7: 3,
    q8: 3,
    q9: 3,
    q10: 3,
  });

  const navigation = useNavigation();

  const questions = [
    'About how often did you feel tired out for no good reason?',
    'About how often did you feel nervous?',
    'About how often did you feel so nervous that nothing could calm you down?',
    'About how often did you feel hopeless?',
    'About how often did you feel restless or fidgety?',
    'About how often did you feel so restless you could not sit still?',
    'About how often did you feel depressed?',
    'About how often did you feel that everything was an effort?',
    'About how often did you feel so sad that nothing could cheer you up?',
    'About how often did you feel worthless?',
  ];

  const handleSliderChange = (questionId, value) => {
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
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={answers[`q${index + 1}`] || 3}
          onValueChange={(value) => handleSliderChange(`q${index + 1}`, value)}
          minimumTrackTintColor="#0f9d58"
          maximumTrackTintColor="#AAA"
          thumbTintColor="#0f9d58"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>None of the time</Text>
          <Text style={styles.sliderLabel}>Most of the time</Text>
        </View>
        <Text style={styles.sliderValue}>{answers[`q${index + 1}`] || 3}</Text>
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

  const getMentalHealthStatus = (totalScore) => {
    if (totalScore < 20) {
      return 'Likely to be well';
    } else if (totalScore >= 20 && totalScore <= 24) {
      return 'Mild mental disorder signs';
    } else if (totalScore >= 25 && totalScore <= 29) {
      return 'Moderate mental disorder signs';
    } else {
      return 'Likely to have severe mental disorder';
    }
  };

  const getSeverityColor = (totalScore) => {
    if (totalScore < 20) {
      return 'Green';
    } else if (totalScore >= 20 && totalScore <= 24) {
      return 'Yellow';
    } else if (totalScore >= 25 && totalScore <= 29) {
      return 'Yellow';
    } else {
      return 'Red';
    }
  };

  const showMentalHealthStatus = () => {
    const totalScore = calculateTotalScore();
    const mentalHealthStatus = getMentalHealthStatus(totalScore);
    const severityLevel = getSeverityColor(totalScore);
  
    const { sessionId } = route.params; 
  
    navigation.navigate('ResultScreen', {
      sessionId, 
      mentalHealthStatus,
      severityLevel,
      surveyResults: answers,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.middleContainer}>
          <Text style={styles.title}>General Survey</Text>
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

export default GeneralSurvey;
