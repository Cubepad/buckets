import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  useFonts,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { useColorScheme } from '@/hooks/useColorScheme';

// Keep the splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load all the Manrope font variants
  const [fontsLoaded] = useFonts({

    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Define typography styles using the loaded Manrope fonts.
  // Here variants with weight "400" use Manrope_400Regular and weight "500" uses Manrope_500Medium.
  const typography = {
    displaySmall: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 36,
      letterSpacing: 0,
      lineHeight: 44,
    },
    displayMedium: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 45,
      letterSpacing: 0,
      lineHeight: 52,
    },
    displayLarge: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 57,
      letterSpacing: 0,
      lineHeight: 64,
    },
    headlineSmall: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 24,
      letterSpacing: 0,
      lineHeight: 32,
    },
    headlineMedium: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 28,
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineLarge: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 32,
      letterSpacing: 0,
      lineHeight: 40,
    },
    titleSmall: {
      fontFamily: "Manrope_500Medium",
      fontWeight: "500" as const,
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    titleMedium: {
      fontFamily: "Manrope_500Medium",
      fontWeight: "500" as const,
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleLarge: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 22,
      letterSpacing: 0,
      lineHeight: 28,
    },
    labelSmall: {
      fontFamily: "Manrope_500Medium",
      fontWeight: "500" as const,
      fontSize: 11,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelMedium: {
      fontFamily: "Manrope_500Medium",
      fontWeight: "500" as const,
      fontSize: 12,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: "Manrope_500Medium",
      fontWeight: "500" as const,
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 12,
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    bodyMedium: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 14,
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: "Manrope_400Regular",
      fontWeight: "400" as const,
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: 24,
    },
  };

  // Select the appropriate Paper theme based on the color scheme
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  // Merge our typography with the default theme's fonts
  paperTheme.fonts = { ...paperTheme.fonts, ...typography };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
