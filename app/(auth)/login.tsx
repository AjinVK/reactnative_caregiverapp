import PersonIcon from "@/assets/login/login-person.svg";
import { Feather, Octicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dimensions, Image, Keyboard, Pressable, StyleSheet,
    Text, TouchableOpacity, TouchableWithoutFeedback, View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginSchema } from "../utils/validation";
import FloatingInput from "@/components/form/FloatingInput";
import Toast from "react-native-toast-message";
import AuthService from "../service/authService";
import apiResponseMessages from "../api/apiResponseMessages";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
    const [remember, setRemember] = useState(false);
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const response: any = await AuthService.login(data);
            console.log("response:", response);

            if (response?.statusCode == apiResponseMessages.apiStatuscode.success) {

                const token = response?.data?.token;
                const userId = response.data.user.user_id || response.data.user._id;
                let userRole = response.data.user.role || response.data.user.user_role || response.data.user.userRole;

                // Fallback for current "Caregiver" user if role is missing in DB
                if (!userRole && response.data.user.first_name.toLowerCase().includes('caregiver')) {
                    userRole = 'caregiver';
                }

                console.log("User ID:", userId);
                console.log("User Role:", userRole);

                // Role Validation for Caregiver Login Screen
                if (userRole !== "caregiver") {
                    Toast.show({
                        type: apiResponseMessages.tostTypes.error,
                        text1: "Invalid caregiver credentials",
                        position: "top",
                    });
                    return;
                }

                if (userId) {
                    await AsyncStorage.setItem("user_id", userId);
                }

                await AsyncStorage.setItem("user_role", "caregiver");

                if (token) {
                    await AsyncStorage.setItem("token", token);
                    console.log("✅ Token stored successfully:", token);
                } else {
                    console.warn("⚠️ No token found in response — skipping save");
                }
                Toast.show({
                    type: apiResponseMessages.tostTypes.sucess,
                    text1: response.message,
                    position: "top",
                });
                router.replace("/(tabs)");
                reset();
            }
            else {
        let errorMsg = response.message;
        if (typeof errorMsg === 'object' && errorMsg !== null) {
          errorMsg = errorMsg.message || "Login failed";
        }
        Toast.show({
          type: apiResponseMessages.tostTypes.error,
          text1: typeof errorMsg === 'string' ? errorMsg : "Login failed",
          position: "top",
        });
      }
    } catch (error) {
      let displayMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        displayMessage = error.message;
        try {
          const match = displayMessage.match(/Message: (.*)/);
          if (match && match[1]) {
            const parsed = JSON.parse(match[1]);
            displayMessage = parsed.message || parsed.error || displayMessage;
          }
        } catch (e) { }
        console.log("Error:", displayMessage);
      } else {
        console.log("Unknown error:", JSON.stringify(error, null, 2));
      }
      Toast.show({
        type: apiResponseMessages.tostTypes.error,
        text1: displayMessage,
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
                >
                    <View className="flex-1 mt-[10px]">
                        <View className="px-4">
                            <Text className="text-[28px] font-semibold mb-[4px]">Health is a wealth...</Text>

                            <Text className="text-[18px] text-[#636363] font-medium">
                                Join with us{"\n"}and follow your{"\n"}health care
                            </Text>
                        </View>

                        <Image
                            source={require("@/assets/login/login-doctor.png")}
                            style={styles.headerImage}
                        />
                        <View
                            className="h-full rounded-tl-[40px] rounded-tr-[40px] bg-[#CBDDFF] items-center px-[40px]"
                            style={{ elevation: 10 }}
                        >
                            <Text className="text-[26px] font-medium mt-[25px] mb-[25px]">Login</Text>

                            <FloatingInput
                                name="userName"
                                control={control}
                                label="User Name"
                                icon={<PersonIcon />}
                                labelStyle={{
                                    fontWeight: "700",
                                    letterSpacing: 2,
                                    color: "#000",
                                }}
                            />

                            <FloatingInput
                                name="password"
                                control={control}
                                label="Password"
                                icon={<Octicons name="key" size={19} color="black" />}
                                secureTextEntry
                                labelStyle={{
                                    fontWeight: "700",
                                    letterSpacing: 2,
                                    color: "#000",
                                }}
                            />
                            <View className="w-full items-start flex-row justify-between -mt-4 mb-7">
                                <View className="flex-row">
                                    <TouchableOpacity onPress={() => setRemember(!remember)}>
                                        <View
                                            style={[
                                                styles.checkbox,
                                                remember && styles.checkedBox,
                                            ]}
                                        >
                                            {remember && (
                                                <Feather name="check" size={12} color="#000000ff" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <Text className="text-[10px] font-semibold tracking-wide">Remember me</Text>
                                </View>
                                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password/ForgotPassword")}>
                                    <Text className="text-[10px] font-semibold tracking-wide">Forgot password?</Text>
                                </TouchableOpacity>
                            </View>

                            <Pressable
                                onPress={handleSubmit(onSubmit)}
                                className="w-full h-[40px] mb-[12px] items-center justify-center rounded-[18px] bg-[#3979F2] active:opacity-70"
                            >
                                <Text className="text-[20px] text-[#fff] font-semibold tracking-widest">Login</Text>
                            </Pressable>

                            <Text className="text-[15px] font-normal mb-[12px]">(Or)</Text>

                            <Pressable
                                onPress={() => router.push("/(auth)/register")}
                                className="w-full h-[40px] mb-[20px] items-center justify-center rounded-[18px] bg-[#3979F2] active:opacity-70"
                            >
                                <Text className="text-[15px] text-[#fff] font-semibold tracking-widest">Create an account</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    headerImage: {
        width: width * 0.90,
        height: width * 0.64,
        alignSelf: "center",
        marginBottom: 15,
    },
    // floatingLabel: {
    //     position: "absolute",
    //     left: 0,
    //     fontSize: 16,
    //     color: "#444",
    // },
    // rightIcon: {
    //     position: "absolute",
    //     right: 0,
    //     bottom: 6,
    // },
    checkbox: {
        width: 13,
        height: 12,
        borderWidth: 0.4,
        borderColor: "#888888",
        backgroundColor: "#fff",
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 3,
    },
    checkedBox: {
        backgroundColor: "#ffffffff",
        borderColor: "#ffffffff",
    },
});
