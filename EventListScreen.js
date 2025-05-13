import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import CalenderIcon from '../assets/svg/calender.svg';
import { format, addMonths, isValid, lastDayOfMonth,addDays , isBefore, isEqual} from 'date-fns';
import moment from 'moment';

const EventListScreen = ({navigation}) => {
  const [eventName, setEventName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventType1, setEventType1] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('');
  const [eventNameError, setEventNameError] = useState('');
  const [emailNameError, setEmailNameError] = useState('');
  const [occupancError, setOccupanceError] = useState('');
  const [dayOffWeekError, setDayOffWeekError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [endDate, setEndDate] = useState(null);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [specDate, setSpecDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [occurrences, setOccurrences] = useState('');
  const [occurrences2, setOccurrences2] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('');
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      setEventNameError('Please enter event name');
      return;
    }
    setEventNameError('');

    if (!email.trim()) {
      setEmailNameError('Please enter notification email');
      return;
    }
    setEmailNameError('');

    if (!eventType) {
      alert('Please select an event type');
      return;
    }

    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    if (!endDate) {
      alert('Please select an end date');
      return;
    }

    if (eventType === 'recurring') {
      // if (!occurrences.trim()) {
      //   setOccupanceError('Please enter number of occurrences');
      //   return;
      // }
      // setOccupanceError('');

      if (eventType1 === 'weekly' && selectedDays.length === 0) {
        setDayOffWeekError('Please select at least one day of the week');
        return;
      }
      setDayOffWeekError('');

      if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be before start date');
        return;
      }
    }
    const finalSelectedOccuranceDates = generateMonthlyOccurrences(
      startDate,
      selectedDates,
      occurrences
    );
    const finalSelectedDates =
      eventType === 'recurring' &&
      eventType1 === 'monthly' &&
      selectedDates.length === 0
        ? Array.from({length: 31}, (_, i) => i + 1)
        : selectedDates;
    const nextOccurrences = getNextWeekdayOccurrences(startDate,selectedDays, occurrences);
    const datesList = getMatchingDates(
    startDate,
    specDate,
    selectedDays,     
    selectedDates    
    );
    console.log("weeks",nextOccurrences)
    setOccurrences2(getNextWeekdayOccurrences(startDate,selectedDays, occurrences))
    const newEvent = {
      id: events.length + 1,
      name: eventName,
      type: eventType,
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: eventType === 'recurring' ? endDate.toLocaleDateString('en-GB') : '',
      occurrences: eventType === 'recurring' ? occurrences : 1,
      weekdays: selectedDays,
      eventDates: finalSelectedDates,
      recType: eventType1,
      ocuurencyDates: finalSelectedOccuranceDates?.length
        ? finalSelectedOccuranceDates
        : nextOccurrences,
        occurencyWeek:nextOccurrences,
        specificDates:datesList,
    };
    

    console.log('Created Event:', newEvent);
    setEvents(prev => [...prev, newEvent]);

   
    setEventName('');
    setEmail('');
    setOccurrences('');
    setDaysOfWeek('');
    setStartDate(null);
    setEndDate(null);
    setEventType1('');
    setSelectedDates([]);
    setSelectedDays([]);
    setSpecDate(null)
  };

  const toggleDay = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  const toggleDateSelection = date => {
    setSelectedDates(prevDates =>
      prevDates.includes(date)
        ? prevDates.filter(d => d !== date)
        : [...prevDates, date],
    );
  };
  const generateMonthlyOccurrences = (startDate, selectedDates, occurrences) => {
    const result = [];
  
    for (let i = 0; i < parseInt(occurrences); i++) {
      const monthDate = addMonths(new Date(startDate), i);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth(); // 0-based
  
      const validDates = selectedDates.filter(day => {
        const dateToCheck = new Date(year, month, day);
        const lastDay = lastDayOfMonth(monthDate).getDate();
        return day <= lastDay && isValid(dateToCheck);
      });
  
      result.push({
        month: format(monthDate, 'MMMM yyyy'),
        dates: validDates,
      });
    }
  
    return result;
  };
  const weekdayToNumber = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const getNextWeekdayOccurrences = (startDate, selectedWeekdays, occurrences) => {
    const weekdayToNumber = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    const selectedNumbers = selectedWeekdays.map(day => weekdayToNumber[day]);
    const result = {};
  
    selectedWeekdays.forEach(weekday => {
      const weekdayNum = weekdayToNumber[weekday];
      const dates = [];
      let current = new Date(startDate);
  
      while (current.getDay() !== weekdayNum) {
        current = addDays(current, 1);
      }
  
      while (dates.length < occurrences) {
        if (current.getDay() === weekdayNum) {
          dates.push(format(current, 'dd/MM/yyyy')); // Formatting date
          current = addDays(current, 7); // Jump to next week
        }
      }
  
      result[weekday] = dates;
      console.log("days",result)
    });
  
    return result;
  };
  const getMatchingDates = (startDate, endDate, selectedWeekdays = [], selectedMonthDates = []) => {
    const weekdayToNumber = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
  
    const selectedWeekdayNumbers = selectedWeekdays.map(day => weekdayToNumber[day]);
    const result = [];
  
    let current = new Date(startDate);
    const end = new Date(endDate);
  
    while (isBefore(current, end) || isEqual(current, end)) {
      const day = current.getDay();         // 0 to 6
      const date = current.getDate();       // 1 to 31
  
      const matchWeekday = selectedWeekdayNumbers.includes(day);
      const matchMonthDate = selectedMonthDates.includes(date);
  
      if ((selectedWeekdays.length > 0 && matchWeekday) ||
          (selectedMonthDates.length > 0 && matchMonthDate)) {
        result.push(format(current, 'dd/MM/yyyy'));
      }
  
      current = addDays(current, 1);
    }
  
    return result;
  };
  
  
  return (
    <SafeAreaView style={{backgroundColor: '#f3f3f3', flex: 1}}>
      <ScrollView>
        <View style={{margin: 10, backgroundColor: '#FFF', borderRadius: 15}}>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: '#000',
              fontSize: 24,
              fontWeight: '800',
            }}>
            Create Recurring Event
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 13,
              color: '#000',
              fontSize: 14,
              fontWeight: '200',
            }}>
            Configure your event details and receive notifications for each
            scheduled time.
          </Text>

          <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
            <Text style={{marginStart: 5, color: 'black', fontSize: 14}}>
              Event name
            </Text>
            <TextInput
              placeholder="Enter event Name"
              placeholderTextColor="gray"
              value={eventName}
              onChangeText={setEventName}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                marginBottom: 8,
                paddingHorizontal: 10,
              }}
            />
            {eventNameError ? (
              <Text style={{color: 'red', fontSize: 12, marginTop: 2}}>
                {eventNameError}
              </Text>
            ) : null}
          </View>

          <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
            <Text style={{marginStart: 5, color: 'black', fontSize: 14}}>
              Notification Email
            </Text>
            <TextInput
              placeholder="Enter Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                marginBottom: 8,
                paddingHorizontal: 10,
              }}
            />
            {emailNameError ? (
              <Text style={{color: 'red', fontSize: 12, marginTop: 2}}>
                {emailNameError}
              </Text>
            ) : null}
          </View>

          <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
            <Text style={{fontSize: 14, color: '#000'}}>Event Type:</Text>
            <View
              style={{
                marginTop: 10,
                height: 50,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                justifyContent: 'center',
              }}>
              <Picker
                selectedValue={eventType}
                onValueChange={itemValue => setEventType(itemValue)}
                style={{
                  height: 60,
                  width: '100%',
                  color: eventType === '' ? '#999' : '#000',
                  fontSize: 11,
                  margin: 5,
                }}
                itemStyle={{
                  fontSize: 11,
                  textAlign: 'center',
                }}>
                <Picker.Item
                  label="Select Event Type"
                  value=""
                  enabled={false}
                />
                <Picker.Item label="Single" value="single" />
                <Picker.Item label="Recurring" value="recurring" />

                {/* <CalenderIcon/> */}
              </Picker>
            </View>
          </View>

          <View style={{marginTop: 20, marginStart: 15, marginEnd: 15}}>
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
                }}>
                <Text style={{color: '#000'}}>
                  {startDate
                    ? startDate.toLocaleDateString('en-GB')
                    : 'dd-mm-yyyy'}
                </Text>
                <CalenderIcon width={20} height={20} />
              </View>
            </TouchableOpacity>

            {showStartPicker &&
              (Platform.OS === 'ios' ? (
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
              ))}
          </View>

          <View style={{marginTop: 20, marginStart: 15, marginEnd: 15}}>
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
                }}>
                <Text style={{color: '#000'}}>
                  {endDate
                    ? endDate.toLocaleDateString('en-GB')
                    : 'dd-mm-yyyy'}
                </Text>
                <CalenderIcon width={20} height={20} />
              </View>
            </TouchableOpacity>

            {showEndPicker &&
              (Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              ) : (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              ))}
          </View>

          {eventType === 'recurring' && (
            <>
              <View style={{marginHorizontal: 15, marginTop: 10}}>
                <Text style={{marginStart: 5, color: 'black', fontSize: 14}}>
                  No of occurrences
                </Text>
                <TextInput
                  placeholder="Enter number of occurrences"
                  placeholderTextColor="gray"
                  value={occurrences}
                  onChangeText={setOccurrences}
                  keyboardType="numeric"
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
                  <Text style={{color: 'red', fontSize: 12, marginTop: 2}}>
                    {occupancError}
                  </Text>
                ) : null}
              </View>


              <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
                <Text style={{fontSize: 14, color: '#000'}}>
                  Recurrence Type
                </Text>
                <View
                  style={{
                    marginTop: 10,
                    height: 50,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: 'gray',
                    justifyContent: 'center',
                  }}>
                  <Picker
                    selectedValue={eventType1}
                    onValueChange={itemValue => setEventType1(itemValue)}
                    style={{
                      height: 60,
                      width: '100%',
                      color: eventType1 === '' ? '#999' : '#000',
                      fontSize: 11,
                      margin: 5,
                    }}
                    itemStyle={{
                      fontSize: 11,
                      textAlign: 'center',
                    }}>
                    <Picker.Item label="Select type" value="" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />

                    {/* <CalenderIcon/> */}
                  </Picker>
                </View>
              </View>

              {eventType1 === 'weekly' && (
                <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
                  <Text style={{marginStart: 5, color: 'black', fontSize: 14}}>
                    Select Days in Week
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 10,
                      marginTop: 10,
                      padding: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {days.map(day => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={{
                          backgroundColor: selectedDays.includes(day)
                            ? '#4caf50'
                            : '#e0e0e0',
                          borderRadius: 20,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          margin: 4,
                        }}>
                        <Text
                          style={{
                            color: selectedDays.includes(day)
                              ? 'white'
                              : 'black',
                          }}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Conditional Monthly UI */}
              {eventType1 === 'monthly' && (
                <View style={{marginStart: 15, marginEnd: 15, marginTop: 10}}>
                  <Text style={{color: 'black', fontSize: 14}}>
                    Select Specific Dates in Month
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 10,
                      marginTop: 10,
                      padding: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {Array.from({length: 31}, (_, i) => i + 1).map(date => (
                      <TouchableOpacity
                        key={date}
                        onPress={() => toggleDateSelection(date)}
                        style={{
                          backgroundColor: selectedDates.includes(date)
                            ? '#4caf50'
                            : '#e0e0e0',
                          borderRadius: 20,
                          paddingVertical: 6,
                          paddingHorizontal: 12,
                          margin: 4,
                        }}>
                        <Text
                          style={{
                            color: selectedDates.includes(date)
                              ? 'white'
                              : 'black',
                            fontSize: 13,
                          }}>
                          {date}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/*Specific End Date */}

              <View style={{marginTop: 20, marginStart: 15, marginEnd: 15}}>
                <Text>Select Specific End Date</Text>
                <TouchableOpacity onPress={() => setShowSpecPicker(true)}>
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
                    }}>
                    <Text style={{color: '#000'}}>
                      {specDate
                        ? specDate.toLocaleDateString('en-GB')
                        : 'dd-mm-yyyy'}
                    </Text>
                    <CalenderIcon width={20} height={20} />
                  </View>
                </TouchableOpacity>

                {showSpecPicker &&
              (Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={specDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setSpecDate(selectedDate);
                  }}
                />
              ) : (
                <DateTimePicker
                  value={specDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowSpecPicker(false);
                    if (selectedDate) setSpecDate(selectedDate);
                  }}
                />
              ))}
              </View>
            </>
          )}

          <View style={{margin: 15}}>
            <TouchableOpacity
              onPress={handleCreateEvent}
              style={{
                backgroundColor: '#0564B1',
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                Create Event
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginStart: 15,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          All Events
        </Text>

        <View
          style={{
            marginStart: 15,
            marginEnd: 15,
            marginBottom: 10,
          }}>
          <ScrollView horizontal>
            <View
              style={{
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
                }}>
                <Text
                  style={{width: 60, fontWeight: 'bold', textAlign: 'center'}}>
                  S.No
                </Text>
                <Text
                  style={{width: 120, fontWeight: 'bold', textAlign: 'center'}}>
                  Name
                </Text>
                <Text
                  style={{width: 100, fontWeight: 'bold', textAlign: 'center'}}>
                  Type
                </Text>
                <Text
                  style={{width: 100, fontWeight: 'bold', textAlign: 'center'}}>
                  Start Date
                </Text>
                <Text
                  style={{width: 100, fontWeight: 'bold', textAlign: 'center'}}>
                  End Date
                </Text>
                <Text
                  style={{width: 120, fontWeight: 'bold', textAlign: 'center'}}>
                  Rec Type
                </Text>
                <Text
                  style={{width: 130, fontWeight: 'bold', textAlign: 'center'}}>
                  Days
                </Text>
                <Text
                  style={{width: 130, fontWeight: 'bold', textAlign: 'center'}}>
                  No. of Occurrences
                </Text>
              
              </View>

              {events.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate('EventFormScreen', {eventData: item,occurrences: occurrences2})
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderColor: '#eee',
                    }}>
                    <Text style={{width: 60, textAlign: 'center'}}>
                      {index + 1}
                    </Text>
                    <Text style={{width: 120, textAlign: 'center'}}>
                      {item.name}
                    </Text>
                    <Text style={{width: 100, textAlign: 'center'}}>
                      {item.type}
                    </Text>
                    <Text style={{width: 100, textAlign: 'center'}}>
                      {item.startDate}
                    </Text>
                    <Text style={{width: 100, textAlign: 'center'}}>
                      {item.endDate}
                    </Text>
                    <Text style={{width: 120, textAlign: 'center'}}>
                      {item.recType}
                    </Text>
                    <Text style={{width: 130, textAlign: 'center'}}>
                      {item.weekdays && item.weekdays.length > 0
                        ? item.weekdays.join(', ')
                        : item.eventDates && item.eventDates.length > 0
                        ? item.eventDates.join(', ')
                        : 'N/A'}
                    </Text>

                    <Text style={{width: 130, textAlign: 'center'}}>
                      {item.occurrences}
                    </Text>
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
