import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { ReplyOption, SCENARIOS, ScamScenario } from '../../data/scenarios';

const SCAM_TYPES = ['All Types', ...Array.from(new Set(SCENARIOS.map((s) => s.scamType)))];

export default function SimulateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sensory-friendly soft color palette
  const theme = {
    bg: isDark ? '#1F2937' : '#F9FAFB',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    subText: isDark ? '#9CA3AF' : '#6B7280',
    primary: isDark ? '#818CF8' : '#6366F1', // Soft Indigo
    success: isDark ? '#34D399' : '#10B981', // Calming Mint Green
    warning: isDark ? '#FBBF24' : '#F59E0B', // Soft Amber (Not harsh red)
    border: isDark ? '#4B5563' : '#E5E7EB',
  };

  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  const [userVerdict, setUserVerdict] = useState<'scam' | 'safe' | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);

  const filteredScenarios = selectedType === 'All Types' ? SCENARIOS : SCENARIOS.filter((s) => s.scamType === selectedType);

  const readAloud = (text: string) => {
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 1.0 });
  };

  const handleDecision = (choice: 'scam' | 'safe') => {
    if (!selectedScenario) return;
    setUserVerdict(choice);
    const isCorrect = (choice === 'scam' && selectedScenario.isScam) || (choice === 'safe' && !selectedScenario.isScam);
    if (!completedIds.includes(selectedScenario.id)) {
      setCompletedIds([...completedIds, selectedScenario.id]);
      if (isCorrect) setScore(score + 100);
    }
    readAloud(isCorrect ? "Correct! Good job analyzing the threat." : "Incorrect. Let's review the warning signs.");
  };

  const resetSelection = () => {
    Speech.stop();
    setSelectedScenario(null);
    setUserVerdict(null);
    setSelectedReply(null);
  };

  const renderMessageCard = (item: ScamScenario) => (
    <View style={[styles.messageBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={styles.messageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.senderName, { color: theme.text }]}>{item.sender}</Text>
          <Text style={[styles.senderHandle, { color: theme.subText }]}>{item.senderHandle}</Text>
        </View>
        <TouchableOpacity style={[styles.ttsBtn, { backgroundColor: theme.card }]} onPress={() => readAloud(`Message from ${item.sender}. ${item.message}`)}>
          <Ionicons name="volume-medium" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <View style={[styles.bubble, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.messageText, { color: theme.text }]}>{item.message}</Text>
        {item.hasLink && (
          <TouchableOpacity style={[styles.linkBox, { backgroundColor: isDark ? '#3730A3' : '#EEF2FF' }]} onPress={() => setLinkModalVisible(true)}>
            <Ionicons name="link" size={16} color={theme.primary} />
            <Text style={[styles.linkText, { color: theme.primary }]}>Attached Link</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.header, { color: theme.text }]} accessibilityRole="header">Inbox Simulator</Text>
          <Text style={[styles.subHeader, { color: theme.subText }]}>Practice safely identifying scams.</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.scoreLabel, { color: theme.subText }]}>SCORE</Text>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>{score}</Text>
        </View>
      </View>

      {!selectedScenario ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
            {SCAM_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <TouchableOpacity key={type} style={[styles.filterChip, { backgroundColor: active ? theme.primary : theme.card, borderColor: theme.border }]} onPress={() => setSelectedType(type)}>
                  <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.text }]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredScenarios.map((item) => {
            const isDone = completedIds.includes(item.id);
            return (
              <TouchableOpacity key={item.id} style={[styles.inboxCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => { setSelectedScenario(item); setUserVerdict(null); setSelectedReply(null); readAloud("Scenario opened. Please analyze the message."); }}>
                <View style={styles.inboxCardHeader}>
                  <Text style={[styles.channelBadge, { color: theme.primary, backgroundColor: isDark ? '#312E81' : '#EEF2FF' }]}>{item.channel}</Text>
                  {isDone && <Ionicons name="checkmark-circle" size={16} color={theme.success} />}
                </View>
                <Text style={[styles.senderName, { color: theme.text }]}>{item.sender}</Text>
                <Text numberOfLines={2} style={[styles.messagePreview, { color: theme.subText }]}>{item.message}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.backButton} onPress={resetSelection}>
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
            <Text style={[styles.backButtonText, { color: theme.primary }]}>Back to List</Text>
          </TouchableOpacity>

          {renderMessageCard(selectedScenario)}

          {!userVerdict ? (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Step 1: Is this message safe?</Text>
              <View style={styles.decisionRow}>
                <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: theme.warning }]} onPress={() => handleDecision('scam')}>
                  <Ionicons name="warning-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.decisionBtnText}>It's a Scam</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.decisionBtn, { backgroundColor: theme.success }]} onPress={() => handleDecision('safe')}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.decisionBtnText}>It's Safe</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.feedbackContainer}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Step 2: How would you reply?</Text>
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
                    {selectedReply.isSafeChoice ? 'Good Choice!' : 'Careful!'}
                  </Text>
                  <Text style={[styles.replyResultText, { color: theme.text }]}>{selectedReply.response}</Text>
                </View>
              )}

              <TouchableOpacity style={[styles.ttsBtn, { backgroundColor: theme.card, alignSelf: 'flex-start', marginBottom: 10 }]} onPress={() => readAloud(selectedScenario.explanation)}>
                <Ionicons name="volume-medium" size={16} color={theme.primary} />
                <Text style={{ color: theme.primary, fontWeight: '600', marginLeft: 6 }}>Listen to Explanation</Text>
              </TouchableOpacity>
              
              <Text style={[styles.explanationBody, { color: theme.subText }]}>{selectedScenario.explanation}</Text>

              <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.primary }]} onPress={resetSelection}>
                <Text style={styles.nextBtnText}>Next Scenario</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Modal visible={linkModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Ionicons name="information-circle" size={40} color={theme.warning} />
            <Text style={[styles.modalAlertTitle, { color: theme.text }]}>Simulation Alert</Text>
            <Text style={[styles.modalAlertBody, { color: theme.subText }]}>You tapped a link. In a real scenario, this could steal your information. Be careful!</Text>
            <TouchableOpacity style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]} onPress={() => setLinkModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 26, fontWeight: '800' },
  subHeader: { fontSize: 15, marginTop: 4 },
  scoreBadge: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  scoreLabel: { fontSize: 10, fontWeight: '700' },
  scoreValue: { fontSize: 18, fontWeight: '800' },
  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 10, paddingRight: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  filterChipText: { fontSize: 14, fontWeight: '600' },
  inboxCard: { padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  inboxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  channelBadge: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  senderName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  senderHandle: { fontSize: 13, marginBottom: 10 },
  messagePreview: { fontSize: 14, lineHeight: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backButtonText: { fontSize: 15, fontWeight: '700' },
  messageBox: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  ttsBtn: { padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  bubble: { padding: 16, borderRadius: 16, borderWidth: 1 },
  messageText: { fontSize: 16, lineHeight: 24 },
  linkBox: { marginTop: 14, padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkText: { fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  decisionRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  decisionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  decisionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  feedbackContainer: { marginTop: 10 },
  replyOptionBtn: { padding: 16, borderRadius: 16, borderWidth: 1 },
  replyOptionText: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  replyResultBox: { padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 2 },
  replyResultTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  replyResultText: { fontSize: 15, lineHeight: 22 },
  explanationBody: { fontSize: 15, lineHeight: 24, marginBottom: 16 },
  nextBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  nextBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalAlertTitle: { fontSize: 20, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  modalAlertBody: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  modalCloseBtn: { paddingVertical: 14, width: '100%', borderRadius: 12, alignItems: 'center' },
  modalCloseBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});