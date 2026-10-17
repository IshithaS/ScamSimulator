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

interface ReplyOption {
  text: string;
  response: string;
  isSafeChoice: boolean;
}

interface ScamScenario {
  id: string;
  channel: 'SMS Text' | 'Voicemail (AI Voice)' | 'Email' | 'DM / Social';
  sender: string;
  senderHandle: string;
  timestamp: string;
  subject?: string;
  message: string;
  isScam: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard (AI Era)';
  redFlags: string[];
  explanation: string;
  replyOptions: ReplyOption[];
  hasLink?: boolean;
  linkDestinationUrl?: string;
}

const SCENARIOS: ScamScenario[] = [
  {
    id: '1',
    channel: 'SMS Text',
    sender: 'USPS Delivery Alert',
    senderHandle: '+1 (808) 555-0194',
    timestamp: 'Today, 10:14 AM',
    message:
      'USPS Notice: Your package #US-948201 cannot be delivered due to an incomplete street address. Please confirm your address and pay the $0.30 redelivery fee within 12 hours or the item will be returned: https://usps-track-redelivery-portal.com/resolve',
    isScam: true,
    difficulty: 'Easy',
    hasLink: true,
    linkDestinationUrl: 'https://usps-track-redelivery-portal.com/resolve',
    redFlags: [
      'Came from a standard 10-digit phone number instead of an official USPS short code (like 28777).',
      'Fake lookalike URL ("usps-track-redelivery-portal.com") instead of official "usps.com".',
      'Demands a tiny "$0.30 fee" just to harvest your credit card number.',
    ],
    explanation:
      'Classic "Smishing" (SMS Phishing). USPS never texts you from random numbers asking for credit card fees to fix an address.',
    replyOptions: [
      {
        text: 'Reply: "Which package is this? Here is my card info."',
        response: 'Scammer instantly logs your credit card details and charges $499.00 on your account!',
        isSafeChoice: false,
      },
      {
        text: 'Reply: "STOP" or ignore and delete the message.',
        response: 'Correct! Never engage with or click links from unknown delivery texts.',
        isSafeChoice: true,
      },
    ],
  },
  {
    id: '2',
    channel: 'Voicemail (AI Voice)',
    sender: 'Unknown Caller (Sounds like Mom)',
    senderHandle: 'No Caller ID • 0:24s',
    timestamp: 'Today, 2:42 PM',
    message:
      '[Audio Transcript]: "Hey sweetie, my phone just died and I got into a minor fender bender. I am using a tow truck driver’s phone. My wallet is locked in the car—can you Zelle $380 to the driver’s number right now at (704) 555-0148 so he can release the car? Please hurry, my battery is at 2%."',
    isScam: true,
    difficulty: 'Hard (AI Era)',
    redFlags: [
      'Scammers only need 3 seconds of audio from social media to clone a family member’s voice using AI.',
      'Extreme urgency ("Please hurry") + excuse why you cannot call them back ("using the driver’s phone").',
      'Payment requested via Zelle to an unknown third party (Zelle transfers are instant and irreversible).',
    ],
    explanation:
      'AI Voice Cloning Emergency Scam. Always hang up and call your family member’s actual phone number directly, or ask a "family safe word" question.',
    replyOptions: [
      {
        text: 'Send $380 via Zelle immediately so Mom is not stranded.',
        response: 'Money is instantly wired to a scammer overseas and cannot be recovered.',
        isSafeChoice: false,
      },
      {
        text: 'Hang up and call Mom directly on her real number to verify.',
        response: 'Smart! Mom picks up at home totally fine. You just blocked an AI clone scam.',
        isSafeChoice: true,
      },
    ],
  },
  {
    id: '3',
    channel: 'Email',
    sender: 'University Financial Aid Office',
    senderHandle: 'aid-disbursement@student-portal-verify.org',
    timestamp: 'Yesterday, 4:15 PM',
    subject: 'URGENT: Fall Tuition Grant Refund Pending ($1,450.00)',
    message:
      'Dear Student,\n\nYour $1,450.00 federal tuition grant refund has been processed. However, our system detected an outdated bank routing profile.\n\nClick below to sign in with your University NetID and password within 24 hours, or your grant will be forfeited.\n\nRegards,\nCampus Student Accounts',
    isScam: true,
    difficulty: 'Medium',
    hasLink: true,
    linkDestinationUrl: 'https://student-portal-verify.org/login',
    redFlags: [
      'Sender domain ends in ".org" ("student-portal-verify.org") instead of an official ".edu" school address.',
      'Threatens that you will "forfeit" money in 24 hours to cause panic.',
      'Phishes for your University NetID login so scammers can hijack your direct deposit profile.',
    ],
    explanation:
      'College & Youth Targeted Phishing. Young adults lose millions annually to fake financial aid and campus job emails.',
    replyOptions: [
      {
        text: 'Click the link and log in with your school username & password.',
        response: 'Credential Harvested! Scammers now have access to your student portal and direct deposit settings.',
        isSafeChoice: false,
      },
      {
        text: 'Delete email and check your official university portal directly.',
        response: 'Correct! Always navigate to official school portals independently rather than clicking email links.',
        isSafeChoice: true,
      },
    ],
  },
  {
    id: '4',
    channel: 'SMS Text',
    sender: 'Chase Fraud Prevention',
    senderHandle: '72166',
    timestamp: 'Yesterday, 6:05 PM',
    message:
      'Chase Fraud Alert: Did you attempt a $412.50 purchase at ELECTRONICS HUB MIAMI FL on card ending in 4821? Reply YES or NO. If NO, we will block the charge. Never share your passcode with anyone.',
    isScam: false,
    difficulty: 'Medium',
    redFlags: [
      'NO RED FLAGS — This is a legitimate bank security alert!',
      'Sent from an official 5-digit bank short code (72166).',
      'Does NOT include a shady link and explicitly warns you never to share passcodes.',
    ],
    explanation:
      'Not every alert is a scam! Real bank texts ask simple YES/NO verification without links or passcode requests.',
    replyOptions: [
      {
        text: 'Reply "NO" because you did not make that purchase.',
        response: 'Correct! This safely blocks the fraudulent charge through official bank automated channels.',
        isSafeChoice: true,
      },
      {
        text: 'Ignore the text and throw away your credit card immediately.',
        response: 'Unnecessary—this was a legitimate bank alert protecting your account.',
        isSafeChoice: false,
      },
    ],
  },
  {
    id: '5',
    channel: 'DM / Social',
    sender: 'Campus Brand Ambassador Recruiter',
    senderHandle: '@stella_talent_recruiting',
    timestamp: '2 days ago',
    message:
      'Hey! We loved your profile and want to send you free merch + pay you $300/week! We already e-mailed you a $500 check to cover starter gear—just mobile deposit the check today and Venmo $200 back to our graphic designer for custom promo codes!',
    isScam: true,
    difficulty: 'Medium',
    redFlags: [
      'The "Fake Check Overpayment" trick: They send a check and ask you to Venmo cash back.',
      'Bank funds appear in 24 hours, but the fake check bounces 5 days later—leaving you down $200 of your own money.',
      'Real employers never ask you to wire or Venmo money back to vendors.',
    ],
    explanation:
      'Influencer & Remote Job Overpayment Scam. Currently the #1 scam targeting teens and college students on social media.',
    replyOptions: [
      {
        text: 'Deposit the check in your app and Venmo the $200 back.',
        response: 'The check bounces in 5 days! Your bank takes back the full $500 and you lose the $200 you Venmoed.',
        isSafeChoice: false,
      },
      {
        text: 'Block the account and report them for job fraud.',
        response: 'Correct! Real companies never pay you with checks that require you to send cash back.',
        isSafeChoice: true,
      },
    ],
  },
];

