import { useThemeStore } from '@/stores/useThemeStore';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type AuthPaysFilterModalExpoProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthPaysFilterModal({ visible, onClose }: AuthPaysFilterModalExpoProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.7;

  const [selectedCompany, setSelectedCompany] = useState('CYBERLUX');
  const [onlyAuthorized, setOnlyAuthorized] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('VED');

  return (
    <Modal
      visible={visible}
      animationType="slide"
        presentationStyle="pageSheet" 
      transparent
      onRequestClose={onClose}
        onDismiss={onClose}

    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { height: modalHeight, backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>Filtros</Text>

          <Text style={[styles.label, { color: isDark ? 'white' : 'black' }]}>Empresa:</Text>
          <View style={[styles.pickerContainer, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
            <Picker
              selectedValue={selectedCompany}
              onValueChange={setSelectedCompany}
              style={{ color: isDark ? 'white' : 'black' }}
            >
              <Picker.Item label="FRIGILUX" value="FRIGLUX" />
              <Picker.Item label="CYBERLUX" value="CYBERLUX" />
            </Picker>
          </View>

          <View style={styles.switchRow}>
            <Text style={{ color: isDark ? 'white' : 'black' }}>Solo autorizados</Text>
            <Switch
              value={onlyAuthorized}
              onValueChange={setOnlyAuthorized}
            />
          </View>

          <Text style={[styles.label, { color: isDark ? 'white' : 'black' }]}>Moneda:</Text>
          <View style={[styles.pickerContainer, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
            <Picker
              selectedValue={selectedCurrency}
              onValueChange={setSelectedCurrency}
              style={{ color: isDark ? 'white' : 'black' }}
            >
              <Picker.Item label="VED (Bolívares)" value="VED" />
              <Picker.Item label="USD (Dólares)" value="USD" />
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isDark ? '#2196F3' : '#2196F3' }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
