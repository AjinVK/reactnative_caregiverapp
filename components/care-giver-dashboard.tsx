import { FlatList, StatusBar, View } from "react-native";
import Header from "./careGiver/home-screen/Header";
import Notification from "./careGiver/home-screen/Notification";
import PatientList from "./careGiver/home-screen/PatientList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CareGiverDashBoard() {
    const sections = [
        { key: "header", component: <Header /> },
        { key: "notification", component: <Notification /> },
        { key: "patientList", component: <PatientList /> },
    ];

    return (
        <>
            <StatusBar translucent barStyle="dark-content" />
            <SafeAreaView className="bg-[white]">
            <View className="h-full bg-[#fff]">
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => <View>{item.component}</View>}
                    showsVerticalScrollIndicator={false} />
            </View>
            </SafeAreaView>
        </>
    );
}