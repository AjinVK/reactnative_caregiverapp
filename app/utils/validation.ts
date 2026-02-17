import * as Yup from "yup";

// Login Validation
export const loginSchema = Yup.object().shape({
    userName: Yup.string()
        .required("Username is required"),

    password: Yup.string()
        .required("Password is required"),
});

// Register Validation
export const registerSchema = Yup.object().shape({
    firstName: Yup.string()
        .required("Firstname is required")
        .min(3, "Firstname must be at least 3 characters"),

    lastName: Yup.string()
        .required("Lastname is required")
        .min(3, "Lastname must be at least 3 characters"),

    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

//Forgot Password
export const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .notRequired(),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .notRequired(),
})
    .test(
        "email-or-phone",
        "Email or phone is required",
        function (values) {
            const { email, phone } = values || {};
            return !!email || !!phone;
        });

// Create Password
export const createPasswordScheme = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

// Patient Form
export const patientFormSchema = Yup.object().shape({
    patientName: Yup.string()
        .required("Patient Name is required")
        .min(2, "Name must be at least 2 characters"),

    phoneNumber_1: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Number must be 10 digits"),

    phoneNumber_2: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Number must be 10 digits"),
});

export default patientFormSchema;