import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    patientId?: string;
}

export default function ChatButton({ patientId }: Props) {
    const insets = useSafeAreaInsets();

    const handlePress = () => {
        if (!patientId) return;

        router.push({
            pathname: "/screen/ChatPage",
            params: {
                patientId,
            },
        });
    };

    return (
        <Pressable
            className="absolute right-4 w-[56px] h-[56px] rounded-full items-center justify-center bg-[#1E5B91] active:opacity-90"
            style={{
                bottom: insets.bottom + 16, 
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
            onPress={handlePress}
        >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        </Pressable>
    );
}