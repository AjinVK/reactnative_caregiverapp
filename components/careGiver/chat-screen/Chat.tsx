import { FontAwesome6, FontAwesome5, Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
    Linking,
    Pressable,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Text,
    FlatList,
    Keyboard,
} from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AttachmentModal from "./AttachmentModal";
import TypingIndicator from "./TypingIndicator";
import PatientFormService from "@/app/service/patientFormService";

type MessageStatus = "sent" | "delivered" | "read";

interface Message {
    id: string;
    text: string;
    sender: "me" | "patient";
    status: MessageStatus;
}

export default function Chat() {
    const [message, setMessage] = useState("");
    const [showAttach, setShowAttach] = useState(false);
    const inputHeight = useRef(new Animated.Value(36)).current;
    const [isOnline, setIsOnline] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const flatListRef = useRef<FlatList>(null);

    const { patientId } = useLocalSearchParams<{ patientId: string }>();
    const typingTimeout = useRef<number | null>(null);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onContactPress = () => {
        if (patient?.phone) Linking.openURL(`tel:${patient.phone}`);
    };

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", e => {
            setKeyboardHeight(e.endCoordinates.height);
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    // useEffect(() => {
    //     const onlineInterval = setInterval(() => {
    //         setIsOnline((prev) => !prev);
    //     }, 5000);

    //     return () => clearInterval(onlineInterval);
    // }, []);

    const handleTyping = (text: string) => {
        setMessage(text);
        // setIsTyping(true);

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    // simulate patient typing
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setIsTyping(true);

    //         setTimeout(() => {
    //             setIsTyping(false);
    //         }, 2000);
    //     }, 8000);

    //     return () => clearInterval(timer);
    // }, []);

    // useEffect(() => {
    //     const typingInterval = setInterval(() => {
    //         setIsTyping(true);
    //         setTimeout(() => setIsTyping(false), 2000); 
    //     }, 8000);

    //     return () => clearInterval(typingInterval);
    // }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: "me",
            status: "sent",
        };

        setMessages((prev) => [newMessage, ...prev]);
        setMessage("");

        setTimeout(() => updateMessageStatus(newMessage.id, "delivered"), 800);

        setTimeout(() => updateMessageStatus(newMessage.id, "read"), 2000);
    };

    const updateMessageStatus = (id: string, status: MessageStatus) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === id ? { ...msg, status } : msg
            )
        );
    };

    useEffect(() => {
        if (!patientId) return;

        const fetchPatient = async () => {
            try {
                setLoading(true);
                console.log("Fetching chat patient:", patientId);

                const response = await PatientFormService.getPatientById(patientId);

                if (response?.success && response?.data) {
                    setPatient(response.data);
                } else {
                    setPatient(null);
                }
            } catch (error) {
                console.error("Failed to load patient", error);
                setPatient(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === "me";

        return (
            <View
                className={`my-1 px-3 py-2 flex-row gap-2 rounded-xl max-w-[75%] ${isMe ? "self-end bg-[#2873B5]" : "self-start bg-[#EDEDED]"
                    }`}
            >
                <Text className={isMe ? "text-white" : "text-black"}>
                    {item.text}
                </Text>

                {isMe && (
                    <View className="flex-row justify-end mt-1">
                        <FontAwesome6
                            name="check-double"
                            size={12}
                            color={
                                item.status === "read"
                                    ? "#4FC3F7"
                                    : item.status === "delivered"
                                        ? "#D0D0D0"
                                        : "#999"
                            }
                        />
                    </View>
                )}
            </View>
        );
    };


    return (
        <>
            <SafeAreaView edges={["top"]} className="bg-[#F2F2F2]" />

            <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 bg-[white]">

                <View className="flex-row items-center justify-between bg-[#F2F2F2] px-4 py-3">
                    <View className="flex-row items-center gap-4">
                        <Pressable onPress={() => router.back()}>
                            <FontAwesome6 name="arrow-left" size={19} color="#868585" />
                        </Pressable>

                        <Avatar.Image
                            size={40}
                            source={{
                                uri:
                                    patient?.image ??
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            }}
                            style={{ backgroundColor: "white" }}
                        />

                        <View>
                            <Text className="text-[16px] font-semibold text-black">
                                {patient?.name ?? "Patient"}
                            </Text>

                            {isTyping ? (
                                <TypingIndicator />
                            ) : (
                                <Text className="text-[12px] text-[#1E5B91]">
                                    Last seen recently
                                    {/* {isOnline ? "Online" : "Last seen recently"} */}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <Pressable onPress={onContactPress}>
                            <FontAwesome5 name="phone-alt" size={19} color="#868585" />
                        </Pressable>
                        <Entypo name="dots-three-vertical" size={19} color="#868585" />
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    inverted
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 12 }}
                    style={{ flex: 1 }}
                />
                <View style={{ marginBottom: keyboardHeight }}>

                    <View className="px-4 py-2 bg-white">
                        <View className="flex-row items-center bg-[#F6F6F6] rounded-full px-3 py-2">

                            <Entypo
                                name="plus"
                                size={22}
                                color="#777777"
                                onPress={() => setShowAttach(true)}
                            />

                            <Animated.View style={{ height: inputHeight, flex: 1 }}>
                                <TextInput
                                    value={message}
                                    onChangeText={handleTyping}
                                    placeholder="Message"
                                    multiline
                                    textAlignVertical="top"
                                    placeholderTextColor="#8E8E8E"
                                    className="text-[16px] mx-3"
                                    onContentSizeChange={(e) => {
                                        const height = Math.min(
                                            120,
                                            Math.max(36, e.nativeEvent.contentSize.height)
                                        );

                                        Animated.timing(inputHeight, {
                                            toValue: height,
                                            duration: 120,
                                            useNativeDriver: false,
                                        }).start();
                                    }}
                                />
                            </Animated.View>

                            <Pressable onPress={sendMessage}>
                                <FontAwesome6 name="telegram" size={34} color="#2873B5" />
                            </Pressable>

                        </View>
                    </View>

                </View>

                <AttachmentModal
                    visible={showAttach}
                    onClose={() => setShowAttach(false)}
                />
            </SafeAreaView>
        </>
    );
}
