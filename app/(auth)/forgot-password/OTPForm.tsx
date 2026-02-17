import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Pressable, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { maskEmail, maskPhone } from './utils/mask';

const OTPFrom = () => {
    const OTP_LENGTH = 4;

    const { type, email, phone } = useLocalSearchParams<{
        type?: "email" | "phone";
        email?: string;
        phone?: string;
    }>();

    const maskedValue =
        type === "phone"
            ? maskPhone(phone)
            : maskEmail(email);

    const [codes, setCodes] = useState<string[]>(
        Array(OTP_LENGTH).fill("")
    );
    const inputRefs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        if (!/^\d?$/.test(text)) return;

        const newCodes = [...codes];
        newCodes[index] = text;
        setCodes(newCodes);

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: any,
        index: number
    ) => {
        if (e.nativeEvent.key === "Backspace") {
            const newCodes = [...codes];

            if (codes[index]) {
                newCodes[index] = "";
            } else if (index > 0) {
                newCodes[index - 1] = "";
                inputRefs.current[index - 1]?.focus();
            }

            setCodes(newCodes);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView className='flex-1 bg-[white] px-4'>
                <TouchableOpacity
                    className="mb-[25px] mt-[10px]"
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>

                <View className='px-2'>
                    <View className='mb-[32px]'>
                        <Text className='text-[24px] font-bold mb-[8px]'>Enter Verification Code</Text>

                        <Text className='text-[16px] text-[#A1A8B0] font-normal'>
                            Enter code that we have sent to your number
                        </Text>

                        <Text className='text-[16px] font-normal'>{maskedValue}</Text>
                    </View>

                    <View className='flex-row justify-between mb-[40px]'>
                        {codes.map((code, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    if (ref) inputRefs.current[index] = ref;
                                }}
                                className='text-[24px] h-[64px] w-[64px] text-center font-bold border rounded-[16px]'
                                keyboardType="number-pad"
                                maxLength={1}
                                value={code}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    <Pressable
                        className='items-center py-[16px] rounded-full bg-[#3D80FF] active:opacity-70 mb-[32px]'
                        onPress={()=> router.replace("/(auth)/forgot-password/NewPassword")}
                    >
                        <Text className='text-[16px] text-[white] font-semibold'>Verify</Text>
                    </Pressable>


                    <View className='flex-row items-center justify-center'>
                        <Text className='text-[15px] font-normal text-[#717784]'>Didn't receive the code? </Text>
                        <TouchableOpacity
                            onPress={() => Alert.alert("OTP Resend Successfully")}
                        >
                            <Text className='text-[15px] font-normal text-[#0051FF]'>Resend</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default OTPFrom;
