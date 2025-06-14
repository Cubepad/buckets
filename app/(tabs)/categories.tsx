import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Appbar, List, Text, useTheme, Surface } from "react-native-paper";

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function CategoriesScreen() {
  const theme = useTheme();
  // Sample categories; you can later integrate persistence or more dynamic features.
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Pickup Games", description: "Casual play sessions" },
    { id: 2, name: "Tournaments", description: "Competitive matchups" },
    { id: 3, name: "1v1 Battles", description: "Head-to-head challenge" },
  ]);

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
        {categories.map((category) => (
          <Surface
            key={category.id}
            style={[
              styles.categoryContainer,
              { backgroundColor: theme.colors.elevation.level1 },
            ]}
            elevation={1}
          >
            <List.Item
              title={category.name}
              description={category.description}
              left={(props) => (
                // Using "tag-outline" for organizing categories; feel free to change it if needed
                <List.Icon {...props} icon="tag-outline" />
              )}
            />
          </Surface>
        ))}
        {categories.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories available.</Text>
          </View>
        )}
      </ScrollView>
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
  categoryContainer: {
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
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

