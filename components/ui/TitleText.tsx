import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;//Other component or feat
}

export default function ScreenHeader({ title, subtitle, rightComponent }: ScreenHeaderProps) {
  return (
    <View className="px-4 flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="text-white font-bold text-base">{title}</Text>
        {subtitle && <Text className="text-white text-base mt-1">{subtitle}</Text>}
      </View>
      {rightComponent}
    </View>
  );
}
