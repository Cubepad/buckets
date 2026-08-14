import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  TextInput,
  useTheme,
  Surface,
} from "react-native-paper";
import {
  DEFAULT_CATEGORIES,
  GameCategory,
  loadCategories,
  loadSavedGames,
  MAX_CATEGORY_NAME_LENGTH,
  persistCategories,
  persistSavedGames,
  SavedGame,
} from "../../utils/gameHistory";

export default function CategoriesScreen() {
  const theme = useTheme();
  const [categories, setCategories] =
    useState<GameCategory[]>(DEFAULT_CATEGORIES);
  const [historyEntries, setHistoryEntries] = useState<SavedGame[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<GameCategory | null>(
    null
  );
  const [replacementCategoryId, setReplacementCategoryId] =
    useState<string>("");
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  useEffect(() => {
    const load = async () => {
      const savedCategories = await loadCategories();
      const savedGames = await loadSavedGames();
      setCategories(savedCategories);
      setHistoryEntries(savedGames);
    };

    load();
  }, []);

  const visibleCategories = categories;

  const handleDeleteCategory = (category: GameCategory) => {
    const nextCategoryId = categories.find(
      (item) => item.id !== category.id
    )?.id;

    setCategoryToDelete(category);
    setReplacementCategoryId(nextCategoryId ?? "");
    setDeleteDialogVisible(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const nextCategories = categories.filter(
      (category) => category.id !== categoryToDelete.id
    );

    const fallbackCategoryId =
      replacementCategoryId ||
      categories.find((category) => category.id !== categoryToDelete.id)?.id ||
      DEFAULT_CATEGORIES[0]?.id;

    const nextHistoryEntries = historyEntries.map((game) => {
      if (game.categoryId !== categoryToDelete.id) {
        return game;
      }

      const replacementCategory =
        categories.find((category) => category.id === fallbackCategoryId) ??
        DEFAULT_CATEGORIES[0];

      return {
        ...game,
        categoryId: replacementCategory.id,
        categoryName: replacementCategory.name,
      };
    });

    setCategories(nextCategories);
    setHistoryEntries(nextHistoryEntries);
    setDeleteDialogVisible(false);
    setCategoryToDelete(null);
    setReplacementCategoryId("");

    await persistCategories(nextCategories);
    await persistSavedGames(nextHistoryEntries);
  };

  const handleSaveCategory = async () => {
    const nextName = draftName.trim().slice(0, MAX_CATEGORY_NAME_LENGTH);
    if (!nextName) {
      return;
    }

    const nextCategory = {
      id: nextName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]+/g, ""),
      name: nextName,
      description: draftDescription.trim() || "Custom category",
    };

    const nextCategories = [nextCategory, ...categories];
    setCategories(nextCategories);
    setDraftName("");
    setDraftDescription("");
    setDialogVisible(false);
    await persistCategories(nextCategories);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content
          title="Game Categories"
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -1,
          }}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        alwaysBounceVertical={false}
      >
        <Button
          mode="contained"
          onPress={() => setDialogVisible(true)}
          style={styles.addButton}
        >
          Add category
        </Button>

        {visibleCategories.map((category) => (
          <Surface
            key={category.id}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.colors.elevation.level1,
              },
            ]}
            elevation={1}
          >
            <List.Item
              title={category.name}
              description={category.description}
              titleStyle={styles.categoryTitle}
              descriptionStyle={styles.categoryDescription}
              left={(props) => <List.Icon {...props} icon="tag-outline" />}
              right={() => (
                <Button
                  compact
                  mode="text"
                  textColor={theme.colors.error}
                  onPress={() => handleDeleteCategory(category)}
                >
                  Delete
                </Button>
              )}
            />
          </Surface>
        ))}
        {visibleCategories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available.</Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            New category
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category name"
              value={draftName}
              onChangeText={setDraftName}
              mode="outlined"
              maxLength={MAX_CATEGORY_NAME_LENGTH}
              autoCapitalize="words"
              autoCorrect={false}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
            />
            <Text
              style={{
                marginTop: 6,
                textAlign: "right",
                color: theme.colors.onSurfaceVariant,
                fontFamily: "SpaceGrotesk_500Medium",
              }}
            >
              {draftName.length}/{MAX_CATEGORY_NAME_LENGTH}
            </Text>
            <TextInput
              label="Description"
              value={draftDescription}
              onChangeText={setDraftDescription}
              mode="outlined"
              style={[styles.descriptionInput, styles.textInput]}
              contentStyle={styles.textInputContent}
              autoCapitalize="sentences"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveCategory}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            Move saved games?
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontFamily: "SpaceGrotesk_400Regular" }}>
              {categoryToDelete
                ? `Games currently in ${categoryToDelete.name} will be reassigned to another category.`
                : "This category has games saved to it."}
            </Text>
            <TextInput
              label="Move to category"
              value={
                categories.find(
                  (category) => category.id === replacementCategoryId
                )?.name ?? ""
              }
              mode="outlined"
              style={styles.reassignInput}
              onFocus={() => {
                const firstAvailable = categories.find(
                  (category) => category.id !== categoryToDelete?.id
                );
                if (firstAvailable) {
                  setReplacementCategoryId(firstAvailable.id);
                }
              }}
              editable={false}
            />
            <View style={styles.reassignRow}>
              {categories
                .filter((category) => category.id !== categoryToDelete?.id)
                .map((category) => (
                  <Button
                    key={category.id}
                    mode={
                      replacementCategoryId === category.id
                        ? "contained"
                        : "outlined"
                    }
                    onPress={() => setReplacementCategoryId(category.id)}
                    style={styles.reassignButton}
                  >
                    {category.name}
                  </Button>
                ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={confirmDeleteCategory}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  addButton: {
    marginBottom: 12,
    borderRadius: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  categoryTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 16,
  },
  categoryDescription: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
  },
  textInput: {
    fontFamily: "SpaceGrotesk_500Medium",
  },
  textInputContent: {
    fontFamily: "SpaceGrotesk_500Medium",
  },
  descriptionInput: {
    marginTop: 12,
  },
  reassignInput: {
    marginTop: 12,
    marginBottom: 8,
  },
  reassignRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  reassignButton: {
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "SpaceGrotesk_500Medium",
  },
});
