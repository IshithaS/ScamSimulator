import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmergencyStep {
  id: string; title: string; actionText: string; shortDesc: string;
  inDepthDetails: string[]; urgency: 'IMMEDIATE' | 'WITHIN 1 HOUR' | 'WITHIN 24 HOURS';
}

const EMERGENCY_STEPS: EmergencyStep[] = [
  {
    id: '1', title: 'FREEZE BANK & CREDIT CARDS', actionText: 'App > "Freeze / Lock Card"',
    shortDesc: 'Instantly lock your debit or credit card to block unauthorized transactions.',
    inDepthDetails: [
      'Log into your official banking app (Chase, Bank of America, etc.) right away.',
      'Navigate to Card Settings and toggle the "Lock / Freeze" switch.',
      'Call the customer service phone number on the back of your physical card.',
      'Check if your card was saved on online shopping accounts and remove it.',
    ], urgency: 'IMMEDIATE',
  },
  {
    id: '2', title: 'SECURE ACCOUNT PASSWORDS', actionText: 'Settings > Password & Security',
    shortDesc: 'Change your main cloud account password and sign out of all active web sessions.',
    inDepthDetails: [
      'Go to your phone’s settings menu to change your password immediately.',
      'Click "Sign Out of Other Devices" to kick hackers off your account.',
      'Verify your backup recovery email was not changed.',
    ], urgency: 'IMMEDIATE',
  },
  {
    id: '3', title: 'REVOKE CRYPTO PERMISSIONS', actionText: 'Visit Revoke.cash / Debank.com',
    shortDesc: 'Disconnect sketchy smart contracts if you signed a malicious web airdrop.',
    inDepthDetails: [
      'Go to a verified revocation tool like Revoke.cash using a secure browser.',
      'Connect your wallet and carefully review all active token approvals.',
      'Revoke permissions for any unknown or suspicious contracts.',
    ], urgency: 'IMMEDIATE',
  },
  {
    id: '4', title: 'UPGRADE TO 2FA AUTHENTICATOR', actionText: 'Download Google Authenticator',
    shortDesc: 'Switch from vulnerable SMS text codes to secure time-based 2FA tokens.',
    inDepthDetails: [
      'SMS text messages can be intercepted via SIM-swapping attacks.',
      'Log into major accounts and go to security settings.',
      'Scan the QR code using Google Authenticator or a hardware key.',
    ], urgency: 'WITHIN 1 HOUR',
  },
  {
    id: '5', title: 'REPORT CYBERCRIME TO IC3', actionText: 'File official report at ic3.gov',
    shortDesc: 'Submit a formal complaint to the FBI Internet Crime Complaint Center.',
    inDepthDetails: [
      'Go to the official FBI Internet Crime Complaint Center website (ic3.gov).',
      'Provide exact transaction logs, phone numbers, and URLs associated with the scam.',
      'Contact your local police department to file an identity theft report if necessary.',
    ], urgency: 'WITHIN 24 HOURS',
  },
];

export default function KitScreen() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    if (completedSteps.includes(id)) setCompletedSteps(completedSteps.filter((item) => item !== id));
    else setCompletedSteps([...completedSteps, id]);
  };

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>DEFENSE KIT</Text>
          <Text style={styles.subHeader}>INCIDENT RESPONSE CHECKLIST</Text>
        </View>
      </View>

      <View style={styles.warningBanner}>
        <Ionicons name="warning" size={24} color="#050505" />
        <Text style={styles.warningText}>REACT QUICKLY: Every minute counts when securing compromised accounts.</Text>
      </View>

      <Text style={styles.sectionTitle}>// RECOVERY PROTOCOLS:</Text>

      {EMERGENCY_STEPS.map((step) => {
        const isDone = completedSteps.includes(step.id);
        const isExpanded = expandedId === step.id;

        return (
          <View key={step.id} style={[styles.stepCard, isDone && styles.stepCardDone]}>
            <TouchableOpacity onPress={() => toggleExpand(step.id)} activeOpacity={0.8}>
              <View style={styles.stepHeaderRow}>
                <Text style={[styles.urgencyBadgeText, step.urgency === 'IMMEDIATE' ? { color: '#EF4444' } : { color: '#EAB308' }]}>
                  [{step.urgency}]
                </Text>
                <TouchableOpacity onPress={() => toggleStep(step.id)} style={styles.checkboxTouch}>
                  <Ionicons name={isDone ? 'checkbox' : 'square-outline'} size={24} color={isDone ? '#10B981' : '#71717A'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.stepTitle, isDone && styles.textDone]}>{step.title}</Text>
              <Text style={styles.stepAction}>{step.actionText}</Text>
              <Text style={styles.stepDesc}>{step.shortDesc}</Text>

              <Text style={styles.expandPromptText}>{isExpanded ? 'HIDE LOG ▲' : 'VIEW ACTION PLAN ▼'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.detailsContainer}>
                <View style={styles.divider} />
                <Text style={styles.detailsHeader}>EXECUTION STEPS:</Text>
                {step.inDepthDetails.map((detail, idx) => (
                  <View key={idx} style={styles.detailRow}>
                    <Text style={styles.detailBullet}>></Text>
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 20 },
  header: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  subHeader: { fontSize: 12, color: '#EF4444', fontWeight: '700', marginTop: 4, letterSpacing: 2 },
  warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EF4444', padding: 16, borderRadius: 6, marginBottom: 24 },
  warningText: { fontSize: 12, fontWeight: '900', color: '#050505', flex: 1, letterSpacing: 1, lineHeight: 18 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#71717A', marginBottom: 12, letterSpacing: 1 },
  stepCard: { backgroundColor: '#111113', padding: 18, borderRadius: 6, marginBottom: 14, borderWidth: 1, borderColor: '#27272A' },
  stepCardDone: { borderColor: '#10B981', opacity: 0.6 },
  stepHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  urgencyBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  checkboxTouch: { padding: 4 },
  stepTitle: { fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 6 },
  textDone: { textDecorationLine: 'line-through', color: '#10B981' },
  stepAction: { fontSize: 12, fontWeight: '900', color: '#00F0FF', marginBottom: 8, letterSpacing: 1 },
  stepDesc: { fontSize: 13, color: '#A1A1AA', lineHeight: 20, marginBottom: 12 },
  expandPromptText: { fontSize: 10, fontWeight: '900', color: '#71717A', letterSpacing: 2 },
  detailsContainer: { marginTop: 16 },
  divider: { height: 1, backgroundColor: '#27272A', marginBottom: 16 },
  detailsHeader: { fontSize: 11, fontWeight: '900', color: '#FFF', marginBottom: 12, letterSpacing: 1 },
  detailRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  detailBullet: { fontSize: 13, fontWeight: '900', color: '#00F0FF' },
  detailText: { fontSize: 13, color: '#D4D4D8', flex: 1, lineHeight: 20 },
});