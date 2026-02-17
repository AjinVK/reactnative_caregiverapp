import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, View, type StyleProp, type TextStyle } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];
type IoniconsName = ComponentProps<typeof Ionicons>["name"];
type FeatherName = ComponentProps<typeof Feather>["name"];
type FontAwesome6Name = ComponentProps<typeof FontAwesome6>["name"];
type FontAwesomeName = ComponentProps<typeof FontAwesome>["name"];
type FontistoName = ComponentProps<typeof Fontisto>["name"];
type AntDesignName = ComponentProps<typeof AntDesign>["name"];

type AppIconName = MaterialIconName | MaterialCommunityIconName | IoniconsName | FeatherName | FontAwesome6Name | FontAwesomeName | FontistoName | AntDesignName;

type IconEntry = {
  lib: "material" | "materialCommunity" | "ionicons" | "feather" | "fontAwesome6" | "fontAwesome" | "fontisto" | "antDesign";
  name: AppIconName;
};

const MAPPING: Record<string, IconEntry> = {
  "history.fill": { lib: "materialCommunity", name: "history" },
  "clock.outline": { lib: "materialCommunity", name: "clock-time-four-outline" },
  "bell.fill": { lib: "materialCommunity", name: "bell-ring" },
  "dots.fill": { lib: "materialCommunity", name: "dots-horizontal" },
  "human-height.fill": { lib: "materialCommunity", name: "human-male-height" },

  "partly-sunny.outline": { lib: "ionicons", name: "partly-sunny-outline" },
  "eye.outline": { lib: "ionicons", name: "eye-outline" },
  "search.outline": { lib: "ionicons", name: "search" },
  "person.fill": { lib: "ionicons", name: "person" },
  "arrow-forward.outline": { lib: "ionicons", name: "arrow-forward-circle-outline" },
  "home.fill": { lib: "ionicons", name: "home" },

  "phone.outline": { lib: "feather", name: "phone" },
  "arrow-right.fill": { lib: "feather", name: "arrow-right" },
  "arrow-left.fill": { lib: "feather", name: "arrow-left" },
  "phone-call.outline": { lib: "feather", name: "phone-call" },

  "check.fill": { lib: "material", name: "check" },

  "plus-circle.outline": { lib: "fontAwesome6", name: "circle-plus" },
  "location.fill": { lib: "fontAwesome6", name: "location-dot" },
  "weight-scale.fill": { lib: "fontAwesome6", name: "weight-scale" },
  "user-doctor.fill": { lib: "fontAwesome6", name: "user-doctor" },

  "phone.fill": { lib: "fontAwesome", name: "phone" },

  "blood-drop.fill": { lib: "fontisto", name: "blood-drop" },

  "message.outline": { lib: "antDesign", name: "message" },

  'house.fill': { lib: "material", name: "home" },
  'paperplane.fill': { lib: "material", name: "send" },
  // 'chevron.left.forwardslash.chevron.right': { lib: "material", name: "code" },
  // 'chevron.right': { lib: "material", name: "chevron-right" },
};

type IconSymbolProps = {
  name: keyof typeof MAPPING;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  // badgeCount?: number;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {

  const entry = MAPPING[name];
  if (!entry) return null;

  let IconComponent:
    | typeof MaterialIcons
    | typeof MaterialCommunityIcons
    | typeof Ionicons
    | typeof Feather
    | typeof FontAwesome6
    | typeof FontAwesome
    | typeof Fontisto
    | typeof AntDesign
    | null = null;

  switch (entry.lib) {
    case "material":
      IconComponent = MaterialIcons;
      break;
    case "materialCommunity":
      IconComponent = MaterialCommunityIcons;
      break;
    case "ionicons":
      IconComponent = Ionicons;
      break;
    case "feather":
      IconComponent = Feather;
      break;
    case "fontAwesome6":
      IconComponent = FontAwesome6;
      break;
    case "fontAwesome":
      IconComponent = FontAwesome;
      break;
    case "fontisto":
      IconComponent = Fontisto;
      break;
    case "antDesign":
      IconComponent = AntDesign;
      break;
  }

  if (!IconComponent) return null;

  const iconElement = (
    <IconComponent
      name={entry.name as any}
      size={size}
      color={color}
      style={style}      
    />
  );

  return (
    <View style={{ width: size, height: size }}>
      {iconElement}
    </View>
  );

  // return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
