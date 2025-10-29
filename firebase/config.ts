import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration for Web SDK
const firebaseConfig = {
  apiKey: "AIzaSyCiWqLnBq8Z-5-jeOizvyt27LoE7zFdpb8",
  authDomain: "rk-doors.firebaseapp.com",
  projectId: "rk-doors",
  storageBucket: "rk-doors.firebasestorage.app",
  messagingSenderId: "431334746034",
  appId: "1:431334746034:web:7805230932696dc737e6ab",
  databaseURL: "https://rk-doors-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app; 