import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { ScrollView, StyleSheet } from "react-native";

// InputField
interface FormInputProps {
    label: string;
    leftIcon?: string;
    icon?: React.ReactNode;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onBlurInput?: () => void;
    focused?: boolean;
    prefixText?: string;
    keyboardType?: string;
    error?: string;
    containerClassName?: string;
    inputClassName?: string;
    isRequired?: boolean;
}

export default function FormInput({
    label,
    value,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    onBlurInput,
    focused,
    error,
    keyboardType,
    leftIcon,
    icon,
    containerClassName = "",
    inputClassName = "",
    isRequired,
    prefixText,
}: FormInputProps) {
    return (
        <View className={`mx-[24px] mb-4 ${containerClassName}`}>
            <Text className="text-[15px] font-medium mb-[8px]">
                {label}
                {isRequired && (
                    <Text className="text-red-500 text-[16px] ml-[2px]"> *</Text>
                )}
            </Text>

            {/* {leftIcon && leftIcon} */}
            <View className={`flex-row items-center bg-[#fff] rounded-xl px-3`}
                style={{
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: error
                        ? "#EF4444"
                        : focused
                            ? "#1E5B91"
                            : "#E5E7EB",
                }}>
                <View>
                    {icon}
                </View>

                {prefixText && (
                    <Text className="text-[15px]">
                        {prefixText}
                    </Text>
                )}

                <TextInput
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={() => {
                        if (onBlur) onBlur();
                        if (onBlurInput) onBlurInput();
                    }}
                    keyboardType={keyboardType as any}
                    className={`flex-1 h-[43px] px-4 text-[15px] ${inputClassName}`}
                    placeholderTextColor="#AAA7A7"
                />
            </View>

            {error ? (
                <Text className="text-red-500 text-[12px] mt-1">
                    {error}
                </Text>
            ) : null}
        </View>
    );
};

// DatePicker
interface DatePickerFieldProps {
    label?: string;
    isRequired?: boolean;
    value?: Date | null;
    placeholder?: "Select date" | "Start date" | "End date";
    onPress?: () => void;
    error?: string;
    focused?: boolean;
    className?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    isRequired,
    value,
    placeholder = "Select date",
    onPress,
    error,
    focused,
    className,
}) => {
    return (
        <View className={className}>
            {label && (
                <Text className="text-[16px] mb-[5px] text-[#333]">
                    {label} {isRequired && <Text className="text-red-500">*</Text>}
                </Text>
            )}

            <Pressable
                onPress={onPress}
                className={`flex-row h-[43px] items-center bg-[#fff] rounded-xl px-4`}
                style={{ elevation: 3, borderWidth: 1, borderColor: error ? "#EF4444" : focused ? "#1E5B91" : "#E5E7EB", }}
            >
                <View className="flex-row items-center justify-between flex-1">
                    <Text className={`ml-2 text-[15px] ${value ? "text-[#111]" : "text-[#999]"}`}>
                        {value
                            ? value.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : placeholder}
                    </Text>
                    <View className="flex-row items-center ">
                        <View className="w-[1px] h-[30px] mr-[11px] bg-[#D1D1D1]" />
                        <Ionicons name="calendar-outline" size={18} color="black" />
                    </View>
                </View>
            </Pressable>

            {error && <Text className="text-red-500 text-[10px] mt-[2px]">{error}</Text>}
        </View>
    );
};

