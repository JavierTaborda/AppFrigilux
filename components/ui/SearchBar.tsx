
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchBar() {
  const { theme } = useThemeStore();

  return (
    <View className="flex-row items-center bg-componentbg dark:bg-dark-componentbg rounded-full px-4 py-2">
      <Ionicons name="search-outline" size={20} color={theme === 'dark' ? 'white' : 'black'} />
      <TextInput
        className="ml-2 flex-1 text-black dark:text-white"
        placeholder="Buscar documento..."
        placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
      />
      <TouchableOpacity className="ml-2">
        <Ionicons name="filter-outline" size={22} color={theme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );
}
