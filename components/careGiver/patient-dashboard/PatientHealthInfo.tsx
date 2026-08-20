import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export type SelectedItem = {
    label: string;
    value: string;
    dose: string;
    days: number;
    startDate: string | null;
    endDate: string | null;
};

interface PatientHealthInfoProps {
    bloodType: string;
    height: string;
    weight: string;
    medications: SelectedItem[];
}

export default function PatientHealthInfo({
    bloodType,
    height,
    weight,
    medications = [],
}: PatientHealthInfoProps) {
    console.log("TABLE RECEIVED MEDICATIONS =>", medications);
    return (
        <View className="px-4 mb-[20px]">
            <Text className="text-[20px] font-semibold mb-[15px]">Patient health info </Text>

            <View className="rounded-[7px] px-[18px] bg-[white] shadow">

                <View className="bg-[#FFF5F5] rounded-[8px] w-full mt-[20px] mb-[12px] h-[50px] justify-center px-2 pr-3">
                    <View className="flex-row items-center justify-between overflow-hidden">
                        <View className="flex-row items-center">
                            <View className="w-[45px] h-[41px] bg-[#FFE6E6] rounded-[8px] items-center justify-center">
                                <Fontisto name="blood-drop" size={24} color="#C54040" />
                            </View>

                            <Text className="text-[17px] text-[#932828] font-semibold ml-[15px]">Blood type</Text>
                        </View>

                        <View className="flex-row items-baseline">
                            <Text className="text-[20px] text-[#932828] font-semibold">
                                {bloodType ? bloodType.replace(/[\+\-]/, "") : "--"}
                            </Text>
                            {bloodType && (
                                <Text className="text-[10px] text-[#932828] font-semibold ml-0.5">
                                    {bloodType.includes("+") ? "+ve" : bloodType.includes("-") ? "-ve" : ""}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <View className="bg-[#F2FBFE] rounded-[8px] w-full h-[50px] mb-[12px] justify-center px-2 pr-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-[45px] h-[41px] bg-[#D6F6FF] rounded-[8px] items-center justify-center">
                                <MaterialCommunityIcons name="human-male-height" size={24} color="#13667C" />
                            </View>

                            <Text className="text-[17px] text-[#0D5164] font-semibold ml-[15px]">Height</Text>
                        </View>

                        <Text className="text-[15px] text-[#0D5164] font-semibold">{height || "--"}</Text>
                    </View>
                </View>

                <View className="bg-[#F6F7FF] rounded-[8px] w-full h-[50px] mb-[20px] justify-center px-2 pr-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-[45px] h-[41px] bg-[#E5E8FF] rounded-[8px] items-center justify-center">
                                <Image
                                    source={require("@/assets/patientDashboard/balance-scale-left.png")}
                                    resizeMode="contain" 
                                    style={{ width: 24, height: 24, tintColor: "#101D84" }} 
                                />
                            </View>

                            <Text className="text-[17px] text-[#0C1662] font-semibold ml-[15px]">Weight</Text>
                        </View>

                        <Text className="text-[15px] text-[#0C1662] font-semibold">{weight || "--"}</Text>
                    </View>
                </View>

                <View className="bg-[#E6E6E6] h-[1px] mb-[15px]" />

                <Text className="text-[17px] font-semibold mb-[15px]">Current medication</Text>
                <View style={styles.tableContainer} className="mb-[20px]">
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>
                            Medicine name
                        </Text>
                        <Text style={[styles.cell, styles.headerText]}>Days</Text>
                        <Text style={[styles.cell, styles.headerText]}>Start date</Text>
                        <Text style={[styles.cell, styles.headerText]}>End date</Text>
                        <Text style={[styles.cell, styles.headerText]}>Dose</Text>
                    </View>

                    {medications.map((med, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.cell, { flex: 2 }]}>{med.label}</Text>
                            <Text style={styles.cell}>{med.days}</Text>
                            <Text style={styles.cell}>{med.startDate ?? "-"}</Text>
                            <Text style={styles.cell}>{med.endDate ?? "-"}</Text>
                            <Text style={styles.cell}>{med.dose}</Text>
                        </View>
                    ))}

                    {medications.length === 0 && (
                        <View style={styles.tableRow}>
                            <Text style={[styles.cell, { flex: 1 }]}>
                                No medication found
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    tableContainer: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        minHeight: 42,
        alignItems: "center",
    },

    tableHeader: {
        backgroundColor: "#1E5B91",
    },

    cell: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 6,
        fontSize: 11,
        color: "#111827",
        textAlign: "center",
    },

    headerText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

});