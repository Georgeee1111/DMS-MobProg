import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { Room } from "@/app/model/Room";

const Tenants = () => {
  const [tenants, setTenants] = useState<
    { id: number; name: string; room: string; date: string }[]
  >([]);
  const [filteredTenants, setFilteredTenants] = useState<
    { id: number; name: string; room: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    room: "",
    email: "",
    phone: "",
  });

  const [vacantRooms, setVacantRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please sign in.");
        }

        const response = await axios.get(
          "http://192.168.1.8:8000/api/tenants",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedTenants = response.data.map((tenant: any) => ({
          ...tenant,
          date: new Date(tenant.created_at).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
        }));

        setTenants(formattedTenants);
        setFilteredTenants(formattedTenants);
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          setError(
            `Error: ${err.response.data.message || "Failed to fetch data"}`
          );
        } else if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching tenants:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchVacantRooms = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please sign in.");
        }

        const response = await axios.get(
          "http://192.168.1.8:8000/api/vacant-rooms",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const rooms = response.data.rooms;
        setVacantRooms(rooms);
      } catch (err) {
        console.error("Error fetching vacant rooms:", err);
      }
    };

    fetchTenants();
    fetchVacantRooms();
  }, []);

  const handleAddTenant = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        "http://192.168.1.8:8000/api/tenants",
        {
          name: newTenant.name,
          room: newTenant.room,
          email_address: newTenant.email,
          contact_number: newTenant.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const addedTenant = response.data;
      const formattedTenant = {
        ...addedTenant,
        date: new Date(addedTenant.created_at).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
      };

      await axios.put(
        `http://192.168.1.8:8000/api/rooms/${newTenant.room}/status`,
        { status: "occupied" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVacantRooms((prevRooms) =>
        prevRooms.filter((room) => room.room_number !== newTenant.room)
      );

      setTenants((prevTenants) => [...prevTenants, formattedTenant]);
      setFilteredTenants((prevFilteredTenants) => [
        ...prevFilteredTenants,
        formattedTenant,
      ]);

      setModalVisible(false);
      setNewTenant({ name: "", room: "", email: "", phone: "" });
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(`Error: ${err.response.data.message || "Failed to add tenant"}`);
      } else if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setFilteredTenants(tenants);
    } else {
      const filtered = tenants.filter((tenant) =>
        tenant.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTenants(filtered);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
        }}
      >
        <Icon
          name="search"
          size={20}
          color="#4A5568"
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={{
            flex: 1,
            padding: 10,
            height: 40,
            marginLeft: 10,
          }}
          placeholder="Find Tenants..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text className="text-xl font-bold text-center my-4">Tenants</Text>
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : error ? (
        <Text className="text-center text-red-500">{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
          {filteredTenants.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <Icon
                name="user-circle"
                size={50}
                color="#4A5568"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text>{item.room}</Text>
                <Text style={{ color: "#888" }}>{item.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 110,
          right: 20,
          backgroundColor: "#007BFF",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Add Tenant
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              placeholder="Name"
              value={newTenant.name}
              onChangeText={(text) =>
                setNewTenant((prev) => ({ ...prev, name: text }))
              }
            />
            <RNPickerSelect
              onValueChange={(value) =>
                setNewTenant((prev) => ({ ...prev, room: value }))
              }
              items={vacantRooms.map((room) => ({
                label: room.room_number,
                value: room.room_number,
              }))}
              value={newTenant.room}
              style={{
                inputIOS: {
                  backgroundColor: "#f9f9f9",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                  fontSize: 16,
                  color: "#333",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 3,
                },
                inputAndroid: {
                  backgroundColor: "#f9f9f9",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginBottom: 12,
                  fontSize: 16,
                  color: "#333",
                  elevation: 3,
                },
                placeholder: {
                  color: "#aaa",
                  fontSize: 16,
                },
              }}
              placeholder={{
                label: "Select a Room",
                value: null,
                color: "#aaa",
              }}
            />

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              placeholder="Email"
              value={newTenant.email}
              onChangeText={(text) =>
                setNewTenant((prev) => ({ ...prev, email: text }))
              }
            />
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              placeholder="Phone"
              value={newTenant.phone}
              onChangeText={(text) =>
                setNewTenant((prev) => ({ ...prev, phone: text }))
              }
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007BFF",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
              onPress={handleAddTenant}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Tenants;
