import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller, Control } from "react-hook-form";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";

// Create Account Component
type Props = {
    name: string;
    control: Control<any>;
    placeholder: string;
    icon?: React.ReactNode;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export const FormTextInput: React.FC<Props> = ({
    name,
    control,
    placeholder,
    icon,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="mb-[15px]">
                    <View className="flex-row items-center border-b border-[#5F5F60]"
                        style={{ borderColor: error ? "#EF4444" : "#5F5F60" }}>
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder={placeholder}
                            placeholderTextColor="#787777"
                            secureTextEntry={secureTextEntry && !showPassword}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            className="flex-1 text-[17px] pt-[10px] pb-[5px] tracking-wider"
                        />

                        {secureTextEntry ? (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#787777"
                                />
                            </TouchableOpacity>
                        ) : (
                            icon
                        )}
                    </View>

                    <Text className="text-[10px] text-red-500 mt-[3px]">
                        {error?.message ?? " "}
                    </Text>
                </View>
            )}
        />
    );
};

export default FormTextInput;

//Forgot Page Component
type TextInputProps = {
    name: string;
    control: Control<any>;
    tab: "email" | "phone";
    isValid?: boolean;
    icon?: React.ReactNode;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export const InputText: React.FC<TextInputProps> = ({
    name,
    control,
    tab,
    isValid = false,
    icon,
    autoCapitalize,
}) => {
    const isPhone = tab === "phone";

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View
                    className="mb-[43px]"
                    style={{
                        width: "100%",
                        alignItems: isPhone ? "center" : "stretch",
                    }}
                >
                    <View
                        className="flex-row items-center border-b"
                        style={{
                            width: isPhone ? "70%" : "100%",
                            borderBottomWidth: 1,
                            borderBottomColor: error ? "#EF4444" : "#5F5F60",
                        }}
                    >
                        <View className="pt-[5px]">
                            {icon ? (
                                icon
                            ) : isPhone ? (
                                <Feather
                                    name="phone"
                                    size={19}
                                    color="#3979F2"
                                />
                            ) : null}
                        </View>

                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize={autoCapitalize}
                            placeholder={
                                isPhone
                                    ? "Phone Number"
                                    : "Email Address"
                            }
                            placeholderTextColor="#3d3a3aff"
                            keyboardType={
                                isPhone ? "phone-pad" : "email-address"
                            }
                            className="flex-1 mx-[12px] text-[15px] font-normal pb-[5px]"
                            style={{
                                marginLeft: isPhone ? 22 : 12,
                            }}
                        />

                        <View className="pt-[5px] w-[20px] items-end">
                            {isValid && !error ? (
                                <FontAwesome6
                                    name="check"
                                    size={16}
                                    color="#3979F2"
                                />
                            ) : null}
                        </View>
                    </View>

                    <Text className="text-[11px] text-red-500 mt-[4px]">
                        {error?.message ?? " "}
                    </Text>
                </View>
            )}
        />
    );
};

// Password Input
type PasswordInputProps = {
    name: string;
    control: Control<any>;
    placeholder: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
    name,
    control,
    placeholder,
    icon,
    activeIcon,
}) => {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, onBlur }, fieldState: { error }, }) => (
                <>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            {focused ? activeIcon : icon}
                            <TextInput
                                placeholder={placeholder}
                                secureTextEntry={!show}
                                value={value}
                                onChangeText={onChange}
                                onFocus={() => setFocused(true)}
                                onBlur={() => {
                                    setFocused(false);
                                    onBlur();
                                }}
                                className="text-[16px] ml-[16px] flex-1"
                            />
                        </View>

                        {value?.length > 0 && (
                            <TouchableOpacity onPress={() => setShow(prev => !prev)}>
                                <Ionicons
                                    name={show ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#787777"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className={`h-[1px] ${error ? "bg-red-500" : "bg-black"}`} />

                    {error && (
                        <Text className="text-[11px] text-red-500 mt-[4px] mb-[20px]">
                            {error.message}
                        </Text>
                    )}

                    {!error && <View className="mb-[32px]" />}
                </>
            )}
        />
    );
};

