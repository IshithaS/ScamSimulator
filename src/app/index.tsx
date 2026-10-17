import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SLIDES: OnboardingSlide[] = [
  {
    title: 'Welcome to ScamSimulator',
    subtitle: 'Congressional App Challenge Edition',
    description: 'An immersive, realistic training simulator designed to teach you how to identify and defend against AI-era cyber scams.',
    icon: 'shield-checkmark-outline',
  },
  {
    title: 'Interactive Threat Inbox',
    subtitle: '40+ Realistic Simulations',
    description: 'Inspect live SMS messages, AI voice voicemails, and phishing emails. Test your instincts with multi-choice response consequences.',
    icon: 'mail-unread-outline',
  },
  {
    title: 'Daily Security Briefings',
    subtitle: 'Master Cyber Defense',
    description: 'Stay ahead of hackers by learning how deepfake voice cloning, lookalike domains, and financial check-fraud scams operate.',
    icon: 'book-outline',
  },
  {
    title: 'Emergency Defense Kit & Precinct Locator',
    subtitle: 'Instant Incident Response',
    description: 'Locked out or hacked? Follow step-by-step freeze checklists and locate nearby police precincts with required document guides.',
    icon: 'medical-outline',
  },
];

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(tabs)/simulate');
    }
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.slideContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={slide.icon} size={64} color="#2563eb" />
        </View>

        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDesc}>{slide.description}</Text>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Launch App 🚀' : 'Next Feature →'}
          </Text>
        </TouchableOpacity>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => router.replace('/(tabs)/simulate')}
          >
            <Text style={styles.skipBtnText}>Skip Intro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'space-between', padding: 24, paddingTop: 80 },
  slideContainer: { alignItems: 'center', marginTop: 40 },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  slideSubtitle: { fontSize: 13, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 },
  slideTitle: { fontSize: 26, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 14 },
  slideDesc: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1' },
  activeDot: { width: 24, backgroundColor: '#2563eb' },
  footer: { marginBottom: 30, width: '100%' },
  nextBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  nextBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipBtnText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
});