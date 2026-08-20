import { Image, Pressable, Text, View } from "react-native";
import CareGiver from "@/assets/careGiver/care_giver.svg";

export default function Notification() {
    return (
        <View className="px-4">
            <View
                className="w-full bg-[#fff] rounded-xl mb-[20px] justify-center"
                style={{ 
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }}
            >
                <View className="overflow-hidden rounded-xl">
                    <View className="flex-row items-center justify-between">
                    <View className="flex-1 ml-5">
                        <Text className="text-[18px] font-bold text-[#032D6F] mb-1.5">
                            Get the best medical services
                        </Text>

                        <Text className="text-[10px] font-semibold text-[#72A7DF] mb-5">
                            We provide best quality medical service without further cost
                        </Text>

                        <Pressable
                            className="w-[75px] py-1.5 rounded-lg items-center active:opacity-70 bg-white"
                            style={{ 
                                elevation: 2,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                            }}
                        >
                            <Text className="text-[11px] font-normal">Read more</Text>
                        </Pressable>
                    </View>

                    <View className="relative">
                        <View className="absolute flex-row justify-start -mx-28 -my-32">
                            <Image
                                source={require("@/assets/careGiver/green_bg.png")}
                                width={226} height={220}
                            />
                        </View>
                        <View className="absolute flex-row justify-start -mx-24 -my-32">
                            <Image
                                source={require("@/assets/careGiver/blue_bg.png")}
                                width={226} height={220}
                            />
                        </View>
                        <View className="absolute top-[59px] left-[70px]">
                            <Image
                                source={require("@/assets/careGiver/circle_bg.png")}
                            />
                        </View>
                        <View className="ml-[41px] mt-[9px]">
                            <CareGiver width={159} height={159} />
                        </View>
                    </View>

                    </View>
                </View>
            </View>
        </View>
    );
}