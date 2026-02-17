import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNavigation } from "@react-navigation/native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/search-bar";
import PatientCard, { Patient } from "./PatientCard";
import FloatingButton from "../FloatingButton";
import PatientTabs from "../PatientTabs";
import PatientFormService from "@/app/service/patientFormService";

const PATIENT_IMAGE = "https://cdn-icons-png.flaticon.com/512/861/861503.png";
const PAGE_LIMIT = 10;

export default function PatientList() {
    const navigation = useNavigation<any>();
    const [selectedTab, setSelectedTab] = useState("All");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isFirstSearch = useRef(true);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadPatients = async (pageNumber = 1, search = "", loadMore = false) => {
        if (loading || loadingMore) return;

        try {
            loadMore ? setLoadingMore(true) : setLoading(true);

            const response = await PatientFormService.getPaginatedPatients(
                pageNumber,
                PAGE_LIMIT,
                search,
                selectedTab
            );

            if (response?.patients && Array.isArray(response.patients)) {
                const mapped = response.patients.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    patientId: item.patientId ?? item._id.slice(-6),
                    phone: item.phone,
                    image: PATIENT_IMAGE,
                }));

                if (loadMore) {
                    setPatients((prev) => [...prev, ...mapped]);
                    setPage(pageNumber);
                } else {
                    setPatients(mapped);
                    setPage(1);
                }

                setTotalPages(response.pagination?.totalPages ?? 1);
            } else if (!loadMore) {
                setPatients([]);
                setPage(1);
            }
        } catch (error) {
            console.error("Failed to fetch patients", error);
            if (!loadMore) {
                setPatients([]);
                setPage(1);
            }
        } finally {
            loadMore ? setLoadingMore(false) : setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        loadPatients(1, searchText);
    }, [selectedTab]);

    useFocusEffect(
        useCallback(() => {
            loadPatients();
        }, [])
    );

    const handleBack = () => {
        if (navigation.canGoBack()) router.back();
    };

    const handleSelect = (tab: string) => {
        setSelectedTab(tab)
    };

    const handleLoadMore = () => {
        if (!loadingMore && page < totalPages) {
            loadPatients(page + 1, searchText, true);
        }
    };

    const handleDebounce = async (text: string) => {
        setPage(1);
        loadPatients(1, text);
    };

    //  const handleSelect = (tab: string) => {
    //     setSelectedTab(tab);
    //     setPage(1);
    // };

    const handlePress = (item: Patient) => {
        router.push({
            pathname: "/screen/PatientDashboardPage",
            params: {
                id: item.id,
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 relative">
            <View className="flex-row items-center px-4">
                <Pressable onPress={handleBack}
                    className="w-[33px] h-[33px] bg-[#fff] rounded-full items-center justify-center mt-[10px] mb-[14px]">
                    <IconSymbol name={"arrow-left.fill"} color={""} />
                </Pressable>
                <View className="ml-[98px]">
                    <Text className="text-[20px] font-semibold">Patient’s list</Text>
                </View>
            </View>

            <View className="w-full h-[1px] bg-[#D9D9D9] mb-5" />
            <PatientTabs selected={selectedTab} onSelect={handleSelect} />

            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onDebounce={(txt) => {
                    if (isFirstSearch.current) {
                        isFirstSearch.current = false;
                        return;
                    }
                    setPage(1);
                    handleDebounce(txt);
                }}
            />

            {loading && page === 1 ? (
                <View className="absolute inset-0 justify-center items-center z-50">
                    <ActivityIndicator size="large" color="#2873B5" />
                </View>
            ) : (
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (<PatientCard item={item} onPress={handlePress} />)}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}                   
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color="#2873B5" />
                            </View>
                        ) : null
                    }
                     ListEmptyComponent={
                        !loading ? (
                            <Text className="text-center mt-10 text-gray-500">
                                No patients found
                            </Text>
                        ) : null
                    }
                />
            )}
            <FloatingButton />
        </SafeAreaView>
    );
}