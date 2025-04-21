import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventListScreen from './src/screens/EventListScreen'; // your screen with the list
import EventFormScreen from './src/screens/EventFormScreen'; // your form screen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EventList">
        <Stack.Screen name="EventList" component={EventListScreen} options={{ headerShown: false ,gestureEnabled: false }}/>
        <Stack.Screen name="EventFormScreen" component={EventFormScreen} options={{ headerShown: false ,gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