// DatePicker
interface DateRangePickerProps {
    label: string;
    isRequired?: boolean;
    focusedInput?: string | null;
    error?: string;
    containerClassName?: string;
    inputClassName?: string;
    onPress?: () => void;
    date?: Date | null;
    fieldKey: string;
    placeholder?: "Select date" | "Start date" | "End date";
    className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    label,
    isRequired,
    containerClassName = "",
    onPress,
    date,
    focusedInput,
    fieldKey,
    error,
    inputClassName = "",
    placeholder,
    className,
}) => {
    const isFocused = focusedInput === fieldKey;
    return (
        <View className={`mx-[24px] mb-4 ${containerClassName}`}>
            <Text className="text-[15px] font-medium mb-[8px]">
                {label}
                {isRequired && (
                    <Text className="text-red-500 text-[16px] ml-[2px]"> *</Text>
                )}
            </Text>

            <DatePickerField
                value={date}
                onPress={onPress}
                focused={isFocused}
                error={error}
                placeholder={placeholder}
                className={className}
            />
            {error && <Text className="text-red-500 text-[10px] mt-[2px]">{error}</Text>}
        </View>
    );
};

// DropdownField
// interface DropdownFieldProps {
//     label: string;
//     required?: boolean;
//     selectedValue: any;
//     onValueChange: (value: any, index: number) => void;
//     onFocus?: () => void;
//     onBlur?: () => void;
//     items: { label: string; value: any }[];
//     focused?: boolean;
//     containerClassName?: string;
//     inputClassName?: string;
//     isRequired?: boolean;
//     error?: string;
//     placeholder?: string;
//     disabled?: boolean;
// }

// export const DropdownField: React.FC<DropdownFieldProps> = ({
//     label,
//     selectedValue,
//     onValueChange,
//     onFocus,
//     onBlur,
//     items,
//     focused,
//     containerClassName = "",
//     inputClassName = "",
//     isRequired,
//     error,
//     placeholder,
//     disabled = false,
// }) => {

//     return (
//         <View className={`mx-[24px] mb-4 ${containerClassName}`}>
//             <Text className="text-[15px] font-medium mb-[8px]"
//                 style={{ color: disabled ? "#AAA7A7" : "#000" }}
//             >
//                 {label}
//                 {isRequired && <Text className="text-red-500 text-[16px] ml-[2px]"> *</Text>}
//             </Text>

//             <View className={`bg-[#fff] rounded-xl px-3 justify-center relative`}
//                 style={{ height: 43, elevation: 3, borderWidth: 1, borderColor: error ? "#EF4444" : focused ? "#1E5B91" : "#E5E7EB", }}>

//                 <Picker
//                     enabled={!disabled}
//                     selectedValue={selectedValue}
//                     onValueChange={onValueChange}
//                     onFocus={onFocus}
//                     onBlur={onBlur}
//                     dropdownIconColor="#fff"
//                 >
//                     <Picker.Item
//                         label={placeholder ?? "Age"}
//                         value=""
//                         enabled={false}
//                         color="#AAA7A7"
//                     />
//                     {items.map((item, index) => (
//                         <Picker.Item key={index} label={item.label} value={item.value} />
//                     ))}
//                 </Picker>

//                 <View
//                     pointerEvents="none"
//                     className="absolute right-3 top-0 bottom-0 justify-center"
//                 >
//                     <View className="w-[1px] h-[30px] absolute right-3 top-1.5 bottom-0 mr-[20px] bg-[#D1D1D1]" />

//                     <MaterialIcons
//                         name="keyboard-arrow-down"
//                         size={27}
//                         style={{
//                             color: disabled ? "#AAA7A7" : "#000",
//                         }}
//                     />
//                 </View>
//             </View>
//         </View>
//     );
// };

//TextArea 
interface FormInputProps {
    label: string;
    leftIcon?: string;
    icon?: React.ReactNode;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onBlurInput?: () => void;
    focused?: boolean;
    prefixText?: string;
    keyboardType?: string;
    error?: string;
    containerClassName?: string;
    inputClassName?: string;
    isRequired?: boolean;
}

