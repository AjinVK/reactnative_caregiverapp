import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingButton() {
    const insets = useSafeAreaInsets();

    return (
        <Pressable
            className="absolute right-4 w-[56px] h-[56px] rounded-full items-center justify-center bg-[#1E5B91] active:opacity-70"
            style={{
                bottom: insets.bottom + 16, 
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
            onPress={() => router.push("/screen/PatientFormPage")}
        >
            <Text className="text-[28px] text-[#fff]">+</Text>
        </Pressable>
    );
}