import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Scoreboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: "scoreboard", selected: "scoreboard" }}
          sf={{ default: "sportscourt", selected: "sportscourt.fill" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: "history", selected: "history" }}
          sf={{ default: "clock", selected: "clock.fill" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="categories">
        <NativeTabs.Trigger.Label>Categories</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md={{ default: "folder", selected: "folder" }}
          sf={{ default: "folder", selected: "folder.fill" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
