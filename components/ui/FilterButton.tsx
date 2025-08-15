import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonProps {
  onPress: () => void;
  filterCount?: number;
}

export default function FilterButton({ onPress, filterCount }: FilterButtonProps) {
  const { theme } = useThemeStore();
  return (
    <TouchableOpacity
      className={`mx-0 px-6 py-2.5 rounded-full
       bg-componentbg dark:bg-dark-componentbg `}//shadow-inner
      onPress={onPress}
    >
      <Ionicons name="filter" size={20} color={theme === 'dark' ? 'white' : 'grey'} />
      {typeof filterCount === 'number' && filterCount > 0 && (
        <View  className="absolute -top-0 -right-0 bg-red-500 dark:bg-red-200 rounded-full px-1.5 py-0.5">
          <Text className="text-white text-xs font-bold overflow-hidden">{filterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

