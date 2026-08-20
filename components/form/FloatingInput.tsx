import { Control, Controller, useWatch } from "react-hook-form";
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
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
                <View className="w-full mb-[15px]">
                    <View style={{ position: "relative" }}>
                        <Animated.Text
                            pointerEvents="none"
                            style={[
                                styles.floatingLabel,
                                labelStyle,
                                {
                                    transform: [
                                        {
                                            translateY: animated.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [18, -10],
                                            }),
                                        },
                                        {
                                            scale: animated.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0.85],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            {label}
                        </Animated.Text>

                        <View
                            className="flex-row items-center border-b-[1px]"
                            style={{
                                borderBottomColor: error ? "#EF4444" : "#000",
                                minHeight: 45,
                            }}
                        >
                            <TextInput
                                style={[
                                    styles.input,
                                    Platform.OS === "web" && ({ outlineStyle: "none" } as any),
                                ]}
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
                                <View style={[styles.iconContainer, iconStyle]}>
                                    {icon}
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={{ height: 18, marginTop: 4 }}>
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
        zIndex: 1,
    },
    input: {
        flex: 1,
        fontSize: 17,
        paddingTop: 18,
        paddingBottom: 4,
        paddingHorizontal: 0,
        color: "#000",
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    iconContainer: {
        paddingTop: 14,
        paddingLeft: 8,
    },
});

