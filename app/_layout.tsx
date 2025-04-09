import { Stack } from 'expo-router';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold,SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

// Keep the splash screen visible until fonts are loaded.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load the fonts.
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // Define typography styles using the loaded fonts.
  const typography = {
    displaySmall: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 36,
      letterSpacing: 0,
      lineHeight: 44,
    },
    displayMedium: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 45,
      letterSpacing: 0,
      lineHeight: 52,
    },
    displayLarge: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 57,
      letterSpacing: 0,
      lineHeight: 64,
    },
    headlineSmall: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 24,
      letterSpacing: 0,
      lineHeight: 32,
    },
    headlineMedium: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 28,
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineLarge: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 32,
      letterSpacing: 0,
      lineHeight: 40,
    },
    titleSmall: {
      fontFamily: 'SpaceGrotesk_500Medium',
      fontWeight: '500' as const,
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    titleMedium: {
      fontFamily: 'SpaceGrotesk_500Medium',
      fontWeight: '500' as const,
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleLarge: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 22,
      letterSpacing: 0,
      lineHeight: 28,
    },
    labelSmall: {
      fontFamily: 'SpaceGrotesk_500Medium',
      fontWeight: '500' as const,
      fontSize: 11,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelMedium: {
      fontFamily: 'SpaceGrotesk_500Medium',
      fontWeight: '500' as const,
      fontSize: 12,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: 'SpaceGrotesk_500Medium',
      fontWeight: '500' as const,
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 12,
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    bodyMedium: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 14,
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontWeight: '400' as const,
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: 24,
    },
  };

  // Custom Light Theme using your new colors.
  const customLightTheme = {
    ...MD3LightTheme,
    "colors": {
      "primary": "rgb(0, 95, 175)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(212, 227, 255)",
      "onPrimaryContainer": "rgb(0, 28, 58)",
      "secondary": "rgb(84, 95, 113)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(216, 227, 248)",
      "onSecondaryContainer": "rgb(17, 28, 43)",
      "tertiary": "rgb(114, 76, 159)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(238, 219, 255)",
      "onTertiaryContainer": "rgb(42, 0, 83)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(253, 252, 255)",
      "onBackground": "rgb(26, 28, 30)",
      "surface": "rgb(253, 252, 255)",
      "onSurface": "rgb(26, 28, 30)",
      "surfaceVariant": "rgb(224, 226, 236)",
      "onSurfaceVariant": "rgb(67, 71, 78)",
      "outline": "rgb(116, 119, 127)",
      "outlineVariant": "rgb(195, 198, 207)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(47, 48, 51)",
      "inverseOnSurface": "rgb(241, 240, 244)",
      "inversePrimary": "rgb(165, 200, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(240, 244, 251)",
        "level2": "rgb(233, 239, 249)",
        "level3": "rgb(225, 235, 246)",
        "level4": "rgb(223, 233, 245)",
        "level5": "rgb(218, 230, 244)"
      },
      "surfaceDisabled": "rgba(26, 28, 30, 0.12)",
      "onSurfaceDisabled": "rgba(26, 28, 30, 0.38)",
      "backdrop": "rgba(45, 49, 56, 0.4)"
    },
    fonts: { ...MD3LightTheme.fonts, ...typography },
  };

  // Custom Dark Theme using your new colors.
  const customDarkTheme = {
    ...MD3DarkTheme,
    "colors": {
      "primary": "rgb(170, 199, 255)",
      "onPrimary": "rgb(0, 47, 100)",
      "primaryContainer": "rgb(0, 69, 141)",
      "onPrimaryContainer": "rgb(214, 227, 255)",
      "secondary": "rgb(190, 198, 220)",
      "onSecondary": "rgb(40, 49, 65)",
      "secondaryContainer": "rgb(62, 71, 89)",
      "onSecondaryContainer": "rgb(218, 226, 249)",
      "tertiary": "rgb(218, 185, 255)",
      "onTertiary": "rgb(65, 27, 109)",
      "tertiaryContainer": "rgb(89, 52, 133)",
      "onTertiaryContainer": "rgb(238, 219, 255)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(26, 27, 30)",
      "onBackground": "rgb(227, 226, 230)",
      "surface": "rgb(26, 27, 30)",
      "onSurface": "rgb(227, 226, 230)",
      "surfaceVariant": "rgb(68, 71, 78)",
      "onSurfaceVariant": "rgb(196, 198, 208)",
      "outline": "rgb(142, 144, 153)",
      "outlineVariant": "rgb(68, 71, 78)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(227, 226, 230)",
      "inverseOnSurface": "rgb(47, 48, 51)",
      "inversePrimary": "rgb(0, 93, 184)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(33, 36, 41)",
        "level2": "rgb(38, 41, 48)",
        "level3": "rgb(42, 46, 55)",
        "level4": "rgb(43, 48, 57)",
        "level5": "rgb(46, 51, 62)"
      },
      "surfaceDisabled": "rgba(227, 226, 230, 0.12)",
      "onSurfaceDisabled": "rgba(227, 226, 230, 0.38)",
      "backdrop": "rgba(45, 48, 56, 0.4)"
    },
    fonts: { ...MD3DarkTheme.fonts, ...typography },
  };

  // Select the theme based on the user's color scheme.
  const paperTheme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

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
