import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BriefingArticle {
  id: string; title: string; category: string; readTime: string;
  summary: string; keyTakeaway: string; quizQuestion: string;
  options: { text: string; isCorrect: boolean }[]; explanation: string;
}

const BRIEFINGS: BriefingArticle[] = [
  {
    id: '1', title: 'The Rise of AI Voice Cloning', category: 'AI THREAT', readTime: '2 MIN',
    summary: 'Cybercriminals now use generative AI tools to clone anyone’s voice using just 3 seconds of audio pulled from public Instagram or TikTok videos.',
    keyTakeaway: 'Always establish a private "family safe word" with your parents or close friends to verify emergency phone calls.',
    quizQuestion: 'How much audio do scammers need to create an AI clone of a voice?',
    options: [
      { text: 'At least 2 full hours of recorded phone calls', isCorrect: false },
      { text: 'Just 3 seconds of video from social media', isCorrect: true },
      { text: 'They need access to your school microphone', isCorrect: false },
    ],
    explanation: 'Modern neural network models require very brief audio clips to replicate vocal tone, pitch, and accent patterns.',
  },
  {
    id: '2', title: 'Anatomy of a Phishing Domain', category: 'WEB VECTOR', readTime: '3 MIN',
    summary: 'Scammers register fake lookalike websites (like "appleid-support-login.net" instead of "apple.com") to harvest your login credentials.',
    keyTakeaway: 'Always look past the first part of a URL. The actual domain name is right before the primary ".com" or ".org".',
    quizQuestion: 'In the URL "netflix.com.billing-update.net", who actually owns the website?',
    options: [
      { text: 'Netflix Inc.', isCorrect: false },
      { text: 'The owner of "billing-update.net"', isCorrect: true },
      { text: 'Apple security servers', isCorrect: false },
    ],
    explanation: 'Scammers put familiar brand names at the beginning of URLs to trick skimming eyes, but the actual domain is the last part before the slash.',
  },
  {
    id: '3', title: 'The Fake Check Overpayment Trap', category: 'FINANCIAL', readTime: '2 MIN',
    summary: 'The #1 scam targeting teens on social media offering "brand ambassador" or "remote assistant" jobs. They send a mobile check and ask you to Venmo cash back.',
    keyTakeaway: 'By federal banking law, funds from checks must be made available in 24 hours, but banks can take up to 2 weeks to discover a check is fake.',
    quizQuestion: 'What happens 5 days after you mobile-deposit a fake scam check and Venmo cash back?',
    options: [
      { text: 'Nothing, the bank keeps the money', isCorrect: false },
      { text: 'The check bounces, and your bank takes back the full amount plus your Venmo cash', isCorrect: true },
      { text: 'You get a bonus paycheck from the company', isCorrect: false },
    ],
    explanation: 'When fake checks bounce, the bank removes the credit from your balance, leaving you responsible for the real cash you sent out.',
  },
];

