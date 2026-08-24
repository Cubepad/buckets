import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, FlatList, Text } from "react-native";
import {
  Button,
  useTheme,
  Appbar,
  Surface,
  Chip,
  Dialog,
  Portal,
} from "react-native-paper";
import { useFocusEffect, useNavigation } from "expo-router/react-navigation";
import { useSegments } from "expo-router";
import HistoryCard from "../../components/HistoryCard";
import {
  DEFAULT_CATEGORIES,
  GameCategory,
  loadCategories,
  loadSavedGames,
  persistSavedGames,
  SavedGame,
} from "../../utils/gameHistory";
import {
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  subscribeAppSettings,
} from "../../utils/appSettings";

const History = () => {
  const theme = useTheme();
  const [historyData, setHistoryData] = useState<SavedGame[]>([]);
  const [categories, setCategories] =
    useState<GameCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_APP_SETTINGS);

  const fetchHistory = useCallback(async () => {
    const savedGames = await loadSavedGames();
    const loadedCategories = await loadCategories();
    setHistoryData(savedGames);
    setCategories(loadedCategories);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const loadSettings = async () => {
      const nextSettings = await loadAppSettings();
      setSettings(nextSettings);
    };

    loadSettings();
    const unsubscribe = subscribeAppSettings(() => {
      loadSettings();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteGame = useCallback(async (gameId: string) => {
    setHistoryData((prev) => {
      const next = prev.filter((game) => game.id !== gameId);
      persistSavedGames(next);
      return next;
    });
  }, []);

  const handleClearHistory = useCallback(async () => {
    setHistoryData([]);
    setClearDialogVisible(false);
    await persistSavedGames([]);
  }, []);

  const handleClearHistoryPress = useCallback(async () => {
    if (!settings.confirmDestructiveActions) {
      await handleClearHistory();
      return;
    }

    setClearDialogVisible(true);
  }, [settings.confirmDestructiveActions, handleClearHistory]);

  const handleCategoryChange = useCallback(
    async (gameId: string, categoryId: string) => {
      setHistoryData((prev) => {
        const next = prev.map((game) => {
          if (game.id !== gameId) {
            return game;
          }

          const category =
            categories.find((item) => item.id === categoryId) ?? categories[0];
          return {
            ...game,
            categoryId,
            categoryName: category?.name ?? "Pickup Games",
          };
        });
        persistSavedGames(next);
        return next;
      });
    },
    [categories]
  );

  const filteredHistory =
    selectedCategory === "all"
      ? historyData
      : historyData.filter((game) => game.categoryId === selectedCategory);

  const renderHistoryCard = useCallback(
    ({ item }: { item: SavedGame }) => (
      <HistoryCard
        gameId={item.id}
        team1={item.teamAName}
        team2={item.teamBName}
        score1={item.scoreA}
        score2={item.scoreB}
        date={item.date}
        duration={item.duration}
        categoryName={item.categoryName ?? "Pickup Games"}
        categoryId={item.categoryId ?? "pickup"}
        categories={categories}
        scoreLog={item.scoreLog ?? []}
        onCategoryChange={(categoryId: string) =>
          handleCategoryChange(item.id, categoryId)
        }
        onDelete={handleDeleteGame}
      />
    ),
    [categories, handleCategoryChange, handleDeleteGame]
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.Content
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -1,
          }}
          title="History"
        />
      </Appbar.Header>
      {settings.showHistoryCategoryFilters ? (
        <Surface
          style={[
            styles.filterCard,
            { backgroundColor: theme.colors.elevation.level1 },
          ]}
          elevation={1}
        >
          <Text
            style={[
              styles.filterLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Filter categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <Chip
              selected={selectedCategory === "all"}
              onPress={() => setSelectedCategory("all")}
              style={styles.filterChip}
              textStyle={styles.filterChipText}
            >
              All
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
              >
                {category.name}
              </Chip>
            ))}
          </ScrollView>
        </Surface>
      ) : null}
      <Button
        mode="contained"
        onPress={handleClearHistoryPress}
        style={styles.clearButton}
        disabled={historyData.length === 0}
      >
        Clear All History
      </Button>

      <FlatList
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, styles.historyList]}
        showsVerticalScrollIndicator={false}
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryCard}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyState,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            No games saved yet.
          </Text>
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
      />

      <Portal>
        <Dialog
          visible={clearDialogVisible}
          onDismiss={() => setClearDialogVisible(false)}
        >
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            Clear all history?
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_400Regular",
                color: theme.colors.onSurfaceVariant,
              }}
            >
              This will remove every saved game from your history.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleClearHistory}>Clear</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  filterCard: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 16,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "SpaceGrotesk_500Medium",
  },
  filterRow: {
    paddingRight: 4,
    gap: 8,
  },
  filterChip: {
    marginRight: 0,
  },
  filterChipText: {
    fontFamily: "SpaceGrotesk_500Medium",
  },
  historyList: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  clearButton: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
  },
  emptyState: {
    textAlign: "center",
    paddingVertical: 24,
    fontFamily: "SpaceGrotesk_500Medium",
    fontSize: 16,
  },
});

export default History;
