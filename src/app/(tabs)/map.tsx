import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Station {
  id: string;
  name: string;
  distance: string;
  address: string;
  contactName: string;
  contactTitle: string;
  hours: string;
}

export default function MapScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#1F2937' : '#F9FAFB',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    subText: isDark ? '#9CA3AF' : '#6B7280',
    primary: isDark ? '#818CF8' : '#6366F1',
    success: isDark ? '#34D399' : '#10B981',
    border: isDark ? '#4B5563' : '#E5E7EB',
  };

  const [locationStatus, setLocationStatus] = useState('Locating nearby precincts...');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Location permission denied. Showing defaults.');
      } else {
        await Location.getCurrentPositionAsync({});
        setLocationStatus('Location Secured. Nearest safe havens found.');
      }
      
      // Simulate finding stations near the user
      setStations([
        { id: '1', name: 'Central District Police Department', distance: '1.2 miles away', address: '450 Main St.', contactName: 'Detective Sarah Jenkins', contactTitle: 'Head of Cyber & Financial Crimes', hours: 'Mon-Fri: 8AM - 5PM (24/7 for emergencies)' },
        { id: '2', name: 'Northside Precinct', distance: '3.5 miles away', address: '1200 Northside Blvd.', contactName: 'Officer Marcus Thorne', contactTitle: 'Digital Fraud Specialist', hours: 'Tue-Sat: 9AM - 6PM' },
        { id: '3', name: 'County Sheriff Substation', distance: '5.1 miles away', address: '88 County Line Rd.', contactName: 'Sgt. David Chen', contactTitle: 'Scam & Extortion Task Force', hours: 'Mon-Fri: 7AM - 3PM' },
      ]);
    })();
  }, []);

  const selectStation = (station: Station) => {
    setSelectedStation(station);
    Speech.speak(`Selected ${station.name}. Contact ${station.contactName}, ${station.contactTitle}.`, { rate: 0.9 });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <Text style={[styles.header, { color: theme.text }]}>Safe Haven Locator</Text>
        <Text style={[styles.subHeader, { color: theme.subText }]}>{locationStatus}</Text>
      </View>

      {!selectedStation ? (
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select a nearby precinct:</Text>
          {stations.map((station) => (
            <TouchableOpacity key={station.id} style={[styles.stationCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => selectStation(station)}>
              <View style={styles.stationHeader}>
                <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.stationName, { color: theme.text }]}>{station.name}</Text>
                  <Text style={[styles.stationDistance, { color: theme.primary }]}>{station.distance}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.subText} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedStation(null)}>
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
            <Text style={[styles.backBtnText, { color: theme.primary }]}>Back to List</Text>
          </TouchableOpacity>

          <Text style={[styles.detailsName, { color: theme.text }]}>{selectedStation.name}</Text>
          <Text style={[styles.detailsAddress, { color: theme.subText }]}>{selectedStation.address} • {selectedStation.distance}</Text>

          <View style={[styles.contactBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Ionicons name="person-circle" size={40} color={theme.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.contactName, { color: theme.text }]}>{selectedStation.contactName}</Text>
              <Text style={[styles.contactTitle, { color: theme.primary }]}>{selectedStation.contactTitle}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={theme.subText} />
            <Text style={[styles.infoText, { color: theme.text }]}>Available: {selectedStation.hours}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={20} color={theme.subText} />
            <Text style={[styles.infoText, { color: theme.text }]}>Bring: ID, printed bank statements, and scam screenshots.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { marginBottom: 24 },
  header: { fontSize: 26, fontWeight: '800' },
  subHeader: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  stationCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  stationHeader: { flexDirection: 'row', alignItems: 'center' },
  stationName: { fontSize: 16, fontWeight: '700' },
  stationDistance: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  detailsCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtnText: { fontSize: 16, fontWeight: '700', marginLeft: 6 },
  detailsName: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  detailsAddress: { fontSize: 15, marginBottom: 20 },
  contactBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  contactName: { fontSize: 18, fontWeight: '700' },
  contactTitle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { fontSize: 15, marginLeft: 12, flex: 1, lineHeight: 22 },
});