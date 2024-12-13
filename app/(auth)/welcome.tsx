import "../../global.css";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import React from "react";

const Home = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white relative">
      {/* Conditionally render the Skip button only on the first slide */}
      {activeIndex === 0 && (
        <TouchableOpacity
          onPress={() => {
            // router.replace("/(auth)/sign-up");
            router.replace("/(root)/(tabs)/overview");
          }}
          className="w-full flex justify-end items-end p-5"
        >
          <Text className="text-black text-md font-JakartaBold">Skip</Text>
        </TouchableOpacity>
      )}

      <Swiper
        ref={swiperRef}
        loop={false}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item, index) => (
          <View
            key={item.id}
            className="flex items-center justify-center p-5 h-full"
          >
            {/* Content for the first slide */}
            {index === 0 && (
              <>
                <Text className="text-2xl text-center">
                  <Text className="text-2xl">Simplify your life with </Text>
                  <Text className="text-2xl font-bold">Dorm</Text>
                  <Text className="text-2xl italic">Mate</Text>
                </Text>
                <Image
                  source={item.image}
                  className="w-full h-[300px]"
                  resizeMode="contain"
                />
                <View className="flex flex-row items-center justify-center w-full mt-10">
                  <Text className="text-black text-3xl font-bold mx-10 text-center">
                    {item.title}
                  </Text>
                </View>
                <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
                  {item.description}
                </Text>
              </>
            )}

            {index === 1 && item.features && (
              <View className="flex flex-row items-start w-full mt-5">
                <View className="flex flex-col mr-5">
                  <Text className="text-3xl font-bold mb-10">Features</Text>
                  {item.features.map((feature, idx) => (
                    <View
                      key={idx}
                      className="flex flex-row items-center mb-10 max-w-[90%]"
                    >
                      <Image source={feature.icon} className="w-14 h-14 mr-2" />
                      <View>
                        <Text className="font-semibold text-[1.5rem] mb-2">
                          {feature.title}
                        </Text>
                        <Text className="text-[0.9rem] text-[#858585]">
                          {feature.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View className="flex-1">
                  <Text className="text-black text-3xl font-bold text-center">
                    {item.title}
                  </Text>
                  <View className="mt-3 mx-5 max-w-[30%]">
                    <Text
                      className="text-md font-JakartaSemiBold text-center text-[#858585]"
                      style={{ lineHeight: 1.5 }}
                    >
                      {item.description}{" "}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Content for the third slide */}
            {index === 2 && (
              <>
                <Image
                  source={item.image}
                  className="w-full h-[300px]"
                  resizeMode="contain"
                />
                <View className="flex flex-row items-center justify-center w-full mt-10">
                  <Text className="text-[#858585] text-[1.3rem] font-semibold mx-10 text-center">
                    {item.description}
                  </Text>
                </View>
                <Text className="text-3xl font-JakartaSemiBold text-center text-black mx-10 mt-5">
                  {item.title}
                </Text>
              </>
            )}
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Home;
