// import React from "react";
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Entypo } from "@expo/vector-icons";
// import { IconSymbol } from "@/components/ui/icon-symbol";

// interface Item {
//     id: string;
//     date: string;
//     title: string;
//     hospital: string;
//     doctor: string;
//     desc: string;
//     color: string;
// }

// const DATA: Item[] = [
//     {
//         id: "1",
//         date: "1/1/2025",
//         color: "#6ACA60",
//         title: "Blood test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
//     {
//         id: "2",
//         date: "1/2/2025",
//         color: "#6567D5",
//         title: "Medical test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
//     {
//         id: "3",
//         date: "1/2/2025",
//         color: "#6ACA60",
//         title: "Medical test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
//     {
//         id: "4",
//         date: "1/2/2025",
//         color: "#E1AE41",
//         title: "Medical test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
//     {
//         id: "5",
//         date: "1/2/2025",
//         color: "#6567D5",
//         title: "Medical test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
//     {
//         id: "6",
//         date: "1/2/2025",
//         color: "#6ACA60",
//         title: "Medical test",
//         doctor: "Dr.John sarvesh",
//         hospital: "Francies Hospital",
//         desc: "Consoling your health and blood level as more prevented by consultation for non undeted",
//     },
// ];

// const PatientHistory = () => {
//     const renderItem = ({ item, index }: any) => {
//         const isFirst = index === 0;
//         const isLast = index === DATA.length - 1;

//         return (
//             <View className="px-2 mt-[22px]">
//                 <View className="flex-row">
//                     <Text className="text-[12px] mr-[11px] mt-[2px]">{item.date}</Text>

//                     <View className="items-center mr-[11px] self-stretch">
//                         {!isFirst && <View style={styles.lineTop} />}

//                         <View
//                             className="p-[4px] rounded-full"
//                             style={{ backgroundColor: item.color }}
//                         >
//                             <Entypo name="star" size={10} color="white" />
//                         </View>

//                         {!isLast && <View style={styles.lineBottom} />}
//                     </View>

//                     <View className="flex-1">
//                         <Text className="text-[12px] font-semibold">{item.title}</Text>

//                         <View
//                             className="bg-white rounded-lg p-[11px] border-l-[2px] mt-[10px]"
//                             style={{ borderLeftColor: item.color, elevation: 3 }}
//                         >
//                             <Text className="text-[10px] font-medium mb-[2px]">{item.hospital}</Text>
//                             <Text className="text-[10px] text-[#BBBABA] font-medium mb-[6px]">{item.doctor}</Text>
//                             <Text className="text-[9px] text-[#010101] font-light mb-[15px]">{item.desc}</Text>

//                             <Pressable className="ml-auto flex-row items-center active:opacity-70">
//                                 <Text className="text-[8px] text-[#14386C] font-normal mr-[2px]">View more</Text>
//                                 <Ionicons name="arrow-forward" className="relative top-[1px]" size={9} color="#1E6B8D" />
//                             </Pressable>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         );
//     };

//     return (
//         <SafeAreaView className="flex-1 bg-[white] px-4">
//             <View className="flex-row justify-between mt-[10px] mb-5">

//                 <View className="flex-row items-center">
//                     <TouchableOpacity onPress={() => router.back()}>
//                         <IconSymbol name={"arrow-left.fill"} size={25} color={"black"} />
//                     </TouchableOpacity>

//                     <Text className="text-[20px] font-semibold ml-[16px]">Patient history</Text>
//                 </View>

//                 <Ionicons name="search" size={24} color="black" />
//             </View>

//             <View className="w-full h-[1px] bg-[#E4E4E45C]" />

//             <FlatList
//                 data={DATA}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={{ paddingBottom: 40 }}
//             />
//         </SafeAreaView>
//     );
// };

// export default PatientHistory;

// const styles = StyleSheet.create({
//     lineTop: {
//         // width: 2,
//         // flex: 1,
//         // backgroundColor: "#E6E6E6",
//     },
//     lineBottom: {
//         width: 2,
//         flex: 1,
//         backgroundColor: "#E6E6E6",
//         marginBottom: -26
//     },
// });


import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { IconSymbol } from "@/components/ui/icon-symbol";
import PatientHistoryService from "../service/patientHistoryService";

interface Medication {
    name: string;
    dose: string;
    days: number;
    startDate: string;
    endDate: string;
}

interface TimelineItem {
    id: string;
    date: string;
    title: string;
    hospital: string;
    doctor: string;
    desc: string;
    color: string;
    medications: Medication[];
}

