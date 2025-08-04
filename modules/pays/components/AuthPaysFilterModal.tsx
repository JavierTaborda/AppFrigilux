import { useThemeStore } from '@/stores/useThemeStore';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type AuthPaysFilterModalExpoProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthPaysFilterModal({ visible, onClose }: AuthPaysFilterModalExpoProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.7;

  const textColor = isDark ? 'text-white' : 'text-black';
  const bgPicker = isDark ? 'bg-neutral-700' : 'bg-neutral-200';

  const [selectedCompany, setSelectedCompany] = useState('CYBERLUX');
  const [onlyAuthorized, setOnlyAuthorized] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('VED');

  const handleApplyFilters = () => {
    // lógica para aplicar los filtros seleccionados
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          style={{
            height: modalHeight,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5
          }}
          className={`p-5 rounded-t-2xl ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className={`text-center text-lg font-bold mb-4 ${textColor}`}>Filtros</Text>

            {/* Empresa */}
            <Text className={`mb-2 ${textColor}`}>Empresa:</Text>
            <View className={`rounded mb-4 ${bgPicker}`}>
              <Picker
                selectedValue={selectedCompany}
                onValueChange={setSelectedCompany}
                style={{ color: isDark ? 'white' : 'black' }}
              >
                <Picker.Item label="FRIGILUX" value="FRIGLUX" />
                <Picker.Item label="CYBERLUX" value="CYBERLUX" />
              </Picker>
            </View>

            {/* Switch solo autorizados */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className={textColor}>Solo autorizados</Text>
              <Switch
                accessibilityLabel="Mostrar solo autorizados"
                value={onlyAuthorized}
                onValueChange={setOnlyAuthorized}
              />
            </View>

            {/* Moneda */}
            <Text className={`mb-2 ${textColor}`}>Moneda:</Text>
            <View className={`rounded mb-4 ${bgPicker}`}>
              <Picker
                selectedValue={selectedCurrency}
                onValueChange={setSelectedCurrency}
                style={{ color: isDark ? 'white' : 'black' }}
              >
                <Picker.Item label="VED (Bolívares)" value="VED" />
                <Picker.Item label="USD (Dólares)" value="USD" />
              </Picker>
            </View>

            {/* Botones */}
            <TouchableOpacity
              className="bg-green-500 py-3 rounded-full mt-2"
              onPress={handleApplyFilters}
            >
              <Text className="text-white text-center font-semibold">Aplicar filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-full mt-3"
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}