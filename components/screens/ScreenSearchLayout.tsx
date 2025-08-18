import FilterButton from '@/components/ui/FilterButton';
import TitleText from '@/components/ui/TitleText';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
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
  headerVisible?: boolean;
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
  filterCount,
  headerVisible = true,

}: ScreenSearchLayoutProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Set value directly without animation
      animatedValue.setValue(headerVisible ? 1 : 0);
      isFirstRender.current = false;
    } else {
      Animated.timing(animatedValue, {
        toValue: headerVisible ? 1 : 0,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [headerVisible]);

  const animatedStyle = {
    height: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 55], // height by component search and filters
    }),
    opacity: animatedValue,
    overflow: 'hidden' as 'hidden',
  };


  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary pt-2">
      <TitleText title={title} subtitle={subtitle} />

      <View className="flex-1 relative bg-background dark:bg-dark-background rounded-t-3xl px-3 pt-2 shadow-lg ">

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
        <Animated.View style={animatedStyle}>

          {/* Extra filters row */}
          {extrafilter && (
            <View className='flex-row  pt-1 pb-1'>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}

                contentContainerClassName="gap-3 py-1"
              >
                <View className="justify-center items-start">
                  <FilterButton onPress={onFilterPress} filterCount={filterCount} />
                </View>
                <View>
                  {extraFiltersComponent}
                </View>
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
