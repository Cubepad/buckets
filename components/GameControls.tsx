import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Portal, Dialog, Text, useTheme } from "react-native-paper";

interface GameControlsProps {
  onUndo: () => void;
  onNewGame: () => void;
  disableUndo: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onUndo, onNewGame, disableUndo }) => {
  const theme = useTheme();

  // Stopwatch state: starts at 0 and is not running by default.
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Update the stopwatch every second if it is running.
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format seconds into mm:ss format.
  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  // Toggle the timer between running and paused.
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // State and handlers for the New Game confirmation dialog.
  const [newGameDialogVisible, setNewGameDialogVisible] = useState(false);
  const showNewGameDialog = () => setNewGameDialogVisible(true);
  const hideNewGameDialog = () => setNewGameDialogVisible(false);
  const confirmNewGame = () => {
    onNewGame();
    setSeconds(0); // Reset the stopwatch.
    setIsRunning(false); // Pause the timer when a new game starts.
    hideNewGameDialog();
  };

  return (
    <View style={styles.container}>
      {/* Timer button that toggles pause/play and displays elapsed time */}
      <Button
        mode="contained"
        icon={isRunning ? "pause" : "play"}
        onPress={toggleTimer}
        style={styles.timerButton}
        contentStyle={styles.timerContent}
      >
        {formatTime(seconds)}
      </Button>
      <View style={styles.buttonRow}>
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
          icon="reload"
          mode="contained"
          style={styles.controlButton}
          onPress={showNewGameDialog}
        >
          New Game
        </Button>
      </View>
      <Portal>
        <Dialog visible={newGameDialogVisible} onDismiss={hideNewGameDialog}>
          <Dialog.Title style={{ fontFamily: "SpaceGrotesk_500Medium" }}>Confirm New Game</Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontFamily: "SpaceGrotesk_400Regular" }}>
              Are you sure you want to start a new game? All current scores will be lost.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideNewGameDialog}>Cancel</Button>
            <Button onPress={confirmNewGame}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 12,
    borderRadius: 16,
  },
  timerContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
  },
});

export default GameControls;
