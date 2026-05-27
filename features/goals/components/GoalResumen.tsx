import Ionicons from "@react-native-vector-icons/ionicons";
import { memo } from "react";
import { ScrollView, Text, View } from "react-native";

type ResumenItem = {
  icon: string;
  label: string;
  value: number;
};

type Props = {
  data: ResumenItem[];
  isDark: boolean;
};

function GoalsResumen({ data, isDark }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-0.5 pb-2"
      contentContainerClassName="flex-row justify-between items-stretch gap-2 px-1 min-w-full"
    >
      {data.map((item) => (
        <ResumenCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          isDark={isDark}
        />
      ))}
    </ScrollView>
  );
}

const ResumenCard = memo(function ResumenCard({
  icon,
  label,
  value,
  isDark,
}: {
  icon: string;
  label: string;
  value: number;
  isDark: boolean;
}) {
  return (
    <View className="items-center p-2 bg-componentbg dark:bg-dark-componentbg shadow-sm shadow-black/10 rounded-xl min-w-[31%]">
      <View className="flex-row items-center gap-1 mb-1">
        <Ionicons
          name={icon as any}
          size={14}
          color={isDark ? "white" : "black"}
        />
        <Text className="text-sm text-foreground dark:text-dark-foreground">
          {label}
        </Text>
      </View>
      <Text className="text-3xl font-bold text-primary dark:text-dark-primary">
        {value}
      </Text>
    </View>
  );
});

export default memo(GoalsResumen);
