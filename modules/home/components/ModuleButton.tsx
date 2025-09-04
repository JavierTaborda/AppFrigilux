import { Pressable, Text } from "react-native";
type ModuleButtonProps = {
  icon: string;
  label: string;
  onPress?: ()=>void;
  bgColor?: string;
};
export const ModuleButton = ({ icon, label, onPress, bgColor }: ModuleButtonProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 h-24 rounded-xl mx-1 items-center justify-center ${bgColor} `}
  >
    <Text className="text-white text-3xl mb-1 shadow-sm">{icon}</Text>
    <Text className="text-white text-lg font-bold text-center">{label}</Text>
  </Pressable>
);
