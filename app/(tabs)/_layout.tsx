import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Define our own minimal types for the tab bar props
interface CustomTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<string, any>;
  navigation: {
    navigate: (name: string) => void;
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented: boolean };
  };
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const theme = useTheme();

  return (
    <BottomNavigation.Bar
      navigationState={state}
      onTabPress={({ route }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      }}
      renderIcon={({ route, focused }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return (
            <View style={styles.iconContainer}>
              {options.tabBarIcon({
                color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant,
                size: 24,
                focused,
              })}
            </View>
          );
        }
        return null;
      }}
      renderLabel={({ route, focused }) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        return (
          <Text
            style={[
              styles.labelText,
              {
                color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {label}
          </Text>
        );
      }}
      shifting={false}
      style={[
        styles.bottomNavigation,
        { backgroundColor: theme.colors.elevation.level2 },
      ]}
    />
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        // Use our custom tab bar
        tabBar={(props: CustomTabBarProps) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Scoreboard',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <MaterialCommunityIcons
                size={24}
                name={focused ? 'scoreboard' : 'scoreboard-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <MaterialCommunityIcons
                size={24}
                name={focused ? 'history' : 'history'}
                color={color}
              />
            ),
          }}
        />
                <Tabs.Screen
          name="categories"
          options={{
            title: 'Categories',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <MaterialCommunityIcons
                size={24}
                name={focused ? 'folder' : 'folder-outline'}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    borderTopWidth: 0,
    elevation: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_500Medium',
  },
});
