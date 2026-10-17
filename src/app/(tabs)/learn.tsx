import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BriefingArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  keyTakeaway: string;
  quizQuestion: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const BRIEFINGS: BriefingArticle[] = [
  {
    id: '1',
    title: 'The Rise of AI Voice Cloning',
    category: 'AI Threat',
    readTime: '2 min read',
    summary:
      'Cybercriminals now use generative AI tools to clone anyone’s voice using just 3 seconds of audio pulled from public Instagram or TikTok videos.',
    keyTakeaway:
      'Always establish a private "family safe word" with your parents or close friends to verify emergency phone calls.',
    quizQuestion: 'How much audio do scammers need to create an AI clone of a voice?',
    options: [
      { text: 'At least 2 full hours of recorded phone calls', isCorrect: false },
      { text: 'Just 3 seconds of video from social media', isCorrect: true },
      { text: 'They need access to your school microphone', isCorrect: false },
    ],
    explanation:
      'Modern neural network models require very brief audio clips to replicate vocal tone, pitch, and accent patterns.',
  },
  {
    id: '2',
    title: 'Anatomy of a Phishing Domain',
    category: 'Smishing & Web',
    readTime: '3 min read',
    summary:
      'Scammers register fake lookalike websites (like "appleid-support-login.net" instead of "apple.com") to harvest your login credentials.',
    keyTakeaway:
      'Always look past the first part of a URL. The actual domain name is right before the primary ".com" or ".org".',
    quizQuestion: 'In the URL "netflix.com.billing-update.net", who actually owns the website?',
    options: [
      { text: 'Netflix Inc.', isCorrect: false },
      { text: 'The owner of "billing-update.net"', isCorrect: true },
      { text: 'Apple security servers', isCorrect: false },
    ],
    explanation:
      'Scammers put familiar brand names at the beginning of URLs to trick skimming eyes, but the actual domain is the last part before the slash.',
  },
  {
    id: '3',
    title: 'The Fake Check Overpayment Trap',
    category: 'Financial Scam',
    readTime: '2 min read',
    summary:
      'The #1 scam targeting teens on social media offering "brand ambassador" or "remote assistant" jobs. They send a mobile check and ask you to Venmo cash back.',
    keyTakeaway:
      'By federal banking law, funds from checks must be made available in 24 hours, but banks can take up to 2 weeks to discover a check is fake.',
    quizQuestion: 'What happens 5 days after you mobile-deposit a fake scam check and Venmo cash back?',
    options: [
      { text: 'Nothing, the bank keeps the money', isCorrect: false },
      { text: 'The check bounces, and your bank takes back the full amount plus your Venmo cash', isCorrect: true },
      { text: 'You get a bonus paycheck from the company', isCorrect: false },
    ],
    explanation:
      'When fake checks bounce, the bank removes the credit from your balance, leaving you responsible for the real cash you sent out.',
  },
];

export default function LearnScreen() {
  const [selectedArticle, setSelectedArticle] = useState<BriefingArticle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const resetSelection = () => {
    setSelectedArticle(null);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (index: number, articleId: string) => {
    setSelectedAnswer(index);
    if (!completedQuizzes.includes(articleId)) {
      setCompletedQuizzes([...completedQuizzes, articleId]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>Daily Briefing</Text>
          <Text style={styles.subHeader}>
            Master cyber defense tactics & outsmart modern scams.
          </Text>
        </View>
      </View>

      {!selectedArticle ? (
        <View>
          <Text style={styles.sectionTitle}>Cybersecurity Intelligence Feed:</Text>
          {BRIEFINGS.map((art) => {
            const isDone = completedQuizzes.includes(art.id);
            return (
              <TouchableOpacity
                key={art.id}
                style={[styles.articleCard, isDone && styles.articleCardDone]}
                onPress={() => {
                  setSelectedArticle(art);
                  setSelectedAnswer(null);
                }}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{art.category}</Text>
                  </View>
                  <Text style={styles.readTimeText}>{art.readTime}</Text>
                </View>

                <Text style={styles.articleTitle}>{art.title}</Text>
                <Text numberOfLines={2} style={styles.articleSummary}>
                  {art.summary}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.readPrompt}>
                    {isDone ? '✓ Quiz Completed' : 'Read & Take Quiz →'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.readerCard}>
          <TouchableOpacity style={styles.backButton} onPress={resetSelection}>
            <Ionicons name="arrow-back" size={18} color="#374151" />
            <Text style={styles.backButtonText}>Back to Briefings</Text>
          </TouchableOpacity>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{selectedArticle.category}</Text>
          </View>
          <Text style={styles.readerTitle}>{selectedArticle.title}</Text>

          <Text style={styles.readerBody}>{selectedArticle.summary}</Text>

          <View style={styles.takeawayBox}>
            <Ionicons name="shield-checkmark" size={20} color="#15803d" />
            <View style={{ flex: 1 }}>
              <Text style={styles.takeawayTitle}>Key Defense Rule</Text>
              <Text style={styles.takeawayText}>{selectedArticle.keyTakeaway}</Text>
            </View>
          </View>

          <Text style={styles.quizHeader}>Quick Knowledge Check:</Text>
          <Text style={styles.quizQuestion}>{selectedArticle.quizQuestion}</Text>

          <View style={{ gap: 10, marginBottom: 16 }}>
            {selectedArticle.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = opt.isCorrect;

              let btnStyle = styles.quizOptionBtn;
              if (selectedAnswer !== null) {
                if (isCorrectOpt) btnStyle = [styles.quizOptionBtn, styles.quizCorrect];
                else if (isSelected) btnStyle = [styles.quizOptionBtn, styles.quizWrong];
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={btnStyle}
                  onPress={() => handleAnswerSelect(idx, selectedArticle.id)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.quizOptionText}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedAnswer !== null && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{selectedArticle.explanation}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneBtn} onPress={resetSelection}>
            <Text style={styles.doneBtnText}>Back to Feed</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 18 },
  header: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  subHeader: { fontSize: 14, color: '#475569', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  articleCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  articleCardDone: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#2563eb' },
  readTimeText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  articleTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  articleSummary: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  readPrompt: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  readerCard: {
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
  readerTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  readerBody: { fontSize: 15, color: '#334155', lineHeight: 22, marginBottom: 18 },
  takeawayBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  takeawayTitle: { fontSize: 13, fontWeight: '700', color: '#166534', marginBottom: 2 },
  takeawayText: { fontSize: 13, color: '#14532d', lineHeight: 18 },
  quizHeader: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  quizQuestion: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 12 },
  quizOptionBtn: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  quizCorrect: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  quizWrong: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  quizOptionText: { fontSize: 14, color: '#0f172a', fontWeight: '600' },
  explanationBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  explanationTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  explanationText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  doneBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});