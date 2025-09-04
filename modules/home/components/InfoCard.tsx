import { Text, View } from "react-native";

type InfoCardProps = {
  icon: string;
  title: string;
  value: string | number;
  bgColor: string;
};
export const InfoCard = ({ icon, title, value, bgColor }: InfoCardProps) => (
  <View
    className={`
    flex-1 min-w-28 rounded-xl p-4 justify-between
      ${bgColor ?? "bg-primary dark:bg-dark-primary"}
    `}
  >
    <View className="flex-row items-center">
      <Text className="text-white text-2xl mr-1 shadow-sm">{icon}</Text>
      <Text
        className="text-white text-lg font-bold flex-1"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
    <Text className="text-white text-2xl font-semibold">{value}</Text>
  </View>
);

