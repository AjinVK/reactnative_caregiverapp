import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// Add a mapping for iOS SF Symbols to match the names used in the app
const MAPPING: Record<string, string> = {
  "history.fill": "clock.arrow.circlepath",
  "clock.outline": "clock",
  "bell.fill": "bell.fill",
  "dots.fill": "ellipsis",
  "human-height.fill": "figure.stand",
  "partly-sunny.outline": "cloud.sun",
  "eye.outline": "eye",
  "search.outline": "magnifyingglass",
  "person.fill": "person.fill",
  "arrow-forward.outline": "arrow.forward.circle",
  "home.fill": "house.fill",
  "phone.outline": "phone",
  "arrow-right.fill": "arrow.right",
  "arrow-left.fill": "arrow.left",
  "phone-call.outline": "phone.arrow.up.right",
  "check.fill": "checkmark",
  "plus-circle.outline": "plus.circle",
  "location.fill": "mappin.and.ellipse",
  "weight-scale.fill": "scalemass",
  "user-doctor.fill": "person.text.rectangle",
  "phone.fill": "phone.fill",
  "blood-drop.fill": "drop.fill",
  "message.outline": "message",
  "house.fill": "house.fill",
  "paperplane.fill": "paperplane.fill",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const nativeName = MAPPING[name] || name;

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={nativeName as any}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

