import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Music, Search, User } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";

export default function TabLayout() {
  const { isDjMode } = useUserStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isDjMode ? "Request Queue" : "My Requests",
          tabBarIcon: ({ color }) => <Music size={24} color={color} />,
          tabBarLabel: isDjMode ? "Requests" : "My Requests",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Song Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          tabBarLabel: "Search",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isDjMode ? "DJ Profile" : "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}