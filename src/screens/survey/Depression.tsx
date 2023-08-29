import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const DepressionSurvey = ({ route }) => {
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
  });

  const questionTexts = [
    [
      "I do not feel sad.",
      "I feel sad.",
      "I am sad all the time and I can't snap out of it.",
      "I am so sad and unhappy that I can't stand it."
    ],
    [
      "I am not particularly discouraged about the future.",
      "I feel discouraged about the future.",
      "I feel I have nothing to look forward to.",
      "I feel the future is hopeless and that things cannot improve."
    ],
    [
      "I do not feel like a failure.",
      "I feel I have failed more than the average person.",
      "As I look back on my life, all I can see is a lot of failures.",
      "I feel I am a complete failure as a person."
    ],
    [
      "I get as much satisfaction out of things as I used to.",
      "I don't enjoy things the way I used to.",
      "I don't get real satisfaction out of anything anymore.",
      "I am dissatisfied or bored with everything."
    ],
    [
      "I don't feel particularly guilty.",
      "I feel guilty a good part of the time.",
      "I feel quite guilty most of the time.",
      "I feel guilty all of the time."
    ],
    [
      "I don't feel I am being punished.",
      "I feel I may be punished.",
      "I expect to be punished.",
      "I feel I am being punished."
    ],
    [
      "I don't feel disappointed in myself.",
      "I am disappointed in myself.",
      "I am disgusted with myself.",
      "I hate myself."
    ],
    [
      "I don't feel I am any worse than anybody else.",
      "I am critical of myself for my weaknesses or mistakes.",
      "I blame myself all the time for my faults.",
      "I blame myself for everything bad that happens."
    ],
    [
      "I don't have any thoughts of killing myself.",
      "I have thoughts of killing myself, but I would not carry them out.",
      "I would like to kill myself.",
      "I would kill myself if I had the chance."
    ],
    [
      "I don't cry any more than usual.",
      "I cry more now than I used to.",
      "I cry all the time now.",
      "I used to be able to cry, but now I can't cry even though I want to."
    ],
    [
      "I am no more irritated by things than I ever was.",
      "I am slightly more irritated now than usual.",
      "I am quite annoyed or irritated a good deal of the time.",
      "I feel irritated all the time."
    ],
    [
      "I have not lost interest in other people.",
      "I am less interested in other people than I used to be.",
      "I have lost most of my interest in other people.",
      "I have lost all of my interest in other people."
    ],
    [
      "I make decisions about as well as I ever could.",
      "I put off making decisions more than I used to.",
      "I have greater difficulty in making decisions more than I used to.",
      "I can't make decisions at all anymore."
    ],
    [
      "I don't feel that I look any worse than I used to.",
      "I am worried that I am looking old or unattractive.",
      "I feel there are permanent changes in my appearance that make me look unattractive.",
      "I believe that I look ugly."
    ],
    [
      "I can work about as well as before.",
      "It takes an extra effort to get started at doing something.",
      "I have to push myself very hard to do anything.",
      "I can't do any work at all."
    ],
    [
      "I can sleep as well as usual.",
      "I don't sleep as well as I used to.",
      "I wake up 1-2 hours earlier than usual and find it hard to get back to sleep.",
      "I wake up several hours earlier than I used to and cannot get back to sleep."
    ],
    [
      "I don't get more tired than usual.",
      "I get tired more easily than I used to.",
      "I get tired from doing almost anything.",
      "I am too tired to do anything."
    ],
    [
      "My appetite is no worse than usual.",
      "My appetite is not as good as it used to be.",
      "My appetite is much worse now.",
      "I have no appetite at all anymore."
    ],
    [
      "I haven't lost much weight, if any, lately.",
      "I have lost more than five pounds.",
      "I have lost more than ten pounds.",
      "I have lost more than fifteen pounds."
    ],
    [
      "I am no more worried about my health than usual.",
      "I am worried about physical problems like aches, pains, upset stomach, or constipation.",
      "I am very worried about physical problems and it's hard to think of much else.",
      "I am so worried about my physical problems that I cannot think of anything else."
    ],
    [
      "I have not noticed any recent change in my interest in sex.",
      "I am less interested in sex than I used to be.",
      "I have almost no interest in sex.",
      "I have lost interest in sex completely."
    ],
  ];

  const handleSliderChange = (questionId: string, value: number) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const renderQuestions = () => {
    return questionTexts.map((questionText, index) => (
      <View key={`question_${index}`} style={styles.questionContainer}>
        <Text style={styles.questionText}>{questionText[answers[`q${index + 1}`]]}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={answers[`q${index + 1}`]}
          onValueChange={(value) => handleSliderChange(`q${index + 1}`, value)}
          minimumTrackTintColor="#0f9d58"
          maximumTrackTintColor="#AAA"
          thumbTintColor="#0f9d58"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Not at all</Text>
          <Text style={styles.sliderLabel}>Very much</Text>
        </View>
      </View>
    ));
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    Object.values(answers).forEach(value => {
      totalScore += value;
    });
    return totalScore;
  };

  const getSeverityColor = (totalScore: number) => {
    if (totalScore <= 20) {
      return 'Green';
    } else if (totalScore >= 21 && totalScore <= 29) {
      return 'Yellow';
    } else {
      return 'Red';
    }
  };  

  const getMentalHealthStatus = (totalScore: number) => {
    if (totalScore <= 10) {
      return 'These ups and downs are considered normal';
    } else if (totalScore >= 11 && totalScore <= 16) {
      return 'Mild mood disturbance';
    } else if (totalScore >= 17 && totalScore <= 20) {
      return 'Borderline clinical depression';
    } else if (totalScore >= 21 && totalScore <= 30) {
      return 'Moderate depression';
    } else if (totalScore >= 31 && totalScore <= 40) {
      return 'Severe depression';
    } else {
      return 'Extreme depression';
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
          <Text style={styles.title}>Depression Survey</Text>
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

export default DepressionSurvey;
