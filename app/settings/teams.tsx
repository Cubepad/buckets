import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  Button,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  persistAppSettings,
  triggerFeedback,
} from "../../utils/appSettings";

const TeamSettings = () => {
  const theme = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      const nextSettings = await loadAppSettings();
      setSettings(nextSettings);
    };

    loadSettings();
  }, []);

  const updateSetting = async (patch: Partial<AppSettings>) => {
    const nextSettings = { ...settings, ...patch };
    setSettings(nextSettings);
    await persistAppSettings(nextSettings);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level1 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Team Names" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Team A
          </Text>
          <TextInput
            mode="outlined"
            value={settings.teamAName}
            onChangeText={async (value) => {
              await updateSetting({ teamAName: value });
            }}
            maxLength={18}
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.input}
          />
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Team B
          </Text>
          <TextInput
            mode="outlined"
            value={settings.teamBName}
            onChangeText={async (value) => {
              await updateSetting({ teamBName: value });
            }}
            maxLength={18}
            autoCapitalize="words"
            autoCorrect={false}
            style={styles.input}
          />
        </Surface>

        <Button
          mode="contained"
          onPress={async () => {
            await triggerFeedback("selection");
            const nextSettings = {
              ...settings,
              teamAName: "Team A",
              teamBName: "Team B",
            };
            setSettings(nextSettings);
            await persistAppSettings(nextSettings);
          }}
          style={styles.saveButton}
        >
          Reset names
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  card: { borderRadius: 18, padding: 16 },
  headerTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    letterSpacing: -0.75,
  },
  label: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
  saveButton: {
    borderRadius: 14,
    marginTop: 8,
  },
});

export default TeamSettings;
