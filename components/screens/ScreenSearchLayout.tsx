import FilterButton from '@/components/ui/FilterButton';
import SearchBar from '@/components/ui/SearchBar';
import TitleText from '@/components/ui/TitleText';
import React from 'react';
import { View } from 'react-native';

type ScreenSearchLayoutProps = {
  title: string;
  subtitle: string;
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
  onFilterPress: () => void;
  children: React.ReactNode;
  filterCount?: number;
};

export default function ScreenSearchLayout({
  title,
  subtitle,
  searchText,
  setSearchText,
  placeholder = '',
  onFilterPress,
  children,
  filterCount
}: ScreenSearchLayoutProps) {
  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
      <TitleText title={title} subtitle={subtitle} />

      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
        {/* Search and Filter */}
        <View className="flex-row overflow-hidden p-1">
          <View className="w-4/5">
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              placeHolderText={placeholder}
             
            />
          </View>
          <View className="w-1/5 justify-center items-end">
            <FilterButton onPress={onFilterPress}  filterCount={filterCount}/>
          </View>
        </View>

        {/* Dynamic content */}
        {children}
      </View>
    </View>
  );
}