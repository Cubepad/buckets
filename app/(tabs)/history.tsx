import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, List, Text, Button, useTheme, Appbar, Menu } from "react-native-paper";

const History = () => {
  const theme = useTheme();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

  return (
    <View  style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header>
        <Appbar.Content titleStyle={{ fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 24 }} title="History" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item onPress={() => {}} title="Settings" leadingIcon="cog" />
          <Menu.Item
            onPress={() => {}}
            title="Change Team Name"
            leadingIcon="rename-box"
          />
          <Menu.Item
            onPress={() => {}}
            title="About"
            leadingIcon="information"
          />
        </Menu>
      </Appbar.Header>

      {/* Placeholder for history items */}
      <View style={styles.historyList}>
        <List.Item
          title="Team A scored 1 point"
          description="At: 10:30 AM"
          left={(props) => <Text {...props}>🏀</Text>}
        />
        <List.Item
          title="Team B scored 2 points"
          description="At: 10:35 AM"
          left={(props) => <Text {...props}>🏀</Text>}
        />
        <List.Item
          title="Team A scored 3 points"
          description="At: 10:40 AM"
          left={(props) => <Text {...props}>🏀</Text>}
        />
      </View>

      {/* Clear History Button */}
      <Button
        mode="contained"
        onPress={() => {}}
        style={styles.clearButton}
      >
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
  },
  clearButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default History;
