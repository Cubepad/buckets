import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Portal,
  Dialog,
  Text,
  useTheme,
  Snackbar,
} from "react-native-paper";

interface GameControlsProps {
  onUndo: () => void;
  onNewGame: () => void;
  onSaveGame: (payload: {
    duration: string;
    scoreA: number;
    scoreB: number;
    teamAName: string;
    teamBName: string;
    categoryId: string;
    categoryName: string;
  }) => void;
  disableUndo: boolean;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  categoryId: string;
  categoryName: string;
  seconds: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onNewGame,
  onSaveGame,
  disableUndo,
  teamAName,
  teamBName,
  scoreA,
  scoreB,
  categoryId,
  categoryName,
  seconds,
  isRunning,
  onToggleTimer,
  onResetTimer,
}) => {
  const theme = useTheme();

  const [newGameDialogVisible, setNewGameDialogVisible] = useState(false);
  const [saveToastVisible, setSaveToastVisible] = useState(false);

  useEffect(() => {
    if (!saveToastVisible) return;
    const timeout = setTimeout(() => setSaveToastVisible(false), 1800);
    return () => clearTimeout(timeout);
  }, [saveToastVisible]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  const showNewGameDialog = () => setNewGameDialogVisible(true);
  const hideNewGameDialog = () => setNewGameDialogVisible(false);
  const confirmNewGame = () => {
    onNewGame();
    onResetTimer();
    hideNewGameDialog();
  };

  const handleSaveGame = () => {
    onSaveGame({
      duration: formatTime(seconds),
      scoreA,
      scoreB,
      teamAName,
      teamBName,
      categoryId,
      categoryName,
    });
    setSaveToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon={isRunning ? "pause" : "play"}
        onPress={onToggleTimer}
        style={styles.timerButton}
        contentStyle={styles.timerContent}
        labelStyle={styles.timerLabel}
      >
        {formatTime(seconds)}
      </Button>

      <View style={styles.topRow}>
        <Button
          icon="undo"
          mode="outlined"
          style={styles.controlButton}
          onPress={onUndo}
          disabled={disableUndo}
        >
          Undo
        </Button>
        <Button
          icon="content-save"
          mode="contained-tonal"
          style={styles.controlButton}
          onPress={handleSaveGame}
        >
          Save
        </Button>
      </View>

      <View style={styles.bottomRow}>
        <Button
          icon="reload"
          mode="contained"
          style={styles.newGameButton}
          labelStyle={styles.newGameLabel}
          onPress={showNewGameDialog}
        >
          New Game
        </Button>
      </View>
      <Portal>
        <Dialog visible={newGameDialogVisible} onDismiss={hideNewGameDialog}>
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>
            Confirm New Game
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_400Regular",
                color: theme.colors.onSurface,
              }}
            >
              Are you sure you want to start a new game? All current scores will
              be lost.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideNewGameDialog}>Cancel</Button>
            <Button onPress={confirmNewGame}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={saveToastVisible}
        onDismiss={() => setSaveToastVisible(false)}
        duration={1800}
        style={{ backgroundColor: theme.colors.primary }}
      >
        Game saved to history
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timerButton: {
    marginBottom: 8,
    borderRadius: 16,
    width: "95%",
  },
  timerContent: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  timerLabel: {
    fontFamily: "SpaceGrotesk_700Bold",
    fontSize: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    gap: 8,
    marginBottom: 8,
  },
  bottomRow: {
    width: "95%",
  },
  controlButton: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
  },
  newGameButton: {
    width: "100%",
    borderRadius: 16,
  },
  newGameLabel: {
    fontFamily: "SpaceGrotesk_700Bold",
  },
});

export default GameControls;
