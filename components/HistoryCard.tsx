import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HistoryCardProps = {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  date: string;
  duration?: string;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  team1,
  team2,
  score1,
  score2,
  date,
  duration = "40:00",
}) => {
  const theme = useTheme();

  return (
    <Surface
      style={[
        styles.card,
        { backgroundColor: theme.colors.elevation.level1 },
      ]}
      elevation={1}
    >
      {/* Header: Date moved to the left */}
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
          {date}
        </Text>
      </View>

      {/* Main Content: Scoreboard */}
      <View style={styles.mainContent}>
        <View style={styles.teamContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons name="shield" size={32} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text numberOfLines={1} style={[styles.teamName, { color: theme.colors.onSurface }]}>
            {team1}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>
            {score1} — {score2}
          </Text>
        </View>

        <View style={styles.teamContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="shield" size={32} color={theme.colors.primary} />
          </View>
          <Text numberOfLines={1} style={[styles.teamName, { color: theme.colors.primary }]}>
            {team2}
          </Text>
        </View>
      </View>

      {/* Footer: Duration */}
      <View style={styles.footer}>
        <View style={styles.durationContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.durationText, { color: theme.colors.onSurfaceVariant }]}>
            Duration: {duration}
          </Text>
        </View>
      </View>
    </Surface>
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
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 10,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
  },
});

export default HistoryCard;