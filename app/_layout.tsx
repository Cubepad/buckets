import { Stack } from "expo-router";
import { Platform, Appearance, View } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useMemo } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  loadAppSettings,
  subscribeAppSettings,
  ThemeMode,
} from "@/utils/appSettings";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "expo-router/react-navigation";

SplashScreen.preventAutoHideAsync();

const typography = {
  displaySmall: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 36,
    letterSpacing: 0,
    lineHeight: 44,
  },
  displayMedium: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 45,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displayLarge: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 57,
    letterSpacing: 0,
    lineHeight: 64,
  },
  headlineSmall: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineMedium: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineLarge: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 32,
    letterSpacing: 0,
    lineHeight: 40,
  },
  titleSmall: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500" as const,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500" as const,
    fontSize: 16,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleLarge: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 28,
  },
  labelSmall: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500" as const,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelMedium: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500" as const,
    fontSize: 12,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500" as const,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  bodyMedium: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontWeight: "400" as const,
    fontSize: 16,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [themeHydrated, setThemeHydrated] = useState(false);

  // Generates complete Material 3 light & dark palettes automatically
  const { theme: material3Theme } = useMaterial3Theme({
    fallbackSourceColor: "#005FAF",
  });

  useEffect(() => {
    const loadThemeMode = async () => {
      const settings = await loadAppSettings();
      setThemeMode(settings.themeMode);
      setThemeHydrated(true);
    };
    loadThemeMode();
    const unsubscribe = subscribeAppSettings(() => {
      loadThemeMode();
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const effectiveScheme = themeMode === "system" ? colorScheme : themeMode;

  useEffect(() => {
    if (themeMode === "system") {
      Appearance.setColorScheme("unspecified" as any);
    } else {
      Appearance.setColorScheme(themeMode);
    }
  }, [themeMode]);

  // Construct Paper theme using generated M3 colors directly
  const paperTheme = useMemo(() => {
    const isDark = effectiveScheme === "dark";
    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
    const dynamicColors = material3Theme[isDark ? "dark" : "light"];

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...dynamicColors,
      },
      fonts: {
        ...baseTheme.fonts,
        ...typography,
      },
    };
  }, [effectiveScheme, material3Theme]);

  if (!fontsLoaded || !themeHydrated) return null;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider
        value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <View
          style={{ backgroundColor: paperTheme.colors.background, flex: 1 }}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={effectiveScheme === "dark" ? "light" : "dark"} />
        </View>
      </ThemeProvider>
    </PaperProvider>
  );
}
