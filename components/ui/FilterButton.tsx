import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FilterButtonProps {
  onPress: () => void;
}

export default function FilterButton({ onPress}: FilterButtonProps) { 
  const { theme } = useThemeStore();
  return (
    <TouchableOpacity
      className="mx-1 px-6 py-2.5 bg-componentbg dark:bg-dark-componentbg rounded-full"
      onPress={onPress}
    >
      <Ionicons name="filter" size={20} color={theme === 'dark' ? 'white' : 'grey'} />
    </TouchableOpacity>
  );
};

