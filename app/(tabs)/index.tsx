import React, { useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Appbar, Menu, Text, useTheme, Surface } from "react-native-paper";
import ScoreCard from "../../components/ScoreCard";
import GameControls from "../../components/GameControls";

interface ScoreHistory {
  teamAScore: number;
  teamBScore: number;
}

interface LastScorer {
  team: "A" | "B";
  points: number;
}

export default function HomeScreen() {
  const theme = useTheme();

  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([
    { teamAScore: 0, teamBScore: 0 },
  ]);
  const [lastScorer, setLastScorer] = useState<LastScorer | null>(null);

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
      setLastScorer(null);
    }
  };

  // Update score also records last scorer
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

    setLastScorer({ team, points });
  };

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setScoreHistory([{ teamAScore: 0, teamBScore: 0 }]);
    setLastScorer(null);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -1,
          }}
          title="Buckets Scoreboard"
        />
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
        {/* Container for the scorecard */}
        <View style={styles.scoreCardContainer}>
          <ScoreCard
            scoreA={teamAScore}
            scoreB={teamBScore}
            updateScore={updateScore}
          />
        </View>

        {/* Container for displaying the last scorer information */}
        <Surface
          style={[
            styles.infoContainer,
            { backgroundColor: theme.colors.elevation.level1 },
          ]}
          elevation={1}
        >
          <Text style={styles.lastScorerText}>
            {lastScorer ? (
              <>
                Last Scorer: Team {lastScorer.team} scored (
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: "SpaceGrotesk_600SemiBold",
                  }}
                >
                  +{lastScorer.points}
                </Text>
                )
              </>
            ) : (
              "No score yet"
            )}
          </Text>
        </Surface>

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
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  scoreCardContainer: {
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    alignSelf: "center",
    borderRadius: 12,
  },
  lastScorerText: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: "SpaceGrotesk_500Medium",
  },
});
