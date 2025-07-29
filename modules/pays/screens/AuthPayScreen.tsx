import SearchBar from '@/components/ui/SearchBar';
import TitleText from '@/components/ui/TitleText';
import { useAuthPays } from '@/modules/pays/hooks/useAuthPays';
import { ActivityIndicator, FlatList, View } from 'react-native';
import AuthPayCard from '../components/AuthPayCard';

export default function AuthorizationScreen() {
  const { pays, loading } = useAuthPays();

  const totalAutorizadoVED = pays
    .filter((d) => d.monedaproveedor === 'BOLIVARES')
    .reduce((acc, item) => acc + parseFloat(item.montoneto), 0);

  const totalAutorizadoUSD = pays
    .filter((d) => d.monedaproveedor === 'DOLARES')
    .reduce((acc, item) => acc + parseFloat(item.montoneto), 0);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary dark:bg-dark-primary">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
      <TitleText
        title={`${pays.length} Documentos`}
        subtitle={`Total autorizado: ${totalAutorizadoVED.toLocaleString()} Bs / ${totalAutorizadoUSD.toLocaleString()} $`}
      />

      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
        <SearchBar />
        <FlatList
          data={pays}
          keyExtractor={(item, index) => `${item.numerodocumento}-${index}`}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => <AuthPayCard item={item} />}
        />
      </View>
    </View>
  );
}
