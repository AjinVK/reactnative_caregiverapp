// import { ScrollView, Text } from "react-native";
// import { View } from "react-native";
// import TabletIcon from "@/assets/patientDashboard/tablet.svg";
// import AsthumaIcon from "@/assets/patientDashboard/asthuma.svg";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// export default function HealthDetails() {
//     return (
//         <View className="px-4">
//             <Text className="text-[20px] font-semibold mb-[15px]">Health details</Text>

//             <View className="bg-[white] rounded-[7px] px-[18px] pt-[16px] shadow-md">

//                 <View className="flex-row justify-between">
//                     <View className="w-[82px] bg-[white] rounded-[11px] border border-[#BCBCBC] items-center px-[11px] py-[8px] mb-[14px]"
//                         style={{ elevation: 2 }}
//                     >
//                         <Text className="text-[11px] font-medium">Medication</Text>
//                     </View>

//                     <View className="w-[26] h-[26] border-[0.5px] border-[#000] rounded-full items-center justify-center top-1">
//                         <MaterialCommunityIcons name="dots-vertical" size={16} color="black" />
//                     </View>
//                 </View>

//                 <View className="bg-[#F6FCFF] rounded-[9px] shadow gap-4 flex-row items-center justify-center py-[28px] mb-[18px]"  >

//                     <View className="w-[70px] h-[70px] gap-2 rounded-[8px] bg-[#E5F6FF] items-center justify-center"
//                         style={{ elevation: 3 }}
//                     >
//                         <TabletIcon />
//                         <Text className="text-[#186085] text-[12px] font-medium">Diabetes</Text>
//                     </View>

//                     <View className="w-[70px] h-[70px] gap-2 rounded-[8px] bg-[#E5F6FF] items-center justify-center"
//                         style={{ elevation: 3 }}
//                     >
//                         <AsthumaIcon />
//                         <Text className="text-[#186085] text-[12px] font-medium">Asthuma</Text>
//                     </View>

//                     <View className="w-[70px] h-[70px] gap-2 rounded-[8px] bg-[#E5F6FF] items-center justify-center"
//                         style={{ elevation: 3 }}
//                     >
//                         <AsthumaIcon />
//                         <Text className="text-[#186085] text-[12px] font-medium">Asthuma</Text>
//                     </View>
//                 </View>

//             </View>
//         </View>
//     );
// }


import React, { useRef } from "react";
import { Text, Animated, Image } from "react-native";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TabletIcon from "@/assets/patientDashboard/tablet.svg";
import AsthumaIcon from "@/assets/patientDashboard/asthuma.svg";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const CARD_WIDTH = 90;
const GAP = 16;
const SNAP_INTERVAL = CARD_WIDTH + GAP;

const MEDICATIONS = [
    { label: "Diabetes", Icon: TabletIcon },
    { label: "Asthuma", Icon: AsthumaIcon },
    { label: "Asthuma", Icon: AsthumaIcon },
];

interface HealthDetailsProps {
    medicalCondition?: {
        _id: string;
        name: string;
    };
}

export default function HealthDetails({ medicalCondition }: HealthDetailsProps) {
    const scrollX = useRef(new Animated.Value(0)).current;

    const getIcon = (name: string) => {
        if (name === "Hypertension") {
            return () => <MaterialCommunityIcons name="heart-plus" size={24} color="#186085" />;
        }
        if (name === "Heart Disease") {
            return () => <FontAwesome name="heartbeat" size={24} color="#186085" />;
        }
        if (name === "Thyroid Disorder") {
            return () => <Image source={require("@/assets/patientDashboard/thyroid.png")} style={{ width: 24, height: 24, tintColor: "#186085" }} accessibilityLabel="thyroid"/>;
        }
        return AsthumaIcon;
    };

    const conditions = medicalCondition ? [
        { 
            label: medicalCondition.name, 
            Icon: getIcon(medicalCondition.name)
        }
    ] : MEDICATIONS;

    return (
        <View className="px-4 mb-[20px]">
            <Text className="text-[20px] font-semibold mb-[15px]">
                Health details
            </Text>

            <View className="bg-white rounded-[7px] px-[18px] pt-[16px] shadow-md">
                <View className="flex-row justify-between">
                    <View
                        className="w-auto px-3 bg-white rounded-[11px] border border-[#BCBCBC] items-center py-2 mb-[14px]"
                        style={{ 
                            elevation: 3,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                        }}
                    >
                        <Text className="text-[11px] font-medium">Medical condition</Text>
                    </View>

                    <View className="w-7 h-7 border-[0.5px] border-black rounded-full items-center justify-center top-1">
                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={16}
                            color="black"
                        />
                    </View>
                </View>

                <View className="bg-[#F6FCFF] rounded-[9px] mb-[18px] items-center shadow">
                    <Animated.ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={SNAP_INTERVAL}
                        decelerationRate="fast"
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingVertical: 28,
                            gap: GAP,
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                    >
                        {conditions.map((item, index) => (
                            <MedicationCard
                                key={index}
                                label={item.label}
                                Icon={item.Icon}
                            />
                        ))}
                    </Animated.ScrollView>
                </View>

                {/* <View className="flex-row justify-center gap-2 pb-[16px]">
                    {MEDICATIONS.map((_, index) => {
                        const inputRange = [
                            (index - 1) * SNAP_INTERVAL,
                            index * SNAP_INTERVAL,
                            (index + 1) * SNAP_INTERVAL,
                        ];

                        const width = scrollX.interpolate({
                            inputRange,
                            outputRange: [6, 16, 6],
                            extrapolate: "clamp",
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.4, 1, 0.4],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={{
                                    width,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "#186085",
                                    opacity,
                                }}
                            />
                        );
                    })}
                </View> */}
            </View>
        </View>
    );
}

function MedicationCard({
    label,
    Icon,
}: {
    label: string;
    Icon: any;
}) {
    return (
        <View
            className="w-[90px] px-3 py-4 gap-2 rounded-[8px] bg-[#E5F6FF] items-center justify-center"
            style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            }}
        >
            <Icon />
            <Text className="text-[#186085] text-[12px] font-medium text-center" numberOfLines={1} ellipsizeMode="clip">
                {label}
            </Text>
        </View>
    );
}

