import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";

export interface CreatePatientPayload {
    caregiver_id: string;
    name: string;
    date_of_birth?: string | null;
    age: number;
    gender: "male" | "female" | "other";
    phone: string;
    emergency_contact?: string;
    bloodGroup?: {
        _id: string;
        name: string;
    };
    //  bloodGroup?: string | {
    //     _id: string;
    //     bloodGroup?: string;
    // };
    address?: string;
    height?: number;
    weight?: number;
    medical_conditions?: string;
    present_medication?: string;
    details?: string;
}

export interface PatientPayload {
    _id: string;
    patientId: string;
    image: string;

    caregiver_id: string;
    name: string;
    date_of_birth?: string | null;
    age: number;
    gender: "male" | "female" | "other";
    phone: string;
    emergency_contact?: string;
    bloodGroup?: {
        _id: string;
        name: string;
    };
    address?: string;
    height?: number;
    weight?: number;
    details?: string;
    medical_conditions?: {
        _id: string;
        name: string;
    };
    present_medication?: string | {
        _id: string;
        name: string;
    };
    createdAt?: string;
    past_surgeries?: string;
}

export interface PatientResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: PatientPayload;
}

const PatientFormService = {
    async createPatient(payload: CreatePatientPayload): Promise<PatientResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<PatientResponse>(API_ENDPOINTS.CREATE_PATIENT, {
            method: "POST",
            body: payload,
            token,
        });

        // const data = await response.json();
        console.log("API response:", response);
        return response;
    },

    async getPatient(): Promise<PatientResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const response = await fetchAPI<PatientResponse>(API_ENDPOINTS.GET_PATIENTS, {
            method: "GET",
            token,
        });
        return response;
    },

    async getPatientById(id: string): Promise<PatientResponse> {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found. Please login again.");

        const url = `${API_ENDPOINTS.GET_PATIENTS_BY_ID}/${id}`;

        const response = await fetchAPI<PatientResponse>(url, {
            method: "GET",
            token,
        });

        console.log("RAW patient response:", response);
        return response;
    },

    async getPaginatedPatients(page: number, limit: number, search: string, patient: string) {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        let url = `${API_ENDPOINTS.GET_PATIENTS}?page=${page}&limit=${limit}&search=${search}`;

        if (patient && patient !== "all") {
            url += `&patient_type_id=${patient}`;
        }

        // console.log("API URL =>", url);

        return fetchAPI<any>(url, {
            method: "GET",
            token,
        }).then((res) => res.data);
    },
}

export default PatientFormService;
