import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from '@/components/SplashScreen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { DoorsProvider } from '@/contexts/DoorsContext';

// Conditionally import expo-screen-capture
let ScreenCapture: typeof import('expo-screen-capture') | null = null;
try {
  ScreenCapture = require('expo-screen-capture');
} catch (error) {
  console.warn('expo-screen-capture not available, using native Android implementation only');
}

function AppContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, loading, router]);

  // Show loading indicator while checking auth
  if (loading) {
    return null; // Just show nothing while loading
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Prevent screenshots and screen recording throughout the app
  useEffect(() => {
    const preventScreenshot = async () => {
      if (ScreenCapture) {
        try {
          await ScreenCapture.preventScreenCaptureAsync();
        } catch (error) {
          console.warn('Failed to prevent screen capture:', error);
        }
      }
      // Note: Android native implementation in MainActivity.kt already prevents screenshots
    };

    preventScreenshot();

    // Return a cleanup function that will be called if needed
    return () => {
      // Optionally, you could allow screenshots again when the app is backgrounded
      // if (ScreenCapture) {
      //   ScreenCapture.allowScreenCaptureAsync();
      // }
    };
  }, []);

  if (!loaded) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <DoorsProvider>
              <ThemeProvider value={DefaultTheme}>
                <AppContent />
                <StatusBar style="dark" />
              </ThemeProvider>
            </DoorsProvider>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
