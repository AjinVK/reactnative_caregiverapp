import PatientFormService, { PatientPayload } from "@/app/service/patientFormService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chart from "../Chart";
import ChatButton from "../ChatButton";
import PatientDashboardHeader from "./Header";
import HealthDetails from "./HealthDetails";
import PatientHealthInfo, { SelectedItem } from "./PatientHealthInfo";

export default function PatientDashboard() {
    const params = useLocalSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [patientData, setPatientData] = useState<PatientPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState<SelectedItem[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchPatient = async () => {
            try {
                setLoading(true);
                console.log("Fetching patient by ID:", id);

                const response = await PatientFormService.getPatientById(id);
                console.log("Patient Detail: ", response);
                if (response?.success && response?.data) {
                    const patient = response.data;
                    setPatientData(patient);

                    let meds: SelectedItem[] = [];

                    if (patient.details) {
                        try {
                            const parsedDetails = JSON.parse(patient.details);
                            if (parsedDetails.medications && Array.isArray(parsedDetails.medications)) {
                                meds = parsedDetails.medications.map((m: any) => ({
                                    label: m.label || m.name || "",
                                    value: m.value || m._id || "",
                                    dose: m.dose || "",
                                    days: Number(m.days) || 0,
                                    startDate: m.startDate || null,
                                    endDate: m.endDate || null,
                                }));
                            }
                        } catch (e) {
                            // details is just a plain string (legacy notes)
                        }
                    }

                    // Fallback to present_medication if no detailed meds found in details
                    if (meds.length === 0 && patient.present_medication) {
                        if (typeof patient.present_medication === 'object' && 'name' in patient.present_medication) {
                            meds = [{
                                label: (patient.present_medication as any).name,
                                value: (patient.present_medication as any)._id,
                                dose: "",
                                days: 0,
                                startDate: null,
                                endDate: null,
                            }];
                        }
                    }

                    setMedications(meds);
                } else {
                    console.warn("Patient not found");
                    setPatientData(null);
                    setMedications([]);
                }
            } catch (err) {
                console.error("Error fetching patient:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const sections = [
        { key: "header", component: <PatientDashboardHeader patient={patientData} /> },
        { key: "chart", component: <Chart /> },
        { key: "healthDetails", component: <HealthDetails /> },
        {
            key: "patientHealthInfo", component: (
                <PatientHealthInfo
                    bloodType={patientData?.bloodGroup?.name ?? ""}
                    height={patientData?.height ? `${patientData.height} cm` : ""}
                    weight={patientData?.weight ? `${patientData.weight} kg` : ""}
                    medications={medications}
                />
            )
        },
    ];

    return (
        <>
            <StatusBar translucent barStyle="dark-content" />
            <SafeAreaView className="h-full bg-[white]">
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => <View>{item.component}</View>}
                    showsVerticalScrollIndicator={false} />

                {patientData?._id && (<ChatButton patientId={String(patientData._id)} />)}
            </SafeAreaView>
        </>
    );
}