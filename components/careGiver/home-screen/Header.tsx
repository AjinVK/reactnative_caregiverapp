import { useState } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationIcon from "@/assets/careGiver/notification.svg";

export default function Header() {
    const [imageUri, setImageUri] = useState<string | null>(null);

    return (
        // <SafeAreaView className="px-4">
            <View className="px-4 mt-[10px] mb-[20px]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable className="active:opacity-70">
                            <Avatar.Image
                                size={40}
                                source={{
                                    uri: imageUri || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                                }}
                                style={{ backgroundColor: "#3b82f6", }} />
                        </Pressable>

                        <Text className="text-[20px] font-medium ml-[7px]">User profile</Text>
                    </View>

                    <NotificationIcon />
                </View>
            </View>
        // </SafeAreaView>
    );
}