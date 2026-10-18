import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { ReplyOption, SCENARIOS, ScamScenario } from '../../data/scenarios';

const SCAM_TYPES = ['Daily Challenge', 'All Types', ...Array.from(new Set(SCENARIOS.map((s) => s.scamType)))];

export default function SimulateScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#1F2937' : '#F9FAFB',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    subText: isDark ? '#9CA3AF' : '#6B7280',
    primary: isDark ? '#818CF8' : '#6366F1',
    success: isDark ? '#34D399' : '#10B981',
    warning: isDark ? '#FBBF24' : '#F59E0B',
    border: isDark ? '#4B5563' : '#E5E7EB',
  };

  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  const [userVerdict, setUserVerdict] = useState<'scam' | 'safe' | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [aiGrade, setAiGrade] = useState<{ isSafe: boolean; feedback: string } | null>(null);

  const filteredScenarios = selectedType === 'Daily Challenge' 
    ? [SCENARIOS[0]] 
    : selectedType === 'All Types' ? SCENARIOS : SCENARIOS.filter((s) => s.scamType === selectedType);

  const readAloud = (text: string) => {
    if (isAudioMuted) return;
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 1.0 });
  };

  const handleDecision = (choice: 'scam' | 'safe') => {
    if (!selectedScenario) return;
    setUserVerdict(choice);
    const isCorrect = (choice === 'scam' && selectedScenario.isScam) || (choice === 'safe' && !selectedScenario.isScam);
    if (!completedIds.includes(selectedScenario.id)) {
      setCompletedIds([...completedIds, selectedScenario.id]);
    }
    readAloud(isCorrect ? "Correct assessment." : "Incorrect assessment.");
  };

  const gradeOpenAnswer = () => {
    const input = openAnswer.toLowerCase();
    if (input.includes('stop') || input.includes('who') || input.includes('why')) {
      setAiGrade({ isSafe: false, feedback: "Engaging with the sender verifies your number is active. The safest response is no response." });
      readAloud("Engaging with the sender is unsafe.");
    } else if (input === '' || input.includes('ignore') || input.includes('block') || input.includes('report')) {
      setAiGrade({ isSafe: true, feedback: "Excellent. Ignoring, blocking, or reporting is the only secure way to handle this threat." });
      readAloud("Excellent. Ignoring or blocking is the secure choice.");
    } else {
      setAiGrade({ isSafe: false, feedback: "Providing custom information or arguing is risky. Never engage." });
      readAloud("Providing custom information is risky.");
    }
  };

  const resetSelection = () => {
    Speech.stop();
    setSelectedScenario(null);
    setUserVerdict(null);
    setSelectedReply(null);
    setOpenAnswer('');
    setAiGrade(null);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.header, { color: theme.text }]}>Threat Inbox</Text>
          <Text style={[styles.subHeader, { color: theme.subText }]}>Analyze and Defend.</Text>
        </View>
        <TouchableOpacity 
          style={[styles.muteBtn, { backgroundColor: theme.card, borderColor: theme.border }]} 
          onPress={() => {
            Speech.stop();
            setIsAudioMuted(!isAudioMuted);
          }}
        >
          <Ionicons name={isAudioMuted ? "volume-mute" : "volume-high"} size={20} color={theme.primary} />
          <Text style={[styles.muteText, { color: theme.text }]}>{isAudioMuted ? 'TTS: OFF' : 'TTS: ON'}</Text>
        </TouchableOpacity>
      </View>

      {!selectedScenario ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {SCAM_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <TouchableOpacity key={type} style={[styles.filterChip, { backgroundColor: active ? theme.primary : theme.card, borderColor: theme.border }]} onPress={() => setSelectedType(type)}>
                  <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.text }]}>
                    {type === 'Daily Challenge' ? '⭐ Daily Challenge' : type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredScenarios.map((item) => {
            const isDone = completedIds.includes(item.id);
            return (
              <TouchableOpacity key={item.id} style={[styles.inboxCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => setSelectedScenario(item)}>
                <View style={styles.inboxCardHeader}>
                  <Text style={[styles.channelBadge, { color: theme.primary, backgroundColor: isDark ? '#312E81' : '#EEF2FF' }]}>
                    {item.difficulty === 'Hard (AI Era)' ? '🔥 HARD MODE' : item.channel}
                  </Text>
                  {isDone && <Ionicons name="checkmark-circle" size={16} color={theme.success} />}
                </View>
                <Text style={[styles.senderName, { color: theme.text }]}>{item.sender}</Text>
                {/* HIDES MESSAGE, SHOWS ONLY SCAM TYPE AND PROMPT */}
                <Text style={[styles.messagePreview, { color: theme.subText, marginTop: 4, fontWeight: '600' }]}>Subject: {item.scamType}</Text>
                <Text style={[styles.messagePreview, { color: theme.primary, marginTop: 8 }]}>Tap to open payload...</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.backButton} onPress={resetSelection}>
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
            <Text style={[styles.backButtonText, { color: theme.primary }]}>Back to Inbox</Text>
          </TouchableOpacity>

          <View style={[styles.messageBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.senderName, { color: theme.text, marginBottom: 10 }]}>From: {selectedScenario.sender}</Text>
            {/* REVEALS MESSAGE ONLY AFTER CLICKING */}
            <Text style={[styles.messageText, { color: theme.subText }]}>{selectedScenario.message}</Text>
          </View>

          {!userVerdict ? (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Step 1: Classification</Text>
              <View style={styles.decisionRow}>
                <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: theme.warning }]} onPress={() => handleDecision('scam')}>
                  <Text style={styles.decisionBtnText}>Mark as Scam</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: theme.success }]} onPress={() => handleDecision('safe')}>
                  <Text style={styles.decisionBtnText}>Mark as Safe</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.feedbackContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Step 2: Threat Response</Text>
              
              {selectedScenario.difficulty === 'Hard (AI Era)' ? (
                <View style={[styles.openEndedBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Text style={[styles.openEndedPrompt, { color: theme.text }]}>Hard Mode: Type your exact reply. Leave blank to ignore.</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Type your response..."
                    placeholderTextColor={theme.subText}
                    value={openAnswer}
                    onChangeText={setOpenAnswer}
                    editable={!aiGrade}
                  />
                  {!aiGrade ? (
                    <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: theme.primary }]} onPress={gradeOpenAnswer}>
                      <Text style={styles.gradeBtnText}>Submit to AI for Grading</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.replyResultBox, { backgroundColor: theme.card, borderColor: aiGrade.isSafe ? theme.success : theme.warning }]}>
                      <Text style={[styles.replyResultTitle, { color: aiGrade.isSafe ? theme.success : theme.warning }]}>
                        {aiGrade.isSafe ? 'Secure Action' : 'Vulnerable Action'}
                      </Text>
                      <Text style={[styles.replyResultText, { color: theme.text }]}>{aiGrade.feedback}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {!selectedReply ? (
                    <View style={{ gap: 10, marginBottom: 16 }}>
                      {selectedScenario.replyOptions.map((opt, idx) => (
                        <TouchableOpacity key={idx} style={[styles.replyOptionBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => { setSelectedReply(opt); readAloud(opt.response); }}>
                          <Text style={[styles.replyOptionText, { color: theme.text }]}>{opt.text}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={[styles.replyResultBox, { backgroundColor: theme.card, borderColor: selectedReply.isSafeChoice ? theme.success : theme.warning }]}>
                      <Text style={[styles.replyResultTitle, { color: selectedReply.isSafeChoice ? theme.success : theme.warning }]}>
                        {selectedReply.isSafeChoice ? 'Secure Action' : 'Vulnerable Action'}
                      </Text>
                      <Text style={[styles.replyResultText, { color: theme.text }]}>{selectedReply.response}</Text>
                    </View>
                  )}
                </View>
              )}

              <Text style={[styles.explanationBody, { color: theme.subText, marginTop: 16 }]}>{selectedScenario.explanation}</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 26, fontWeight: '800' },
  subHeader: { fontSize: 15, marginTop: 4 },
  muteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  muteText: { fontSize: 12, fontWeight: '700' },
  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 10, paddingRight: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 14, fontWeight: '600' },
  inboxCard: { padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  inboxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  channelBadge: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  senderName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  messagePreview: { fontSize: 14, lineHeight: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backButtonText: { fontSize: 15, fontWeight: '700' },
  messageBox: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  messageText: { fontSize: 15, lineHeight: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  decisionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  decisionBtn: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  decisionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  feedbackContainer: { marginTop: 10 },
  replyOptionBtn: { padding: 16, borderRadius: 16, borderWidth: 1 },
  replyOptionText: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  openEndedBox: { padding: 16, borderRadius: 16, borderWidth: 1 },
  openEndedPrompt: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  textInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12 },
  gradeBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  gradeBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  replyResultBox: { padding: 16, borderRadius: 16, borderWidth: 2, marginTop: 12 },
  replyResultTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  replyResultText: { fontSize: 15, lineHeight: 22 },
  explanationBody: { fontSize: 15, lineHeight: 24 },
});