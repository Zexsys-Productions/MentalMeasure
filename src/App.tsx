import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';

import LoginScreen from './screens/Login';
import ChatScreen from './screens/Chat';
import LoadingScreen from './screens/shared/Loading';
import SettingsScreen from './screens/Settings';
import HomeScreen from './screens/Home';
import MoodScreen from './screens/Mood';
import OfflineScreen from './screens/shared/Offline';

// Survey Flow
import SurveyScreen from './screens/Survey';
import GeneralSurvey from './screens/survey/General';
import DepressionSurvey from './screens/survey/Depression';
import AnxietySurvey from './screens/survey/Anxiety';
import ResultScreen from './screens/survey/Result';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isConnected, setIsConnected] = useState(true); 

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Check network connectivity
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      subscriber();
      netInfoUnsubscribe();
    };
  }, []);

  if (initializing) return <LoadingScreen />;

  // Show OfflineScreen when not connected
  if (!isConnected) return <OfflineScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Mood" 
          component={MoodScreen} 
          options={{ headerShown: false }} 
        />
        {/* Survey Flow */}
        <Stack.Screen 
          name="Survey" 
          component={SurveyScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="GeneralSurvey" 
          component={GeneralSurvey} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="DepressionSurvey" 
          component={DepressionSurvey}  
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AnxietySurvey" 
          component={AnxietySurvey}   
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ResultScreen" 
          component={ResultScreen}    
          options={{ headerShown: false }} 
        />
        {/* More screens can be added here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
