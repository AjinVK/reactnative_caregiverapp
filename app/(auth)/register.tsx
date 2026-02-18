import PersonIcon from "@/assets/login/person.svg";
import { Feather } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerSchema } from "../utils/validation";
import FormTextInput from "@/components/form/InputForm";
import Toast from "react-native-toast-message";
import { BASE_URL } from "../api/apiEndPoints";
import AuthService from "../service/authService";
import apiResponseMessages from "../api/apiResponseMessages";

const SignUpScreen = () => {
    const [agree, setAgree] = useState(false);
    const { control, handleSubmit, } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: any) => {
        console.log("onSubmit triggered", data);
        console.log("Register endpoint:", BASE_URL + "/auth/register");

        try {
            const response: any = await AuthService.register(data);
            console.log("response received:", response);

            if (response?.statusCode == apiResponseMessages.apiStatuscode.created) {
                Toast.show({
                    type: apiResponseMessages.tostTypes.sucess,
                    text1: response.message,
                    position: "top",
                });
                router.replace("/login");
            } else if (response?.statusCode == 500) {
                Toast.show({
                    type: apiResponseMessages.tostTypes.error,
                    text1: "Name already taken",
                    position: "top",
                });
            } else {
                Toast.show({
                    type: apiResponseMessages.tostTypes.error,
                    text1: response.message,
                    position: "top",
                });
            }
        } catch (error) {

            console.error("Registration Error:", error);
            console.log("🧭 Error message:", (error as Error).message);
            console.log("🛠️ Full error object:", JSON.stringify(error, null, 2));

            Toast.show({
                type: apiResponseMessages.tostTypes.error,
                text1: (error as Error).message,
                position: "top",
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[white]">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView
                    enableOnAndroid
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}

                // scrollEnabled={keyboardOpen}
                >
                    <View className="mt-[10px]">
                        <Text className="text-[22px] font-semibold text-center px-[65px]">Let's begin your healthy journey with us</Text>

                        <View className="flex-row items-center justify-center">
                            <Image
                                source={require("@/assets/images/doctors.png")}
                                className="w-[216px] h-[216px]"
                                resizeMode="contain"
                            />
                        </View>

                        <View
                            className="h-full rounded-tr-[40px] rounded-tl-[40px] bg-[#CBDDFF] px-[40px]"
                            style={{ elevation: 10 }}
                        >
                            <Text className="text-[22px] font-semibold text-center mt-[25px] mb-[25px]">Sign up</Text>

                            <FormTextInput
                                name="firstName"
                                control={control}
                                placeholder="Enter first name"
                                icon={<PersonIcon />}
                            />

                            <FormTextInput
                                name="lastName"
                                control={control}
                                placeholder="Enter last name"
                                icon={<PersonIcon />}
                            />

                            <FormTextInput
                                name="email"
                                control={control}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<Feather name="mail" size={20} color="#787777" />}
                            />

                            <FormTextInput
                                name="password"
                                control={control}
                                placeholder="Enter new password"
                                secureTextEntry
                            />

                            <FormTextInput
                                name="confirmPassword"
                                control={control}
                                placeholder="Enter confirm password"
                                secureTextEntry
                            />

                            <View className="flex-row items-center -mt-4 mb-[18px]">
                                <TouchableOpacity onPress={() => setAgree(!agree)}>
                                    <View
                                        style={[
                                            styles.checkbox,
                                            agree && styles.checkedBox,
                                        ]}
                                    >
                                        {agree && (
                                            <Feather name="check" size={12} color="#000000ff" />
                                        )}
                                    </View>
                                </TouchableOpacity>

                                <Text className="text-[9px] font-normal">
                                    I agree to the medilock Terms of Service and Privacy Policy
                                </Text>
                            </View>

                            <Pressable
                                onPress={handleSubmit(onSubmit)}
                                className="w-full h-[40px] items-center justify-center rounded-[18px] bg-[#3979F2] active:opacity-70 mb-[10px]"
                            >
                                <Text className="text-[16px] text-[white] font-semibold tracking-widest">Sign up</Text>
                            </Pressable>

                            <View className="flex-row justify-center">
                                <Text className="text-[10px] font-normal">Go to</Text>
                                <Pressable
                                    onPress={() => router.replace("/(auth)/login")}
                                    className="active:opacity-70">
                                    <Text className="text-[10px] text-[#005EFF] font-normal"> login</Text>
                                </Pressable>
                                <Text className="text-[10px] font-normal"> page?</Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    checkbox: {
        width: 15,
        height: 14,
        borderWidth: 0.4,
        borderColor: "#888888",
        backgroundColor: "#fff",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    checkedBox: {
        backgroundColor: "#ffffffff",
        borderColor: "#ffffffff",
    },
});
