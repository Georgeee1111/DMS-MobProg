import { router } from "expo-router";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace("/(auth)/welcome");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
};

export default Home;
