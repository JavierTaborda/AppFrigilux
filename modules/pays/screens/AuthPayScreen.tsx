import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';

import SearchBar from '@/components/ui/SearchBar';
import TitleText from '@/components/ui/TitleText';
import { useAuthPays } from '@/modules/pays/hooks/useAuthPays';
import { useThemeStore } from '@/stores/useThemeStore';
import { totalVenezuela } from '@/utils/moneyFormat';

import { appColors } from '@/utils/colors';
import AuthPayCard from '../components/AuthPayCard';
import AuthPayModal from '../components/AuthPayModal';
import FiltersModal from '../components/FilterModal';
import { AuthPay } from '../types/AuthPay';

export default function AuthorizationScreen() {
  const { pays, loading, totalDocumentsAuth, totalAutorizadoUSD, totalAutorizadoVED } = useAuthPays();
  const [searchText, setSearchText] = useState('');
  const { theme } = useThemeStore();

  // State Filters
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // States Auth
  const [selectedItem, setSelectedItem] = useState<AuthPay | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
  };

  const handleOpenAuthModal = (item: AuthPay) => {
    setSelectedItem(item);
    setAuthModalVisible(true);
  };

  const handleAuthorize = () => {
    if (selectedItem) {
      alert('Pago Autorizado')
      // TODO: real logic
    }
    setAuthModalVisible(false);
  };

  const filteredPays = pays.filter((item) =>
    `${item.observacion} ${item.beneficiario}`.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator
          size="large"
          color={theme === 'dark' ? appColors.dark.primary.DEFAULT : appColors.primary.DEFAULT}
        />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
        <TitleText
          title={`${totalDocumentsAuth} Documentos`}
          subtitle={`Total autorizado: ${totalVenezuela(totalAutorizadoVED)} VED / ${totalVenezuela(totalAutorizadoUSD)} $`}
        />

        <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
          {/* bar search and filter button */}
          <View className="flex-row overflow-hidden p-1">
            <View className="w-4/5">
              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                placeHolderText="Observación o Beneficiario..."
              />
            </View>
            <View className="w-1/5 justify-center items-end">
              <TouchableOpacity
                className="mx-1 px-6 py-2.5 bg-componentbg dark:bg-dark-componentbg rounded-full"
                onPress={() => setFilterModalVisible(true)}
              >
                <Ionicons name="filter" size={20} color={theme === 'dark' ? 'white' : 'grey'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pay List */}
          <FlatList
            data={filteredPays}
            keyExtractor={(item, index) => `${item.numerodocumento}-${index}`}
            renderItem={({ item }) => (
              <AuthPayCard item={item} onPress={() => handleOpenAuthModal(item)} />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </View>

      {/* Modal Filters */}
      {filterModalVisible && (

        <FiltersModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={handleApplyFilters}
        />

      )}

      {authModalVisible && (
        <AuthPayModal
          visible={authModalVisible}
          onClose={() => setAuthModalVisible(false)}
          item={selectedItem || undefined}
          onAuthorize={handleAuthorize}
        />
      )}

    </>
  );
}
