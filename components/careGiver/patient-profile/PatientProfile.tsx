import { IconSymbol } from "@/components/ui/icon-symbol";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Image, LayoutAnimation, Linking, Platform, Pressable, ScrollView, Text, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeightIcon from "@/assets/careGiver/weight.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { Modal, ActivityIndicator } from "react-native";
import PatientFormService, { PatientPayload } from "@/app/service/patientFormService";

export default function PatientProfile() {

    const { id } = useLocalSearchParams<{ id?: string }>();
    const [patientData, setPatientData] = useState<PatientPayload | null>(null);

    const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/861/861503.png";

    const imageUri = patientData?.image || DEFAULT_IMAGE;

    const phoneStr = patientData?.phone;

    const handleContactPress = () => {
        if (!phoneStr) return;
        Linking.openURL(`tel:${phoneStr}`);
    };

    const handleMessage = () => {
        router.push({
            pathname: "/screen/ChatPage",
            params: {
                patientId: patientData?._id,
                patientName: patientData?.name,
            },
        });
    };
    if (
        Platform.OS === "android" &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpen(!open);
    };
    const reportList = [
        {
            id: "1",
            title: "Check up result 20-03-2024",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        },
        {
            id: "2",
            title: "Blood test report 10-02-2024",
            pdfUrl: "https://www.orimi.com/pdf-test.pdf",
        },
    ];
    const [visible, setVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchPatientById = async () => {
            try {
                setLoading(true);

                const response = await PatientFormService.getPatientById(id);
                console.log("Patient Profile: ", response);
                if (response.success && response.data) {
                    setPatientData(response.data);
                } else {
                    console.warn("Failed to fetch patient:", response.message);
                }
            } catch (error) {
                console.error("Error fetching patient by ID:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientById();
    }, [id]);


    const vitals = [
        {
            label: "Height",
            value: patientData?.height
                ? `${patientData.height} cm`
                : "--",
            icon: <MaterialCommunityIcons name="human-male-height" size={15} color="black" />,
        },
        {
            label: "Weight",
            value: patientData?.weight
                ? `${patientData.weight} kg`
                : "--",
            icon: <WeightIcon />,
        },
        {
            label: "Blood",
            value: patientData?.bloodGroup
                ? patientData.bloodGroup.name
                : "--",
            icon: <Fontisto name="blood-drop" size={14} color="#E93A3A" />,
        },
    ];


    const openPdf = (pdfUrl: string) => {
        setSelectedPdf(pdfUrl);
        setVisible(true);
        setLoading(true);
    };
    const generalInfoData = [
        // { label: "Date of birth", value: patientData?.date_of_birth ?? "--" },
        { label: "Date of birth", value: patientData?.date_of_birth ? new Date(patientData.date_of_birth).toLocaleDateString() : "--" },
        { label: "Gender", value: patientData?.gender ?? "--" },
        { label: "Age", value: patientData?.age?.toString() ?? "--" },
        { label: "Location", value: patientData?.address ?? "--" },
        { label: "Registration date", value: patientData?.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : "--" },
    ];

    // const formatNames = (data?: { name: string } | { name: string }[]) => {
    //     if (!data) return "--";
    //     if (Array.isArray(data)) {
    //         return data.map(d => d.name).join(", ");
    //     }
    //     return data.name;
    // };

    const formatNames = (
        data?: string | { name: string } | { name: string }[]
    ) => {
        if (!data) return "--";

        if (typeof data === "string") return data;

        if (Array.isArray(data)) return data.map(d => d.name).join(", ");

        return data.name;
    };

    const medicalInfoData = [
        {
            label: "Medical Conditions",
            value: formatNames(patientData?.medical_conditions),
        },
        {
            label: "Present Medication",
            value: formatNames(patientData?.present_medication),
        },
    ];

    return (
        <>
            <View className="flex-1 bg-[#E3EEFE]">
                <SafeAreaView>
                    <View className="mt-[10px] px-4 mb-[68px]">
                        <Pressable
                            className="w-[33px] h-[33px] bg-white items-center justify-center rounded-full active:opacity-70"
                            onPress={router.back}
                        >
                            <IconSymbol name={"arrow-left.fill"} color={""} />
                        </Pressable>
                    </View>
                </SafeAreaView>

                <View className="flex-1 relative">
                    <View
                        className="absolute left-0 right-0 bottom-0 bg-white"
                        style={{
                            borderTopRightRadius: 16,
                            borderTopLeftRadius: 16,
                            top: 60,
                        }}
                    />

                    <View className="px-4 flex-row items-end">
                        <View className="w-[125px] h-[125px] items-center justify-center bg-white" style={{
                            elevation: 7, borderRadius: 19
                        }}>
                            <Image
                                source={{ uri: imageUri }}
                                style={{ width: 115, height: 115, borderRadius: 19 }}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="ml-[19px]">
                            <View className="flex-row items-center">
                                <Text className="text-[20px] font-medium"> {patientData?.name ?? "Unknown Patient"}</Text>
                                <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={16} color="#95B5FA" className="ml-[8px]" />
                            </View>
                            <Text className="text-[13px] font-normal mt-[10px]">{patientData?._id ?? "--"}</Text>
                        </View>
                    </View>

                    <View className="px-4 mt-[20px] flex-row gap-7">
                        {vitals.map((item, index) => (
                            <View key={index}>
                                <Text className="text-[#A8A5A5] text-[12px]">
                                    {item.label}
                                </Text>

                                <View className="flex-row items-center mt-[6px]">
                                    {item.icon}
                                    <Text className="text-[13px] font-normal ml-[3px]">
                                        {item.value}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View className="px-4 mt-[20px] flex-row justify-between">
                        <Pressable onPress={handleContactPress} className="active:opacity-70">
                            <LinearGradient
                                colors={["#CADBFF", "#729AF0"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                className="flex-row w-[172px] h-[36px]"
                                style={{ borderRadius: 8 }}
                            >
                                <View className="flex-row items-center ml-[15px] gap-7">
                                    <IconSymbol name={"phone-call.outline"} color={""} size={20} />
                                    <Text className="text-[14px] font-normal">Contact</Text>
                                </View>
                            </LinearGradient>
                        </Pressable>

                        <Pressable onPress={handleMessage} className="active:opacity-70">
                            <LinearGradient
                                colors={["#CADBFF", "#729AF0"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                className="flex-row w-[172px] h-[36px]"
                                style={{ borderRadius: 8 }}
                            >
                                <View className="flex-row items-center ml-[15px] gap-7">
                                    <IconSymbol name={"message.outline"} color={""} size={20} />
                                    <Text className="text-[14px] font-normal">Message</Text>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <View className="px-4">
                        <View className="h-[1px] bg-[#D9D9D9] mt-[24px]" />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="px-4 mb-[40px]">
                        <Text className="text-[20px] font-bold mb-[20px] mt-[20px]">General info</Text>

                        {generalInfoData.map((item, index) => {
                            const isLastItem = item.label === "Registration date";

                            return (
                                <View key={index}>
                                    <Text className="text-[13px] font-medium text-[#AAAAAA] mb-[8px]">
                                        {item.label}
                                    </Text>

                                    <Text
                                        className={`text-[15px] font-medium ${isLastItem ? "mb-[20px]" : "mb-[12px]"
                                            }`}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                            );
                        })}

                        <View className="h-[1px] bg-[#D9D9D9] mb-[20px]" />

                        <Text className="text-[20px] font-bold mb-[20px]">Medical info</Text>

                        {medicalInfoData.map((item, index) => {
                            const isLastItem = item.label === "Past Surgeries";

                            return (
                                <View key={index}>
                                    <Text className="text-[13px] font-medium text-[#AAAAAA] mb-[8px]">
                                        {item.label}
                                    </Text>

                                    <Text
                                        className={`text-[15px] font-medium ${isLastItem ? "mb-[20px]" : "mb-[12px]"
                                            }`}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                            );
                        })}

                        <View className="h-[1px] bg-[#D9D9D9] mb-[20px]" />

                        <View className="flex-row justify-between mb-[25px]">
                            <Text className="text-[20px] font-bold">Report</Text>
                            <Pressable
                                onPress={toggleOpen} className="active:opacity-70">
                                <MaterialIcons
                                    name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                    size={23}
                                    color={"#000"}
                                />
                            </Pressable>
                        </View>
                        {open && (
                            <FlatList
                                data={reportList}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View>
                                        <View className="flex-row items-center justify-between mb-[15px]">
                                            <View className="flex-row items-center">
                                                <Ionicons name="document-text" size={21} color="#AAAAAA" />
                                                <Text className="text-[15px] ml-[10px] font-medium text-[#AAAAAA]">
                                                    {item.title}
                                                </Text>
                                            </View>

                                            <Pressable
                                                onPress={() => openPdf(item.pdfUrl)}
                                                className="flex-row items-center px-2 py-1.5 rounded-[8px] bg-[#6B94EA] active:opacity-80"
                                            >
                                                <Ionicons name="eye" size={14} color="white" />
                                                <Text className="text-[11px] font-medium text-white ml-[3px]">
                                                    View
                                                </Text>
                                            </Pressable>
                                        </View>

                                        <View className="h-[1px] bg-[#D9D9D9] mb-[15px]" />
                                    </View>
                                )}
                            />
                        )}
                    </ScrollView>
                </View>
            </View>
            {/* </SafeAreaView> */}

            <Modal visible={visible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                        <Text className="text-[16px] font-bold">Report Preview</Text>
                        <Pressable onPress={() => setVisible(false)}>
                            <Ionicons name="close" size={24} />
                        </Pressable>
                    </View>

                    {loading && (
                        <ActivityIndicator
                            size="large"
                            color="#6B94EA"
                            style={{ marginTop: 20 }}
                        />
                    )}

                    {selectedPdf && (
                        <WebView
                            // source={{ uri: selectedPdf }}
                            source={{
                                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
                                    selectedPdf
                                )}`,
                            }}
                            style={{ flex: 1 }}
                            onLoadEnd={() => setLoading(false)}
                        />
                    )}

                </SafeAreaView>
            </Modal>
        </>
    );
}