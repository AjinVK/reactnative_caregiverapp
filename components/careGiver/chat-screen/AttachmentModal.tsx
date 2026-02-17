import { Modal, Pressable, Text, View } from "react-native";
import { FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";

export default function AttachmentModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/30 justify-end"
      >
        {/* Sheet */}
        <View className="bg-white rounded-t-3xl px-6 py-5">
          <View className="flex-row justify-between mb-4">

            <AttachmentItem
              icon={<Entypo name="camera" size={26} color="#4CAF50" />}
              label="Camera"
            />

            <AttachmentItem
              icon={<FontAwesome5 name="image" size={24} color="#2196F3" />}
              label="Gallery"
            />

            <AttachmentItem
              icon={<MaterialIcons name="insert-drive-file" size={26} color="#FF9800" />}
              label="Document"
            />

            <AttachmentItem
              icon={<Entypo name="location-pin" size={26} color="#F44336" />}
              label="Location"
            />

          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

function AttachmentItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View className="items-center gap-2">
      <View className="w-14 h-14 rounded-full bg-[#F3F3F3] items-center justify-center">
        {icon}
      </View>
      <Text className="text-[12px] text-[#555]">{label}</Text>
    </View>
  );
}
