import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { updateUser } from "@/app/redux/userSlice";
import styles from "@/app/styles/ProfileStyles";
import { router } from "expo-router";

const Profile = () => {
  const dispatch = useDispatch();

  // Access Redux state
  const { name, email, phone_number } = useSelector(
    (state: RootState) => state.user
  );

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [pictureModalVisible, setPictureModalVisible] = useState(false);

  // Temporary data for editing
  const [tempName, setTempName] = useState(name);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phone_number);
  const [tempEmail, setTempEmail] = useState(email);

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("Logout function triggered");
    alert("You have been logged out.");
    router.replace("/(auth)/sign-in");
  };

  const handleSaveProfile = () => {
    dispatch(
      updateUser({
        name: tempName,
        email: tempEmail,
        phone_number: tempPhoneNumber,
      })
    );
    setInfoModalVisible(false);
    setModalVisible(false);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your photos."
      );
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selectedImage = result.assets[0].uri;
      setProfilePicture(selectedImage);
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      Alert.alert("No Image Selected", "Please select an image first.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", {
        uri: profilePicture,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const response = await axios.post(
        "http://192.168.1.8:8000/api/profile/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile picture updated successfully.");
        setPictureModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Something went wrong while uploading.");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        router.replace("/(auth)/sign-in");
        return;
      }

      try {
        const response = await axios.get(
          "http://192.168.1.8:8000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const { name, email, phone_number, profile_picture } = response.data;
          dispatch(updateUser({ name, email, phone_number }));
          setProfilePicture(profile_picture);
        } else {
          Alert.alert("Error", "Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert(
          "Error",
          "Something went wrong while fetching profile data."
        );
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingBottom: 90 }}
    >
      <View style={styles.header}>
        <Icon name="chevron-back-outline" size={35} color="black" />
        <Text style={styles.profileTitle}>Your Profile</Text>
      </View>

      {/* Profile Header */}
      <View style={[styles.profileHeader]}>
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require("../../../assets/images/modeng.png")
            }
            style={styles.profilePicture}
          />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={() => setPictureModalVisible(true)} // Open the picture modal
          >
            <Icon name="create-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Personal Information Section */}
      <View style={styles.personalInfoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Icon
            name="mail-outline"
            size={20}
            color="#666"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>Email: {email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="call-outline"
            size={20}
            color="#666"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>Phone Number: {phone_number}</Text>
        </View>

        <TouchableOpacity
          style={styles.editIconButton}
          onPress={() => setInfoModalVisible(true)} // Open modal to edit personal info
        >
          <Icon name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Options List */}
      <View style={styles.optionsList}>
        <TouchableOpacity style={styles.optionItem} onPress={() => {}}>
          <Icon name="lock-closed-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="red" />
          <Text style={[styles.optionText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Profile Picture Modal */}
      <Modal
        visible={pictureModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>

            {/* Button to Select Image */}
            <TouchableOpacity
              className="bg-blue-500 rounded-md py-3 mb-4"
              onPress={pickImage}
            >
              <Text className="text-white text-center font-semibold">
                Select Image
              </Text>
            </TouchableOpacity>

            {/* Button to Upload */}
            <TouchableOpacity
              className="bg-green-500 rounded-md py-3 mb-4"
              onPress={uploadProfilePicture}
            >
              <Text className="text-white text-center font-semibold">
                Upload
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              className="bg-red-500 rounded-md py-3"
              onPress={() => setPictureModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
