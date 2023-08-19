import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #121212;
`;

const Spacer = styled.View`
  height: 28px;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  top: 10px;
  left: 10px;
`;

const LogoutButton = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #0f9d58;
`;

const LogoutText = styled.Text`
  color: #ffffff;
`;

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
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            auth()
              .signOut()
              .then(() => {
                console.log("User signed out!");
                navigation.navigate('Login');  
              })
              .catch(error => console.error("Sign Out Error: ", error));
          } 
        }
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
      .set({
        username: username
      }, { merge: true })
      .then(() => {
        console.log("Username updated successfully!");
      })
      .catch(error => console.error("Update Username Error: ", error));
  };

  return (
    <Container>
      <BackButton onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back" size={24} color="#ffffff" />
      </BackButton>

      <Spacer />

      <Text style={{ color: '#ffffff', marginBottom: 10 }}>Username:</Text>
      <TextInput
        style={{
          backgroundColor: '#ffffff',
          padding: 10,
          borderRadius: 5,
          color: '#000000'
        }}
        value={username}
        onChangeText={handleUsernameChange}
      />

      <Spacer />

      <LogoutButton onPress={handleLogout}>
        <LogoutText>Logout</LogoutText>
      </LogoutButton>
    </Container>
  );
};

export default SettingsScreen;
