import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  imageUrl?: string;
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
    { id: '1', text: "Hello. I am your Cyber-Assist AI. Describe what happened, or upload a screenshot of the suspicious text/email for me to analyze.", sender: 'ai' }
  ]);

  const readAloud = (text: string) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.95 });
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const userMsg: Message = { id: Date.now().toString(), text: "Please scan this screenshot.", sender: 'user', imageUrl: result.assets[0].uri };
      setMessages((prev) => [...prev, userMsg]);
      
      // Educational, in-depth simulated response
      setTimeout(() => {
        const responseText = "🔍 SCAN COMPLETE: High Probability of Phishing.\n\nHere is what I spotted in your screenshot:\n\n1. Suspicious Sender: Always check the actual phone number or email address. Scammers use standard 10-digit numbers or lookalike domains instead of official corporate accounts.\n2. The 'Report Junk' Option: If your messaging app shows a 'Report Junk' button, it means the sender is not in your contacts and is likely an automated spam bot.\n3. Urgency Triggers: They are creating a fake emergency (like a locked account or delivery fee) to force you into acting without thinking.\n\n🚨 ACTION PLAN:\n• If you HAVEN'T clicked the link: You are safe. Just tap 'Report Junk', block the sender, and delete the message.\n• If you ALREADY clicked the link AND typed in your password or credit card: Go to the 'Defense' tab immediately for step-by-step instructions on freezing your accounts.";
        
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          text: responseText, 
          sender: 'ai' 
        };
        setMessages((prev) => [...prev, aiMsg]);
        readAloud("Scan complete. High probability of phishing. Please read the detailed breakdown and action plan.");
      }, 1500);
    }
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('click') || lowerInput.includes('link') || lowerInput.includes('text')) {
      return "It sounds like you encountered a phishing link.\n\nHere is the rule: Simply tapping a link rarely hacks your phone. The danger is what happens ON the website. Did you type your password or credit card into the site?\n\n• If NO: Close the tab, clear your browser history, and block the sender. You are safe.\n• If YES: Go to the 'Defense' tab immediately. You need to freeze your cards and change your passwords right now.";
    } else if (lowerInput.includes('check') || lowerInput.includes('job') || lowerInput.includes('venmo') || lowerInput.includes('zelle')) {
      return "This exhibits all the red flags of a Fake Check Overpayment scam.\n\nHow it works: Scammers send you a check and ask you to send some cash back via Zelle or Venmo. By federal law, banks must make check funds available within 24 hours, giving the illusion the check cleared. However, the check is totally fake and will bounce in 5-7 days. When it does, the bank takes the full amount back, and you lose the real cash you sent.\n\nDo not send any money. If you already deposited the check, call your bank's fraud department immediately.";
    } else if (lowerInput.includes('police') || lowerInput.includes('report')) {
      return "Filing an official report is the best next step, especially if you lost money or had your identity stolen.\n\nPlease go to the 'Locator' tab at the bottom of your screen. It will use your location to find the nearest Police Precinct and provide a checklist of the exact documents you need to bring (like your ID and printed statements).";
    }

    return "I understand. To give you the best advice, could you clarify a bit more? For example, did they send you a link, ask for money, or threaten you over a phone call?";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiResponseText = generateAIResponse(userMsg.text);
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: aiResponseText, 
        sender: 'ai' 
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      // Read aloud a shorter summary so the TTS isn't overwhelmingly long
      readAloud("I have generated a response based on your situation. Please review the recommended actions in the chat.");
    }, 1000);
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
                {msg.imageUrl && <Image source={{ uri: msg.imageUrl }} style={styles.chatImage} />}
                <Text style={[styles.messageText, { color: isUser ? '#FFF' : theme.text }]}>{msg.text}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.inputArea, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.attachBtn} onPress={handleImagePick}>
          <Ionicons name="camera-outline" size={24} color={theme.subText} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
          placeholder="Describe or upload screenshot..."
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
  chatImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 8 },
  inputArea: { flexDirection: 'row', padding: 16, paddingBottom: 30, borderTopWidth: 1, alignItems: 'center' },
  attachBtn: { marginRight: 12, padding: 4 },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, fontSize: 15, marginRight: 10 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});