export default function LearnScreen() {
  const [selectedArticle, setSelectedArticle] = useState<BriefingArticle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const resetSelection = () => { setSelectedArticle(null); setSelectedAnswer(null); };

  const handleAnswerSelect = (index: number, articleId: string) => {
    setSelectedAnswer(index);
    if (!completedQuizzes.includes(articleId)) setCompletedQuizzes([...completedQuizzes, articleId]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>DAILY BRIEFING</Text>
          <Text style={styles.subHeader}>CYBER INTELLIGENCE FEED</Text>
        </View>
      </View>

      {!selectedArticle ? (
        <View>
          <Text style={styles.sectionTitle}>// LATEST THREAT VECTORS:</Text>
          {BRIEFINGS.map((art) => {
            const isDone = completedQuizzes.includes(art.id);
            return (
              <TouchableOpacity key={art.id} style={[styles.articleCard, isDone && styles.articleCardDone]} onPress={() => { setSelectedArticle(art); setSelectedAnswer(null); }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.categoryBadgeText}>[{art.category}]</Text>
                  <Text style={styles.readTimeText}>{art.readTime}</Text>
                </View>
                <Text style={styles.articleTitle}>{art.title}</Text>
                <Text numberOfLines={2} style={styles.articleSummary}>{art.summary}</Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.readPrompt, isDone && { color: '#10B981' }]}>
                    {isDone ? 'DATA ACCESSED ✓' : 'INITIALIZE BRIEFING →'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.readerCard}>
          <TouchableOpacity style={styles.backButton} onPress={resetSelection}>
            <Ionicons name="chevron-back" size={16} color="#00F0FF" />
            <Text style={styles.backButtonText}>CLOSE BRIEFING</Text>
          </TouchableOpacity>

          <Text style={styles.categoryBadgeText}>[{selectedArticle.category}]</Text>
          <Text style={styles.readerTitle}>{selectedArticle.title}</Text>
          <Text style={styles.readerBody}>{selectedArticle.summary}</Text>

          <View style={styles.takeawayBox}>
            <Ionicons name="shield" size={20} color="#00F0FF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.takeawayTitle}>DEFENSE PROTOCOL</Text>
              <Text style={styles.takeawayText}>{selectedArticle.keyTakeaway}</Text>
            </View>
          </View>

          <Text style={styles.quizHeader}>// KNOWLEDGE OVERRIDE:</Text>
          <Text style={styles.quizQuestion}>{selectedArticle.quizQuestion}</Text>

          <View style={{ gap: 10, marginBottom: 20 }}>
            {selectedArticle.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = opt.isCorrect;
              let btnStyle = styles.quizOptionBtn;
              if (selectedAnswer !== null) {
                if (isCorrectOpt) btnStyle = [styles.quizOptionBtn, styles.quizCorrect];
                else if (isSelected) btnStyle = [styles.quizOptionBtn, styles.quizWrong];
              }

              return (
                <TouchableOpacity key={idx} style={btnStyle} onPress={() => handleAnswerSelect(idx, selectedArticle.id)} disabled={selectedAnswer !== null}>
                  <Text style={[styles.quizOptionText, selectedAnswer !== null && isCorrectOpt && { color: '#10B981' }]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedAnswer !== null && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>SYSTEM LOG:</Text>
              <Text style={styles.explanationText}>{selectedArticle.explanation}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.doneBtn} onPress={resetSelection}>
            <Text style={styles.doneBtnText}>RETURN TO FEED</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 24 },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  subHeader: { fontSize: 12, color: '#00F0FF', fontWeight: '700', marginTop: 4, letterSpacing: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#71717A', marginBottom: 12, letterSpacing: 1 },
  articleCard: { backgroundColor: '#111113', padding: 18, borderRadius: 6, marginBottom: 14, borderWidth: 1, borderColor: '#27272A' },
  articleCardDone: { borderColor: '#10B981', opacity: 0.8 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  categoryBadgeText: { fontSize: 10, fontWeight: '900', color: '#00F0FF', letterSpacing: 1, marginBottom: 8 },
  readTimeText: { fontSize: 10, color: '#71717A', fontWeight: '800', letterSpacing: 1 },
  articleTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 8 },
  articleSummary: { fontSize: 14, color: '#A1A1AA', lineHeight: 22, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#27272A', paddingTop: 12 },
  readPrompt: { fontSize: 11, fontWeight: '900', color: '#00F0FF', letterSpacing: 1 },
  readerCard: { backgroundColor: 'transparent', padding: 0 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  backButtonText: { fontSize: 12, fontWeight: '800', color: '#00F0FF', letterSpacing: 1 },
  readerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 16, lineHeight: 30 },
  readerBody: { fontSize: 15, color: '#D4D4D8', lineHeight: 24, marginBottom: 24 },
  takeawayBox: { flexDirection: 'row', gap: 14, backgroundColor: 'rgba(0, 240, 255, 0.05)', borderWidth: 1, borderColor: '#00F0FF', padding: 16, borderRadius: 6, marginBottom: 24, alignItems: 'flex-start' },
  takeawayTitle: { fontSize: 11, fontWeight: '900', color: '#00F0FF', marginBottom: 6, letterSpacing: 1 },
  takeawayText: { fontSize: 14, color: '#FFF', lineHeight: 22 },
  quizHeader: { fontSize: 13, fontWeight: '900', color: '#71717A', marginBottom: 10, letterSpacing: 1 },
  quizQuestion: { fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 16, lineHeight: 22 },
  quizOptionBtn: { backgroundColor: '#111113', padding: 16, borderRadius: 6, borderWidth: 1, borderColor: '#27272A' },
  quizCorrect: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' },
  quizWrong: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' },
  quizOptionText: { fontSize: 14, color: '#A1A1AA', fontWeight: '700' },
  explanationBox: { backgroundColor: '#111113', borderWidth: 1, borderColor: '#3F3F46', padding: 16, borderRadius: 6, marginBottom: 24 },
  explanationTitle: { fontSize: 11, fontWeight: '900', color: '#71717A', marginBottom: 8, letterSpacing: 1 },
  explanationText: { fontSize: 14, color: '#D4D4D8', lineHeight: 22 },
  doneBtn: { backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 6, alignItems: 'center' },
  doneBtnText: { color: '#050505', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
});