const PatientHistory = () => {
    const [history, setHistory] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            fetchPatientHistory(id);
        }
    }, [id]);

    const fetchPatientHistory = async (patientId: string) => {
        try {
            const response = await PatientHistoryService.getPatientHistoryById(patientId);
            // console.log("API response:", response);

            if (response.success && response.data) {
                const mappedData: TimelineItem[] = response.data.map((item: any) => {
                    let meds: Medication[] = [];

                    if (item.details) {
                        try {
                            const parsed = JSON.parse(item.details);
                            if (parsed.medications && Array.isArray(parsed.medications)) {
                                meds = parsed.medications.map((m: any) => ({
                                    name: m.label || m.name || "N/A",
                                    dose: m.dose || "N/A",
                                    days: m.days || 0,
                                    startDate: m.startDate || "N/A",
                                    endDate: m.endDate || "N/A",
                                }));
                            }
                        } catch (e) {
                            // If parsing fails, details might be just a string, not JSON
                        }
                    }

                    // Also check if present_medication is an array (populated)
                    if (meds.length === 0 && Array.isArray(item.present_medication)) {
                        meds = item.present_medication.map((m: any) => ({
                            name: m.name || m.label || "N/A",
                            dose: m.dose || m.dosage || "N/A",
                            days: m.days || 0,
                            startDate: m.startDate || m.start_date || "N/A",
                            endDate: m.endDate || m.end_date || "N/A",
                        }));
                    }

                    return {
                        id: item._id,
                        date: new Date(item.createdAt).toLocaleDateString(),
                        title: item.details && !item.details.startsWith("{") ? item.details : (item.action === "add" ? "Patient Added" : "Profile Updated"),
                        hospital: item.address || "Unknown Hospital",
                        doctor: item.caregiver_name || "Assigned Doctor",
                        desc: item.medical_conditions?.name || "No description available",
                        color: getColorByGender(item.gender),
                        medications: meds,
                    };
                });

                setHistory(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch patient history", error);
        } finally {
            setLoading(false);
        }
    };

    const getColorByGender = (gender: string) => {
        switch (gender) {
            case "male":
                return "#6ACA60";
            case "female":
                return "#6567D5";
            default:
                return "#E1AE41";
        }
    };

    const renderItem = ({ item, index }: any) => {
        const isFirst = index === 0;
        const isLast = index === history.length - 1;

        return (
            <View className="px-2 mt-[22px]">
                <View className="flex-row">
                    <Text className="text-[12px] mr-[11px] mt-[2px] font-semibold w-[55px]">{item.date}</Text>

                    <View className="items-center mr-[11px] self-stretch">
                        {!isFirst && <View style={styles.lineTop} />}

                        <View
                            className="p-[4px] rounded-full"
                            style={{ backgroundColor: item.color }}
                        >
                            <Entypo name="star" size={10} color="white" />
                        </View>

                        {!isLast && <View style={styles.lineBottom} />}
                    </View>

                    <View className="flex-1">
                        {/* <Text className="text-[12px] font-semibold">{item.title}</Text> */}
                        <Text className="text-[12px] font-semibold">{item.desc}</Text>

                        <View
                            className="bg-white rounded-lg p-[11px] border-l-[2px] mt-[10px]"
                            style={{ borderLeftColor: item.color, elevation: 3 }}
                        >
                            <Text className="text-[11px] font-medium mb-[2px]">Dr. {item.doctor}</Text>
                            <Text className="text-[10px] text-[#BBBABA] font-medium mb-[6px]">{item.hospital}</Text>
                            <View className="mt-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3">
                                <View className="mb-2">
                                    <Text className="text-[11px] font-bold text-[#1E293B]">Medications</Text>
                                </View>

                                {item.medications && item.medications.length > 0 ? (
                                    item.medications.map((med: any, idx: number) => (
                                        <View key={idx} className={`${idx !== 0 ? 'mt-2 pt-2 border-t border-[#EDF2F7]' : ''}`}>
                                            <Text className="text-[10px] text-[#1E293B] font-semibold mb-1">{med.name}</Text>
                                            <View className="flex-row flex-wrap">
                                                <Text className="text-[9px] text-[#64748B] w-1/2 mb-0.5">• Dose: {med.dose}</Text>
                                                <Text className="text-[9px] text-[#64748B] w-1/2 mb-0.5">• Days: {med.days}</Text>
                                                <Text className="text-[9px] text-[#64748B] w-1/2">• Start: {med.startDate}</Text>
                                                <Text className="text-[9px] text-[#64748B] w-1/2">• End: {med.endDate}</Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-[10px] text-[#64748B] font-light italic">{item.desc}</Text>
                                )}
                            </View>

                            {/* <Pressable
                                className="ml-auto w-[52px] px-[7px] py-[4px] bg-[#FAFAFA] items-center rounded-[5px] active:opacity-70"
                                style={{ elevation: 3 }}
                            >
                                <Text className="text-[8px] font-normal text-[#ACACAC]">View more</Text>
                            </Pressable> */}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!loading && history.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white px-4">
                <View className="flex-row justify-between mt-[10px] mb-5">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()}>
                            <IconSymbol name={"arrow-left.fill"} size={25} color={"black"} />
                        </TouchableOpacity>
                        <Text className="text-[20px] font-semibold ml-[16px]">
                            Patient history
                        </Text>
                    </View>
                </View>

                <View className="w-full h-[1px] bg-[#E4E4E45C]" />

                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-400 text-[14px]">
                        No history found for this patient
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[white] px-4">
            <View className="flex-row justify-between mt-[10px] mb-5">

                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <IconSymbol name={"arrow-left.fill"} size={25} color={"black"} />
                    </TouchableOpacity>

                    <Text className="text-[20px] font-semibold ml-[16px]">Patient history</Text>
                </View>

                <Ionicons name="search" size={24} color="black" />
            </View>

            <View className="w-full h-[1px] bg-[#E4E4E45C]" />

            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </SafeAreaView>
    );
};

export default PatientHistory;

const styles = StyleSheet.create({
    lineTop: {
        // width: 2,
        // flex: 1,
        // backgroundColor: "#E6E6E6",
    },
    lineBottom: {
        width: 2,
        flex: 1,
        backgroundColor: "#E6E6E6",
        marginBottom: -26
    },
});