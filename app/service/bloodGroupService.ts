import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface BloodGroupPayload {
    _id?: string;
    name: string;
    isActive?: boolean;
}

export interface BloodGroupResponse {
    success: boolean;
    statusCode?: number;
    message?: string;
    data: BloodGroupPayload;
}

export interface BloodGroupListResponse {
    success: boolean;
    data: BloodGroupPayload[];
}

const BloodGroupService = {
    async createBloodGroup(payload: BloodGroupPayload): Promise<BloodGroupResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<BloodGroupResponse>(API_ENDPOINTS.CREATE_BLOODGROUP, {
            method: "POST",
            body: payload,
            token,
        });

        return response;
    },

    async getAllBloodGroups(): Promise<BloodGroupPayload[]> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<BloodGroupListResponse>(API_ENDPOINTS.GET_BLOODGROUP, {
            method: "GET",
            token,
        });

        return response.data;
    },
};

export default BloodGroupService;
