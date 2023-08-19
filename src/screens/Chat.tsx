import React, { useState, useEffect, useRef } from 'react';
import { UIManager, LayoutAnimation, Platform, ActivityIndicator, TouchableOpacity, Image, ScrollView, Text, TextProps, Alert } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  role?: 'user';
};

type ChatObject = {
  role: 'user' | 'assistant';
  content: string;
};

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #121212;
`;

const MessageContainer = styled.View<Props>`
  padding: 10px;
  margin-vertical: 5px;
  border-radius: 5px;
  align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.role === 'user' ? '#0f9d58' : '#424242'};
`;

const MessageText = styled.Text<Props>`
  color: ${props => props.role === 'user' ? '#ffffff' : '#f5f5f5'};
`;

const InputContainer = styled.View`
  flex-direction: row;
`;

const ChatInput = styled.TextInput`
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #2d2d2d;
  background-color: #2d2d2d;
  color: #ffffff;
`;

const SendButton = styled(TouchableOpacity)<{ disabled: boolean }>`
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${props => props.disabled ? '#777' : '#0f9d58'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const SendButtonText = styled.Text`
  color: #ffffff;
`;

const TypingIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-vertical: 5px;
`;

const ElapsedTime = styled.Text`
  margin-left: 10px;
  color: #f5f5f5;
`;

const emotionScores = {
  dissappointment: -1,
  curiousity: 1,
  sadness: -1,
  neutral: 0,
  confusion: -1,
  annoyance: -1,
  disapproval: -1,
  anger: -1,
  realization: 1,
  surprise: 1,
  embarrasment: -1,
  remorse: -1,
  nervousness: -1,
  optimism: 1,
  approval: 1,
  disgust: -1,
  grief: -1,
  caring: 1,
  fear: -1,
  admiration: 1,
  desire: 1,
  love: 1,
  amusement: 1,
  joy: 1,
  excitement: 1,
  gratitude: 1,
  relief: 1,
  pride: 1
};

const ChatScreen = () => {
  const [chatHistory, setChatHistory] = useState<ChatObject[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const navigation = useNavigation();
  const [score, setScore] = useState(0);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [chatHistory]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | number | null = null;
  
    if (isAssistantTyping && typingStartTime !== null) {
      intervalId = setInterval(() => {
        const elapsedSeconds = (Date.now() - typingStartTime) / 1000;
        setElapsedTime(`${elapsedSeconds.toFixed(1)} s`);
      }, 100);
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId as number);
      }
      setElapsedTime('');
    }
  
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId as number);
      }
    };
  }, [isAssistantTyping, typingStartTime]);

  const onSendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput.length === 0) {
      return;
    }

    setTypingStartTime(Date.now());

    const updatedChatHistory = [...chatHistory, { role: 'user' as const, content: trimmedInput }];
    setChatHistory(updatedChatHistory);
    setIsAssistantTyping(true);
    setUserInput('');

    try {
      const response = await axios.post('https://mentalscreen.axesys.repl.co/chat', {
      input: trimmedInput,
      chat_history: updatedChatHistory,
      });

      const assistantMessage = response.data.response;
      const sentiment = response.data.sentiment;
      const sentimentScore = emotionScores[sentiment] || 0; 
      setScore(prevScore => prevScore + sentimentScore); // Update the score
      const messageWithSentiment = `${assistantMessage} [${sentiment}]`; // Append sentiment to the message
      setChatHistory([...updatedChatHistory, { role: 'assistant', content: messageWithSentiment }]);
      setIsAssistantTyping(false);
    } catch (error) { 
      console.log('An error occurred: ', error);
      setIsAssistantTyping(false);
    } finally {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      setUserInput('');
      setTypingStartTime(null);
    }
  };

  const onClearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the chat history?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", 
          onPress: () => {
            setChatHistory([]);
            setScore(0); 
          }
        }
      ]
    );
  };

  return (
    <Container>
      <TopBar>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../../src/assets/settings-icon.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
  
        <TouchableOpacity onPress={onClearChat}>
          <Image
            source={require('../../src/assets/clear-icon.png')} 
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </TopBar>
      
      <ScrollView ref={scrollViewRef}>
        {chatHistory.map((chat, index) => (
          <MessageContainer key={index} role={chat.role}>
            <MessageText color={chat.role === 'user' ? '#ffffff' : '#f5f5f5'}>{chat.content}</MessageText>
          </MessageContainer>
        ))}
        {isAssistantTyping && (
          <TypingIndicator>
            <ActivityIndicator size="small" color="#f5f5f5" />
            <ElapsedTime>{elapsedTime}</ElapsedTime>
          </TypingIndicator>
        )}
      </ScrollView>
      <Text style={{ alignSelf: 'center', color: '#f5f5f5', fontSize: 24 }}>Score: {score}</Text>
      <InputContainer>
        <ChatInput
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type a message..."
          placeholderTextColor="#f5f5f5"
        />
        <SendButton onPress={onSendMessage} disabled={isAssistantTyping}>
          <SendButtonText>Send</SendButtonText>
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;