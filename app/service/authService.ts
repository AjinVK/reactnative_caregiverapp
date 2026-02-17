import { fetchAPI } from "../api/apiClient";
import API_ENDPOINTS from "../api/apiEndPoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = 'auth_token';

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
            _id: string;
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
            password: payload.password
        };

        const response = await fetchAPI<AuthResponse>(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: loginPayload,
        });

        // if (response?.token) {
        //     await AsyncStorage.setItem(TOKEN_KEY, response.token);
        // }

        console.log("LOGIN response:", response);

        const token = response?.data?.token;
        const userId = response?.data?.user?._id;

        if (token && userId) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
            await AsyncStorage.setItem("user_id", userId);

            console.log("✅ Token stored:", token);
            console.log("✅ User ID stored:", userId);
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
            confirm_password: payload.confirmPassword
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