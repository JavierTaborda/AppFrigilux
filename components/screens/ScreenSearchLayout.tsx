import FilterButton from '@/components/ui/FilterButton';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import SearchBar from '../ui/SearchBar';


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
        easing: Easing.out(Easing.exp),
        //easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [headerVisible]);

  const animatedStyle = {
    height: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 45], // altura deseada
      extrapolate: 'clamp',
    }),
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scaleY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
    overflow: 'hidden' as const,
  };


  return (
    <View className="flex-1 pt-0.5 bg-primary dark:bg-dark-primary ">
      {/* <TitleText title={title} subtitle={subtitle} /> */}

      <View className="flex-1 relative bg-background dark:bg-dark-background rounded-t-3xl pt-2 ">
        {/* Search & Filter row */}
        <View className="flex-row items-center gap-0 pb-2 px-2.5">
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
        <Animated.View style={animatedStyle} className="px-2.5">
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
