import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type PatientTabsProps = {
    selected: string;
    onSelect: (tab: string) => void;
};

export default function PatientTabs({ selected, onSelect, }: PatientTabsProps) {
    const tabs = ["All", "Op patient", "Asthma patient"];

    return (
        <View className="px-4 flex-row gap-3 mb-5">
            {tabs.map((tab) => {
                const isActive = selected === tab;

                return (
                    <Pressable
                        key={tab}
                        onPress={() => onSelect(tab)}
                        className={`px-[11px] py-[6px] rounded-[20px] active:opacity-70 items-center ${isActive ? "bg-[#1E5B91]" : "bg-white"
                            }`}
                    >
                        <Text
                            className={`text-[15px] font-medium ${isActive ? "text-white" : "text-black"
                                }`}
                        >
                            {tab}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}