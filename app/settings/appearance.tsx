import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  SegmentedButtons,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  persistAppSettings,
  subscribeAppSettings,
  ThemeMode,
  triggerFeedback,
} from "../../utils/appSettings";

const AppearanceSettings = () => {
  const theme = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      const nextSettings = await loadAppSettings();
      setSettings(nextSettings);
    };

    loadSettings();

    // Subscribe to settings changes and return cleanup
    const unsubscribe = subscribeAppSettings(loadSettings);
    return () => {
      unsubscribe();
    };
  }, []);

  const updateTheme = (themeMode: ThemeMode) => {
    const nextSettings = { ...settings, themeMode };

    // Update state immediately
    setSettings(nextSettings);

    // Save and trigger haptics in the background (non-blocking)
    persistAppSettings(nextSettings);
    triggerFeedback("selection");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.background, }}>
        <Appbar.BackAction
          onPress={() => router.back()}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginLeft: 16, 
          }}
        />
        <Appbar.Content title="Appearance" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Theme
          </Text>
          <SegmentedButtons
            value={settings.themeMode}
            onValueChange={(value) => updateTheme(value as ThemeMode)}
            buttons={[
              { value: "system", label: "System" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  card: { borderRadius: 18, padding: 16 },
  headerTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    letterSpacing: -0.75,
  },
  label: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
});

export default AppearanceSettings;