import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import {
  Button,
  useTheme,
  Appbar,
  Surface,
  Chip,
  Dialog,
  Portal,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import HistoryCard from "../../components/HistoryCard";
import {
  DEFAULT_CATEGORIES,
  GameCategory,
  loadCategories,
  loadSavedGames,
  persistSavedGames,
  SavedGame,
} from "../../utils/gameHistory";

const History = () => {
  const theme = useTheme();
  const [historyData, setHistoryData] = useState<SavedGame[]>([]);
  const [categories, setCategories] =
    useState<GameCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [clearDialogVisible, setClearDialogVisible] = useState(false);

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

  const handleDeleteGame = async (gameId: string) => {
    const nextHistory = historyData.filter((game) => game.id !== gameId);
    setHistoryData(nextHistory);
    await persistSavedGames(nextHistory);

    const refreshedHistory = await loadSavedGames();
    setHistoryData(refreshedHistory);
  };

  const handleClearHistory = async () => {
    setHistoryData([]);
    setClearDialogVisible(false);
    await persistSavedGames([]);

    const refreshedHistory = await loadSavedGames();
    setHistoryData(refreshedHistory);
  };

  const handleCategoryChange = async (gameId: string, categoryId: string) => {
    const nextHistory = historyData.map((game) => {
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

    setHistoryData(nextHistory);
    await persistSavedGames(nextHistory);
  };

  const filteredHistory =
    selectedCategory === "all"
      ? historyData
      : historyData.filter((game) => game.categoryId === selectedCategory);

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

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.historyList}>
          {filteredHistory.length === 0 ? (
            <Text
              style={[
                styles.emptyState,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              No games saved yet.
            </Text>
          ) : (
            filteredHistory.map((item) => (
              <HistoryCard
                key={item.id}
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
            ))
          )}
        </View>

        <Button
          mode="contained"
          onPress={() => setClearDialogVisible(true)}
          style={styles.clearButton}
          disabled={historyData.length === 0}
        >
          Clear All History
        </Button>
      </ScrollView>

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
