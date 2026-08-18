import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { BottomNavigation, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();

  return (
    <BottomNavigation.Bar
      navigationState={state}
      activeColor={theme.colors.onPrimaryContainer}
      inactiveColor={theme.colors.onSurfaceVariant}
      activeIndicatorStyle={{
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 18,
      }}
      shifting={true}
      compact={false}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({
          color,
          size: 24,
          focused,
        }) ?? null
      }
      // Replaces labelStyle with renderLabel to preserve typography and animated color
      renderLabel={({ route, color }) => (
        <Text style={[styles.labelText, { color }]}>
          {descriptors[route.key].options.title ?? route.name}
        </Text>
      )}
    />
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scoreboard",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={24}
              name={focused ? "scoreboard" : "scoreboard-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={24} name="history" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={24}
              name={focused ? "folder" : "folder-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "SpaceGrotesk_500Medium",
  },
});
