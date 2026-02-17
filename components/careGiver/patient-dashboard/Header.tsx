// import { IconSymbol } from "@/components/ui/icon-symbol";
// import { router, useLocalSearchParams } from "expo-router";
// import { Pressable, Text, TouchableOpacity, View } from "react-native";
// import { Avatar } from "react-native-paper";

// export default function PatientDashboardHeader() {
//     const { id, patientId, phone, image, name } = useLocalSearchParams<{
//         id: string;
//         patientId?: string;
//         phone?: string;
//         image?: string;
//         name?: string;
//     }>();

//     const patientHistory = () => {
//         router.push("/screen/PatientHistoryPage");
//     }

//     const patientProfile = () => {
//         router.push({
//             pathname: "/screen/PatientProfilePage",
//             params: {
//                 id,
//                 name,
//                 patientId,
//                 phone,
//                 image,
//             },
//         });
//     }

//     return (
//         <View className="px-4 mt-[10px] mb-[20px]">
//             <View className="flex-row items-center justify-between">
//                 <Pressable onPress={patientProfile} className="active:opacity-70">
//                     <Avatar.Image
//                         size={40}
//                         source={{
//                             uri: image ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//                         }}
//                         style={{ backgroundColor: "white" }} />
//                 </Pressable>

//                 <Text className="text-[20px] font-semibold">{name ?? "Patient Name"}</Text>

//                 <TouchableOpacity onPress={patientHistory}>
//                     <IconSymbol name={"history.fill"} color={"black"} size={26} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }


import { PatientPayload } from "@/app/service/patientFormService";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

interface Props {
    patient: PatientPayload | null;
}

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/861/861503.png";

export default function PatientDashboardHeader({ patient }: Props) {
    if (!patient) return null;

    const patientHistory = () => {
        router.push({
            pathname: "/screen/PatientHistoryPage",
            params: {
                id: patient._id,
            },
        });
    };

    const patientProfile = () => {
        router.push({
            pathname: "/screen/PatientProfilePage",
            params: {
                id: patient._id,
            },
        });
    };

    return (
        <View className="px-4 mt-[10px] mb-[20px]">
            <View className="flex-row items-center justify-between">
                <Pressable onPress={patientProfile} className="active:opacity-70">
                    <Avatar.Image
                        size={40}
                        source={{
                            uri: String(patient.image || DEFAULT_IMAGE),
                        }}
                        style={{ backgroundColor: "white" }}
                    />
                </Pressable>

                <Text
                    numberOfLines={1}
                    className="text-[20px] font-semibold max-w-[60%]"
                >
                    {patient.name}
                </Text>

                <TouchableOpacity onPress={patientHistory}>
                    <IconSymbol name="history.fill" color="black" size={26} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
