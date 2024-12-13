import { Tabs } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  View,
  TouchableOpacity,
} from "react-native";

import { icons } from "@/constants";
import { useMultiSelect } from "@/components/MultiSelectContext";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-general-300" : ""
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? "bg-general-400" : ""
      }`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

export default function Layout() {
  const { isMultiSelectMode } = useMultiSelect();

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: [{ translateX: -25 }],
          zIndex: 2,
        }}
      ></TouchableOpacity>

      <Tabs
        initialRouteName="overview"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#333333",
            borderRadius: 50,
            paddingBottom: 0,
            overflow: "hidden",
            marginHorizontal: 20,
            marginBottom: 20,
            height: 78,
            display: isMultiSelectMode ? "none" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="overview"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.home} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="management"
          options={{
            title: "Management",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.profile} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Rides",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.list} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.chat} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="tenants"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.profile} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
