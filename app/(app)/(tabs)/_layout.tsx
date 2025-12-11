// app/(app)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { createContext, useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LiquidGlassTabBar } from "@layout";

interface ScrollContextType {
  isScrolling: boolean;
  setIsScrolling: (value: boolean) => void;
}

export const ScrollContext = createContext<ScrollContextType>({
  isScrolling: false,
  setIsScrolling: () => {},
});

export const useScrollContext = () => useContext(ScrollContext);

export default function TabsLayout() {
  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <ScrollContext.Provider value={{ isScrolling, setIsScrolling }}>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => <LiquidGlassTabBar {...props} isScrolling={isScrolling} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="salon" />
        <Tabs.Screen name="activity" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </ScrollContext.Provider>
  );
}