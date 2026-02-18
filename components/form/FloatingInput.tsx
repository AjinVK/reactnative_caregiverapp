import { Control, Controller, useWatch } from "react-hook-form";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";

type FloatingInputProps = {
    name: string;
    control: Control<any>;
    label: string;
    icon?: React.ReactNode;
    labelStyle?: any;
    iconStyle?: any;
    secureTextEntry?: boolean;
    keyboardType?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const FloatingInput = ({
    name,
    control,
    label,
    icon,
    labelStyle = {},
    iconStyle = {},
    secureTextEntry,
    keyboardType,
    autoCapitalize,
}: FloatingInputProps) => {
    const animated = useRef(new Animated.Value(0)).current;
    const [isFocused, setIsFocused] = useState(false);
    const watchedValue = useWatch({ control, name });
    const [hasValue, setHasValue] = useState(!!watchedValue);

    useEffect(() => {
        setHasValue(!!watchedValue);
    }, [watchedValue]);

    useEffect(() => {
        Animated.timing(animated, {
            toValue: isFocused || hasValue ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [isFocused, hasValue]);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View className="w-full mb-[25px]">
                    <Animated.Text
                        style={[
                            styles.floatingLabel,
                            labelStyle,
                            {
                                transform: [
                                    {
                                        translateY: animated.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [12, -12],
                                        }),
                                    },
                                    {
                                        scale: animated.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 0.8],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {label}
                    </Animated.Text>

                    <TextInput
                        className="-mb-[5px] text-[17px]"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType as any}
                        autoCapitalize={autoCapitalize}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false);
                            onBlur();
                        }}
                    />

                    {icon && (
                        <View style={[styles.rightIcon, iconStyle]}>
                            {icon}
                        </View>
                    )}

                    <View
                        className="h-[1px]"
                        style={{ backgroundColor: error ? "#EF4444" : "#000" }}
                    />

                    <View style={{ height: 12 }}>
                        <Text className="text-red-500 text-[10px]">
                            {error?.message ?? " "}
                        </Text>
                    </View>
                </View>
            )}
        />
    );
};

export default FloatingInput;

const styles = StyleSheet.create({
    floatingLabel: {
        position: "absolute",
        left: 0,
        fontSize: 16,
        color: "#444",
    },
    rightIcon: {
        position: "absolute",
        right: 0,
        marginTop: 7,
    },
});
