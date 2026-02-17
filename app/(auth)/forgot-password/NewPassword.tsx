import { router } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPasswordScheme } from '@/app/utils/validation';
import LockIconBlue from '@/assets/login/lockIcon_blue.svg';
import LockIcon from '@/assets/login/lockIcon.svg'
import { PasswordInput } from '@/components/form/InputForm';

const NewPassword = () => {
    const { control, handleSubmit, } = useForm({
        resolver: yupResolver(createPasswordScheme),
    });

    const onSubmit = () => {
        router.replace("/(auth)/login");
    };

    return (
        <SafeAreaView className='flex-1 bg-[white] px-4'>
            <TouchableOpacity
                className="mb-[25px] mt-[10px]"
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <View className='px-2'>
                <Text className='text-[24px] font-bold mb-[8px]'>Create New Password</Text>

                <Text className='text-[16px] font-normal text-[#A1A8B0] mb-[24px]'>
                    Create your new password to login
                </Text>

                <View className='px-6'>
                    <PasswordInput
                        name="password"
                        control={control}
                        placeholder="Password"
                        icon={<LockIcon />}
                        activeIcon={<LockIconBlue />}
                    />

                    <PasswordInput
                        name="confirmPassword"
                        control={control}
                        placeholder="Confirm password"
                        icon={<LockIcon />}
                        activeIcon={<LockIconBlue />}
                    />
                </View>

                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    className='items-center rounded-full py-[16px] bg-[#3D80FF] active:opacity-70'
                >
                    <Text className='text-[16px] text-[white] font-semibold'>Create Password</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default NewPassword;
