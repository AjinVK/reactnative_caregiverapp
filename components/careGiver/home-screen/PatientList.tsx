import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function PatientList() {
    return (
        <View className="px-4">
            <Pressable
                className="w-full h-[42px] bg-[#fff] rounded-lg flex-row items-center justify-between active:opacity-70"
                onPress={() => router.push("/screen/PatientListPage")}
                style={{ elevation: 2 }}
            >
                <Text className="text-[17px] font-semibold ml-[21px]">Patient’s list</Text>
                <View className="mr-[12px]">
                    <IconSymbol name={"arrow-right.fill"} color={"#000"} />
                </View>
            </Pressable>
        </View>
    );
}