import apiResponseMessages from "@/app/api/apiResponseMessages";
import BloodGroupService from "@/app/service/bloodGroupService";
import MedicalConditionService from "@/app/service/medicalConditionService";
import PatientFormService from "@/app/service/patientFormService";
import PresentMedicationService from "@/app/service/presentMedicationService";
import patientFormSchema from "@/app/utils/validation";
import SaveIcon from "@/assets/careGiver/save.svg";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Animated, Dimensions, Keyboard, Platform, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import FormInput, { CustomDropdownField, DateRangePicker, FormTextArea } from "./form/FormInput";
import MultiSelectDropdown from "./form/MultiDropdown";


export default function PatientForm() {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<"patient" | "medication">("patient");
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: yupResolver(patientFormSchema),
    });
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState<any>({ visible: false });
    const [dob, setDob] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const { width } = Dimensions.get("window");
    const translateX = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(false);
    const [bloodGroups, setBloodGroups] = useState<{ label: string; value: string }[]>([]);
    const [bloodGroupLoading, setBloodGroupLoading] = useState(false);
    const [medicalConditions, setMedicalConditions] = useState<{ label: string; value: string }[]>([]);
    const [mcLoading, setMcLoading] = useState(false);
    const [presentMedications, setPresentMedications] = useState<{ label: string; value: string }[]>([]);
    const [pmLoading, setPmLoading] = useState(false);

    const handleBack = () => {
        if (navigation.canGoBack()) {
            router.back();
        } else {
            // router.replace("/(tabs)/care");
        }
    };

    const goToStep = (step: "patient" | "medication") => {
        setActiveTab(step);

        Animated.timing(translateX, {
            toValue: step === "patient" ? 0 : -containerWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker({ visible: false });

        if (event.type !== "set" || !selectedDate) return;

        if (focusedInput === "dob") {
            setDob(selectedDate);

            const today = new Date();
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }
            setValue("age", age.toString(), { shouldValidate: true });
        }

        if (focusedInput === "startDate") {
            setStartDate(selectedDate);
            setDateError(null);
        }

        if (focusedInput === "endDate") {
            if (startDate && selectedDate < startDate) {
                setDateError("End date cannot be earlier than start date");
                return;
            }

            setEndDate(selectedDate);
            setDateError(null);
        }

    };

    {/* Blood Group */ }
    useEffect(() => {
        const loadBloodGroups = async () => {
            try {
                setBloodGroupLoading(true);

                const data = await BloodGroupService.getAllBloodGroups();

                const dropdownItems = data
                    .filter((bg) => bg.isActive !== false)
                    .map((bg) => ({
                        label: bg.name,
                        value: bg._id!,
                    }));

                setBloodGroups(dropdownItems);
            } catch (error) {
                console.error("Failed to load blood groups", error);
            } finally {
                setBloodGroupLoading(false);
            }
        };

        loadBloodGroups();
    }, []);

    {/* Medical Condition */ }
    useEffect(() => {
        const loadMedicalConditions = async () => {
            try {
                setMcLoading(true);
                const data = await MedicalConditionService.getAllMedicalCondition();

                const items = data
                    .filter((mc) => mc.isActive !== false)
                    .map((mc) => ({
                        label: mc.name,
                        value: mc._id!,
                    }));

                setMedicalConditions(items);
            } catch (error) {
                console.error("Failed to load medical conditions", error);
            } finally {
                setMcLoading(false);
            }
        };

        loadMedicalConditions();
    }, []);

    {/* Present Medication */ }
    useEffect(() => {
        const loadMedications = async () => {
            try {
                setPmLoading(true);
                const data = await PresentMedicationService.getAllPresentMedication();

                const items = data
                    .filter((med) => med.isActive !== false)
                    .map((med) => ({
                        label: med.name,
                        value: med._id!,
                    }));

                setPresentMedications(items);
            } catch (error) {
                console.error("Failed to load present medications", error);
            } finally {
                setPmLoading(false);
            }
        };

        loadMedications();
    }, []);

    const onSubmit = async (formData: any) => {
        try {
            setLoading(true);
            const caregiver_id = await AsyncStorage.getItem("user_id");

            if (!caregiver_id) {
                throw new Error("User not authenticated. Please login again.");
            }

            const payload = {
                caregiver_id,
                name: formData.patientName,
                date_of_birth: dob ? dob.toISOString().split("T")[0] : null,
                age: Number(formData.age),
                gender: formData.gender,
                phone: formData.phoneNumber_1,
                emergency_contact: formData.phoneNumber_2,
                bloodGroup: formData.bloodType,
                address: formData.address,
                height: formData.patientHeight ? Number(formData.patientHeight) : undefined,
                weight: formData.patientWeight ? Number(formData.patientWeight) : undefined,
                medical_conditions: formData.medicalCondition,
                present_medication: formData.presentMedication
                    .map((m: any) => m.value)
                    .join(","),
                details: JSON.stringify({
                    notes: formData.details,
                    medications: formData.presentMedication
                }),
            };

            const response = await PatientFormService.createPatient(payload);

            if (response.success) {
                Toast.show({ type: apiResponseMessages.tostTypes.sucess, text1: response.message, position: "top", });
                router.back();
            } else {
                Toast.show({ type: apiResponseMessages.tostTypes.error, text1: response?.message || "Something went wrong", position: "top", });
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error(error);
            Toast.show({ type: apiResponseMessages.tostTypes.error, text1: error?.message || "Failed to create team", position: "top", });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[white]">
            <View className="mt-[10px]">
                <View className="flex-row items-center px-4 mb-[15px]">
                    <Pressable onPress={handleBack}
                        className="w-[33px] h-[33px] bg-[#F2F2F2] items-center justify-center rounded-full active:opacity-70">
                        <IconSymbol name={"arrow-left.fill"} color={""} />
                    </Pressable>
                    <Text className="text-[20px] font-semibold ml-[90px]">Patient’s form</Text>
                </View>

                <View className="px-4">
                    <View className="w-full rounded-[13px] bg-[#F2F2F2]"
                        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                        style={{
                            overflow: "hidden",
                            height: activeTab === "patient" ? 710 : 755,
                        }}
                    >
                        <View className="items-center">
                            <View className="w-[216px] bg-white rounded-full flex-row mt-[35px] mb-[4]">
                                <Pressable
                                    onPress={() => goToStep("patient")}
                                    className={`w-[108px] h-[38px] items-center justify-center rounded-full active:opacity-70 ${activeTab === "patient" ? "bg-[#1E5B91]" : "bg-white"
                                        }`}
                                >
                                    <Text
                                        className={`text-[15px] font-medium ${activeTab === "patient" ? "text-white" : "text-black"
                                            }`}
                                    >
                                        Patient info
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => goToStep("medication")}
                                    className={`w-[108px] h-[38px] items-center justify-center rounded-full active:opacity-70 ${activeTab === "medication" ? "bg-[#1E5B91]" : "bg-white"
                                        }`}
                                >
                                    <Text
                                        className={`text-[15px] font-medium ${activeTab === "medication" ? "text-white" : "text-black"
                                            }`}
                                    >
                                        Medication
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <Animated.View
                            style={{
                                flexDirection: "row",
                                width: width * 2,
                                transform: [{ translateX }],
                            }}>

                            {/* STEP-1 */}
                            <View
                                style={{
                                    width: containerWidth, height: Dimensions.get("window").height * 0.83
                                }}
                            >
                                <KeyboardAwareScrollView
                                    enableOnAndroid
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                >
                                    {/* <View> */}
                                    <Text className="text-[20px] font-semibold text-center mt-[30px] mb-[1px]">
                                        Patient’s personal info
                                    </Text>
                                    <Text className="text-[11px] font-medium text-[#908383] mb-[23px] text-center">
                                        Enter the patient’s details
                                    </Text>

                                    <View className="mb-9">
                                        {/* Patient Name */}
                                        <Controller
                                            control={control}
                                            name="patientName"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <FormInput
                                                    label="Patient full name"
                                                    isRequired={false}
                                                    placeholder="Enter Patient full name"
                                                    icon={<IconSymbol name={"person.fill"} color={"black"} size={18} />}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    focused={focusedInput === "patientName"}
                                                    onFocus={() => setFocusedInput("patientName")}
                                                    onBlurInput={() => setFocusedInput(null)}
                                                    error={errors.patientName?.message as string | undefined}
                                                />
                                            )}
                                        />
                                        {/* Date of Birth */}
                                        <View className="flex-row">
                                            <View className="flex-[2.5]">
                                                <DateRangePicker
                                                    label={"Date of birth"}
                                                    date={dob}
                                                    fieldKey="dob"
                                                    className="w-[180px]"
                                                    focusedInput={focusedInput}
                                                    onPress={() => {
                                                        setFocusedInput("dob");
                                                        setShowPicker({ visible: true });
                                                    }}
                                                />
                                            </View>
                                            {/* Age */}
                                            <View className="flex-[2]">
                                                <Controller
                                                    control={control}
                                                    name="age"
                                                    render={({ field: { value } }) => (
                                                        <CustomDropdownField
                                                            label="Age"
                                                            placeholder="Age"
                                                            selectedValue={value}
                                                            disabled
                                                            items={
                                                                value
                                                                    ? [{ label: `${value}`, value }]
                                                                    : []
                                                            }
                                                            onValueChange={() => { }}
                                                        />
                                                    )}
                                                />
                                            </View>
                                        </View>
                                        {/* Phone Number-1 */}
                                        <Controller
                                            control={control}
                                            name="phoneNumber_1"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <FormInput
                                                    label="Phone number - 1"
                                                    isRequired={false}
                                                    placeholder="Enter Phone number"
                                                    keyboardType="numeric"
                                                    icon={<IconSymbol name={"phone.fill"} color={"black"} size={19} />}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    focused={focusedInput === "phoneNumber_1"}
                                                    onFocus={() => setFocusedInput("phoneNumber_1")}
                                                    onBlurInput={() => setFocusedInput(null)}
                                                    error={errors.phoneNumber_1?.message as string | undefined}
                                                />
                                            )}
                                        />
                                        {/* Phone Number-2 */}
                                        <Controller
                                            control={control}
                                            name="phoneNumber_2"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <FormInput
                                                    label="Phone number - 2"
                                                    isRequired={false}
                                                    placeholder="Enter Phone number"
                                                    keyboardType="numeric"
                                                    icon={<IconSymbol name={"phone.fill"} color={"black"} size={19} />}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    focused={focusedInput === "phoneNumber_2"}
                                                    onFocus={() => setFocusedInput("phoneNumber_2")}
                                                    onBlurInput={() => setFocusedInput(null)}
                                                    error={errors.phoneNumber_2?.message as string | undefined}
                                                />
                                            )}
                                        />
                                        {/* Address */}
                                        <Controller
                                            control={control}
                                            name="address"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <FormInput
                                                    label="Address"
                                                    isRequired={false}
                                                    placeholder="Enter Address"
                                                    icon={<IconSymbol name={"location.fill"} color={"black"} size={18} />}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    focused={focusedInput === "address"}
                                                    onFocus={() => setFocusedInput("address")}
                                                    onBlurInput={() => setFocusedInput(null)}
                                                    error={errors.address?.message as string | undefined}
                                                />
                                            )}
                                        />
                                    </View>
                                    {/* Next Button */}
                                    <View className="mb-[36px] mx-[24px]">
                                        <Pressable onPress={() => goToStep("medication")}
                                            className="w-full h-[40px] bg-[#1E5B91] rounded-full flex-row gap-2 items-center justify-center active:opacity-70">
                                            <Text className="text-[15px] font-semibold text-[#fff]">Next</Text>
                                            <IconSymbol name={"arrow-forward.outline"} color={"white"} size={18} />
                                        </Pressable>
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>

                            {/* STEP-2 */}
                            <View style={{ width: containerWidth, height: Dimensions.get("window").height * 0.81 }}>
                                <KeyboardAwareScrollView
                                    enableOnAndroid
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 80 }}
                                >
                                    <Pressable onPress={() => { Keyboard.dismiss(); setFocusedInput(null); }}>
                                        <Text className="text-[20px] font-semibold text-center mt-[30px] mb-[1px]">
                                            Patient’s medication info
                                        </Text>
                                        <Text className="text-[11px] font-medium text-[#908383] mb-[23px] text-center">
                                            Enter the patient’s medication details
                                        </Text>

                                        <View className="mb-9">
                                            <View className="flex-row">
                                                {/* Patient Height */}
                                                <View className="w-[54%] -mr-[30px]">
                                                    <Controller
                                                        control={control}
                                                        name="patientHeight"
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <FormInput
                                                                label="Patient height"
                                                                isRequired={false}
                                                                placeholder="Height (cm)"
                                                                keyboardType="numeric"
                                                                icon={""}
                                                                value={value}
                                                                onChangeText={onChange}
                                                                onBlur={onBlur}
                                                                focused={focusedInput === "patientHeight"}
                                                                onFocus={() => setFocusedInput("patientHeight")}
                                                                onBlurInput={() => setFocusedInput(null)}
                                                                error={errors.patientHeight?.message as string | undefined}
                                                            />
                                                        )}
                                                    />
                                                </View>
                                                {/* Patient Weight */}
                                                <View className="w-[54%]">
                                                    <Controller
                                                        control={control}
                                                        name="patientWeight"
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <FormInput
                                                                label="Patient weight"
                                                                isRequired={false}
                                                                placeholder="Weight (kg)"
                                                                keyboardType="numeric"
                                                                icon={""}
                                                                value={value}
                                                                onChangeText={onChange}
                                                                onBlur={onBlur}
                                                                focused={focusedInput === "patientWeight"}
                                                                onFocus={() => setFocusedInput("patientWeight")}
                                                                onBlurInput={() => setFocusedInput(null)}
                                                                error={errors.patientWeight?.message as string | undefined}
                                                            />
                                                        )}
                                                    />
                                                </View>
                                            </View>

                                            <View className="flex-row">
                                                {/* Blood Type */}
                                                <View className="w-[54%] -mr-[30px]">
                                                    <Controller
                                                        control={control}
                                                        name="bloodType"
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <CustomDropdownField
                                                                label="Blood type"
                                                                placeholder="Blood"
                                                                selectedValue={value}
                                                                items={bloodGroups}
                                                                focused={focusedInput === "bloodType"}
                                                                onFocus={() => setFocusedInput("bloodType")}
                                                                onBlur={() => {
                                                                    setFocusedInput(null);
                                                                    onBlur();
                                                                }}
                                                                onValueChange={(val) => onChange(val)}
                                                                error={errors.bloodType?.message as string | undefined}
                                                            />
                                                        )}
                                                    />
                                                </View>

                                                {/* Gender */}
                                                <View className="w-[54%]">
                                                    <Controller
                                                        control={control}
                                                        name="gender"
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <CustomDropdownField
                                                                label="Gender"
                                                                placeholder="Gender"
                                                                selectedValue={value}
                                                                items={[
                                                                    { label: "Male", value: "male" },
                                                                    { label: "Female", value: "female" },
                                                                    { label: "Other", value: "other" },
                                                                ]}
                                                                focused={focusedInput === "gender"}
                                                                onFocus={() => setFocusedInput("gender")}
                                                                onBlur={() => {
                                                                    setFocusedInput(null);
                                                                    onBlur();
                                                                }}
                                                                onValueChange={(val) => onChange(val)}
                                                                error={errors.gender?.message as string | undefined}
                                                            />
                                                        )}
                                                    />
                                                </View>
                                            </View>

                                            {/* Medical Condition */}
                                            <Controller
                                                control={control}
                                                name="medicalCondition"
                                                render={({ field: { value, onChange, onBlur } }) => (
                                                    <CustomDropdownField
                                                        label="Medical condition"
                                                        placeholder="Select condition"
                                                        selectedValue={value}
                                                        items={medicalConditions}
                                                        focused={focusedInput === "medicalCondition"}
                                                        onFocus={() => setFocusedInput("medicalCondition")}
                                                        onBlur={() => {
                                                            setFocusedInput(null);
                                                            onBlur();
                                                        }}
                                                        onValueChange={(val) => onChange(val)}
                                                        error={errors.medicalCondition?.message as string | undefined}
                                                    />
                                                )}
                                            />

                                            {/* Present medication’s */}
                                            <Controller
                                                control={control}
                                                name="presentMedication"
                                                defaultValue={[]}
                                                render={({ field: { value, onChange } }) => (
                                                    <MultiSelectDropdown
                                                        label="Present medication’s"
                                                        placeholder="Select medication’s"
                                                        values={value}
                                                        onChange={onChange}
                                                        items={presentMedications}
                                                    />
                                                )}
                                            />

                                            {/* <View className="flex-row">
                                                <View className="w-[54%] -mr-[30px]">
                                                    <DateRangePicker
                                                        label={"Medication dose"}
                                                        placeholder="Start date"
                                                        date={startDate}
                                                        fieldKey="startDate"
                                                        focusedInput={focusedInput}
                                                        onPress={() => {
                                                            setFocusedInput("startDate");
                                                            setShowPicker({ visible: true });
                                                        }}
                                                    />
                                                </View>

                                                <View className="w-[54%]">
                                                    <DateRangePicker
                                                        label={""}
                                                        placeholder="End date"
                                                        date={endDate}
                                                        fieldKey="endDate"
                                                        focusedInput={focusedInput}
                                                        onPress={() => {
                                                            setFocusedInput("endDate");
                                                            setShowPicker({ visible: true });
                                                        }}
                                                    />
                                                    {dateError && (
                                                        <Text className="text-red-500 text-[10px] -mt-2 ml-2">
                                                            {dateError}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View> */}

                                            {/* Details */}
                                            <Controller
                                                control={control}
                                                name="details"
                                                render={({ field: { value, onChange, onBlur } }) => (
                                                    <FormTextArea
                                                        label="Details"
                                                        isRequired={false}
                                                        placeholder="Fill the medication details"
                                                        icon={""}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        focused={focusedInput === "details"}
                                                        onFocus={() => setFocusedInput("details")}
                                                        onBlurInput={() => setFocusedInput(null)}
                                                        error={errors.details?.message as string | undefined}
                                                    />
                                                )}
                                            />
                                        </View>
                                    </Pressable>

                                    {/* Save Button */}
                                    <View className="mb-[36px] mx-[24px]">
                                        <Pressable
                                            onPress={handleSubmit(onSubmit)}
                                            className="w-full h-[40px] bg-[#1E5B91] rounded-full flex-row gap-2 items-center justify-center active:opacity-70">
                                            <SaveIcon width={19} />
                                            <Text className="text-[15px] font-semibold text-[#fff]">Save</Text>
                                        </Pressable>
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>
                        </Animated.View>

                        {showPicker.visible && (
                            <DateTimePicker
                                value={
                                    focusedInput === "dob"
                                        ? dob ?? new Date()
                                        : focusedInput === "startDate"
                                            ? startDate ?? new Date()
                                            : endDate ?? new Date()
                                }
                                mode="date"
                                maximumDate={focusedInput === "dob" ? new Date() : undefined}
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
        // </View>
    );
}