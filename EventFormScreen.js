import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BackArrow from '../assets/svg/backArrow.svg';
import { useNavigation, useRoute } from '@react-navigation/native';

const EventFormScreen = () => {
  const { eventData, occurrences } = useRoute().params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    occurrences: '',
    recType: '',
    weekdays: '',
    eventDates: '',
    occurencyDays: '',
    occurencyWeek:'' ,
    specificDates:'',
    specificDate:''
  });

  const occurrenceText = occurrences
    ? Object.entries(occurrences)
        .map(([day, dates]) => `${day}: ${dates.join(', ')}`)
        .join('\n')
    : '';

  useEffect(() => {
    if (eventData) {
      let occurencyDaysStr = '';
      let occurencyDaysWeek = '';
      if (Array.isArray(eventData.ocuurencyDates)) {
        occurencyDaysStr = eventData.ocuurencyDates
          .map(item => `${item.month}: ${item.dates.join(', ')}`)
          .join(' | ');
      }
      if (eventData.occurencyWeek && typeof eventData.occurencyWeek === 'object') {
        occurencyDaysWeek = Object.entries(eventData.occurencyWeek)
          .map(([day, dates]) => `${day}: ${dates.join(', ')}`)
          .join('\n'); 
      }

      setFormData({
        name: eventData.name || '',
        type: eventData.type || '',
        startDate: eventData.startDate || '',
        endDate: eventData.endDate || '',
        occurrences: eventData.occurrences?.toString() || '',
        recType: eventData.recType || '',
        weekdays: eventData.weekdays?.join(', ') || '',
        eventDates: eventData.eventDates?.join(', ') || '',
        occurencyDays: occurencyDaysStr,
        occurencyWeek:occurencyDaysWeek,
        specificDates: eventData.specificDates?.join(', ') || ''
      });
    }
  }, [eventData]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <BackArrow width={24} height={24} />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 18, fontWeight: 'bold' }}>
            Event Form
          </Text>
        </View>

        <View style={{ padding: 20 }}>
          <Text>Name</Text>
          <TextInput value={formData.name} editable={false} style={styles.input} />

          <Text>Type</Text>
          <TextInput value={formData.type} editable={false} style={styles.input} />

          <Text>Start Date</Text>
          <TextInput value={formData.startDate} editable={false} style={styles.input} />

          <Text>End Date</Text>
          <TextInput value={formData.endDate} editable={false} style={styles.input} />

          <Text>Occurrences</Text>
          <TextInput value={formData.occurrences} editable={false} style={styles.input} />

          <Text>Recurring Type</Text>
          <TextInput value={formData.recType} editable={false} style={styles.input} />

          <Text>Selected Weekdays</Text>
          <TextInput
            value={formData.weekdays}
            editable={false}
            multiline
            style={[styles.input, { minHeight: 50 }]}
          />

          <Text>Selected Event Dates</Text>
          <TextInput
            value={formData.eventDates}
            editable={false}
            multiline
            style={[styles.input, { minHeight: 50 }]}
          />

          <Text> Occurrence Weeks</Text>
          <TextInput
  value={formData.occurencyWeek}
  editable={false}
  multiline
  style={[styles.input, { minHeight: 80 }]} 
/>
<Text> Occurrence Days</Text>
 <TextInput
  value={formData.occurencyDays}
  editable={false}
  multiline
  style={[styles.input, { minHeight: 80 }]}
/>
<Text> Specific Dates</Text>
 <TextInput
  value={formData.specificDates}
  editable={false}
  multiline
  style={[styles.input, { minHeight: 80 }]} 
/>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    color: 'black',
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    left: 10,
    top: 10,
  },
};

export default EventFormScreen;
