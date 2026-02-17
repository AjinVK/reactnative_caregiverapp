import AsyncStorage from "@react-native-async-storage/async-storage";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetchOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    token?: string;
    isMultipart?: boolean;
}

// api.ts
export async function fetchAPI<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
//   console.log("🌍 API CALL →", endpoint);
    const { method = 'GET', headers = {}, body, token, isMultipart = false, } = options;

    const fetchHeaders: Record<string, string> = {
        ...headers,
    };

    if (!isMultipart) {
        fetchHeaders["Content-Type"] = "application/json";
    }

    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken || token) {
        fetchHeaders['Authorization'] = `Bearer ${token || storedToken}`;
    }

    const fetchOptions: RequestInit = {
        method,
        headers: fetchHeaders,
        // body: body ? JSON.stringify(body) : undefined,
        body: body
            ? isMultipart
                ? body
                : JSON.stringify(body)
            : undefined,
    };

    const response = await fetch(endpoint, fetchOptions);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
    }

    const data = await response.json();
    return data as T;
}
