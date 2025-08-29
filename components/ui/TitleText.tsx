import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;//Other component or feat
}

export default function ScreenHeader({ title, subtitle, rightComponent }: ScreenHeaderProps) {
  return (
    <View className="px-1 flex-1 gap-0 justify-between items-center">
      <View className="flex-row gap-2">
        <Text className="text-foreground dark:text-dark-foreground font-bold text-md">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-foreground dark:text-dark-foreground font-medium text-md overflow-hidden">
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </View>
  );
}
