import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Appbar, Menu, Text, useTheme, Surface } from "react-native-paper";
import { useRouter } from "expo-router";
import ScoreCard from "../../components/ScoreCard";
import GameControls from "../../components/GameControls";
import {
  createSavedGame,
  DEFAULT_CATEGORIES,
  GameCategory,
  getTeamDisplayName,
  loadCategories,
  loadSavedGames,
  persistSavedGames,
  SavedGame,
  ScoreLogEntry,
} from "../../utils/gameHistory";

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
  const router = useRouter();

  const [teamAName, setTeamAName] = useState<string>("Team A");
  const [teamBName, setTeamBName] = useState<string>("Team B");
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([
    { teamAScore: 0, teamBScore: 0 },
  ]);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [scoreLog, setScoreLog] = useState<ScoreLogEntry[]>([]);
  const [lastScorer, setLastScorer] = useState<LastScorer | null>(null);
  const [gameCategories, setGameCategories] =
    useState<GameCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    DEFAULT_CATEGORIES[0].id
  );
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const games = await loadSavedGames();
      const categories = await loadCategories();
      setSavedGames(games);
      setGameCategories(categories);
      if (categories.length > 0) {
        setSelectedCategoryId(categories[0].id);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const resetTimer = () => {
    setSeconds(0);
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const undoLastAction = () => {
    if (scoreHistory.length > 1) {
      const previousStateIndex = scoreHistory.length - 2;
      const lastScores = scoreHistory[previousStateIndex];
      setTeamAScore(lastScores.teamAScore);
      setTeamBScore(lastScores.teamBScore);
      setScoreHistory((prevHistory) => prevHistory.slice(0, -1));
      setScoreLog((prevLog) => prevLog.slice(0, -1));
      setLastScorer(null);
    }
  };

  const updateScore = (team: "A" | "B", points: number): void => {
    startTimer();
    const nextTeamAScore = team === "A" ? teamAScore + points : teamAScore;
    const nextTeamBScore = team === "B" ? teamBScore + points : teamBScore;

    const timestampEntry: ScoreLogEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      team,
      points,
      timestamp: new Date().toISOString(),
      elapsedSeconds: seconds,
    };

    setScoreHistory((prevHistory) => [
      ...prevHistory,
      { teamAScore: nextTeamAScore, teamBScore: nextTeamBScore },
    ]);
    setScoreLog((prevLog) => [...prevLog, timestampEntry]);

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
    setScoreLog([]);
    setLastScorer(null);
    resetTimer();
  };

  const handleTeamNameChange = (team: "A" | "B", value: string) => {
    const nextValue = getTeamDisplayName(value, team);
    if (team === "A") {
      setTeamAName(nextValue);
    } else {
      setTeamBName(nextValue);
    }
  };

  const handleSaveGame = async ({
    duration,
    scoreA,
    scoreB,
    teamAName: savedTeamAName,
    teamBName: savedTeamBName,
    categoryId,
    categoryName,
  }: {
    duration: string;
    scoreA: number;
    scoreB: number;
    teamAName: string;
    teamBName: string;
    categoryId: string;
    categoryName: string;
  }) => {
    const currentGames = await loadSavedGames();
    const nextSave = createSavedGame({
      teamAName: savedTeamAName,
      teamBName: savedTeamBName,
      scoreA,
      scoreB,
      duration,
      categoryId,
      categoryName,
      scoreLog,
    });

    const nextGames = [nextSave, ...currentGames];
    setSavedGames(nextGames);
    await persistSavedGames(nextGames);
  };

  const selectedCategory =
    gameCategories.find((category) => category.id === selectedCategoryId) ??
    gameCategories[0];

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
          contentStyle={styles.appBarMenu}
        >
          <Menu.Item
            title="Settings"
            leadingIcon="cog"
            onPress={() => {
              closeMenu();
              router.push("/settings");
            }}
          />
          <Menu.Item
            onPress={closeMenu}
            title="Change Team Name"
            leadingIcon="rename-box"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/settings/about");
            }}
            title="About"
            leadingIcon="information"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        alwaysBounceVertical={false}
      >
        <View style={styles.scoreCardContainer}>
          <ScoreCard
            scoreA={teamAScore}
            scoreB={teamBScore}
            teamAName={teamAName}
            teamBName={teamBName}
            onTeamNameChange={handleTeamNameChange}
            updateScore={updateScore}
            onGameActivity={startTimer}
          />
        </View>

        <Text
          variant="titleMedium"
          style={{
            marginLeft: 16,
            marginBottom: 8,
            marginTop: 16,
            fontFamily: "SpaceGrotesk_700Bold",
            color: theme.colors.onBackground,
          }}
        >
          Game Log:
        </Text>

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
                    fontFamily: "SpaceGrotesk_700Bold",
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

        <GameControls
          onUndo={undoLastAction}
          onNewGame={resetGame}
          onSaveGame={handleSaveGame}
          disableUndo={scoreHistory.length <= 1}
          teamAName={teamAName}
          teamBName={teamBName}
          scoreA={teamAScore}
          scoreB={teamBScore}
          categoryId={selectedCategoryId}
          categoryName={selectedCategory?.name ?? "Pickup Games"}
          seconds={seconds}
          isRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  scoreCardContainer: {
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    alignSelf: "center",
    borderRadius: 16,
  },
  lastScorerText: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: "SpaceGrotesk_500Medium",
  },
  appBarMenu: {
    borderRadius: 12,
  },
});
