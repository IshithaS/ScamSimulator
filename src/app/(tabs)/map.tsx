import { Ionicons } from '@expo/vector-icons';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Precinct {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  distance: string;
}

const LOCAL_PRECINCTS: Precinct[] = [
  {
    id: '1',
    name: 'City Central Police Department (Cyber Crimes Division)',
    address: '450 E Main St, Downtown',
    hours: 'Open 24/7 (Cyber Desk: Mon-Fri 8am - 6pm)',
    phone: '(555) 019-2831',
    distance: '1.4 miles away',
  },
  {
    id: '2',
    name: 'North Precinct Substation',
    address: '1200 Northside Blvd',
    hours: 'Open 24/7',
    phone: '(555) 019-4420',
    distance: '3.8 miles away',
  },
  {
    id: '3',
    name: 'University Campus Safety & Police Hub',
    address: '800 College Way (Student Union Bldg B)',
    hours: 'Open 24/7',
    phone: '(555) 019-9110',
    distance: '0.6 miles away',
  },
];

const REQUIRED_DOCUMENTS = [
  'Printed bank statements or credit card logs highlighting unauthorized fraudulent charges.',
  'Screenshots of phishing text messages, emails, or social media DMs (include sender handles & timestamps).',
  'Your physical government-issued photo ID (Driver’s License, Passport, or Student ID).',
  'Case reference numbers if you already filed an online report with the FBI IC3 (ic3.gov).',
];

export default function MapScreen() {
  const callNumber = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.header}>Safe Haven & Police Locator</Text>
          <Text style={styles.subHeader}>
            Find nearby precincts, operating hours, and in-person filing requirements.
          </Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="shield-checkmark" size={24} color="#1d4ed8" />
        <Text style={styles.infoText}>
          If you were physically threatened or robbed of your device, call 911 immediately. For financial scams, file an in-person report at your local precinct.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Nearby Precincts & Cyber Desks:</Text>

      {LOCAL_PRECINCTS.map((p) => (
        <View key={p.id} style={styles.precinctCard}>
          <View style={styles.precinctHeader}>
            <Ionicons name="business-outline" size={20} color="#2563eb" />
            <Text style={styles.precinctName}>{p.name}</Text>
          </View>
          <Text style={styles.precinctAddress}>{p.address}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color="#64748b" />
            <Text style={styles.metaText}>{p.hours}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="navigate-outline" size={14} color="#64748b" />
            <Text style={styles.metaText}>{p.distance}</Text>
          </View>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => callNumber(p.phone)}
          >
            <Ionicons name="call" size={16} color="#ffffff" />
            <Text style={styles.callBtnText}>Call Precinct: {p.phone}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.checklistCard}>
        <View style={styles.checklistHeader}>
          <Ionicons name="document-text-outline" size={22} color="#0f172a" />
          <Text style={styles.checklistTitle}>What to Bring When Filing a Report:</Text>
        </View>
        {REQUIRED_DOCUMENTS.map((doc, idx) => (
          <View key={idx} style={styles.docRow}>
            <Text style={styles.docBullet}>•</Text>
            <Text style={styles.docText}>{doc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 14 },
  header: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
  subHeader: { fontSize: 14, color: '#475569', marginTop: 2 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  infoText: { fontSize: 13, fontWeight: '600', color: '#1e40af', flex: 1, lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  precinctCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  precinctHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  precinctName: { fontSize: 16, fontWeight: '700', color: '#0f172a', flex: 1 },
  precinctAddress: { fontSize: 14, color: '#475569', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 13, color: '#64748b' },
  callBtn: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  checklistCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  checklistTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  docRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  docBullet: { fontSize: 16, fontWeight: '700', color: '#2563eb' },
  docText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
});