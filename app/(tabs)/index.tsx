import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Appbar, Menu, useTheme } from "react-native-paper";
import ScoreCard from "../../components/ScoreCard"; // Import the updated ScoreCard
import GameControls from "../../components/GameControls";

interface ScoreHistory {
  teamAScore: number;
  teamBScore: number;
}

export default function HomeScreen() {
  const theme = useTheme();

  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([
    { teamAScore: 0, teamBScore: 0 },
  ]);

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const undoLastAction = () => {
    if (scoreHistory.length > 1) {
      const previousStateIndex = scoreHistory.length - 2;
      const lastScores = scoreHistory[previousStateIndex];
      setTeamAScore(lastScores.teamAScore);
      setTeamBScore(lastScores.teamBScore);
      setScoreHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  // updateScore remains the same, it already handles 'A' or 'B'
  const updateScore = (team: "A" | "B", points: number): void => {
    const nextTeamAScore = team === "A" ? teamAScore + points : teamAScore;
    const nextTeamBScore = team === "B" ? teamBScore + points : teamBScore;

    setScoreHistory((prevHistory) => [
      ...prevHistory,
      { teamAScore: nextTeamAScore, teamBScore: nextTeamBScore },
    ]);

    if (team === "A") {
      setTeamAScore(nextTeamAScore);
    } else {
      setTeamBScore(nextTeamBScore);
    }
  };

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setScoreHistory([{ teamAScore: 0, teamBScore: 0 }]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header mode="center-aligned" >
        <Appbar.Content titleStyle={{ fontFamily: 'Manrope_600SemiBold', fontSize: 24 }}   title="Buckets Scoreboard" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item onPress={closeMenu} title="Settings" leadingIcon="cog" />
          <Menu.Item
            onPress={closeMenu}
            title="Change Team Name"
            leadingIcon="rename-box"
          />
          <Menu.Item
            onPress={closeMenu}
            title="About"
            leadingIcon="information"
          />
        </Menu>
      </Appbar.Header>

      {/* Use ScrollView to ensure content fits, especially buttons */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        alwaysBounceVertical={false}
      >
        {/* Container for the single scorecard */}
        <View style={styles.scoreCardContainer}>
          <ScoreCard
            scoreA={teamAScore}
            scoreB={teamBScore}
            updateScore={updateScore}
            // Optional: pass specific style if needed
            // style={{}}
          />
        </View>

        {/* GameControls remain the same */}
        <GameControls
          onUndo={undoLastAction}
          onNewGame={resetGame}
          disableUndo={scoreHistory.length <= 1}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Ensures ScrollView content can grow
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: "space-between", // Pushes GameControls down if space allows
  },
  // Renamed scoreCardsRow to scoreCardContainer for clarity
  scoreCardContainer: {
    marginBottom: 24, // Keep margin below the card
  },
});
