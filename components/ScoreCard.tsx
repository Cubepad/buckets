import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Button, Text, Card, useTheme, ProgressBar } from "react-native-paper";

interface ScoreCardProps {
  scoreA: number;
  scoreB: number;
  updateScore: (team: "A" | "B", points: number) => void;
  style?: object;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  scoreA,
  scoreB,
  updateScore,
  style,
}) => {
  const theme = useTheme();
  // Separate animated values for each score's pop effect
  const [popValueA] = useState(new Animated.Value(0));
  const [popValueB] = useState(new Animated.Value(0));
  const [borderColor] = useState(new Animated.Value(0));
  const prevScoreA = useRef(scoreA);
  const prevScoreB = useRef(scoreB);

  // Reusable animation function for pop effect
  const animatePop = (
    valueHolder: Animated.Value,
    direction: "up" | "down"
  ) => {
    const startValue = direction === "up" ? 30 : -30; // Start below for 'up', above for 'down'
    valueHolder.setValue(startValue);
    Animated.timing(valueHolder, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  // Border color flash animation
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

  // Effect to trigger animations on score changes
  useEffect(() => {
    let scoreChanged = false;

    // Check Team A score change
    if (scoreA !== prevScoreA.current) {
      animatePop(popValueA, scoreA > prevScoreA.current ? "up" : "down");
      prevScoreA.current = scoreA;
      scoreChanged = true;
    }

    // Check Team B score change
    if (scoreB !== prevScoreB.current) {
      animatePop(popValueB, scoreB > prevScoreB.current ? "up" : "down");
      prevScoreB.current = scoreB;
      scoreChanged = true;
    }

    // Trigger border flash if any score changed
    if (scoreChanged) {
      changeBorderColor();
    }
  }, [scoreA, scoreB]); // Depend on both scores

  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.elevation.level1, theme.colors.primary],
  });

  // Compute the progress bar value and handle flip based on leading team.
  const totalPoints = scoreA + scoreB;
  const progressValue =
    totalPoints > 0 ? (scoreA >= scoreB ? scoreA / totalPoints : scoreB / totalPoints) : 0.5;

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
        {/* Team Names Container */}
        <View style={styles.teamNamesContainer}>
          <Text style={[styles.teamNameText, { color: theme.colors.onSurface, fontFamily: "SpaceGrotesk_500Medium" }]}>
            Team A
          </Text>
          <Text style={[styles.teamNameText, { color: theme.colors.onSurface, fontFamily: "SpaceGrotesk_500Medium" }]}>
            Team B
          </Text>
        </View>

        {/* Score Display Area - Using Row Layout for Individual Animation */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreDisplayRow}>
            {/* Animated Score A */}
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

            {/* Separator */}
            <Text style={[styles.scoreSeparator, { color: theme.colors.outline }]}>
              -
            </Text>

            {/* Animated Score B */}
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

        {/* New Progress Bar added under the score display */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progressValue}
            color={theme.colors.primary}
            style={[
              styles.progressBar,
              // If Team B is leading, flip the progress bar to fill from right.
              scoreA < scoreB && { transform: [{ scaleX: -1 }] },
            ]}
            fillStyle={{ borderRadius: 6 }}
          />
        </View>

        {/* Button Area - Two Columns */}
        <View style={styles.buttonArea}>
          {/* Team A Buttons */}
          <View style={styles.teamButtonColumn}>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("A", 1)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +1 Point
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("A", 2)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +2 Points
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("A", 3)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +3 Points
            </Button>
          </View>

          {/* Team B Buttons */}
          <View style={styles.teamButtonColumn}>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("B", 1)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +1 Point
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("B", 2)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +2 Points
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => updateScore("B", 3)}
              style={styles.scoreButton}
              labelStyle={styles.buttonLabel}
            >
              +3 Points
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    minHeight: 380, // Slightly increased minHeight for better spacing
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
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  teamNameText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  scoreContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
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
