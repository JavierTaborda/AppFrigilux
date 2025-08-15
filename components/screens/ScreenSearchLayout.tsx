import FilterButton from '@/components/ui/FilterButton';
import TitleText from '@/components/ui/TitleText';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../ui/SearchBar';

type ScreenSearchLayoutProps = {
  title: string;
  subtitle: string;
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
  onFilterPress: () => void;
  filterCount?: number;
  children: React.ReactNode;
  extrafilter?: boolean;
  extraFiltersComponent?: React.ReactNode;
};

export default function ScreenSearchLayout({
  title,
  subtitle,
  searchText,
  setSearchText,
  placeholder = '',
  onFilterPress,
  children,
  extrafilter = false,
  extraFiltersComponent,
  filterCount
}: ScreenSearchLayoutProps) {
  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary pt-2">
      <TitleText title={title} subtitle={subtitle} />

      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl px-3 pt-2 shadow-lg ">

        {/* Search & Filter row */}
        <View className="flex-row items-center gap-2">
          <View className={extrafilter ? "flex-1" : "w-4/5"}>
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              placeHolderText={placeholder}
              isFull={extrafilter}
            />
          </View>
          {!extrafilter && (
            <View className="w-1/5 items-center">
              <FilterButton onPress={onFilterPress} filterCount={filterCount} />
            </View>
          )}
        </View>

        {/* Extra filters row */}
        {extrafilter && (
          <View className='flex-row overflow-hidden pt-1'>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}

              contentContainerClassName="gap-3 py-1"
            >
              <View className="justify-center items-start">
                <FilterButton onPress={onFilterPress} filterCount={filterCount} />
              </View>
              <TouchableOpacity className='flex-row items-center gap-1 px-4 py-2 rounded-full  dark:bg-dark-componentbg bg-componentbg'>
                <Text className='text-sm text-foreground dark:text-dark-foreground'>Ordenar</Text>
                <Ionicons name='arrow-down' size={16} color='black' />
              </TouchableOpacity>
              {extraFiltersComponent}
            </ScrollView>
          </View>
        )}

        {/* Content */}
        <View className='pt-2'>
          {children}
        </View>
      </View>
    </View>
  );
}
