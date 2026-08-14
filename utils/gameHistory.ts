import AsyncStorage from "@react-native-async-storage/async-storage";

export const MAX_TEAM_NAME_LENGTH = 18;
export const MAX_CATEGORY_NAME_LENGTH = 22;
export const HISTORY_STORAGE_KEY = "@buckets/history";
export const CATEGORY_STORAGE_KEY = "@buckets/categories";

export interface GameCategory {
  id: string;
  name: string;
  description: string;
}

export interface ScoreLogEntry {
  id: string;
  team: "A" | "B";
  points: number;
  timestamp: string;
  elapsedSeconds?: number;
}

export interface SavedGame {
  id: string;
  date: string;
  duration: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  categoryId: string;
  categoryName: string;
  scoreLog: ScoreLogEntry[];
}

export const DEFAULT_CATEGORIES: GameCategory[] = [
  { id: "pickup", name: "Pickup Games", description: "Casual play sessions" },
  {
    id: "tournament",
    name: "Tournaments",
    description: "Competitive matchups",
  },
  { id: "duel", name: "1v1 Battles", description: "Head-to-head challenge" },
  { id: "league", name: "League", description: "Season play" },
];

export const getCategoryById = (
  categories: GameCategory[],
  categoryId?: string
) => {
  if (!categoryId) {
    return categories[0] ?? DEFAULT_CATEGORIES[0];
  }

  return (
    categories.find((category) => category.id === categoryId) ??
    categories[0] ??
    DEFAULT_CATEGORIES[0]
  );
};

export const getTeamDisplayName = (value: string, team: "A" | "B") => {
  const trimmedName = value.trim().slice(0, MAX_TEAM_NAME_LENGTH);
  return trimmedName || `Team ${team}`;
};

export const createSavedGame = ({
  teamAName,
  teamBName,
  scoreA,
  scoreB,
  duration,
  categoryId,
  categoryName,
  scoreLog = [],
}: {
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  duration: string;
  categoryId?: string;
  categoryName?: string;
  scoreLog?: ScoreLogEntry[];
}): SavedGame => {
  const resolvedCategory = getCategoryById(DEFAULT_CATEGORIES, categoryId);

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    duration: duration || "00:00",
    teamAName: getTeamDisplayName(teamAName, "A"),
    teamBName: getTeamDisplayName(teamBName, "B"),
    scoreA,
    scoreB,
    categoryId: categoryId || resolvedCategory.id,
    categoryName: categoryName || resolvedCategory.name,
    scoreLog,
  };
};

export const loadSavedGames = async (): Promise<SavedGame[]> => {
  try {
    const rawValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn("Unable to load saved games", error);
    return [];
  }
};

export const persistSavedGames = async (games: SavedGame[]) => {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.warn("Unable to save games", error);
  }
};

export const loadCategories = async (): Promise<GameCategory[]> => {
  try {
    const rawValue = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!rawValue) {
      await persistCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) && parsedValue.length > 0
      ? parsedValue
      : DEFAULT_CATEGORIES;
  } catch (error) {
    console.warn("Unable to load categories", error);
    return DEFAULT_CATEGORIES;
  }
};

export const persistCategories = async (categories: GameCategory[]) => {
  try {
    await AsyncStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(categories)
    );
  } catch (error) {
    console.warn("Unable to save categories", error);
  }
};
