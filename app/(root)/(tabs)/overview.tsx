import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RoomStat } from "@/app/model/RoomStat";

const RoomAnalytics = () => {
  const [data, setData] = useState<RoomStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRooms, setTotalRooms] = useState(0);
  const [currentTenants, setCurrentTenants] = useState(0);

  const getRoomStats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://192.168.1.8:8000/api/room-statistics",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const roomStats = response.data;
      const totalRoomsCount =
        roomStats.occupied + roomStats.vacant + roomStats.maintenance;
      setTotalRooms(totalRoomsCount);

      setCurrentTenants(roomStats.occupied);

      const occupiedPercentage = (
        (roomStats.occupied / totalRoomsCount) *
        100
      ).toFixed(1);
      const vacantPercentage = (
        (roomStats.vacant / totalRoomsCount) *
        100
      ).toFixed(1);
      const maintenancePercentage = (
        (roomStats.maintenance / totalRoomsCount) *
        100
      ).toFixed(1);

      setData([
        {
          name: `Occupied\n${occupiedPercentage}%`,
          population: roomStats.occupied,
          color: "rgba(255, 99, 132, 0.6)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: `Vacant\n${vacantPercentage}%`,
          population: roomStats.vacant,
          color: "rgba(54, 162, 235, 0.6)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
        {
          name: `Under Maintenance\n${maintenancePercentage}%`,
          population: roomStats.maintenance,
          color: "rgba(255, 206, 86, 0.6)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        },
      ]);
    } catch (error) {
      setError("Failed to fetch room statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoomStats();

    const intervalId = setInterval(getRoomStats, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View className="p-4 flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 mt-[2rem]"
      contentContainerStyle={{ paddingBottom: 100 }}
      stickyHeaderIndices={[0]}
    >
      <View className="bg-gray-200 p-4 border-b border-gray-300">
        <Text className="text-xl font-bold text-center">Analytics</Text>
      </View>
      <View className="flex-row justify-center items-start">
        <View className="flex-col">
          <View className="bg-gray-200 p-5 rounded-lg border border-gray-300 items-center mb-5 mt-[1rem]">
            <Text className="text-lg font-bold">Total Rooms</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {totalRooms}
            </Text>
          </View>

          <View className="bg-gray-200 p-5 rounded-lg border border-gray-300 items-center">
            <Text className="text-lg font-bold">Current Tenants</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {currentTenants}
            </Text>
          </View>
        </View>

        <View className="items-center">
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 160}
            height={200}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                alignItems: "center",
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="40"
            hasLegend={false}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <View className="absolute top-[80px] left-[75px]">
            <Text className="absolute text-[#8B0000] top-[-15px] left-[30px]">
              {`${((data[0].population / totalRooms) * 100).toFixed(2)}%`}
            </Text>
            <Text className="absolute text-[#00008B] top-[40px] left-[-20px]">
              {`${((data[1].population / totalRooms) * 100).toFixed(2)}%`}
            </Text>
            <Text className="absolute text-[#8B4513] top-[-35px] left-[-35px]">
              {`${((data[2].population / totalRooms) * 100).toFixed(2)}%`}
            </Text>
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <View className="w-5 h-5 bg-pink-400 mr-2" />
              <Text>Occupied</Text>
              <View className="w-5 h-5 bg-blue-400 mr-2 ml-4" />
              <Text>Vacant</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <View className="w-5 h-5 bg-yellow-400 mr-2" />
              <Text>Under Maintenance</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-300 my-6" />

      <View className="mt-6 flex-row justify-between items-center">
        <View className="flex-col items-center">
          <Text className="text-xl font-bold mb-2">Rent Collection Status</Text>

          <PieChart
            data={[
              {
                name: "Paid",
                population: 85,
                color: "rgba(75, 192, 192, 0.6)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15,
              },
              {
                name: "Vacant",
                population: 15,
                color: "rgba(255, 159, 64, 0.6)",
                legendFontColor: "#7F7F7F",
                legendFontSize: 15,
              },
            ]}
            width={Dimensions.get("window").width - 160}
            height={200}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                alignItems: "center",
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="40"
            hasLegend={false}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <View className="mt-4">
            <View className="flex-row items-center">
              <View className="w-5 h-5 bg-teal-400 mr-2" />
              <Text>Paid</Text>
              <View className="w-5 h-5 bg-orange-400 mr-2 ml-4" />
              <Text>Vacant Rooms</Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-200 p-7 rounded-lg border border-gray-300 items-center mt-10 mb-[8rem]">
          <Text className="text-lg font-bold">New Tenants</Text>
          <Text className="text-[2rem] font-bold text-gray-800">+4</Text>
          <Text className="text-small font-bold text-gray-800 flex-shrink-1 text-center overflow-hidden text-ellipsis">
            Nov.25 - Dec.15
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-300 my-6" />

      <View className="p-4">
        <Text className="text-xl font-bold mb-4">
          Electricity and Water Consumption
        </Text>
        <View className="border border-gray-300 rounded-lg w-full">
          <View className="flex-row bg-[#FFDF75]">
            <Text className="flex-1 text-center font-bold border-r border-gray-300 p-3">
              Month
            </Text>
            <Text className="flex-1 text-center font-bold border-r border-gray-300 p-3">
              Electricity (₱)
            </Text>
            <Text className="flex-1 text-center font-bold p-3">Water (₱)</Text>
          </View>

          {[
            { month: "January", electricity: 1200, water: 450 },
            { month: "February", electricity: 1100, water: 420 },
            { month: "March", electricity: 1300, water: 470 },
            { month: "April", electricity: 1250, water: 460 },
            { month: "May", electricity: 1400, water: 480 },
            { month: "June", electricity: 1350, water: 490 },
            { month: "July", electricity: 1450, water: 500 },
            { month: "August", electricity: 1500, water: 510 },
            { month: "September", electricity: 1550, water: 520 },
            { month: "October", electricity: 1600, water: 530 },
            { month: "November", electricity: 1650, water: 540 },
            { month: "December", electricity: 1700, water: 550 },
          ].map((item, index) => (
            <View
              key={index}
              className="flex-row border-t border-gray-300 bg-[#FFF7DD]"
            >
              <Text className="flex-1 text-center border-r border-gray-300 p-3">
                {item.month}
              </Text>
              <Text className="flex-1 text-center border-r border-gray-300 p-3">
                ₱{item.electricity}
              </Text>
              <Text className="flex-1 text-center p-3">₱{item.water}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default RoomAnalytics;
