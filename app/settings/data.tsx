import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
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
} from "../../utils/appSettings";
import { persistSavedGames } from "../../utils/gameHistory";

const DataSettings = () => {
  const theme = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [historyDialogVisible, setHistoryDialogVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setSettings(await loadAppSettings());
    };

    loadSettings();
    const unsubscribe = subscribeAppSettings(() => {
      loadSettings();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const resetAppSettings = async () => {
    await persistAppSettings(DEFAULT_APP_SETTINGS);
    setResetDialogVisible(false);
  };

  const clearHistory = async () => {
    await persistSavedGames([]);
    setHistoryDialogVisible(false);
  };

  const handleResetPress = async () => {
    if (!settings.confirmDestructiveActions) {
      await resetAppSettings();
      return;
    }

    setResetDialogVisible(true);
  };

  const handleHistoryPress = async () => {
    if (!settings.confirmDestructiveActions) {
      await clearHistory();
      return;
    }

    setHistoryDialogVisible(true);
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
        <Appbar.Content title="Data & Reset" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Reset app settings
          </Text>
          <Text
            style={[styles.helper, { color: theme.colors.onSurfaceVariant }]}
          >
            Restore the default theme, names, and feedback preferences.
          </Text>
          <Button
            mode="contained-tonal"
            onPress={handleResetPress}
            style={styles.button}
          >
            Reset settings
          </Button>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            Clear saved matches
          </Text>
          <Text
            style={[styles.helper, { color: theme.colors.onSurfaceVariant }]}
          >
            Remove all saved games from the history list.
          </Text>
          <Button
            mode="contained-tonal"
            onPress={handleHistoryPress}
            style={styles.button}
          >
            Clear history
          </Button>
        </Surface>
      </View>

      <Portal>
        <Dialog
          visible={resetDialogVisible}
          onDismiss={() => setResetDialogVisible(false)}
        >
          <Dialog.Title>Reset app settings?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              This will restore the default theme and team name values.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setResetDialogVisible(false)}>Cancel</Button>
            <Button onPress={resetAppSettings}>Reset</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={historyDialogVisible}
          onDismiss={() => setHistoryDialogVisible(false)}
        >
          <Dialog.Title>Clear saved history?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              This permanently removes all saved games from history.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setHistoryDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={clearHistory}>Clear</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  card: { borderRadius: 18, padding: 16, gap: 8 },
  headerTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    letterSpacing: -0.75,
  },
  label: { fontFamily: "SpaceGrotesk_600SemiBold", fontSize: 16 },
  helper: { fontFamily: "SpaceGrotesk_400Regular", fontSize: 13 },
  button: { marginTop: 8, borderRadius: 12 },
});

export default DataSettings;
