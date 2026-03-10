import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhotoUploadScreen } from './src/screens/PhotoUploadScreen';
import { TryOnResultScreen } from './src/screens/TryOnResultScreen';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0A0A0A' },
            headerTintColor: '#C8A97E',
            headerTitleStyle: {
              color: '#F5F0EB',
              fontWeight: '300',
              fontSize: 14,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="PhotoUpload"
            component={PhotoUploadScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="TryOnResult"
            component={TryOnResultScreen}
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
