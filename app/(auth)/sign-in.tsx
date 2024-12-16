import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { useRouter, useSegments } from "expo-router";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import { signInValidationSchema } from "../validation/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../redux/userSlice";

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments() as string[];

  const user = useSelector((state: any) => state.user);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    setLoading(true);
    try {
      const response = await axios.post("http://192.168.1.8:8000/api/login", {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        console.log("Token saved:", response.data.token);
        const { name, email: userEmail, phone_number } = response.data.user;

        dispatch(
          setUser({
            email: userEmail,
            name,
            phone_number,
          })
        );

        setIsSuccess(true);
        setModalMessage("Sign in successful!");
        setIsModalVisible(true);

        setTimeout(() => {
          router.replace("/(root)/(tabs)/profile");
        }, 1500);
      } else {
        setIsSuccess(false);
        setModalMessage("Token not found in response.");
        setIsModalVisible(true);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setIsSuccess(false);
        if (error.response.status === 401) {
          setModalMessage("Invalid email or password.");
        } else {
          setModalMessage(
            `Sign In error: ${error.response.data.message || "Unknown error"}`
          );
        }
        setIsModalVisible(true);
      } else {
        setIsSuccess(false);
        setModalMessage("An unknown error occurred.");
        setIsModalVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = () => {
    console.log("Forget Password Pressed");
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In Pressed");
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook Sign In Pressed");
  };

  const isSignInScreen = segments.some((segment) => segment === "sign-in");

  return (
    <ImageBackground
      source={require("@/assets/images/Background.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 justify-center items-center">
        <View className="flex flex-row justify-between mb-4 w-full">
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            className="ml-[2rem]"
            disabled={isSignInScreen}
          >
            <Text
              className={`flex flex-row text-[3rem] font-bold ${
                isSignInScreen ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Text className="underline decoration-2 underline-offset-[10px]">
                Lo
              </Text>
              gin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-up")}
            className="mr-[2rem]"
          >
            <Text
              className={`flex flex-row text-[3rem] font-bold ${
                isSignInScreen ? "text-gray-500" : "text-blue-600"
              }`}
            >
              <Text>Sign </Text>
              <Text className="underline decoration-2 underline-offset-[10px]">
                Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={signInValidationSchema}
          onSubmit={handleSignIn}
          validateOnChange={true}
          validateOnBlur={false}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldTouched,
            values,
            errors,
            touched,
          }) => (
            <View
              style={{ backgroundColor: "rgba(73, 88, 103, 0.5)" }}
              className="p-6 rounded-lg w-11/12 max-w-md"
            >
              <InputField
                label="Email"
                icon={icons.email}
                placeholder="Email"
                color="white"
                showLabel={false}
                placeholderTextColor="white"
                onChangeText={(text) => {
                  handleChange("email")(text);
                  setFieldTouched("email", true);
                }}
                onBlur={handleBlur("email")}
                value={values.email}
                error={touched.email && errors.email ? errors.email : ""}
              />
              <InputField
                label="Password"
                secureTextEntry={true}
                icon={icons.lock}
                placeholder="Password"
                color="white"
                showLabel={false}
                placeholderTextColor="white"
                onChangeText={(text) => {
                  handleChange("password")(text);
                  setFieldTouched("password", true);
                }}
                onBlur={handleBlur("password")}
                value={values.password}
                error={
                  touched.password && errors.password ? errors.password : ""
                }
              />

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={{ marginTop: 16 }}
                />
              ) : (
                <CustomButton
                  title="Sign In"
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.50)",
                    marginTop: 16,
                  }}
                />
              )}

              <TouchableOpacity onPress={handleForgetPassword} className="mt-5">
                <Text className="text-black text-center">Forget Password?</Text>
              </TouchableOpacity>

              <Text className="text-center mt-2">Or</Text>

              <View className="flex flex-row items-center mt-2">
                <View className="flex-1 border-t border-gray-300" />
                <Text className="mx-2 text-black">Sign Up with</Text>
                <View className="flex-1 border-t border-gray-300" />
              </View>

              <View className="flex flex-row justify-between mt-4">
                <CustomButton
                  title="Google"
                  onPress={handleGoogleSignIn}
                  className="flex-1 mr-2"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.50)" }}
                />
                <TouchableOpacity
                  onPress={handleFacebookSignIn}
                  className="flex-1 ml-2 border border-secondary-1000 rounded-full py-2 justify-center items-center"
                  style={{ backgroundColor: "transparent" }}
                >
                  <Text className="text-black text-center font-bold">
                    Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-white p-6 rounded-lg w-10/12 max-w-md shadow-lg">
              <Text className="text-center text-lg font-bold">
                {isSuccess ? "Success" : "Error"}
              </Text>
              <Text className="text-center mt-4">{modalMessage}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="mt-4 bg-blue-500 py-2 px-4 rounded-full"
              >
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignIn;
