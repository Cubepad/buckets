import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import {
  useTheme,
  Surface,
  Menu,
  Button,
  Dialog,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GameCategory, ScoreLogEntry } from "../utils/gameHistory";

type HistoryCardProps = {
  gameId?: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  date: string;
  duration?: string;
  categoryName?: string;
  categoryId?: string;
  categories?: GameCategory[];
  scoreLog?: ScoreLogEntry[];
  onCategoryChange?: (categoryId: string) => void;
  onDelete?: (gameId: string) => void;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  gameId,
  team1,
  team2,
  score1,
  score2,
  date,
  duration = "40:00",
  categoryName = "Pickup Games",
  categories = [],
  scoreLog = [],
  onCategoryChange,
  onDelete,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);

  const formatElapsedTime = (seconds?: number) => {
    if (typeof seconds !== "number" || Number.isNaN(seconds)) {
      return "00:00";
    }

    const totalSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <Pressable
      onPress={() => {
        if (!menuVisible) {
          setLogVisible(true);
        }
      }}
    >
      <Surface
        style={[
          styles.card,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
        elevation={1}
      >
        <View style={styles.header}>
          <Text
            style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}
          >
            {date}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.teamContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <MaterialCommunityIcons
                name="shield"
                size={32}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { color: theme.colors.onSurface }]}
            >
              {team1}
            </Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>
              {score1} — {score2}
            </Text>
          </View>

          <View style={styles.teamContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="shield"
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { color: theme.colors.primary }]}
            >
              {team2}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.durationText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Duration: {duration}
            </Text>
          </View>

          <View style={styles.footerActions}>
            {categories.length > 0 ? (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    compact
                    mode="text"
                    onPress={(event) => {
                      event.stopPropagation();
                      setLogVisible(false);
                      setMenuVisible((prev) => !prev);
                    }}
                    icon="tag-outline"
                  >
                    {categoryName}
                  </Button>
                }
              >
                {categories.map((category) => (
                  <Menu.Item
                    key={category.id}
                    title={category.name}
                    onPress={() => {
                      setMenuVisible(false);
                      onCategoryChange?.(category.id);
                    }}
                  />
                ))}
              </Menu>
            ) : (
              <Text
                style={[
                  styles.durationText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {categoryName}
              </Text>
            )}

            {gameId ? (
              <Button
                compact
                mode="text"
                icon="delete-outline"
                textColor={theme.colors.error}
                onPress={(event) => {
                  event.stopPropagation();
                  onDelete?.(gameId);
                }}
              >
                Delete
              </Button>
            ) : null}
          </View>
        </View>
      </Surface>

      <Portal>
        <Dialog visible={logVisible} onDismiss={() => setLogVisible(false)}>
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            Game log
          </Dialog.Title>
          <Dialog.Content>
            {scoreLog.length > 0 ? (
              <ScrollView style={styles.logList}>
                {scoreLog.map((entry) => {
                  const isTeamA = entry.team === "A";
                  const elapsedLabel = formatElapsedTime(entry.elapsedSeconds);

                  return (
                    <View
                      key={entry.id}
                      style={[
                        styles.logRow,
                        {
                          backgroundColor: isTeamA
                            ? theme.colors.primaryContainer
                            : theme.colors.secondaryContainer,
                        },
                        isTeamA ? styles.logRowLeft : styles.logRowRight,
                      ]}
                    >
                      <View style={styles.logTeamBlock}>
                        <Text
                          style={[
                            styles.logTeamName,
                            {
                              color: isTeamA
                                ? theme.colors.onPrimaryContainer
                                : theme.colors.onSecondaryContainer,
                            },
                          ]}
                        >
                          {isTeamA ? team1 : team2}
                        </Text>
                        <Text
                          style={[
                            styles.logDelta,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          +{entry.points}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.logTime,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {elapsedLabel}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <Text
                style={[
                  styles.durationText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No score events for this game.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start", // Changed from flex-end to flex-start
    marginBottom: 12,
  },
  dateText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    paddingLeft: 4, // Aligns slightly better with the icons below
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  teamContainer: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  teamName: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 14,
  },
  scoreContainer: {
    flex: 1.2,
    alignItems: "center",
  },
  scoreText: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 28,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 10,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
    justifyContent: "flex-end",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  durationText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
  },
  logList: {
    maxHeight: 260,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  logRowLeft: {
    justifyContent: "space-between",
  },
  logRowRight: {
    justifyContent: "space-between",
  },
  logTeamBlock: {
    flex: 1,
    minWidth: 0,
  },
  logTeamName: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 12,
  },
  logDelta: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 12,
    marginTop: 2,
  },
  logTime: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 11,
    minWidth: 52,
    textAlign: "right",
  },
});

export default HistoryCard;
