import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme, Appbar, List } from "react-native-paper";
import { useRouter } from "expo-router";

const settingsItems = [
  {
    id: 1,
    title: "Team Names",
    description: "Set default names for Team A and Team B",
    icon: "account-group",
  },
  {
    id: 2,
    title: "Sound and Vibration",
    description: "Control feedback on score and end game",
    icon: "volume-high",
  },
  {
    id: 3,
    title: "Appearance",
    description: "Switch themes and customize team colors",
    icon: "palette",
  },
  {
    id: 4,
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
      <Appbar.Header
        style={[
          styles.header,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>

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
                  if (item.id === 1) router.push("/settings/notifications");
                  else if (item.id === 2) router.push("/settings/account");
                  else if (item.id === 3) router.push("/settings/privacy");
                  else if (item.id === 4) router.push("/settings/about");
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
