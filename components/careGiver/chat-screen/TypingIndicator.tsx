import { Animated, Text, View } from "react-native";
import { useEffect, useRef } from "react";

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animate = (dot: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

  useEffect(() => {
    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 150),
      animate(dot3, 300),
    ]).start();
  }, []);

  const style = (dot: Animated.Value) => ({
    opacity: dot,
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -3],
        }),
      },
    ],
  });

  return (
    <View className="flex-row items-center gap-[3px] mt-[1px]">
      <Animated.Text style={style(dot1)} className="text-[#1E5B91] text-[12px] top-1">•</Animated.Text>
      <Animated.Text style={style(dot2)} className="text-[#1E5B91] text-[12px] top-1">•</Animated.Text>
      <Animated.Text style={style(dot3)} className="text-[#1E5B91] text-[12px] top-1">•</Animated.Text>
      <Text className="text-[#1E5B91] text-[12px] ml-[3px]">typing</Text>
    </View>
  );
}
