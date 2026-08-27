import React from "react";
import { View, StyleSheet, Linking, ScrollView, Image } from "react-native";
import {
  Appbar,
  List,
  Surface,
  Text,
  useTheme,
  Divider,
} from "react-native-paper";
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
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction
          onPress={() => router.back()}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            marginLeft: 16,
          }}
        />
        <Appbar.Content
          title="About"
          titleStyle={{
            fontFamily: "SpaceGrotesk_600SemiBold",
            fontSize: 24,
            letterSpacing: -0.75,
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section with Logo */}
        <View style={styles.headerSection}>
          <Image
            source={require("../../assets/images/Buckets_Logo_adaptive.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text
            variant="headlineMedium"
            style={[styles.appName, { color: theme.colors.onBackground }]}
          >
            Buckets
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.versionNumber,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Version 1.0.0 (Alpha)
          </Text>
        </View>

        {/* Links & Info Section */}
        <Surface style={styles.cardGroup} elevation={1}>
          <List.Item
            title="Developer"
            description="David Olaniyan"
            left={(props) => <List.Icon {...props} icon="account" />}
            titleStyle={styles.label}
            descriptionStyle={styles.value}
          />
          <Divider />

          <List.Item
            title="Website"
            description="davidolaniyan.com"
            left={(props) => <List.Icon {...props} icon="web" />}
            onPress={() => openLink("https://davidolaniyan.com/")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
            right={(props) => (
              <List.Icon
                {...props}
                icon="open-in-new"
                color={theme.colors.onSurfaceVariant}
              />
            )}
          />
          <Divider />

          <List.Item
            title="GitHub"
            description="github.com/Cubepad/buckets"
            left={(props) => <List.Icon {...props} icon="github" />}
            onPress={() => openLink("https://github.com/Cubepad/buckets")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
            right={(props) => (
              <List.Icon
                {...props}
                icon="open-in-new"
                color={theme.colors.onSurfaceVariant}
              />
            )}
          />
          <Divider />

          <List.Item
            title="Email"
            description="davideniola108@gmail.com"
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={() => openLink("mailto:davideniola108@gmail.com")}
            titleStyle={styles.label}
            descriptionStyle={[styles.value, { color: theme.colors.primary }]}
            right={(props) => (
              <List.Icon
                {...props}
                icon="open-in-new"
                color={theme.colors.onSurfaceVariant}
              />
            )}
          />
        </Surface>

        {/* Footer */}
        <Text
          style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}
        >
          © {new Date().getFullYear()} David Olaniyan
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 24,
    marginBottom: 16,
  },
  appName: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 32,
    letterSpacing: -0.75,
    marginBottom: 4,
  },
  versionNumber: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    letterSpacing: -0.5,
  },
  cardGroup: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  label: {
    fontFamily: "SpaceGrotesk_500Medium",
    fontSize: 16,
  },
  value: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
  },
  footerText: {
    textAlign: "center",
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    opacity: 0.7,
  },
});

export default About;
