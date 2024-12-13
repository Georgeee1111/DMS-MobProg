import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

type ConfirmButtonProps = {
  label: string;
  onPress: () => void;
};

type CustomModalProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmButton?: ConfirmButtonProps;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  confirmButton,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View className="bg-white rounded-lg p-4">
        {/* Modal Header */}
        <Text className="text-lg font-bold text-center mb-2">{title}</Text>

        {/* Modal Content */}
        <View className="my-2">{children}</View>

        {/* Modal Buttons */}
        <View className="flex-row justify-end mt-4">
          <TouchableOpacity onPress={onClose} className="mr-3">
            <Text className="text-blue-600 font-semibold">Cancel</Text>
          </TouchableOpacity>

          {confirmButton && (
            <TouchableOpacity onPress={confirmButton.onPress}>
              <Text className="text-blue-600 font-semibold">
                {confirmButton.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
