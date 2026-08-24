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

const GameplaySettings = () => {
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
        <Appbar.Content title="Gameplay" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Auto-start timer on score input
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Start the match clock as soon as scoring begins.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.autoStartTimerOnScore}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ autoStartTimerOnScore: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Show last scorer summary
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Display the last scored point summary above the timer.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.showLastScorerSummary}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ showLastScorerSummary: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Show team edit hints
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Keep the Edit chips visible on each team name.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.showEditHints}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ showEditHints: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Confirm destructive actions
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Require confirmation before clearing history or resetting.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.confirmDestructiveActions}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ confirmDestructiveActions: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Show score progress bar
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Display the score lead indicator beneath the scoreboard.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.showScoreProgress}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ showScoreProgress: value });
                }}
              />
            </Host>
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Show history category filters
              </Text>
              <Text
                style={[
                  styles.helper,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Keep the category chips visible on the history page.
              </Text>
            </View>
            <Host style={styles.switchHost}>
              <Switch
                value={settings.showHistoryCategoryFilters}
                onValueChange={async (value) => {
                  if (value) {
                    await triggerFeedback("selection");
                  }
                  await updateSetting({ showHistoryCategoryFilters: value });
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

export default GameplaySettings;