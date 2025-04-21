import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import BackArrow from '../assets/svg/backArrow.svg';
import {useNavigation} from '@react-navigation/native';

const EventFormScreen = ({route}) => {
  const {eventData} = route.params;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    recurrence: '',
    occurrences: '',
  });

  useEffect(() => {
    if (eventData) {
      setFormData(eventData);
    }
  }, [eventData]);

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}></TouchableOpacity>
        <Text style={{textAlign: 'center', marginTop: 30}}>Event Form </Text>
      </View>

      <View style={{padding: 20}}>
        <Text>Name</Text>
        <TextInput
          value={formData.name}
          editable={false}
          style={styles.input}
        />

        <Text>Type</Text>
        <TextInput
          value={formData.type}
          editable={false}
          style={styles.input}
        />

        <Text>Start Date</Text>
        <TextInput
          value={formData.startDate}
          editable={false}
          style={styles.input}
        />

        <Text>End Date</Text>
        <TextInput
          value={formData.endDate}
          editable={false}
          style={styles.input}
        />

        <Text>Recurrence</Text>
        <TextInput
          value={formData.recurrence}
          editable={false}
          style={styles.input}
        />

        <Text>Occurrences</Text>
        <TextInput
          value={formData.occurrences.toString()}
          editable={false}
          style={styles.input}
        />
      </View>
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
  },
};

export default EventFormScreen;
