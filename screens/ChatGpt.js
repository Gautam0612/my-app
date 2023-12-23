// ...
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';

const GPTChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSend = async () => {
      if (input.trim() === '' || loading) return;
    
      // Add user message to the messages array
      const userMessage = { role: 'user', content: input };
      setMessages([...messages, userMessage]);
      setInput('');
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-1106',
            messages: [...messages, userMessage], // Include the user's message in the request
            max_tokens: 150,
          }),
        });
    
        if (!response.ok) {
          console.error('OpenAI API request failed:', response.status, response.statusText);
          setError('Failed to get response from OpenAI API.');
          return;
        }
    
        const data = await response.json();
    
        // Add the assistant's response to the messages array
        const assistantMessage = { role: 'assistant', content: data.choices[0]?.message.content || '' };
        setMessages([...messages, assistantMessage]);
      } catch (error) {
        console.error('Error during OpenAI API request:', error);
        setError('An error occurred during the API request.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {messages.map((message, index) => (
            <View key={index} style={{ padding: 10, alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Text>{message.content}</Text>
            </View>
          ))}
          {loading && <Text>Loading...</Text>}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <TextInput
            style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 8 }}
            placeholder="Type a message"
            value={input}
            onChangeText={(text) => setInput(text)}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    );
  };
  
  export default GPTChatScreen;
  