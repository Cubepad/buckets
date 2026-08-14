import React from "react";
import { StyleSheet, View, ScrollView } from "react-native"; // Added ScrollView
import { Button, useTheme, Appbar } from "react-native-paper";
import HistoryCard from "../../components/HistoryCard";

const History = () => {
  const theme = useTheme();

  // Example history data
  const historyData = [
    {
      team1: "Team A",
      team2: "Team B",
      score1: 21,
      score2: 32,
      date: "June 10, 2025",
      duration: "42:15",
    },
    {
      team1: "Team C",
      team2: "Team D",
      score1: 15,
      score2: 21,
      date: "June 9, 2025",
      duration: "38:40",
    },
    {
      team1: "Team E",
      team2: "Team F",
      score1: 21,
      score2: 19,
      date: "June 8, 2025",
      duration: "45:00",
    },
    // Adding more for scroll testing
    {
      team1: "Team G",
      team2: "Team H",
      score1: 11,
      score2: 21,
      date: "June 7, 2025",
      duration: "30:20",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.Content
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -1,
          }}
          title="History"
        />
      </Appbar.Header>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* History cards */}
        <View style={styles.historyList}>
          {historyData.map((item, index) => (
            <HistoryCard
              key={index}
              team1={item.team1}
              team2={item.team2}
              score1={item.score1}
              score2={item.score2}
              date={item.date}
              duration={item.duration}
            />
          ))}
        </View>

        {/* Clear History Button moved inside ScrollView so it's at the end of the list */}
        <Button 
          mode="contained" 
          onPress={() => {}} 
          style={styles.clearButton}
          contentStyle={{ paddingVertical: 6 }}
        >
          Clear History
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32, // Extra space at the bottom for breathing room
  },
  historyList: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  clearButton: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 20, // Bottom margin to prevent button from hugging the screen edge
  },
});

export default History;