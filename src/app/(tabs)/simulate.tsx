import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThreatCard } from '../../components/ThreatCard';
import { ReplyOption, SCENARIOS, ScamScenario } from '../../data/scenarios';

const SCAM_TYPES = ['All (40)', ...Array.from(new Set(SCENARIOS.map((s) => s.scamType)))];

export default function SimulateScreen() {
  const [selectedType, setSelectedType] = useState<string>('All (40)');
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  const [userVerdict, setUserVerdict] = useState<'scam' | 'safe' | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);

  const filteredScenarios =
    selectedType === 'All (40)'
      ? SCENARIOS
      : SCENARIOS.filter((s) => s.scamType === selectedType);

  const handleDecision = (choice: 'scam' | 'safe') => {
    if (!selectedScenario) return;
    setUserVerdict(choice);

    const isCorrect =
      (choice === 'scam' && selectedScenario.isScam) ||
      (choice === 'safe' && !selectedScenario.isScam);

    if (!completedIds.includes(selectedScenario.id)) {
      setCompletedIds([...completedIds, selectedScenario.id]);
      if (isCorrect) {
        setScore(score + 100);
      }
    }
  };

  const resetSelection = () => {
    setSelectedScenario(null);
    setUserVerdict(null);
    setSelectedReply(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>Threat Inbox</Text>
          <Text style={styles.subHeader}>
            10 Scam Types • 4 Examples Per Type (40 Total)
          </Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score} XP</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressText}>
          Simulations Completed: {completedIds.length} / {SCENARIOS.length}
        </Text>
      </View>

      {!selectedScenario ? (
        <View>
          {/* Horizontal Filter Bar for the 10 Simulation Types */}
          <Text style={styles.sectionTitle}>Filter by Simulation Type (4 Examples Each):</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {SCAM_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>
            Showing {filteredScenarios.length} Simulations:
          </Text>

          {filteredScenarios.map((item) => {
            const isDone = completedIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.inboxCard, isDone && styles.inboxCardDone]}
                onPress={() => {
                  setSelectedScenario(item);
                  setUserVerdict(null);
                  setSelectedReply(null);
                }}
              >
                <View style={styles.inboxCardHeader}>
                  <View style={styles.channelBadge}>
                    <Text style={styles.channelBadgeText}>{item.channel}</Text>
                  </View>
                  <Text style={styles.difficultyText}>{item.scamType}</Text>
                </View>

                <Text style={styles.senderName}>{item.sender}</Text>
                <Text style={styles.senderHandle}>{item.senderHandle}</Text>
                <Text numberOfLines={2} style={styles.messagePreview}>
                  {item.message}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                  <Text style={styles.inspectPrompt}>
                    {isDone ? '✓ Completed' : 'Tap to Inspect →'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.simulatorCard}>
          <TouchableOpacity style={styles.backButton} onPress={resetSelection}>
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text style={styles.backButtonText}>Back to Inbox</Text>
          </TouchableOpacity>

          <ThreatCard
            scenario={selectedScenario}
            onPressLink={() => setLinkModalVisible(true)}
          />

          {!userVerdict ? (
            <View>
              <Text style={styles.sectionTitle}>Step 1: Is this a scam?</Text>
              <View style={styles.decisionRow}>
                <TouchableOpacity
                  style={[styles.decisionBtn, styles.scamBtn]}
                  onPress={() => handleDecision('scam')}
                >
                  <Ionicons name="warning-outline" size={20} color="#ffffff" />
                  <Text style={styles.decisionBtnText}>Block as Scam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.decisionBtn, styles.safeBtn]}
                  onPress={() => handleDecision('safe')}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#ffffff"
                  />
                  <Text style={styles.decisionBtnText}>Trust as Safe</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.feedbackContainer}>
              <Text style={styles.sectionTitle}>
                Step 2: Choose Your Response Action
              </Text>
              {!selectedReply ? (
                <View style={{ gap: 10, marginBottom: 16 }}>
                  {selectedScenario.replyOptions.map((opt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.replyOptionBtn}
                      onPress={() => setSelectedReply(opt)}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={16}
                        color="#4338ca"
                      />
                      <Text style={styles.replyOptionText}>{opt.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.replyResultBox,
                    selectedReply.isSafeChoice
                      ? styles.replyCorrectBox
                      : styles.replyWrongBox,
                  ]}
                >
                  <Text
                    style={[
                      styles.replyResultTitle,
                      selectedReply.isSafeChoice
                        ? { color: '#15803d' }
                        : { color: '#b91c1c' },
                    ]}
                  >
                    {selectedReply.isSafeChoice
                      ? '✓ Safe Choice Result:'
                      : '⚠️ Dangerous Choice Result:'}
                  </Text>
                  <Text style={styles.replyResultText}>
                    {selectedReply.response}
                  </Text>
                </View>
              )}

              {((userVerdict === 'scam' && selectedScenario.isScam) ||
                (userVerdict === 'safe' && !selectedScenario.isScam)) ? (
                <View style={styles.resultBannerCorrect}>
                  <Ionicons name="checkmark-circle" size={24} color="#15803d" />
                  <Text style={styles.resultTitleCorrect}>
                    Spot On! Accurate threat assessment.
                  </Text>
                </View>
              ) : (
                <View style={styles.resultBannerWrong}>
                  <Ionicons name="close-circle" size={24} color="#b91c1c" />
                  <Text style={styles.resultTitleWrong}>
                    Review the red flags carefully.
                  </Text>
                </View>
              )}

              <Text style={styles.explanationTitle}>Why?</Text>
              <Text style={styles.explanationBody}>
                {selectedScenario.explanation}
              </Text>

              <Text style={styles.explanationTitle}>Key Signals to Spot:</Text>
              {selectedScenario.redFlags.map((flag, idx) => (
                <View key={idx} style={styles.flagRow}>
                  <Text style={styles.flagBullet}>•</Text>
                  <Text style={styles.flagText}>{flag}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.nextBtn} onPress={resetSelection}>
                <Text style={styles.nextBtnText}>Try Another Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Modal
        visible={linkModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLinkModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalAlertHeader}>
              <Ionicons name="alert-circle" size={32} color="#dc2626" />
              <Text style={styles.modalAlertTitle}>
                🚨 SIMULATED MALICIOUS LINK
              </Text>
            </View>
            <Text style={styles.modalAlertBody}>
              You tapped a phishing URL. In a real attack, your browser would
              now redirect to a fake lookalike website designed to steal your
              passwords or credit card details.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setLinkModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>
                Got it (Close Simulation)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  header: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  subHeader: { fontSize: 14, color: '#475569', marginTop: 2 },
  scoreBadge: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreLabel: { fontSize: 10, fontWeight: '700', color: '#dc2626' },
  scoreValue: { fontSize: 16, fontWeight: '800', color: '#991b1b' },
  progressCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  progressText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 8, paddingRight: 16 },
  filterChip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: { backgroundColor: '#dc2626' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  filterChipTextActive: { color: '#ffffff' },
  inboxCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inboxCardDone: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  inboxCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  channelBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  channelBadgeText: { fontSize: 11, fontWeight: '700', color: '#b91c1c' },
  difficultyText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  senderName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  senderHandle: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  messagePreview: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: { fontSize: 12, color: '#94a3b8' },
  inspectPrompt: { fontSize: 13, fontWeight: '700', color: '#dc2626' },
  simulatorCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  backButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  decisionRow: { flexDirection: 'row', gap: 12 },
  decisionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
  },
  scamBtn: { backgroundColor: '#dc2626' },
  safeBtn: { backgroundColor: '#16a34a' },
  decisionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  feedbackContainer: { marginTop: 8 },
  replyOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  replyOptionText: { fontSize: 14, color: '#0f172a', fontWeight: '600', flex: 1 },
  replyResultBox: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  replyCorrectBox: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  replyWrongBox: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  replyResultTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  replyResultText: { fontSize: 13, color: '#1e293b', lineHeight: 18 },
  resultBannerCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  resultTitleCorrect: { fontSize: 15, fontWeight: '700', color: '#15803d' },
  resultBannerWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  resultTitleWrong: { fontSize: 15, fontWeight: '700', color: '#b91c1c' },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
  },
  explanationBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  flagRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  flagBullet: { fontSize: 14, fontWeight: '700', color: '#dc2626' },
  flagText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 19 },
  nextBtn: {
    marginTop: 14,
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  modalAlertHeader: { alignItems: 'center', marginBottom: 12 },
  modalAlertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
    marginTop: 6,
    textAlign: 'center',
  },
  modalAlertBody: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});