import { Image, Pressable, Text, View } from "react-native";

export interface Patient {
    id: string;
    name: string;
    patientId: string;
    phone: string;
    image: string;
}

interface PatientCardProps {
    item: Patient;
    onPress?: (item: Patient) => void;
}

export default function PatientCard({ item, onPress }: PatientCardProps) {
    return (
        <View className="px-4">
            <Pressable
                onPress={() => onPress?.(item)}
                className="h-[85px] bg-white rounded-2xl flex-row items-center mb-3 active:opacity-70"
                style={{ elevation: 3 }}
            >
                <Image
                    source={{ uri: item.image }}
                    className="w-[70px] h-[65px] rounded-full mr-[10px] ml-[10px]"
                    resizeMode="contain"
                />

                <View className="flex-1">
                    <Text className="text-[15px] font-semibold mb-[7px]">
                        {item.name}
                    </Text>

                    <Text className="text-[10px] font-normal text-[#AAA7A7] mb-[4px]">
                        Patient i’d : {item.patientId}
                    </Text>

                    <Text className="text-[10px] font-normal text-[#AAA7A7]">
                        Phone : {item.phone}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}