export default function SimulateScreen() {
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  const [userVerdict, setUserVerdict] = useState<'scam' | 'safe' | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [selectedReply, setSelectedReply] = useState<ReplyOption | null>(null);
  const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);

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

  const renderMessageUI = (item: ScamScenario) => {
    if (item.channel === 'SMS Text' || item.channel === 'DM / Social') {
      return (
        <View style={styles.imessageWindow}>
          <View style={styles.imessageHeader}>
            <View style={styles.imessageAvatar}>
              <Text style={styles.imessageAvatarText}>
                {item.sender.charAt(0)}
              </Text>
            </View>
            <Text style={styles.imessageSenderName}>{item.sender}</Text>
            <Text style={styles.imessageHandle}>{item.senderHandle}</Text>
          </View>

          <View style={styles.chatBody}>
            <Text style={styles.chatTimestampHeader}>{item.timestamp}</Text>
            <View style={styles.incomingBubble}>
              <Text style={styles.incomingBubbleText}>{item.message}</Text>
              {item.hasLink && (
                <TouchableOpacity
                  style={styles.linkButtonBox}
                  onPress={() => setLinkModalVisible(true)}
                >
                  <Ionicons name="globe-outline" size={16} color="#2563eb" />
                  <Text style={styles.linkButtonText}>
                    [ Tap Link: {item.linkDestinationUrl} ]
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    if (item.channel === 'Email') {
      return (
        <View style={styles.emailContainer}>
          <View style={styles.emailHeaderRow}>
            <Text style={styles.emailLabel}>From:</Text>
            <Text style={styles.emailValue}>{item.senderHandle}</Text>
          </View>
          <View style={styles.emailHeaderRow}>
            <Text style={styles.emailLabel}>Subject:</Text>
            <Text style={[styles.emailValue, { fontWeight: '700' }]}>
              {item.subject}
            </Text>
          </View>
          <View style={styles.emailDivider} />
          <Text style={styles.emailBodyText}>{item.message}</Text>
          {item.hasLink && (
            <TouchableOpacity
              style={[styles.linkButtonBox, { marginTop: 12 }]}
              onPress={() => setLinkModalVisible(true)}
            >
              <Ionicons name="globe-outline" size={16} color="#2563eb" />
              <Text style={styles.linkButtonText}>
                [ Click Secure Portal Link ]
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.voicemailContainer}>
        <View style={styles.vmTopRow}>
          <Ionicons name="mic" size={20} color="#dc2626" />
          <Text style={styles.vmTitle}>Visual Voicemail (AI Audio)</Text>
          <Text style={styles.vmDuration}>0:24</Text>
        </View>
        <View style={styles.waveformRow}>
          <View style={[styles.waveBar, { height: 14 }]} />
          <View style={[styles.waveBar, { height: 28 }]} />
          <View style={[styles.waveBar, { height: 36 }]} />
          <View style={[styles.waveBar, { height: 20 }]} />
          <View style={[styles.waveBar, { height: 30 }]} />
          <View style={[styles.waveBar, { height: 12 }]} />
          <View style={[styles.waveBar, { height: 24 }]} />
        </View>
        <Text style={styles.vmTranscriptLabel}>Transcript:</Text>
        <Text style={styles.vmTranscriptText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>Threat Inbox</Text>
          <Text style={styles.subHeader}>
            Inspect incoming messages & spot AI-era traps.
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
          <Text style={styles.sectionTitle}>Select a Message to Analyze:</Text>
          {SCENARIOS.map((item) => {
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
                  <Text style={styles.difficultyText}>{item.difficulty}</Text>
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

          {renderMessageUI(selectedScenario)}

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
  imessageWindow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 16,
  },
  imessageHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  imessageAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  imessageAvatarText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  imessageSenderName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  imessageHandle: { fontSize: 12, color: '#64748b' },
  chatBody: { paddingHorizontal: 4 },
  chatTimestampHeader: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  incomingBubble: {
    backgroundColor: '#e5e7eb',
    padding: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  incomingBubbleText: { fontSize: 15, color: '#1f2937', lineHeight: 22 },
  linkButtonBox: {
    marginTop: 10,
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkButtonText: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  emailContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  emailHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  emailLabel: { fontSize: 13, fontWeight: '700', color: '#6b7280', width: 65 },
  emailValue: { fontSize: 13, color: '#1f2937', flex: 1 },
  emailDivider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
  emailBodyText: { fontSize: 14, color: '#374151', lineHeight: 21 },
  voicemailContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  vmTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  vmTitle: { fontSize: 14, fontWeight: '700', color: '#991b1b', flex: 1 },
  vmDuration: { fontSize: 12, color: '#b91c1c', fontWeight: '600' },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
  },
  waveBar: { width: 4, backgroundColor: '#dc2626', borderRadius: 2 },
  vmTranscriptLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 2,
  },
  vmTranscriptText: {
    fontSize: 13,
    color: '#7f1d1d',
    fontStyle: 'italic',
    lineHeight: 18,
  },
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