import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, TouchableOpacity, Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import CalenderIcon from "../assets/svg/calender.svg"

const EventListScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('single');
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [eventNameError, setEventNameError] = useState('');
  const [emailNameError, setEmailNameError] = useState('');
  const [occupancError, setOccupanceError] = useState('');
  const [dayOffWeekError, setDayOffWeekError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
 
  const [endDate, setEndDate] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(false);
 
  const [events, setEvents] = useState([]);
  const [occurrences, setOccurrences] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('');
  
  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      setEventNameError('Please enter event name');
      return;
    } else {
      setEventNameError('');
    }
  
    if (!email.trim()) {
      setEmailNameError('Please enter notification email');
      return;
    } else {
      setEmailNameError('');
    }
  
    if (!eventType) {
      alert('Please select an event type');
      return;
    }
  
    if (!startDate) {
      alert('Please select a start date');
      return;
    }
    if (!endDate) {
      alert('Please select a end date');
      return;
    }
  
    if (eventType === 'recurring') {
      if (!occurrences.trim()) {
        setOccupanceError('Please enter number of occurrences');
        return;
      } else {
        setOccupanceError('')
      }
  
      if (!daysOfWeek.trim()) {
        setDayOffWeekError('Please enter days of the week');
        return;
      } else {
        setDayOffWeekError('')
      }
  
      if (!endDate) {
        alert('Please select an end date');
        return;
      }
  
      if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date');
        return;
      }
    }
  
    const newEvent = {
      id: events.length + 1,
      name: eventName,
      type: eventType,
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: eventType === 'recurring' ? endDate.toLocaleDateString('en-GB') : '',
      recurrence: eventType === 'recurring' ? recurrenceType : '-',
      occurrences: eventType === 'recurring' ? occurrences : 1,
    };
  
    setEvents([...events, newEvent]);
  
    setEventName('');
    setEmail('');
    setOccurrences('');
    setDaysOfWeek('');
    setStartDate(null);
    setEndDate(null);
  };
  
  
 
  return (
<SafeAreaView style={{ backgroundColor:'#f3f3f3', flex:1}}>
<ScrollView>
  <View style={{ margin:10, backgroundColor:'#FFF', borderRadius:15, }}>


 
<Text style={{textAlign:'center', marginTop:20, color:'#000', fontSize:24, fontWeight:'800'}}>Create Recurring Event</Text>
<Text style={{textAlign:'center', marginTop:13, color:'#000', fontSize:14, fontWeight:'200'}}>
Configure your event details and receive notifications for each scheduled time.</Text>



<View style={{ marginStart:15, marginEnd:15, marginTop:10}}>
  <Text style={{marginStart:5, color:'black', fontSize:14}}>Event name</Text>
  <TextInput
    placeholder="Enter event Name"
    placeholderTextColor='gray'
    value={eventName}
    onChangeText={setEventName}
    style={{
      marginTop:10,
      borderWidth: 1, 
      borderRadius: 10, 
      borderColor: 'gray',
      marginBottom: 8,
      paddingHorizontal: 10, 
    }}
  />
   {eventNameError ? (
    <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
      {eventNameError}
    </Text>
  ) : null}
</View>


   
<View style={{ marginStart:15, marginEnd:15, marginTop:10}}>
<Text style={{marginStart:5, color:'black', fontSize:14}}>Notification Email</Text>
      <TextInput
        placeholder="Enter Email"
         placeholderTextColor='gray'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          marginTop:10,
          borderWidth: 1,
          borderRadius: 10, 
          borderColor: 'gray', 
          marginBottom: 8,
          paddingHorizontal: 10, 
        }}
      />
        {emailNameError ? (
    <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
      {emailNameError}
    </Text>
  ) : null}
      </View>

      <View style={{ marginStart: 15, marginEnd: 15, marginTop: 10 }}>
  <Text style={{ fontSize: 14, color: '#000' }}>Event Type:</Text>
  <View
    style={{
      marginTop: 10,
      height: 50,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      justifyContent: 'center',
    }}
  >
    <Picker
      selectedValue={eventType}
      onValueChange={(itemValue) => setEventType(itemValue)}
      style={{
        height: 60,
        width: '100%',
        color: eventType === "" ? '#999' : '#000',
        fontSize: 11,
        margin:5,
      }}
      itemStyle={{
        fontSize: 11,
        textAlign: 'center',
      }}
    >
      <Picker.Item label="Select Event Type" value="" enabled={false} />
      <Picker.Item label="Single" value="single" />
      <Picker.Item label="Recurring" value="recurring" />

      {/* <CalenderIcon/> */}
    </Picker>

  </View>
</View>

