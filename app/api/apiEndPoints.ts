
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL

const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,

    CREATE_PATIENT: `${BASE_URL}/patient`,
    GET_PATIENTS: `${BASE_URL}/patient`,
    GET_PATIENTS_BY_ID: `${BASE_URL}/patient`,

    CREATE_BLOODGROUP: `${BASE_URL}/master/bloodGroup`,
    GET_BLOODGROUP: `${BASE_URL}/master/bloodGroup`,

    CREATE_MEDICALCONDITION: `${BASE_URL}/master/medicalCondition`,
    GET_MEDICALCONDITION: `${BASE_URL}/master/medicalCondition`,

    CREATE_PRESENTMEDICATION: `${BASE_URL}/master/medication`,
    GET_PRESENTMEDICATION: `${BASE_URL}/master/medication`,

    GET_PATIENTS_HISTORY_BY_ID: `${BASE_URL}/patient/history`,
};

export default API_ENDPOINTS;
