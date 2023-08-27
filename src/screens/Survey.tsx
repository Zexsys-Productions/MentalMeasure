import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const SurveyScreen = ({ navigation }) => {
  const [mentalIssues, setMentalIssues] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [showSurveyRecommendation, setShowSurveyRecommendation] = useState(false);
  const [recommendedSurvey, setRecommendedSurvey] = useState('');

  const loadingTimeoutRef = useRef(null);

  const handleNext = async () => {
    setIsLoading(true);
    setShowLoaderModal(true);

    try {
      const response = await axios.post('https://mentalscreen.axesys.repl.co/sort', {
        input: mentalIssues,
      });

      const apiResponse = response.data;

      if (typeof apiResponse === 'string') {
        let recommendedSurveyType = '';

        if (apiResponse.includes('GENERAL')) {
          recommendedSurveyType = 'general';
        } else if (apiResponse.includes('DEPRESSION')) {
          recommendedSurveyType = 'depression';
        } else if (apiResponse.includes('ANXIETY')) {
          recommendedSurveyType = 'anxiety';
        } else {
          console.log('No survey recommendation found in API response.');
        }

        setRecommendedSurvey(recommendedSurveyType);
        setShowSurveyRecommendation(true);
      } else {
        console.log('Unexpected API response:', apiResponse);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoaderModal(false);
      }, 500); 
    }
  };

  const handleSurveyChoice = (surveyType) => {
    console.log('User chose:', surveyType);
    if (surveyType === 'GENERAL') {
      navigation.navigate('GeneralSurvey');
    } else if (surveyType === 'DEPRESSION') {
      navigation.navigate('DepressionSurvey');
    } else if (surveyType === 'ANXIETY') {
      navigation.navigate('AnxietySurvey');
    } else {
      Alert.alert('gg')
    }
  };

  const handleCancel = () => {
    setShowSurveyRecommendation(false);
    navigation.navigate('Home');
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Describe Your Mental Issues:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Write about your mental problems or issues here..."
          placeholderTextColor="#aaa"
          value={mentalIssues}
          onChangeText={(text) => setMentalIssues(text)}
        />
      </View>
      
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.submitButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        transparent={true}
        animationType="fade"
        visible={showLoaderModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.modalText}>Personalizing your screening process...</Text>
          </View>
        </View>
      </Modal>
      
      <Modal
        transparent={true}
        animationType="slide"
        visible={showSurveyRecommendation}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.recommendationText}>
              {recommendedSurvey ? `It's best to take the ${recommendedSurvey} survey.` : 'No specific survey recommendation.'}
            </Text>
            {recommendedSurvey && (
              <>
                <Text style={styles.recommendationInstructions}>
                  Please select a survey to continue:
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => handleSurveyChoice('GENERAL')}>
                    <Text style={styles.submitButtonText}>General Survey</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => handleSurveyChoice('DEPRESSION')}>
                    <Text style={styles.submitButtonText}>Depression Survey</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => handleSurveyChoice('ANXIETY')}>
                    <Text style={styles.submitButtonText}>Anxiety Survey</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cancelButtonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.submitButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    width: '100%',
    color: 'white',
    textAlignVertical: 'top',
    marginTop: 30,
    flex: 0.2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.90)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 8,
  },
  modalText: {
    marginTop: 10,
    color: 'white',
  },
  recommendationText: {
    marginTop: 15,
    color: 'white',
    fontSize: 18,
  },
  recommendationInstructions: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 15,
  },
  cancelButtonContainer: {
    marginTop: 70,
    marginBottom: 20,
  },
  cancelButton : {
    alignSelf: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    width: 350,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
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
  submitButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0, 
  },
};

export default SurveyScreen;
