import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "react-native-paper";

type HistoryCardProps = {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  date: string;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  team1,
  team2,
  score1,
  score2,
  date,
}) => {
  const theme = useTheme();
  const winner = score1 > score2 ? team1 : team2;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.elevation.level1 },
      ]}
    >
      {/* Teams row */}
      <View style={styles.teamsRow}>
        <Text style={[styles.teamText, { color: theme.colors.onSurface }]}>
          {team1}
        </Text>
        <Text style={[styles.vsText, { color: theme.colors.onSurfaceVariant }]}>
          vs
        </Text>
        <Text style={[styles.teamText, { color: theme.colors.onSurface }]}>
          {team2}
        </Text>
      </View>

      {/* Scores row */}
      <View style={styles.scoresRow}>
        <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>
          {score1}
        </Text>
        <Text style={[styles.dashText, { color: theme.colors.onSurfaceVariant }]}>
          -
        </Text>
        <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>
          {score2}
        </Text>
      </View>

      {/* Winner */}
      <Text style={[styles.winnerText, { color: theme.colors.primary }]}>
        Winner: {winner}
      </Text>

      {/* Date */}
      <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
        {date}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20, // Updated to 20px
    marginBottom: 16,
    borderWidth: 0,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, 
    marginBottom: 8,
    width: "100%",
  },
  teamText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 16,
    fontWeight: "600", 
    textAlign: "center",
    flex: 1,
    maxWidth: "40%", 
  },
  vsText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  scoresRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  scoreText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    marginHorizontal: 8,
    fontWeight: "600",
  },
  dashText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 24,
    marginHorizontal: 58,
  },
  winnerText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 15,
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  dateText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});

export default HistoryCard;
