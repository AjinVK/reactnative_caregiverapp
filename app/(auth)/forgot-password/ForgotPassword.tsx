import { forgotPasswordSchema } from "@/app/utils/validation";
import MailIcon from "@/assets/login/Email.svg";
import { InputText } from "@/components/form/InputForm";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
    const [tab, setTab] = useState<"email" | "phone">("email");
    const { control, handleSubmit, watch, formState: { errors }, } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: "onChange",
    });

    const fieldName = tab === "email" ? "email" : "phone";
    const fieldValue = watch(fieldName);
    const isValid = !!fieldValue && !errors[fieldName];

    const onSubmit = () => {
        router.replace({
            pathname: "/(auth)/forgot-password/OTPForm",
            params: {
                type: tab,
                email: tab === "email" ? fieldValue : "",
                phone: tab === "phone" ? fieldValue : "",
            },
        });
        Alert.alert("OTP send Successfully");
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className="flex-1 bg-white px-4">
                <TouchableOpacity
                    className="mb-[25px] mt-[10px]"
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <View className="px-2">
                    <Text className="text-[24px] font-bold mb-[8px] text-[#101623]">
                        Forgot Your Password?
                    </Text>

                    <Text className="text-[16px] text-[#A1A8B0] mb-[29px]">
                        Enter your email or phone number, we will send you a
                        confirmation code
                    </Text>

                    <View className="px-[25px] py-[45px] rounded-[19px] bg-[#D7E4FC]">
                        <View className="flex-row bg-[#F9FAFB] rounded-full mb-[42px]">
                            <Pressable
                                className={`flex-1 items-center justify-center h-[51px] rounded-full
                            ${tab === "email" ? "bg-white" : ""}`}
                                onPress={() => setTab("email")}
                            >
                                <Text
                                    className={`text-[14px] font-medium
                                             ${tab === "email"
                                            ? "text-[#3979F2]"
                                            : "text-[#A1A8B0]"
                                        }`}
                                >
                                    Email
                                </Text>
                            </Pressable>

                            <Pressable
                                className={`flex-1 items-center justify-center h-[51px] rounded-full
                                     ${tab === "phone" ? "bg-white" : ""}`}
                                onPress={() => setTab("phone")}
                            >
                                <Text
                                    className={`text-[14px] font-medium
                                ${tab === "phone"
                                            ? "text-[#3979F2]"
                                            : "text-[#A1A8B0]"
                                        }`}
                                >
                                    Phone
                                </Text>
                            </Pressable>
                        </View>

                        <InputText
                            name={fieldName}
                            control={control}
                            tab={tab}
                            isValid={isValid}
                            autoCapitalize="none"
                            icon={
                                tab === "email" ? (
                                    <MailIcon width={23} height={23} />
                                ) : undefined
                            }                            
                        />

                        <Pressable
                            className={`bg-[#3D80FF] py-[16px] rounded-[30px] items-center active:opacity-70
                        ${isValid ? "opacity-100" : "opacity-50"}`}
                            disabled={!isValid}
                            onPress={handleSubmit(onSubmit)}
                        >
                            <Text className="text-[16px] text-white font-semibold">
                                Reset Password
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default ForgotPassword;
