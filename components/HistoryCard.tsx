import React, { useState, useRef } from "react";
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
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@expo/ui/community/bottom-sheet";
import { Host, Icon } from "@expo/ui";

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
  const sheetRef = useRef<BottomSheet>(null);
  const [categoryMenuKey, setCategoryMenuKey] = useState(0);
  const [logVisible, setLogVisible] = useState(false);

  const getTeamIconStyle = (isWinner: boolean) => ({
    backgroundColor: isWinner
      ? theme.colors.primaryContainer
      : theme.colors.surfaceVariant,
    iconColor: isWinner ? theme.colors.primary : theme.colors.onSurface,
    textColor: isWinner ? theme.colors.primary : theme.colors.onSurface,
  });

  const team1Style = getTeamIconStyle(score1 > score2);
  const team2Style = getTeamIconStyle(score2 > score1);

  const openCategoryMenu = () => {
    setMenuVisible(false);
    setCategoryMenuKey((prev) => prev + 1);
    requestAnimationFrame(() => setMenuVisible(true));
  };
  const closeCategoryMenu = () => setMenuVisible(false);

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
          sheetRef.current?.present();
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
                { backgroundColor: team1Style.backgroundColor },
              ]}
            >
              <Host matchContents>
                <Icon
                  name={Icon.select({
                    ios: "shield",
                    android: import("@expo/material-symbols/shield.xml"),
                  })}
                  size={32}
                  color={team1Style.iconColor}
                />
              </Host>
            </View>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { color: team1Style.textColor }]}
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
                { backgroundColor: team2Style.backgroundColor },
              ]}
            >
              <Host matchContents>
                <Icon
                  name={Icon.select({
                    ios: "shield",
                    android: import("@expo/material-symbols/shield.xml"),
                  })}
                  size={32}
                  color={team2Style.iconColor}
                />
              </Host>
            </View>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { color: team2Style.textColor }]}
            >
              {team2}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.durationContainer}>
              <Host matchContents>
                <Icon
                  name={Icon.select({
                    ios: "clock",
                    android: import("@expo/material-symbols/timer.xml"),
                  })}
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
              </Host>
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
                onDismiss={closeCategoryMenu}
                contentStyle={{ borderRadius: 12 }}
                anchor={
                  <Button
                    compact
                    mode="text"
                    onPress={(event) => {
                      event.stopPropagation();
                      setLogVisible(false);
                      if (menuVisible) {
                        closeCategoryMenu();
                        return;
                      }
                      openCategoryMenu();
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={["70%", "90%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <View>
              <Text
                style={[styles.sheetTitle, { color: theme.colors.onSurface }]}
              >
                Game log
              </Text>

              <Text
                style={[
                  styles.sheetSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {team1} vs {team2}
              </Text>
            </View>

            <Button
              compact
              mode="text"
              onPress={() => sheetRef.current?.close()}
            >
              Close
            </Button>
          </View>

          <View style={styles.teamHeaders}>
            <View style={styles.teamHeader}>
              <Text
                numberOfLines={1}
                style={[
                  styles.teamHeaderText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {team1}
              </Text>
            </View>

            <View style={styles.teamHeader}>
              <Text
                numberOfLines={1}
                style={[
                  styles.teamHeaderText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {team2}
              </Text>
            </View>
          </View>
        </BottomSheetView>

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.logListContent}
        >
          {scoreLog.length > 0 ? (
            [...scoreLog].reverse().map((entry) => {
              const isTeamA = entry.team === "A";
              const elapsedLabel = formatElapsedTime(entry.elapsedSeconds);

              return (
                <View key={entry.id} style={styles.logRow}>
                  <View style={styles.logTeamColumn}>
                    {isTeamA && (
                      <View
                        style={[
                          styles.scoreEvent,
                          {
                            backgroundColor: theme.colors.primaryContainer,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.logDelta,
                            {
                              color: theme.colors.onPrimaryContainer,
                            },
                          ]}
                        >
                          +{entry.points}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.timeColumn}>
                    <Text
                      style={[
                        styles.logTime,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {elapsedLabel}
                    </Text>
                  </View>

                  <View style={styles.logTeamColumn}>
                    {!isTeamA && (
                      <View
                        style={[
                          styles.scoreEvent,
                          {
                            backgroundColor: theme.colors.secondaryContainer,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.logDelta,
                            {
                              color: theme.colors.onSecondaryContainer,
                            },
                          ]}
                        >
                          +{entry.points}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyLog}>
              <Host matchContents>
                <Icon
                  name={Icon.select({
                    ios: "basketball",
                    android: import("@expo/material-symbols/timeline.xml"),
                  })}
                  size={32}
                  color={theme.colors.onSurfaceVariant}
                />
              </Host>

              <Text
                style={[
                  styles.emptyLogText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No score events for this game.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
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
    justifyContent: "flex-start", 
    marginBottom: 12,
  },
  dateText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    paddingLeft: 4, 
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
    maxHeight: "100%",
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

  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sheetTitle: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontSize: 24,
  },

  sheetSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },

  teamHeaders: {
    flexDirection: "row",
    marginBottom: 8,
  },

  teamHeader: {
    flex: 1,
    alignItems: "center",
  },

  teamHeaderText: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontSize: 15,
    maxWidth: "90%",
  },

  logListContent: {
    paddingBottom: 24,
  },

  logTeamColumn: {
    flex: 1,
    alignItems: "center",
  },

  timeColumn: {
    width: 64,
    alignItems: "center",
  },

  scoreEvent: {
    minWidth: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  emptyLog: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  emptyLogText: {
    fontSize: 14,
  },

  emptyLogContent: {
    flexGrow: 1,
  },
});

export default HistoryCard;
