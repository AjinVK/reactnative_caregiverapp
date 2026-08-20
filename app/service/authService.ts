import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = 'token';

interface LoginPayload {
    userName: string;
    password: string;
}

interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface AuthResponse {
    statuscode: number;
    // token?: string;
    message?: string;
    // user: { id: number; name: string; email: string };
      data: {
        token?: string;
        user: {
            user_id: string;
            patient_id: string | null;
            first_name: string;
            email: string;
        };
    };
}

const AuthService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        console.log("Sending LOGIN request:", payload);

        const userName = payload.userName.trim();
        const firstName = userName.split(' ')[0];

        const loginPayload = {
            first_name: firstName,
            user_name: userName,
            password: payload.password,
            role: "caregiver",
            app_type: "caregiver",
        };

        const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: loginPayload,
        });

        console.log("CAREGIVER LOGIN response:", JSON.stringify(response, null, 2));

        const token = response?.data?.token;
        const userId = response?.data?.user?.user_id;

        if (token && userId) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem("user_id", userId);
            await AsyncStorage.setItem("user_role", "caregiver");

            if (response?.data?.user?.patient_id) {
                await AsyncStorage.setItem("patient_id", response.data.user.patient_id);
                console.log("✅ Patient ID stored:", response.data.user.patient_id);
            }

            console.log("✅ Caregiver login success");
            console.log("✅ Token stored:", token);
            console.log("✅ User ID stored:", userId);
            console.log("✅ User Role stored: caregiver");
        } else {
            console.error("❌ Token or User ID missing in login response");
        }

        return response;
    },

    async register(payload: RegisterPayload): Promise<AuthResponse> {

        console.log("Sending REGISTER request:", payload);
        console.log("Register endpoint:", API_ENDPOINTS.REGISTER);

        console.log("🚀 [AuthService] REGISTER called");
        console.log("📦 Payload being sent:", JSON.stringify(payload, null, 2));
        console.log("🌍 Endpoint:", API_ENDPOINTS.REGISTER);

        const transformedPayload = {
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            password: payload.password,
            confirm_password: payload.confirmPassword,
            role: "caregiver",
            app_type: "caregiver",
        };

        const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            body: transformedPayload,
        });

        console.log("✅ [AuthService] REGISTER response:", JSON.stringify(response, null, 2));
        return response;
    },

    async logout() {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user_id");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("patient_id");
        await AsyncStorage.removeItem("user_role");
    },

    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return !!token;
    },
};

export default AuthService;