import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Surface, Text, useTheme } from "react-native-paper";
import { Host, Switch } from "@expo/ui";
import { useRouter } from "expo-router";
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  persistAppSettings,
  triggerFeedback,
} from "../../utils/appSettings";

const SoundSettings = () => {
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
      <Appbar.Header style={{ backgroundColor: theme.colors.background, }}>
        <Appbar.BackAction
          onPress={() => router.back()}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginLeft: 16, 
          }}
        />
        <Appbar.Content title="Vibration & Haptics" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Haptics
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Button taps and selection feedback
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ hapticsEnabled: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Vibration
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Enable vibration feedback
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ vibrationEnabled: value });
                }}
              />
            </Host>
          </View>
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  card: { borderRadius: 18, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textWrap: { flex: 1, paddingRight: 12 },
  switchHost: {
    width: 51,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    letterSpacing: -0.75,
  },
  label: { fontFamily: "SpaceGrotesk_600SemiBold", fontSize: 16 },
  helper: { fontFamily: "SpaceGrotesk_400Regular", fontSize: 13, marginTop: 4 },
});

export default SoundSettings;