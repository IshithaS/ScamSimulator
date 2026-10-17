import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScamScenario } from '../data/scenarios';

interface Props {
  scenario: ScamScenario;
  onPressLink: () => void;
}

export function ThreatCard({ scenario, onPressLink }: Props) {
  if (scenario.channel === 'SMS Text' || scenario.channel === 'DM / Social') {
    return (
      <View style={styles.imessageWindow}>
        <View style={styles.imessageHeader}>
          <View style={styles.imessageAvatar}>
            <Text style={styles.imessageAvatarText}>
              {scenario.sender.charAt(0)}
            </Text>
          </View>
          <Text style={styles.imessageSenderName}>{scenario.sender}</Text>
          <Text style={styles.imessageHandle}>{scenario.senderHandle}</Text>
        </View>

        <View style={styles.chatBody}>
          <Text style={styles.chatTimestampHeader}>{scenario.timestamp}</Text>
          <View style={styles.incomingBubble}>
            <Text style={styles.incomingBubbleText}>{scenario.message}</Text>
            {scenario.hasLink && (
              <TouchableOpacity style={styles.linkButtonBox} onPress={onPressLink}>
                <Ionicons name="globe-outline" size={16} color="#2563eb" />
                <Text style={styles.linkButtonText}>
                  [ Tap Link: {scenario.linkDestinationUrl} ]
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (scenario.channel === 'Email') {
    return (
      <View style={styles.emailContainer}>
        <View style={styles.emailHeaderRow}>
          <Text style={styles.emailLabel}>From:</Text>
          <Text style={styles.emailValue}>{scenario.senderHandle}</Text>
        </View>
        <View style={styles.emailHeaderRow}>
          <Text style={styles.emailLabel}>Subject:</Text>
          <Text style={[styles.emailValue, { fontWeight: '700' }]}>
            {scenario.subject}
          </Text>
        </View>
        <View style={styles.emailDivider} />
        <Text style={styles.emailBodyText}>{scenario.message}</Text>
        {scenario.hasLink && (
          <TouchableOpacity
            style={[styles.linkButtonBox, { marginTop: 12 }]}
            onPress={onPressLink}
          >
            <Ionicons name="globe-outline" size={16} color="#2563eb" />
            <Text style={styles.linkButtonText}>[ Click Secure Portal Link ]</Text>
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
      <Text style={styles.vmTranscriptText}>{scenario.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});