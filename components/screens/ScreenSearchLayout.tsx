import FilterButton from '@/components/ui/FilterButton';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import SearchBar from '../ui/SearchBar';

// Reanimated v4
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ScreenSearchLayoutProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
  onFilterPress: () => void;
  filterCount?: number;
  children: React.ReactNode;
  extrafilter?: boolean;
  extraFiltersComponent?: React.ReactNode;
  headerVisible?: boolean;
};

export default function ScreenSearchLayout({
  searchText,
  setSearchText,
  placeholder = '',
  onFilterPress,
  children,
  extrafilter = false,
  extraFiltersComponent,
  filterCount,
  headerVisible = true,
}: ScreenSearchLayoutProps) {

  const animatedValue = useSharedValue(headerVisible ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withTiming(headerVisible ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  }, [headerVisible]);

  // Use useAnimatedStyle 
  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedValue.value * 48,
    opacity: animatedValue.value,
    transform: [
      { scaleY: 0.95 + 0.05 * animatedValue.value },
    ],
    overflow: 'hidden',
  }));

  return (
    <View className="flex-1 pt-0.5 bg-primary dark:bg-dark-primary ">
      {/* <TitleText title={title} subtitle={subtitle} /> */}

      <View className="flex-1 relative bg-background dark:bg-dark-background rounded-t-3xl pt-3 ">
        {/* Search & Filter row */}
        <View className="flex-row items-center gap-0 pb-2 px-4">
          <View className={extrafilter ? "flex-1" : "w-4/5"}>
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              placeHolderText={placeholder}
              isFull={extrafilter}
            />
          </View>
          {!extrafilter && (
            <View className="w-1/5 items-end">
              <FilterButton onPress={onFilterPress} filterCount={filterCount} />
            </View>
          )}
        </View>
        <Animated.View style={animatedStyle} className="px-4">
          {/* Extra filters row */}
          {extrafilter && (
            <View className="flex-row">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-1"
              >
                <View className="justify-center items-start">
                  <FilterButton
                    onPress={onFilterPress}
                    filterCount={filterCount}
                    title={extrafilter}
                  />
                </View>
                <View>{extraFiltersComponent}</View>
              </ScrollView>
            </View>
          )}
        </Animated.View>
        {/* Content */}

        {children}
      </View>
    </View>
  );
}
