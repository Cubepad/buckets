import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

export interface AppSettings {
  themeMode: ThemeMode;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartTimerOnScore: boolean;
  showLastScorerSummary: boolean;
  showEditHints: boolean;
  confirmDestructiveActions: boolean;
  showScoreProgress: boolean;
  showHistoryCategoryFilters: boolean;
  teamAName: string;
  teamBName: string;
}

export const APP_SETTINGS_KEY = "@buckets/app-settings";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  themeMode: "system",
  hapticsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  autoStartTimerOnScore: true,
  showLastScorerSummary: true,
  showEditHints: true,
  confirmDestructiveActions: true,
  showScoreProgress: true,
  showHistoryCategoryFilters: true,
  teamAName: "Team A",
  teamBName: "Team B",
};

const listeners = new Set<() => void>();

export const subscribeAppSettings = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emitAppSettingsChange = () => {
  listeners.forEach((listener) => listener());
};

export const loadAppSettings = async (): Promise<AppSettings> => {
  try {
    const rawValue = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    if (!rawValue) {
      await persistAppSettings(DEFAULT_APP_SETTINGS);
      return DEFAULT_APP_SETTINGS;
    }

    const parsed = JSON.parse(rawValue) as Partial<AppSettings>;
    return {
      ...DEFAULT_APP_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.warn("Unable to load app settings", error);
    return DEFAULT_APP_SETTINGS;
  }
};

export const persistAppSettings = async (settings: AppSettings) => {
  try {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
    emitAppSettingsChange();
  } catch (error) {
    console.warn("Unable to save app settings", error);
  }
};

export const triggerFeedback = async (
  mode: "selection" | "light" | "medium" | "heavy" = "selection"
) => {
  const settings = await loadAppSettings();

  if (!settings.hapticsEnabled && !settings.vibrationEnabled) {
    return;
  }

  const shouldHaptics = settings.hapticsEnabled;
  const shouldVibrate = settings.vibrationEnabled;

  switch (mode) {
    case "selection": {
      if (shouldHaptics) {
        await Haptics.selectionAsync();
      }
      if (shouldVibrate) {
        Vibration.vibrate(8);
      }
      break;
    }
    case "light": {
      if (shouldHaptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (shouldVibrate) {
        Vibration.vibrate(10);
      }
      break;
    }
    case "medium": {
      if (shouldHaptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      if (shouldVibrate) {
        Vibration.vibrate(15);
      }
      break;
    }
    case "heavy": {
      if (shouldHaptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      if (shouldVibrate) {
        Vibration.vibrate(20);
      }
      break;
    }
    default: {
      if (shouldHaptics) {
        await Haptics.selectionAsync();
      }
      if (shouldVibrate) {
        Vibration.vibrate(8);
      }
      break;
    }
  }
};

export const shouldUseSoundEffects = async () => {
  const settings = await loadAppSettings();
  return settings.soundEnabled;
};
