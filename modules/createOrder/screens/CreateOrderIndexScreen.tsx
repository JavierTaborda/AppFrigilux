import { useState } from 'react';
import { FlatList, View } from 'react-native';


import ScreenSearchLayout from '@/components/screens/ScreenSearchLayout';
import ProductCard from '../components/ProductCard';

export default function AuthorizationScreen() {
  
  const [searchText, setSearchText] = useState('');

  // State Filters
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // States Auth
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };


//   if (loading) {
//     return (
//       <Loader />
//     );
//   }
const products = [
  {
    id: "1",
    title: "Camisa Vintage",
    price: 39.99,
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: "2",
    title: "Zapatillas Urbanas",
    price: 89.99,
    image: "https://via.placeholder.com/300x200",
  },
];


  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Código o descripción..."
      onFilterPress={() => setFilterModalVisible(true)}
      headerVisible={false}
      extrafilter={false}
    >
      <View className="flex-1 px-4 items-center">
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              image={item.image}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    </ScreenSearchLayout>
  );
}
