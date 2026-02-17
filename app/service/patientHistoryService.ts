import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";

export interface PatientHistoryPayload {
    caregiver_id: string;
    name: string;
    date_of_birth?: string | null;
    age: number;
    gender: "male" | "female" | "other";
    phone: string;
    emergency_contact?: string;
    bloodGroup?: string;
    address?: string;
    height?: number;
    weight?: number;
    details?: string;
    medical_conditions?: string;
    present_medication?: string;
    registrationDate?: string;
    past_surgeries?: string;
}

export interface PatientHistoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
}

const PatientHistoryService = {
    async getPatientHistoryById(id: string): Promise<PatientHistoryResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const url = `${API_ENDPOINTS.GET_PATIENTS_HISTORY_BY_ID}/${id}`;
        console.log("Fetching patient history URL:", url);

        const response = await fetchAPI<PatientHistoryResponse>(url, {
            method: "GET",
            token,
        });

        return response;
    },
}

export default PatientHistoryService;