import { ThemedView } from "@/components/themed-view";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Chart({ monthlyData }: { monthlyData?: number[] }) {
    const now = new Date();
    const currentMonthIndex = now.getMonth();

    const lineData = MONTHS.map((month, i) => {
        const value = monthlyData?.[i] ?? 0;

        if (i > currentMonthIndex) {
            return {
                value: undefined,
                label: month,
            };
        }

        return {
            value,
            label: month,
            customDataPoint: i === currentMonthIndex
                ? () => (
                    <View
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: 10,
                            backgroundColor: "#FF3B3B",
                        }}
                    />
                )
                : undefined,
            dataPointText: i === currentMonthIndex ? `${value}` : undefined,
        };
    });

    const noOfSections = 4;
    const maxValue = 100;

    const yAxisLabelTexts = Array.from(
        { length: noOfSections + 1 },
        (_, i) => {
            const val = (maxValue / noOfSections) * i;
            return Number.isInteger(val) ? `${val}` : `${val.toFixed(1)}`;
        }
    );

    const formattedMonthYearDate = `${now.toLocaleString("en-US", { month: "short" })} - ${now.getFullYear()}/${now.getDate()}`;

    return (
        <View className="px-4 mb-[20px]">
            <View className="bg-[#E9F7FF] p-[15px] rounded-[9px]">
                <Text className="text-[15px] font-medium mb-[10px]">{formattedMonthYearDate}</Text>

                <View className="bg-[white] rounded-[13px] p-[10px] overflow-hidden">
                    <LineChart
                        data={lineData}
                        curved
                        areaChart
                        height={150}
                        hideDataPoints={false}
                        noOfSections={4}
                        maxValue={100}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        color="#FF3B3B"
                        yAxisColor="#E5E7EB"
                        xAxisColor="#E5E7EB"
                        rulesColor="#d5e6f253"
                        rulesThickness={1}
                        showVerticalLines={true}
                        verticalLinesColor="#d5e6f253"
                        verticalLinesThickness={1}
                        xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 12 }}
                        yAxisTextStyle={{ color: '#6B7280', fontSize: 12 }}
                        initialSpacing={20}
                        endSpacing={20}
                        showDataPointOnFocus={true}
                        focusEnabled={true}
                        startFillColor="#FF3B3B"
                        endFillColor="#FF3B3B"
                        startOpacity={0.25}
                        endOpacity={0.02}
                        yAxisLabelTexts={yAxisLabelTexts}
                    />
                </View>
            </View>
        </View>
    );
}