export const FormTextArea: React.FC<FormInputProps> = ({
    label,
    value,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    onBlurInput,
    focused,
    error,
    keyboardType,
    leftIcon,
    icon,
    containerClassName = "",
    inputClassName = "",
    isRequired,
    prefixText,
}) => {
    return (
        <View className={`mx-[24px] mb-4 ${containerClassName}`}>
            <Text className="text-[15px] font-medium mb-[8px]">
                {label}
                {isRequired && (
                    <Text className="text-red-500 text-[16px] ml-[2px]"> *</Text>
                )}
            </Text>

            <View className={`h-[125px] bg-[#fff] rounded-xl px-3`}
                style={{
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: error
                        ? "#EF4444"
                        : focused
                            ? "#1E5B91"
                            : "#E5E7EB",
                }}>
                <View className="flex-row gap-3 py-3 px-4">
                    <Image className="mt-2" source={require("@/assets/careGiver/pencil.png")} />
                    <TextInput
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        onFocus={onFocus}
                        onBlur={() => {
                            if (onBlur) onBlur();
                            if (onBlurInput) onBlurInput();
                        }}
                        keyboardType={keyboardType as any}
                        className={`flex-1 text-[15px] ${inputClassName}`}
                        placeholderTextColor="#C8C8C8"
                    />
                </View>
            </View>
        </View>
    )
};


//CustomDropDown
interface DropdownFieldProps {
    label: string;
    selectedValue: any;
    onValueChange: (value: any, index: number) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    items: { label: string; value: any }[];
    focused?: boolean;
    containerClassName?: string;
    inputClassName?: string;
    isRequired?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const CustomDropdownField: React.FC<DropdownFieldProps> = ({
    label,
    selectedValue,
    onValueChange,
    onFocus,
    onBlur,
    items,
    focused,
    containerClassName = "",
    inputClassName = "",
    isRequired,
    error,
    placeholder = "Select",
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);

    const selectedItem = items.find(i => i.value === selectedValue);

    const toggleDropdown = () => {
        if (disabled) return;

        if (!open) onFocus?.();
        else onBlur?.();

        setOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setOpen(false);
        onBlur?.();
    };

    const handleSelect = (item: any, index: number) => {
        onValueChange(item.value, index);
        setOpen(false);
        onBlur?.();
    };

    return (
        <View className={`mx-[24px] mb-4 ${containerClassName}`}>
            {/* LABEL */}
            <Text
                className="text-[15px] font-medium mb-[8px]"
                style={{ color: disabled ? "#AAA7A7" : "#000" }}
            >
                {label}
                {isRequired && <Text className="text-red-500"> *</Text>}
            </Text>

            <Pressable
                onPress={toggleDropdown}
                className={`bg-white rounded-xl px-4 justify-center ${inputClassName}`}
                style={{
                    height: 43,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: error
                        ? "#EF4444"
                        : open || focused
                            ? "#1E5B91"
                            : "#E5E7EB",
                }}
            >
                <Text
                    numberOfLines={1}
                    className={`text-[15px] ${selectedItem ? "text-black" : "text-[#AAA7A7]"
                        }`}
                >
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>

                <View className="absolute right-3 top-0 bottom-0 justify-center">
                    <View className="w-[1px] h-[30px] absolute right-3 top-1.5 mr-[20px] bg-[#D1D1D1]" />
                    <MaterialIcons
                        name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={26}
                        color={disabled ? "#AAA7A7" : "#000"}
                    />
                </View>
            </Pressable>

            {/* BACKDROP */}
            {open && (
                <>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeDropdown}
                    />

                    <View
                        pointerEvents="box-none"
                        style={{
                            position: "absolute",
                            top: 82,
                            left: 24,
                            right: 24,
                            zIndex: 1000,
                            elevation: 10,
                        }}
                    >
                        <View className="bg-white rounded-xl border border-[#E5E7EB]">
                            <ScrollView
                                style={{ maxHeight: 180 }}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                keyboardShouldPersistTaps="handled"
                            >
                                {items.map((item, index) => (
                                    <Pressable
                                        key={item.value}
                                        onPress={() => handleSelect(item, index)}
                                        className="px-4 py-3"
                                    >
                                        <Text className="text-[15px]">
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </>
            )}

            {error && (
                <Text className="text-red-500 text-[12px] mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
};
