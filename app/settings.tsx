import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme, Appbar, List } from "react-native-paper";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

const settingsItems = [
  {
    id: 1,
    title: "Team Names",
    description: "Set default names for Team A and Team B",
    icon: "account-group",
  },
  {
    id: 2,
    title: "Vibration & Haptics",
    description: "Control feedback on score and end game",
    icon: "vibrate",
  },
  {
    id: 3,
    title: "Appearance",
    description: "Switch themes and customize team colors",
    icon: "palette",
  },
  {
    id: 4,
    title: "Gameplay",
    description: "Timer and score defaults for match flow",
    icon: "basketball",
  },
  {
    id: 5,
    title: "Data & Reset",
    description: "Reset history or restore default app settings",
    icon: "database-refresh",
  },
  {
    id: 6,
    title: "About",
    description: "App version and feedback",
    icon: "information-outline",
  },
];

const Settings = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background, }}>
        <Appbar.BackAction
          onPress={() => router.back()}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginLeft: 16, 
          }}
        />
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <ScrollView
        alwaysBounceVertical={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <List.Section style={styles.listSection}>
          {settingsItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === settingsItems.length - 1;

            const borderRadiusStyle = {
              borderTopLeftRadius: isFirst ? 20 : 4,
              borderTopRightRadius: isFirst ? 20 : 4,
              borderBottomLeftRadius: isLast ? 20 : 4,
              borderBottomRightRadius: isLast ? 20 : 4,
            };

            return (
              <View
                key={item.id}
                style={[
                  borderRadiusStyle,
                  {
                    backgroundColor: theme.colors.elevation.level2,
                    overflow: "hidden",
                    marginBottom: 3,
                  },
                ]}
              >
                <List.Item
                  title={item.title}
                  description={item.description}
                  left={(props) => (
                    <View style={styles.iconWrapper}>
                      <List.Icon {...props} icon={item.icon} />
                    </View>
                  )}
                  onPress={() => {
                    Haptics.selectionAsync();
                    if (item.id === 1) router.push("/settings/teams");
                    else if (item.id === 2) router.push("/settings/sound");
                    else if (item.id === 3) router.push("/settings/appearance");
                    else if (item.id === 4) router.push("/settings/game");
                    else if (item.id === 5) router.push("/settings/data");
                    else if (item.id === 6) router.push("/settings/about");
                  }}
                  style={{ backgroundColor: "transparent" }}
                  titleStyle={[
                    styles.cardTitle,
                    { color: theme.colors.onSurface },
                  ]}
                  descriptionStyle={[
                    styles.cardDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                />
              </View>
            );
          })}
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
  },
  headerTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 24,
    letterSpacing: -0.75,
  },
  listSection: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "SpaceGrotesk_500Medium",
    letterSpacing: -0.75,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    marginTop: 2,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default Settings;
