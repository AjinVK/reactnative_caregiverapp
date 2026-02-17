import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MedicalConditionPayload {
    _id?: string;
    name: string;
    isActive?: boolean;
}

export interface MedicalConditionResponse {
    success: boolean;
    statusCode?: number;
    message?: string;
    data: MedicalConditionPayload;
}

export interface MedicalConditionListResponse {
    success: boolean;
    data: MedicalConditionPayload[];
}

const MedicalConditionService = {
    async createMedicalCondition(payload: MedicalConditionPayload): Promise<MedicalConditionResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<MedicalConditionResponse>(API_ENDPOINTS.CREATE_MEDICALCONDITION, {
            method: "POST",
            body: payload,
            token,
        });

        return response;
    },

    async getAllMedicalCondition(): Promise<MedicalConditionPayload[]> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<MedicalConditionListResponse>(API_ENDPOINTS.GET_MEDICALCONDITION, {
            method: "GET",
            token,
        });

        return response.data;
    },
};

export default MedicalConditionService;
