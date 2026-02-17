import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PresentMedicationPayload {
    _id?: string;
    name: string;
    isActive?: boolean;
}

export interface PresentMedicationResponse {
    success: boolean;
    statusCode?: number;
    message?: string;
    data: PresentMedicationPayload;
}

export interface PresentMedicationListResponse {
    success: boolean;
    data: PresentMedicationPayload[];
}

const PresentMedicationService = {
    async createPresentMedication(payload: PresentMedicationPayload): Promise<PresentMedicationResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<PresentMedicationResponse>(API_ENDPOINTS.CREATE_PRESENTMEDICATION, {
            method: "POST",
            body: payload,
            token,
        });

        return response;
    },

    async getAllPresentMedication(): Promise<PresentMedicationPayload[]> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<PresentMedicationListResponse>(API_ENDPOINTS.GET_PRESENTMEDICATION, {
            method: "GET",
            token,
        });

        return response.data;
    },
};

export default PresentMedicationService;
