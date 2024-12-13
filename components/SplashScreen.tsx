import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen: React.FC = () => {
  const logoOpacity = useSharedValue(0);
  const logoPositionX = useSharedValue(-150);
  const logoPositionY = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const gradientOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Set the initial background color and fade in the gradient
    gradientOpacity.value = withTiming(1, { duration: 800 });

    // 2. Slide in the logo from the left
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoPositionX.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    // 3. Fade in the text after a delay and bounce the logo upward
    const timeout = setTimeout(() => {
      textOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });

      // Bounce effect for logo
      logoPositionY.value = withSpring(-50, {
        damping: 2,
        stiffness: 100,
      });
    }, 1200);

    // Cleanup timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateX: logoPositionX.value },
      { translateY: logoPositionY.value },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#17BAFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Gradient Background */}
      <Animated.View
        style={[{ ...StyleSheet.absoluteFillObject }, gradientAnimatedStyle]}
      >
        <LinearGradient
          colors={["#17BAFF", "#D746DA", "#00C8FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Animated Logo */}
      <Animated.View
        style={[
          logoAnimatedStyle,
          {
            width: 128,
            height: 128,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          },
        ]}
      >
        <Image
          source={require("../assets/images/DormMate-removebg-preview.png")}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </Animated.View>

      {/* Animated Text in Center */}
      <Animated.View
        style={[
          textAnimatedStyle,
          {
            position: "absolute",
            top: "50%",
            transform: [{ translateY: -12 }],
          },
        ]}
      >
        <Text className="text-white text-4xl font-bold mt-10">DormMate</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
