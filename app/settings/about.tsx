import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Appbar, List, Surface, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

const About = () => {
  const theme = useTheme();
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level1 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="About"
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -0.75,
          }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <Text
          variant="headlineMedium"
          style={[styles.centerText, { color: theme.colors.onBackground }]}
        >
          Buckets
        </Text>
        <Text
          variant="bodyMedium"
          style={[
            styles.versionNumber,
            { color: theme.colors.onSurfaceVariant, marginTop: 4 },
          ]}
        >
          Version 1.0.0 (Demo)
        </Text>

        <View style={styles.sectionSpacing} />

        <Surface style={styles.contactItem} elevation={1}>
          <List.Item
            title="Developer"
            description="David Olaniyan"
            left={(props) => <List.Icon {...props} icon="account" />}
            titleStyle={styles.label}
            descriptionStyle={styles.value}
          />
        </Surface>

        <Surface style={styles.contactItem} elevation={1}>
          <List.Item
            title="Website"
            description="davidolaniyan.pages.dev"
            left={(props) => <List.Icon {...props} icon="web" />}
            onPress={() => openLink("https://davidolaniyan.pages.dev/")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
          />
        </Surface>

        <Surface style={styles.contactItem} elevation={1}>
          <List.Item
            title="GitHub"
            description="github.com/Cubepad/buckets"
            left={(props) => <List.Icon {...props} icon="github" />}
            onPress={() => openLink("https://github.com/Cubepad/buckets")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
          />
        </Surface>

        <Surface style={styles.contactItem} elevation={1}>
          <List.Item
            title="Email"
            description="davidolaniyan.dev@gmail.com"
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={() => openLink("mailto:davidolaniyan.dev@gmail.com")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
          />
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  centerText: {
    textAlign: "center",
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 36,
    letterSpacing: -0.75,
  },
  versionNumber: {
    textAlign: "center",
    fontFamily: "SpaceGrotesk_600SemiBold",
    letterSpacing: -0.5,
  },
  sectionSpacing: {
    height: 32,
  },
  contactItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  label: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontSize: 16,
  },
  value: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
  },
});

export default About;
