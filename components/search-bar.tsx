import { Pressable, TextInput, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useEffect, useState } from "react";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onDebounce?: (text: string) => void | Promise<void>;
    placeholder?: string;
}

export default function SearchBar(props: SearchBarProps) {
    const [internalValue, setInternalValue] = useState(props.value);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (props.onDebounce) {
                props.onDebounce(internalValue);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [internalValue]);

    return (
        <View className="px-4 mb-3">
            <View className="w-full rounded-full bg-[#fff] flex-row justify-between">
                <TextInput
                    value={props.value}
                    onChangeText={(text) => {
                        setInternalValue(text);
                        props.onChangeText(text);
                    }}
                    placeholder={props.placeholder ?? "Enter the patient i’d or name"}
                    className="h-[40px] px-4"
                />
                <Pressable className="w-[40px] rounded-full bg-[#1E5B91] items-center justify-center active:opacity-70">
                    <IconSymbol name={"search.outline"} color={"#fff"} size={20} />
                </Pressable>
            </View>
        </View>
    );
}