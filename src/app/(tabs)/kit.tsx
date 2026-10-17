import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface EmergencyStep {
  id: string;
  title: string;
  actionText: string;
  shortDesc: string;
  inDepthDetails: string[];
  urgency: 'Immediate' | 'Within 1 Hour' | 'Within 24 Hours';
}

const EMERGENCY_STEPS: EmergencyStep[] = [
  {
    id: '1',
    title: 'Freeze Bank & Credit Cards',
    actionText: 'Open Mobile Banking App > Tap "Freeze / Lock Card"',
    shortDesc: 'Instantly lock your debit or credit card to block unauthorized transactions.',
    inDepthDetails: [
      'Log into your official banking app (Chase, Bank of America, Capital One, etc.) right away.',
      'Navigate to Card Settings or Manage Cards and toggle the "Lock / Freeze" switch. This prevents new charges while keeping recurring subscriptions safe.',
      'Call the customer service phone number printed on the back of your physical card to report fraudulent charges and request a replacement chip card.',
      'Check if your card was saved on online shopping accounts (Amazon, Apple Wallet) and remove it.',
    ],
    urgency: 'Immediate',
  },
  {
    id: '2',
    title: 'Secure Apple ID / Google Passwords',
    actionText: 'Settings > [Your Name] > Password & Security',
    shortDesc: 'Change your main cloud account password and sign out of all active web sessions.',
    inDepthDetails: [
      'Go to your phone’s settings menu, tap your profile name, and select "Password & Security" to change your password immediately.',
      'Look for the "Sign Out of Other Devices" or "Active Sessions" button to instantly log hackers out of your account.',
      'Verify that your backup recovery email and phone number were not changed by an attacker.',
      'Check your device list and remove any unknown phones, tablets, or computers.',
    ],
    urgency: 'Immediate',
  },
  {
    id: '3',
    title: 'Revoke Malicious Crypto Permissions',
    actionText: 'Visit Revoke.cash or Debank.com to disconnect tokens',
    shortDesc: 'Disconnect sketchy smart contracts if you signed a malicious web airdrop.',
    inDepthDetails: [
      'If you connected your crypto wallet to a fake airdrop or NFT mint site, scammers may have automated approval to drain your funds.',
      'Go to a verified revocation tool like Revoke.cash using a secure browser.',
      'Connect your wallet and carefully review all active token approvals and smart contract allowances.',
      'Revoke permissions for any unknown or suspicious contracts immediately to cut off hacker access.',
    ],
    urgency: 'Immediate',
  },
  {
    id: '4',
    title: 'Upgrade to Authenticator App 2FA',
    actionText: 'Download Google Authenticator or Authy',
    shortDesc: 'Switch from vulnerable SMS text codes to secure time-based 2FA tokens.',
    inDepthDetails: [
      'SMS text messages can be intercepted via SIM-swapping attacks. Move your accounts to an authenticator app.',
      'Log into your major accounts (Email, Social Media, School Portal) and go to security settings.',
      'Scan the QR code using Google Authenticator, Microsoft Authenticator, or a hardware security key.',
      'Store your emergency backup recovery codes in a secure, offline physical notebook.',
    ],
    urgency: 'Within 1 Hour',
  },
  {
    id: '5',
    title: 'Report Cybercrime to Federal Authorities',
    actionText: 'File an official report at ic3.gov',
    shortDesc: 'Submit a formal complaint to the FBI Internet Crime Complaint Center.',
    inDepthDetails: [
      'If you lost money, had your identity stolen, or faced severe extortion, documentation is crucial.',
      'Go to the official FBI Internet Crime Complaint Center website (ic3.gov).',
      'Provide exact transaction logs, phone numbers, screenshots of messages, and website URLs associated with the scam.',
      'Contact your local police department to file an identity theft police report if your Social Security number was compromised.',
    ],
    urgency: 'Within 24 Hours',
  },
];

export default function KitScreen() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((item) => item !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>Emergency Defense Kit</Text>
          <Text style={styles.subHeader}>
            In-depth incident response guides if you or a family member gets hacked.
          </Text>
        </View>
      </View>

      <View style={styles.warningBanner}>
        <Ionicons name="alert-circle" size={24} color="#991b1b" />
        <Text style={styles.warningText}>
          React quickly! Every minute counts when securing compromised accounts or frozen bank cards.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Tap any card to view detailed recovery steps:</Text>

      {EMERGENCY_STEPS.map((step) => {
        const isDone = completedSteps.includes(step.id);
        const isExpanded = expandedId === step.id;

        return (
          <View
            key={step.id}
            style={[styles.stepCard, isDone && styles.stepCardDone]}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(step.id)}
              activeOpacity={0.8}
            >
              <View style={styles.stepHeaderRow}>
                <View
                  style={[
                    styles.urgencyBadge,
                    step.urgency === 'Immediate'
                      ? styles.badgeRed
                      : styles.badgeOrange,
                  ]}
                >
                  <Text style={styles.urgencyBadgeText}>{step.urgency}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleStep(step.id)}
                  style={styles.checkboxTouch}
                >
                  <Ionicons
                    name={isDone ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={isDone ? '#16a34a' : '#64748b'}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.stepTitle, isDone && styles.textDone]}>
                {step.title}
              </Text>
              <Text style={styles.stepAction}>{step.actionText}</Text>
              <Text style={styles.stepDesc}>{step.shortDesc}</Text>

              <View style={styles.expandPromptRow}>
                <Text style={styles.expandPromptText}>
                  {isExpanded ? 'Hide In-Depth Guide ▲' : 'View Full Step-by-Step Guide ▼'}
                </Text>
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.detailsContainer}>
                <View style={styles.divider} />
                <Text style={styles.detailsHeader}>Recovery Action Plan:</Text>
                {step.inDepthDetails.map((detail, idx) => (
                  <View key={idx} style={styles.detailRow}>
                    <Text style={styles.detailBullet}>{idx + 1}.</Text>
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 14 },
  header: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  subHeader: { fontSize: 14, color: '#475569', marginTop: 2 },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  warningText: { fontSize: 13, fontWeight: '600', color: '#991b1b', flex: 1, lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  stepCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepCardDone: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRed: { backgroundColor: '#fee2e2' },
  badgeOrange: { backgroundColor: '#fffbeb' },
  urgencyBadgeText: { fontSize: 11, fontWeight: '700', color: '#991b1b' },
  checkboxTouch: { padding: 2 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  textDone: { textDecorationLine: 'line-through', color: '#166534' },
  stepAction: { fontSize: 13, fontWeight: '700', color: '#2563eb', marginBottom: 6 },
  stepDesc: { fontSize: 13, color: '#334155', lineHeight: 18 },
  expandPromptRow: { marginTop: 10, alignItems: 'flex-start' },
  expandPromptText: { fontSize: 12, fontWeight: '700', color: '#4338ca' },
  detailsContainer: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 12 },
  detailsHeader: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  detailRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  detailBullet: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  detailText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
});