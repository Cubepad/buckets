import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing, Pressable } from "react-native";
import {
  Button,
  Text,
  Card,
  useTheme,
  ProgressBar,
  Dialog,
  Portal,
  Chip,
  TextInput,
} from "react-native-paper";
import { MAX_TEAM_NAME_LENGTH } from "../utils/gameHistory";
import { triggerFeedback } from "../utils/appSettings";

interface ScoreCardProps {
  scoreA: number;
  scoreB: number;
  teamAName: string;
  teamBName: string;
  showEditHints?: boolean;
  showProgress?: boolean;
  onTeamNameChange: (team: "A" | "B", value: string) => void;
  updateScore: (team: "A" | "B", points: number) => void;
  onGameActivity: () => void;
  style?: object;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  scoreA,
  scoreB,
  teamAName,
  teamBName,
  showEditHints = true,
  showProgress = true,
  onTeamNameChange,
  updateScore,
  onGameActivity,
  style,
}) => {
  const theme = useTheme();
  const [popValueA] = useState(new Animated.Value(0));
  const [popValueB] = useState(new Animated.Value(0));
  const [borderColor] = useState(new Animated.Value(0));
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<"A" | "B">("A");
  const [draftName, setDraftName] = useState(teamAName);
  const prevScoreA = useRef(scoreA);
  const prevScoreB = useRef(scoreB);

  useEffect(() => {
    setDraftName(editingTeam === "A" ? teamAName : teamBName);
  }, [editingTeam, teamAName, teamBName]);

  const animatePop = (
    valueHolder: Animated.Value,
    direction: "up" | "down"
  ) => {
    const startValue = direction === "up" ? 30 : -30;
    valueHolder.setValue(startValue);
    Animated.timing(valueHolder, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const changeBorderColor = () => {
    Animated.timing(borderColor, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(borderColor, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }, 600);
  };

  useEffect(() => {
    let scoreChanged = false;

    if (scoreA !== prevScoreA.current) {
      animatePop(popValueA, scoreA > prevScoreA.current ? "up" : "down");
      prevScoreA.current = scoreA;
      scoreChanged = true;
    }

    if (scoreB !== prevScoreB.current) {
      animatePop(popValueB, scoreB > prevScoreB.current ? "up" : "down");
      prevScoreB.current = scoreB;
      scoreChanged = true;
    }

    if (scoreChanged) {
      changeBorderColor();
    }
  }, [scoreA, scoreB]);

  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.elevation.level1, theme.colors.primary],
  });

  const totalPoints = scoreA + scoreB;
  const progressValue =
    totalPoints > 0
      ? scoreA >= scoreB
        ? scoreA / totalPoints
        : scoreB / totalPoints
      : 0.5;

  const openRenameDialog = async (team: "A" | "B") => {
    onGameActivity();
    await triggerFeedback("selection");
    setEditingTeam(team);
    setDraftName(team === "A" ? teamAName : teamBName);
    setRenameDialogOpen(true);
  };

  const confirmRename = () => {
    const nextValue =
      draftName.trim() || (editingTeam === "A" ? "Team A" : "Team B");
    onTeamNameChange(editingTeam, nextValue);
    setRenameDialogOpen(false);
  };

  const scoreButtonPress = async (team: "A" | "B", points: number) => {
    onGameActivity();
    await triggerFeedback(points >= 3 ? "heavy" : "medium");
    updateScore(team, points);
  };

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: interpolatedBorderColor,
          borderWidth: 2,
          backgroundColor: theme.colors.elevation.level1,
        },
        style,
      ]}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.teamNamesContainer}>
          <Pressable
            onPress={() => openRenameDialog("A")}
            style={styles.teamBlock}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.teamNameText,
                {
                  color: theme.colors.onSurface,
                  fontFamily: "SpaceGrotesk_500Medium",
                },
              ]}
            >
              {teamAName}
            </Text>
            {showEditHints ? (
              <Chip compact mode="outlined" style={styles.editChip}>
                Edit
              </Chip>
            ) : null}
          </Pressable>

          <Pressable
            onPress={() => openRenameDialog("B")}
            style={styles.teamBlock}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.teamNameText,
                {
                  color: theme.colors.onSurface,
                  fontFamily: "SpaceGrotesk_500Medium",
                },
              ]}
            >
              {teamBName}
            </Text>
            {showEditHints ? (
              <Chip compact mode="outlined" style={styles.editChip}>
                Edit
              </Chip>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreDisplayRow}>
            <Animated.Text
              style={[
                styles.scoreDigit,
                { color: theme.colors.primary },
                { transform: [{ translateY: popValueA }] },
              ]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {scoreA}
            </Animated.Text>

            <Text
              style={[styles.scoreSeparator, { color: theme.colors.outline }]}
            >
              -
            </Text>

            <Animated.Text
              style={[
                styles.scoreDigit,
                { color: theme.colors.primary },
                { transform: [{ translateY: popValueB }] },
              ]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {scoreB}
            </Animated.Text>
          </View>
        </View>

        {showProgress ? (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progressValue}
              color={theme.colors.primary}
              style={[
                styles.progressBar,
                scoreA < scoreB && { transform: [{ scaleX: -1 }] },
              ]}
              fillStyle={{ borderRadius: 6 }}
            />
          </View>
        ) : null}

        <View style={styles.buttonArea}>
          <View style={styles.teamButtonColumn}>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("A", 1)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +1 Point
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("A", 2)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +2 Points
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("A", 3)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +3 Points
            </Button>
          </View>

          <View style={styles.teamButtonColumn}>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("B", 1)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +1 Point
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("B", 2)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +2 Points
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => void scoreButtonPress("B", 3)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +3 Points
            </Button>
          </View>
        </View>
      </Card.Content>

      <Portal>
        <Dialog
          visible={renameDialogOpen}
          onDismiss={() => setRenameDialogOpen(false)}
        >
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            Rename {editingTeam === "A" ? "Team A" : "Team B"}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              label={editingTeam === "A" ? "Team A name" : "Team B name"}
              maxLength={MAX_TEAM_NAME_LENGTH}
              mode="outlined"
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text
              style={{
                marginTop: 8,
                textAlign: "right",
                color: theme.colors.onSurfaceVariant,
                fontFamily: "SpaceGrotesk_500Medium",
              }}
            >
              {draftName.length}/{MAX_TEAM_NAME_LENGTH}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button onPress={confirmRename}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    minHeight: 380,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  teamNamesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "115%",
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  teamBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  compactTeamBlock: {
    paddingVertical: 4,
  },
  compactCard: {
    minHeight: 280,
  },
  compactCardContent: {
    paddingVertical: 6,
  },
  teamNameText: {
    fontSize: 22,
    textAlign: "center",
    maxWidth: "100%",
  },
  editChip: {
    marginTop: 6,
  },
  scoreContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
  },
  compactScoreContainer: {
    marginTop: 4,
  },
  scoreDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scoreDigit: {
    fontSize: 85,
    textAlign: "center",
    paddingHorizontal: 5,
    fontFamily: "SpaceGrotesk_700Bold",
    minWidth: 160,
  },
  scoreSeparator: {
    fontSize: 50,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlign: "center",
    lineHeight: 90,
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 25,
  },
  teamButtonColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    width: "46%",
  },
  scoreButton: {
    width: "100%",
    borderRadius: 14,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default ScoreCard;