<View style={{ marginTop: 20, marginStart: 15, marginEnd: 15 }}>
  <Text>Select Start Date</Text>
  <TouchableOpacity onPress={() => setShowStartPicker(true)}>
  <View
    style={{
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#000' }}>
      {startDate ? startDate.toLocaleDateString('en-GB') : 'dd-mm-yyyy'}
    </Text>
    <CalenderIcon width={20} height={20} />
  </View>
</TouchableOpacity>


  {showStartPicker && (
    Platform.OS === 'ios' ? (
      <DateTimePicker
        value={startDate || new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          if (selectedDate) setStartDate(selectedDate);
        }}
      />
    ) : (
      <DateTimePicker
        value={startDate || new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowStartPicker(false);
          if (selectedDate) setStartDate(selectedDate);
        }}
      />
    )
  )}
</View>


<View style={{ marginTop: 20, marginStart: 15, marginEnd: 15 }}>
  <Text>Select End Date</Text>
  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
    <View
      style={{
        borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      }}
    >
      <Text style={{ color: '#000' }}>
        {endDate ? endDate.toLocaleDateString('en-GB') : 'dd-mm-yyyy'}
      </Text>
      <CalenderIcon width={20} height={20} />

    </View>
  </TouchableOpacity>

  {showEndPicker && (
    <DateTimePicker
      value={endDate || new Date()}
      mode="date"
      display="default"
      onChange={(event, selectedDate) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
      }}
    />
  )}
</View>



    {eventType === 'recurring' && (
  <>
    <View style={{ marginStart: 15, marginEnd: 15, marginTop: 10 }}>
      <Text style={{ marginStart: 5, color: 'black', fontSize: 14 }}>No of occurrences</Text>
      <TextInput
        placeholder="Enter number of occurrences"
         placeholderTextColor='gray'
        value={occurrences}
        onChangeText={setOccurrences}
        style={{
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'gray',
          marginBottom: 8,
          paddingHorizontal: 10,
        }}
      />
         {occupancError ? (
    <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
      {occupancError}
    </Text>
  ) : null}
    </View>

    <View style={{ marginStart: 15, marginEnd: 15, marginTop: 10 }}>
      <Text style={{ marginStart: 5, color: 'black', fontSize: 14 }}>Day of Week (comma-separated)</Text>
      <TextInput
        placeholder="e.g., Monday,Wednesday"
         placeholderTextColor='gray'
        value={daysOfWeek}
        onChangeText={setDaysOfWeek}
        style={{
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'gray',
          marginBottom: 8,
          paddingHorizontal: 10,
        }}
      />
               {dayOffWeekError ? (
    <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
      {dayOffWeekError}
    </Text>
  ) : null}
    </View>
  </>
)}

 
<View style={{ margin:15 ,}}>
<TouchableOpacity
  onPress={handleCreateEvent}
  style={{
    backgroundColor: '#0564B1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  }}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
    Create Event
  </Text>
</TouchableOpacity>

</View>
 
</View>


<Text style={{ marginTop: 5,marginBottom:5, marginStart:15,fontWeight: 'bold' , textAlign:'center'}}>All Events</Text>




<View
  style={{
    marginStart: 15,
    marginEnd: 15,
    marginBottom: 10,
  }}
>
  <ScrollView horizontal>
    <View  style={{
   
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
  }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          padding: 10,
          borderBottomWidth: 1,
          borderColor: '#ccc',
          borderRadius: 15,
        }}
      >
        <Text style={{ width: 60, fontWeight: 'bold' ,textAlign:'center' }}>S.No</Text>
        <Text style={{ width: 120, fontWeight: 'bold',textAlign:'center'  }}>Name</Text>
        <Text style={{ width: 100, fontWeight: 'bold' ,textAlign:'center' }}>Type</Text>
        <Text style={{ width: 100, fontWeight: 'bold' ,textAlign:'center' }}>Start Date</Text>
        <Text style={{ width: 100, fontWeight: 'bold',textAlign:'center'  }}>End Date</Text>
        <Text style={{ width: 120, fontWeight: 'bold',textAlign:'center' }}>Rec Type</Text>
        <Text style={{ width: 130, fontWeight: 'bold',textAlign:'center'  }}>No. of Occurrences</Text>
      </View>

      {events.map((item, index) => (
  <TouchableOpacity
    key={item.id}
    onPress={() => navigation.navigate('EventFormScreen', { eventData: item })}
  >
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}
    >
      <Text style={{ width: 60 ,textAlign:'center' }}>{index + 1}</Text>
      <Text style={{ width: 120 ,textAlign:'center' }}>{item.name}</Text>
      <Text style={{ width: 100 ,textAlign:'center' }}>{item.type}</Text>
      <Text style={{ width: 100 ,textAlign:'center' }}>{item.startDate}</Text>
      <Text style={{ width: 100 ,textAlign:'center' }}>{item.endDate}</Text>
      <Text style={{ width: 120 ,textAlign:'center' }}>{item.recurrence}</Text>
      <Text style={{ width: 130, textAlign:'center' }}>{item.occurrences}</Text>
    </View>
  </TouchableOpacity>
))}

    </View>
  </ScrollView>
</View>


</ScrollView>


</SafeAreaView>
  );
};
 
export default EventListScreen;