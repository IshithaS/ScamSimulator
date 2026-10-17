import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#1F2937' : '#F9FAFB',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    subText: isDark ? '#9CA3AF' : '#6B7280',
    primary: isDark ? '#818CF8' : '#6366F1',
    userBubble: isDark ? '#4F46E5' : '#6366F1',
    aiBubble: isDark ? '#374151' : '#E5E7EB',
    border: isDark ? '#4B5563' : '#E5E7EB',
  };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello. I am your Cyber-Assist AI. If you think you've been scammed, tell me exactly what happened (e.g., 'I clicked a link in a text' or 'I sent money via Zelle').", sender: 'ai' }
  ]);

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let response = "I understand. To keep you safe, please go to the Defense Kit tab immediately to lock your accounts, then go to the Safe Haven map to find your local police station to file a report.";

    if (lowerInput.includes('click') || lowerInput.includes('link') || lowerInput.includes('text')) {
      response = "It sounds like you may have clicked a phishing link. DO NOT enter any passwords. IMMEDIATELY go to your real banking app and freeze your cards. Then, change your Apple ID or Google passwords.";
    } else if (lowerInput.includes('check') || lowerInput.includes('job') || lowerInput.includes('venmo') || lowerInput.includes('zelle')) {
      response = "This sounds like a Fake Check Overpayment scam. That check will bounce in a few days! Do NOT send any money back. Call your bank immediately and tell them you deposited a fraudulent check.";
    } else if (lowerInput.includes('police') || lowerInput.includes('report')) {
      response = "You should file a report. Please go to the 'Locator' tab at the bottom of your screen to find the nearest Police Precinct and the exact documents you need to bring.";
    }

    return response;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiResponseText = generateAIResponse(userMsg.text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiMsg]);
      Speech.speak(aiResponseText, { rate: 0.95 });
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
        <Ionicons name="hardware-chip" size={24} color={theme.primary} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Cyber-Assist AI</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View key={msg.id} style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
              {!isUser && <Ionicons name="desktop" size={20} color={theme.primary} style={{ marginRight: 8, alignSelf: 'flex-end', marginBottom: 4 }} />}
              <View style={[styles.bubble, { backgroundColor: isUser ? theme.userBubble : theme.aiBubble }]}>
                <Text style={[styles.messageText, { color: isUser ? '#FFF' : theme.text }]}>{msg.text}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.inputArea, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
          placeholder="Describe what happened..."
          placeholderTextColor={theme.subText}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.primary }]} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', marginLeft: 10 },
  chatArea: { flex: 1 },
  messageRow: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start', paddingRight: 40 },
  bubble: { padding: 14, borderRadius: 20, maxWidth: '85%' },
  messageText: { fontSize: 15, lineHeight: 22 },
  inputArea: { flexDirection: 'row', padding: 16, paddingBottom: 30, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, fontSize: 15, marginRight: 10 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});