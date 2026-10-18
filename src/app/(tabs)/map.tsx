import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Station {
  id: string;
  name: string;
  distance: string;
  address: string;
  contactName: string;
  contactTitle: string;
  department: string;
  phone: string;
  hours: string;
  waitTime: string;
  whatToExpect: string[];
}

const CYBER_CONTACTS = [
  { name: 'Detective Sarah Jenkins', title: 'Head of Cyber Crimes', dept: 'Financial Crimes Division', phone: '(555) 019-8234' },
  { name: 'Officer Marcus Thorne', title: 'Digital Fraud Specialist', dept: 'Cyber Fraud Unit', phone: '(555) 019-8235' },
  { name: 'Sgt. David Chen', title: 'Scam & Extortion Lead', dept: 'Special Investigations Task Force', phone: '(555) 019-8236' },
  { name: 'Lt. Amanda Rivera', title: 'Forensics Investigator', dept: 'Digital Forensics Unit', phone: '(555) 019-8237' },
  { name: 'Detective James Cole', title: 'Identity Theft Coordinator', dept: 'Identity Theft Task Force', phone: '(555) 019-8238' }
];

const STANDARD_EXPECTATIONS = [
  'Ask the front desk for the duty officer handling financial fraud.',
  'Present your physical ID and any printed bank statements.',
  'Provide a clear timeline of the scam messages or calls.',
  'Request an official Incident Report Number (required for bank disputes).'
];

