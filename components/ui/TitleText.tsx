import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;//Other component or feat
}

export default function ScreenHeader({ title, subtitle, rightComponent }: ScreenHeaderProps) {
  return (
    <View className="px-3 flex-row gap-0 justify-between items-start">
      <View className="flex-1 ">
        <Text className="text-white font-normal text-2xl">{title}</Text>
        {subtitle && <Text className="text-white font-medium text-2xl mt-1 overflow-hidden">{subtitle}</Text>}
      </View>
      {rightComponent}
    </View>
  );
}
