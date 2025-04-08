import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Button, Text, Card, useTheme } from "react-native-paper"; // Removed Surface for this version

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
    }, 600); // Keep flash visible slightly longer
  };

  // Effect to trigger animations on score changes
  useEffect(() => {
    let scoreChanged = false;

    // Check Team A score change
    if (scoreA !== prevScoreA.current) {
      animatePop(popValueA, scoreA > prevScoreA.current ? "up" : "down");
      prevScoreA.current = scoreA;
      scoreChanged = true;
    } else {
      // Ensure value is reset if it didn't change (handles potential race conditions/re-renders)
      // Note: This might cause a slight flicker if an animation was mid-flight on re-render,
      // but is generally safer for ensuring non-changed scores aren't offset.
      // Consider removing if flicker is observed and unwanted.
      // popValueA.setValue(0);
    }

    // Check Team B score change
    if (scoreB !== prevScoreB.current) {
      animatePop(popValueB, scoreB > prevScoreB.current ? "up" : "down");
      prevScoreB.current = scoreB;
      scoreChanged = true;
    } else {
      // Similar reset logic for B
      // popValueB.setValue(0);
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

  return (
    <Card
      style={[
        styles.card,
        { borderColor: interpolatedBorderColor, borderWidth: 2 },
        style,
      ]}
    >
      <Card.Content style={styles.cardContent}>
        {/* Team Names Container */}
        <View style={styles.teamNamesContainer}>
          <Text style={[styles.teamNameText, { color: theme.colors.onSurface, fontFamily: 'Manrope_500Medium' }]}>
            Team A
          </Text>
          <Text style={[styles.teamNameText, { color: theme.colors.onSurface, fontFamily: 'Manrope_500Medium'  }]}>
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
                { color: theme.colors.primary,  },
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
    borderRadius: 24,
    minHeight: 380, // Slightly increased minHeight for better spacing
    marginHorizontal: 4, // Add back small horizontal margin if needed within parent
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16, // Increased horizontal padding
    paddingVertical: 20, // Increased vertical padding
    justifyContent: "space-between",
  },
  teamNamesContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Space out names
    width: "115%", // Control width to align roughly above scores
    marginBottom: 8, // Space between names and score
    paddingHorizontal: 10, // Padding within the name container
  },
  teamNameText: {
    fontSize: 22, // Slightly smaller than original headline
    fontWeight: "600",
    textAlign: "center",
    flex: 1, // Allow names to take space
  },
  scoreContainer: {
    width: "100%",
    alignItems: "center", // Center the scoreDisplayRow
    justifyContent: "center",
    paddingVertical: 15, // Adjusted padding
    // No flex: 1 here, let it size naturally based on content + padding
  },
  scoreDisplayRow: { // The row holding the two scores and the dash
    flexDirection: "row",
    alignItems: "center", // Vertically align digits and dash
    justifyContent: 'center', // Horizontally center the items in the row
    width: "100%", // Take full width to ensure centering works
  },
  scoreDigit: {
    fontSize: 85, // Slightly larger font size for score
    textAlign: "center", // Center text within its own Animated.Text boundary
    paddingHorizontal: 5, // Small padding around digits
    fontFamily: "SpaceGrotesk_700Bold", // Ensure bold font is used
    minWidth: 160, // Minimum width to prevent layout shifts
  },
  scoreSeparator: {
    fontSize: 50, // Smaller font size for the dash
    fontWeight: "bold",
    marginHorizontal: 10, // Space around the dash
    textAlign: "center",
    lineHeight: 90, // Try to vertically align dash better with large numbers
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start", // Keep alignment to top
    width: "100%",
    marginTop: 25, // Increased space above buttons
    paddingHorizontal: 5, // Add padding to prevent buttons touching edges if card shrinks
  },
  teamButtonColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 14, // Increased gap between buttons
    width: "46%", // Adjusted width for columns
  },
  scoreButton: {
    width: "100%",
    paddingVertical: 4, // Add some vertical padding to buttons
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default ScoreCard;