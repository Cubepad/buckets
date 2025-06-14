import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme, Appbar, Menu } from "react-native-paper";
import HistoryCard from "../../components/HistoryCard";

const History = () => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Example history data
  const historyData = [
    {
      team1: "Team A",
      team2: "Team B",
      score1: 21,
      score2: 32,
      date: "June 10, 2025",
    },
    {
      team1: "Team C",
      team2: "Team D",
      score1: 15,
      score2: 21,
      date: "June 9, 2025",
    },
    {
      team1: "Team E",
      team2: "Team F",
      score1: 21,
      score2: 19,
      date: "June 8, 2025",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.Content
          titleStyle={{ fontFamily: "SpaceGrotesk_600SemiBold", fontSize: 24, letterSpacing: -1, }}
          title="History"
        />
      </Appbar.Header>

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
          />
        ))}
      </View>

      {/* Clear History Button */}
      <Button mode="contained" onPress={() => {}} style={styles.clearButton}>
        Clear History
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  historyList: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  clearButton: {
    marginTop: 20,
    marginHorizontal: 16,
    alignSelf: "center",
  },
  appBarMenu: {
    borderRadius: 12,
  },
});

export default History;
