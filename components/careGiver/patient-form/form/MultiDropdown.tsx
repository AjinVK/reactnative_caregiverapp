import React, { useRef, useState } from "react";
import { Modal, Pressable, Text, View, StyleSheet, Animated, ScrollView, TextInput } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Picker } from "@react-native-picker/picker";
import FormInput, { CustomDropdownField } from "./FormInput";
import { Controller, useForm } from "react-hook-form";

type SelectedItem = {
    label: string;
    value: string;
    dose: string;
    days: number;
    startDate: string | null;
    endDate: string | null;
};

interface MultiSelectDropdownProps {
    label: string;
    items: { label: string; value: string }[];
    values: SelectedItem[];
    onChange: (values: SelectedItem[]) => void;
    placeholder?: string;
    error?: string;
    isRequired?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    items,
    values,
    onChange,
    placeholder = "Select",
    error,
    isRequired,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeItem, setActiveItem] = useState<SelectedItem | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const { control, setValue, getValues, reset, } = useForm<any>({});
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB");
    };

    const calculateDates = (days: number) => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + days);

        return {
            startDate: formatDate(start),
            endDate: formatDate(end),
        };
    };


    const openDoseModal = (item: { label: string; value: string }) => {
        const existing = values.find(v => v.value === item.value);
        const fullItem: SelectedItem = existing ?? {
            label: item.label,
            value: item.value,
            dose: "",
            days: 0,
            startDate: null,
            endDate: null,
        };

        setActiveItem(fullItem);
        reset({
            days: existing?.days ? String(existing.days) : "",
            dose: existing?.dose ?? "",
        });
        // setActiveItem(existing ?? { ...item, dose: 1 });
        setModalVisible(true);

        scaleAnim.setValue(0.9);
        opacityAnim.setValue(0);

        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeModal = () => {
        setIsClosing(true);

        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setModalVisible(false);
            setActiveItem(null);
            setIsClosing(false);
            closeDropdown();
        });
    };

    const handleDone = () => {
        if (!activeItem) return;

        // const days = Number(control._formValues.days || 0);
        // if (!days) return;        
        const days = Number(getValues("days"));
        const dose = getValues("dose");
        if (!days || !dose) return;

        const { startDate, endDate } = calculateDates(days);

        const updatedItem: SelectedItem = {
            ...activeItem,
            days,
            dose,
            startDate,
            endDate,
        };

        const exists = values.find(v => v.value === activeItem.value);

        onChange(
            exists
                ? values.map(v =>
                    v.value === activeItem.value ? updatedItem : v
                )
                : [...values, updatedItem]
        );
        // if (exists) {
        //     onChange(
        //         values.map(v =>
        //             v.value === activeItem.value ? activeItem : v
        //         )
        //     );
        // } else {
        //     onChange([...values, activeItem]);
        // }

        closeModal();
        setDropdownOpen(false);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
        setIsFocused(false);
    };

    // const updateDose = (delta: number) => {
    //     if (!activeItem) return;
    //     setActiveItem({
    //         ...activeItem,
    //         dose: Math.max(1, activeItem.dose + delta),
    //     });
    // };

    const removeItem = (value: string) => {
        onChange(values.filter(v => v.value !== value));
    };

    return (
        <View className="mx-[24px] mb-4">
            {/* LABEL */}
            <Text className="text-[15px] font-medium mb-[8px]">
                {label}
                {isRequired && <Text className="text-red-500"> *</Text>}
            </Text>

            {/* FIELD */}
            <Pressable
                onPress={() => {
                    setDropdownOpen(prev => {
                        const next = !prev;
                        setIsFocused(next);
                        return next;
                    });
                }}
                className="bg-white rounded-xl px-5 justify-center"
                style={{
                    height: 43,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: error ? "#EF4444" : isFocused ? "#1E5B91" : "#E5E7EB",
                }}
            >
                <Text
                    className={`text-[15px] ${values.length ? "text-black" : "text-[#AAA7A7]"}`}
                    numberOfLines={1}
                >
                    {values.length ? values.map(v => v.label).join(", ") : placeholder}
                </Text>

                <View className="absolute right-3 top-0 bottom-0 justify-center">
                    <View className="w-[1px] h-[30px] absolute right-3 top-1.5 mr-[20px] bg-[#D1D1D1]" />
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={26}
                    />
                </View>
            </Pressable>

            {dropdownOpen && (
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={closeDropdown}
                />
            )}
            {/* DROPDOWN */}
            <View className="mb-1 relative" pointerEvents="box-none">
                {dropdownOpen && (
                    <View className="bg-white rounded-xl border border-[#E5E7EB]"
                        style={{
                            position: "absolute",
                            top: 10,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            elevation: 8,
                        }}
                    >
                        <ScrollView
                            style={{ maxHeight: 180 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            {items.map(item => (
                                <Pressable
                                    key={item.value}
                                    onPress={() => openDoseModal(item)}
                                    className="px-4 py-3"
                                >
                                    <Text className="text-[15px]">
                                        {item.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* CHIPS */}
            {values.length > 0 && (
                <View className="flex-row flex-wrap mt-1">
                    {values.map(item => (
                        <View
                            key={item.value}
                            className="flex-row items-center mt-2 mr-2 px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: "#DDDDDD" }}
                        >
                            <Text className="text-black font-medium text-[12px] mr-1">
                                {item.label}
                            </Text>
                            <Pressable onPress={() => removeItem(item.value)}>
                                <Ionicons name="close-circle-outline" size={15} color="black" />
                            </Pressable>
                        </View>
                    ))}
                </View>
            )}

            {/* TABLE */}
            <View className="mt-[15px]">
                <Text className="text-[15px] font-medium mb-[10px]">Medicine table</Text>
                <View style={styles.tableContainer}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>
                            Medicine name
                        </Text>
                        <Text style={[styles.cell, styles.headerText]}>Days</Text>
                        <Text style={[styles.cell, styles.headerText]}>Start date</Text>
                        <Text style={[styles.cell, styles.headerText]}>End date</Text>
                        <Text style={[styles.cell, styles.headerText]}>Dose</Text>
                    </View>

                    {values.map((item, index) => (
                        <View key={item.value} style={styles.tableRow}>
                            <Text style={[styles.cell, { flex: 2 }]}>
                                {item.label}
                            </Text>

                            <Text style={styles.cell}>
                                {item.days}
                            </Text>

                            <Text style={styles.cell}>
                                {item.startDate}
                            </Text>

                            <Text style={styles.cell}>
                                {item.endDate}
                            </Text>

                            <Text style={styles.cell}>
                                {item.dose}
                            </Text>
                        </View>
                    ))}
                </View>

            </View>

            {/* MODAL */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                onRequestClose={closeModal}
            >
                <Animated.View
                    style={[
                        styles.overlay,
                        { opacity: opacityAnim },
                    ]}
                >
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeModal}
                    />

                    {/* MODAL CARD */}
                    {/* <Animated.View
                        style={[
                            styles.modal,
                            {
                                transform: [{ scale: scaleAnim }],
                                elevation: isClosing ? 0 : 6,
                                shadowOpacity: isClosing ? 0 : 0.25,
                            },
                        ]}
                    >
                        {activeItem && (
                            <View className="items-center">
                                <Text className="text-[20px] font-medium mb-[6px]">
                                    {activeItem.label}
                                </Text>

                                <Text className="text-[12px] mb-3">
                                    No. of dose
                                </Text>

                                <View className="flex-row items-center gap-4 mb-5">
                                    <Pressable onPress={() => updateDose(-1)}>
                                        <MaterialIcons
                                            name="remove-circle-outline"
                                            size={22}
                                        />
                                    </Pressable>

                                    <Text className="text-[16px]">
                                        {activeItem.dose}
                                    </Text>

                                    <Pressable onPress={() => updateDose(1)}>
                                        <MaterialIcons
                                            name="add-circle-outline"
                                            size={22}
                                        />
                                    </Pressable>
                                </View>

                                <Pressable
                                    onPress={handleDone}
                                    className="w-[70px] h-[26px] bg-[#1E5B91] rounded-md items-center justify-center">
                                    <Text className="text-white font-medium">
                                        Done
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </Animated.View> */}
                    <Animated.View
                        style={[
                            styles.modal,
                            {
                                transform: [{ scale: scaleAnim }],
                                elevation: isClosing ? 0 : 6,
                                shadowOpacity: isClosing ? 0 : 0.25,
                            },
                        ]}
                    >
                        <View className="items-center w-full">

                            {/* DAYS */}
                            <Controller
                                control={control}
                                name="days"
                                defaultValue=""
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <FormInput
                                        label={"Days"}
                                        placeholder="Days"
                                        containerClassName="w-[164px]"
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        focused={focusedInput === "days"}
                                        onFocus={() => setFocusedInput("days")}
                                        onBlurInput={() => setFocusedInput(null)}
                                    />
                                )}
                            />


                            {/* <Text className="text-[15px] font-medium mb-2">
                                Days
                            </Text> */}
                            {/* <TextInput
                                value={days}
                                onChangeText={setDays}
                                keyboardType="numeric"
                                placeholder="Enter days"
                                className="w-[180px] h-[34px] bg-[#F8F8F8] rounded-[7px] px-3 mb-4 text-center"
                                style={{ elevation: 3, borderWidth: 1, borderColor: "#E5E7EB" }}
                            /> */}

                            {/* SECTION */}
                            <Controller
                                control={control}
                                name="dose"
                                render={({ field: { value, onChange } }) => (
                                    <CustomDropdownField
                                        label="Dose"
                                        placeholder="Dose"
                                        containerClassName="w-[164px]"
                                        selectedValue={value}
                                        items={[
                                            { label: "Morning", value: "Morning" },
                                            { label: "Afternoon", value: "Afternoon" },
                                            { label: "Evening", value: "Evening" },
                                            { label: "Night", value: "Night" },
                                        ]}
                                        onValueChange={(val) => onChange(val)}
                                    />
                                )}
                            />

                            {/* <Text className="text-[15px] font-medium mb-2">
                                Section
                            </Text>
                            <View className="w-[180px] h-[36px] bg-[#F8F8F8] rounded-[7px] justify-center mb-6"
                                style={{ elevation: 3, borderWidth: 1, borderColor: "#E5E7EB" }}>
                                <Picker
                                    selectedValue={section}
                                    onValueChange={(value) => setSection(value)}
                                >
                                    <Picker.Item label="Morning" value="morning" />
                                    <Picker.Item label="Afternoon" value="afternoon" />
                                    <Picker.Item label="Night" value="night" />
                                </Picker>
                            </View> */}

                            {/* DONE BUTTON */}
                            <Pressable
                                onPress={handleDone}
                                className="w-[80px] h-[28px] bg-[#1E5B91] rounded-md items-center justify-center"
                            >
                                <Text className="text-white font-medium">
                                    Done
                                </Text>
                            </Pressable>

                        </View>
                    </Animated.View>

                </Animated.View>
            </Modal>
        </View>

    );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: 202,
        paddingVertical: 16,
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 8,
        alignItems: "center",
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        minHeight: 42,
        alignItems: "center",
    },

    tableHeader: {
        backgroundColor: "#1E5B91",
    },

    cell: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 6,
        fontSize: 11,
        color: "#111827",
        textAlign: "center",
    },

    headerText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

});