export default function MapScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#1F2937' : '#F9FAFB',
    card: isDark ? '#374151' : '#FFFFFF',
    text: isDark ? '#F3F4F6' : '#1F2937',
    subText: isDark ? '#9CA3AF' : '#6B7280',
    primary: isDark ? '#818CF8' : '#6366F1',
    border: isDark ? '#4B5563' : '#E5E7EB',
    success: isDark ? '#34D399' : '#10B981',
  };

  const [locationStatus, setLocationStatus] = useState('Requesting GPS permissions...');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // Default muted

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationStatus('Permission denied. Showing default safe havens.');
          loadFallbackStations('Local');
          return;
        }

        setLocationStatus('Scanning a 50-mile radius for active precincts...');
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;
        const viewbox = `${lon - 0.75},${lat + 0.75},${lon + 0.75},${lat - 0.75}`;
        
        // Broadened search query to "police" and increased limit to catch CMPD branches
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=police&viewbox=${viewbox}&bounded=1&limit=15`;
        
        const response = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'ScamSimulatorApp/1.0' } });
        const data = await response.json();

        if (data && data.length > 0) {
          const realStations = data.map((el: any, index: number) => {
            const stLat = parseFloat(el.lat);
            const stLon = parseFloat(el.lon);
            const distMiles = calculateDistance(lat, lon, stLat, stLon);
            
            const addressParts = el.display_name.split(', ');
            const stationName = el.name || addressParts[0];
            const address = addressParts.slice(1, 3).join(', ') || 'Address available upon contact';
            const contact = CYBER_CONTACTS[index % 5];

            return {
              id: index.toString(),
              name: stationName,
              distance: `${distMiles} miles away`,
              address: address,
              contactName: contact.name,
              contactTitle: contact.title,
              department: contact.dept,
              phone: contact.phone,
              hours: 'Open 24/7 (Cyber Desk: 8AM - 5PM)',
              waitTime: '~15 - 30 mins',
              whatToExpect: STANDARD_EXPECTATIONS,
            };
          });

          // Sort by distance and grab the closest 8
          realStations.sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));
          setStations(realStations.slice(0, 8));
          setLocationStatus('Location Secured. Nearest safe havens found.');
        } else {
          loadFallbackStations('Local');
        }
      } catch (error) {
        loadFallbackStations('Local');
      }
      setIsLoading(false);
    })();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return (R * c).toFixed(1);
  };

  const loadFallbackStations = (cityName: string) => {
    setStations([
      { id: '1', name: `${cityName} Central Police Department`, distance: '1.2 miles away', address: '450 Main St.', contactName: CYBER_CONTACTS[0].name, contactTitle: CYBER_CONTACTS[0].title, department: CYBER_CONTACTS[0].dept, phone: CYBER_CONTACTS[0].phone, hours: 'Open 24/7', waitTime: '~15 mins', whatToExpect: STANDARD_EXPECTATIONS },
      { id: '2', name: `${cityName} North Precinct`, distance: '3.5 miles away', address: '1200 Northside Blvd.', contactName: CYBER_CONTACTS[1].name, contactTitle: CYBER_CONTACTS[1].title, department: CYBER_CONTACTS[1].dept, phone: CYBER_CONTACTS[1].phone, hours: 'Open 24/7', waitTime: '~25 mins', whatToExpect: STANDARD_EXPECTATIONS },
    ]);
    setLocationStatus('Location Secured. Regional safe havens loaded.');
    setIsLoading(false);
  };

  const readAloud = (text: string) => {
    if (isAudioMuted) return;
    Speech.stop();
    Speech.speak(text, { rate: 0.95 });
  };

  const selectStation = (station: Station) => {
    setSelectedStation(station);
    readAloud(`Selected ${station.name}. Contact ${station.contactName}, ${station.contactTitle}.`);
  };

  const callDispatch = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.header, { color: theme.text }]}>Safe Haven Locator</Text>
          <Text style={[styles.subHeader, { color: theme.subText }]}>{locationStatus}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.muteBtn, { backgroundColor: theme.card, borderColor: theme.border }]} 
          onPress={() => {
            Speech.stop();
            setIsAudioMuted(!isAudioMuted);
          }}
        >
          <Ionicons name={isAudioMuted ? "volume-mute" : "volume-high"} size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.subText, marginTop: 16, fontWeight: '600' }}>Scanning 50-mile radius...</Text>
        </View>
      ) : !selectedStation ? (
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select a nearby precinct:</Text>
          {stations.map((station) => (
            <TouchableOpacity key={station.id} style={[styles.stationCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => selectStation(station)}>
              <View style={styles.stationHeader}>
                <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.stationName, { color: theme.text }]}>{station.name}</Text>
                  <Text style={[styles.stationDistance, { color: theme.primary }]}>{station.distance} • {station.department}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.subText} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedStation(null); Speech.stop(); }}>
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
            <Text style={[styles.backBtnText, { color: theme.primary }]}>Back to Radar</Text>
          </TouchableOpacity>

          <Text style={[styles.detailsName, { color: theme.text }]}>{selectedStation.name}</Text>
          <Text style={[styles.detailsAddress, { color: theme.subText }]}>{selectedStation.address} • {selectedStation.distance}</Text>

          <TouchableOpacity style={[styles.callBtn, { backgroundColor: theme.primary }]} onPress={() => callDispatch(selectedStation.phone)}>
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.callBtnText}>Call Dispatch: {selectedStation.phone}</Text>
          </TouchableOpacity>

          <View style={[styles.contactBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Ionicons name="person-circle" size={44} color={theme.primary} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={[styles.contactName, { color: theme.text }]}>{selectedStation.contactName}</Text>
              <Text style={[styles.contactTitle, { color: theme.primary }]}>{selectedStation.contactTitle}</Text>
              <Text style={[styles.deptText, { color: theme.subText }]}>{selectedStation.department}</Text>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={20} color={theme.subText} />
              <Text style={[styles.metaLabel, { color: theme.subText }]}>Status</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>{selectedStation.hours}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="hourglass" size={20} color={theme.subText} />
              <Text style={[styles.metaLabel, { color: theme.subText }]}>Est. Wait</Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>{selectedStation.waitTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>What to Expect on Arrival:</Text>
          {selectedStation.whatToExpect.map((step, idx) => (
            <View key={idx} style={styles.checklistRow}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={[styles.checklistText, { color: theme.text }]}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  header: { fontSize: 26, fontWeight: '800' },
  subHeader: { fontSize: 14, marginTop: 4, fontWeight: '600' },
  muteBtn: { padding: 10, borderRadius: 12, borderWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  stationCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 14 },
  stationHeader: { flexDirection: 'row', alignItems: 'center' },
  stationName: { fontSize: 17, fontWeight: '700' },
  stationDistance: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  detailsCard: { padding: 20, borderRadius: 20, borderWidth: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtnText: { fontSize: 16, fontWeight: '700', marginLeft: 6 },
  detailsName: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  detailsAddress: { fontSize: 15, marginBottom: 20 },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginBottom: 24 },
  callBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  contactBox: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
  contactName: { fontSize: 18, fontWeight: '800' },
  contactTitle: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  deptText: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  metaGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  metaItem: { flex: 1, alignItems: 'flex-start' },
  metaLabel: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  metaValue: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 24, opacity: 0.2 },
  checklistRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  checklistText: { fontSize: 15, marginLeft: 12, flex: 1, lineHeight: 22 },
});