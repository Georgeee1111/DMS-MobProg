import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useMultiSelect } from "@/components/MultiSelectContext";
import { Room } from "@/app/model/RoomModel";

const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const { isMultiSelectMode, setIsMultiSelectMode } = useMultiSelect();
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [isRoomDetailsModalVisible, setRoomDetailsModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const fetchRooms = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://192.168.1.8:8000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [token]);

  const handleSaveRoom = async () => {
    if (!token) {
      console.error("Token not available");
      return;
    }

    const roomData = {
      room_number: roomNumber,
      room_type: roomType,
      price,
      floor,
      description,
      status: "vacant",
    };

    try {
      if (editRoomId) {
        const response = await axios.put(
          `http://192.168.1.8:8000/api/rooms/${editRoomId}`,
          roomData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRooms(
          rooms.map((room) =>
            room.id === editRoomId ? response.data.room : room
          )
        );
      } else {
        const response = await axios.post(
          "http://192.168.1.8:8000/api/add-room",
          roomData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRooms([...rooms, response.data.room]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const deleteSelectedRooms = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) =>
          axios.delete(`http://192.168.1.8:8000/api/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setRooms((prevRooms) =>
        prevRooms.filter((room) => !selectedRooms.includes(room.id))
      );
      setSelectedRooms([]);
      setIsMultiSelectMode(false);
    } catch (error) {
      console.error("Error deleting rooms:", error);
    }
  };

  const resetForm = () => {
    setEditRoomId(null);
    setRoomNumber("");
    setRoomType("");
    setPrice("");
    setFloor("");
    setDescription("");
    setModalVisible(false);
  };

  const openEditModal = (room: Room) => {
    setEditRoomId(room.id);
    setRoomNumber(room.room_number);
    setRoomType(room.room_type);
    setPrice(room.price);
    setFloor(room.floor);
    setDescription(room.description);
    setModalVisible(true);
  };

  const handleLongPress = (roomId: string) => {
    setIsMultiSelectMode(true);
    setSelectedRooms([roomId]);
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  const handleRoomDetails = (room: Room) => {
    setRoomDetails(room);
    setRoomDetailsModalVisible(true);
  };

  const renderRoom: ListRenderItem<Room> = (
    props: ListRenderItemInfo<Room>
  ) => {
    const { item } = props;
    return (
      <TouchableOpacity
        onLongPress={() => handleLongPress(item.id)}
        onPress={() =>
          isMultiSelectMode
            ? handleSelectRoom(item.id)
            : handleRoomDetails(item)
        }
        className={`w-1/2 p-2 ${isMultiSelectMode && "opacity-50"}`}
      >
        <View className="border border-gray-300 p-4 rounded-lg relative">
          {isMultiSelectMode && (
            <View className="absolute top-2 right-2">
              <Icon
                name={
                  selectedRooms.includes(item.id)
                    ? "checkbox-outline"
                    : "square-outline"
                }
                size={24}
                color="blue"
              />
            </View>
          )}

          <Text className="font-bold text-lg absolute top-2 left-2">
            {item.room_number}
          </Text>

          <View className="border-b border-gray-300 mt-8 mb-2" />

          <Text
            className={`font-semibold text-left text-[1.4rem] ${getStatusColor(
              item.status
            )}`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>

          <Text className="text-left mt-2 text-[1rem]">
            {item.room_type
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>

          <TouchableOpacity
            onPress={() => openEditModal(item)}
            className="mt-4 items-end"
          >
            <Icon name="create-outline" size={24} color="orange" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "text-red-500";
      case "maintenance":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  const memoizedRooms = useMemo(() => rooms, [rooms]);

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Room Management</Text>

      {isMultiSelectMode && (
        <View
          className="absolute bottom-0 left-0 right-0 flex-row justify-center items-center px-4 py-4 z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsMultiSelectMode(false);
              setSelectedRooms([]);
            }}
            className="bg-gray-500 p-4 rounded-full mr-10"
          >
            <Icon name="close-outline" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={deleteSelectedRooms}
            className="bg-red-500 p-4 rounded-full"
          >
            <Icon name="trash-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={memoizedRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-28 right-8 bg-blue-500 p-4 rounded-full"
      >
        <Text className="text-white font-bold">+</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        onRequestClose={resetForm}
        transparent={true}
        animationType="slide"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <ScrollView
                contentContainerStyle={{
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
              >
                <View
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    maxWidth: 400,
                    padding: 16,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 16,
                    }}
                  >
                    {editRoomId ? "Edit Room" : "Add Room"}
                  </Text>

                  {/* Input Fields */}
                  <InputField
                    label="Room Number"
                    showLabel={false}
                    value={roomNumber}
                    placeholder="Room Number"
                    onChangeText={setRoomNumber}
                    showValidation={false}
                  />
                  <InputField
                    label="Room Type"
                    showLabel={false}
                    value={roomType}
                    placeholder="Room Type (Single, Double, Suite)"
                    onChangeText={setRoomType}
                    showValidation={false}
                  />
                  <InputField
                    label="Price"
                    showLabel={false}
                    value={price}
                    placeholder="Price"
                    onChangeText={setPrice}
                    showValidation={false}
                  />
                  <InputField
                    label="Floor"
                    showLabel={false}
                    value={floor}
                    placeholder="Floor"
                    onChangeText={setFloor}
                    showValidation={false}
                  />
                  <InputField
                    label="Description"
                    showLabel={false}
                    value={description}
                    placeholder="Description"
                    onChangeText={setDescription}
                    showValidation={false}
                  />

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={handleSaveRoom}
                    style={{
                      backgroundColor: "#3b82f6",
                      padding: 16,
                      borderRadius: 50,
                      marginTop: 16,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {editRoomId ? "Save Changes" : "Save Room"}
                    </Text>
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={resetForm}
                    style={{
                      backgroundColor: "#6b7280",
                      padding: 16,
                      borderRadius: 50,
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={isRoomDetailsModalVisible}
        onRequestClose={() => setRoomDetailsModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl border border-gray-200">
              <Text className="text-2xl font-extrabold mb-4 text-gray-900 text-center">
                Room Details
              </Text>
              {roomDetails ? (
                <View className="space-y-4">
                  {[
                    { label: "Room Number", value: roomDetails.room_number },
                    { label: "Room Type", value: roomDetails.room_type },
                    { label: "Price", value: `$${roomDetails.price}` },
                    { label: "Floor", value: roomDetails.floor },
                    { label: "Description", value: roomDetails.description },
                    { label: "Status", value: roomDetails.status },
                  ].map((item, index) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-start py-2 border-b border-gray-100"
                    >
                      <Text className="font-semibold text-gray-600">
                        {item.label}:
                      </Text>
                      <Text
                        className="text-gray-900 font-medium flex-1 text-right"
                        numberOfLines={
                          item.label === "Description" ? undefined : 1
                        }
                        ellipsizeMode={
                          item.label === "Description" ? undefined : "tail"
                        }
                      >
                        {capitalize(item.value)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-center text-gray-500">
                  No details available
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setRoomDetailsModalVisible(false)}
                className="bg-indigo-600 hover:bg-indigo-700 p-4 rounded-full mt-6"
              >
                <Text className="text-white font-bold text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default RoomManagement;
