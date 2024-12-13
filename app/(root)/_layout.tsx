import { Stack } from "expo-router";
import "react-native-reanimated";
import { MultiSelectProvider } from "@/components/MultiSelectContext";

const RootLayout = () => {
  return (
    <MultiSelectProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </MultiSelectProvider>
  );
};

export default RootLayout;
