import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  showLabel = true,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  error,
  className,
  color = "black",
  showValidation = true,
  ...props
}: InputFieldProps & {
  showLabel?: boolean;
  error?: string;
  color?: string;
  showValidation?: boolean;
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleFocus = () => {
    setIsTouched(true);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  useEffect(() => {
    if (error && !isTouched) {
      setIsTouched(true);
    }
  }, [error, isTouched]);

  const borderColor = showValidation
    ? error
      ? "border-red-500"
      : isTouched && !props.value
      ? "border-gray-300" 
      : isTouched && !error
      ? "border-green-500"
      : "border-gray-300"
    : "border-gray-300";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          {showLabel && label && (
            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`flex flex-row justify-start items-center relative bg-transparent border-b-2 ${borderColor} focus:border-primary-500 ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`p-4 font-JakartaSemiBold text-[15px] flex-1 bg-transparent text-left ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{ color }}
              {...props}
            />
            {showValidation && isTouched && props.value && !error && (
              <Text
                style={{
                  position: "absolute",
                  right: 10,
                  color: "green",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                ✔
              </Text>
            )}
            {showValidation && error && (
              <Text
                style={{
                  position: "absolute",
                  right: 10,
                  color: "red",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                !
              </Text>
            )}
          </View>
          {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
