import { useThemeStore } from '@/stores/useThemeStore';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type AuthPaysFilterModalExpoProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AuthPaysFilterModal({ visible, onClose }: AuthPaysFilterModalExpoProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.8;

  const textColor = isDark ? 'text-white' : 'text-black';
  const bgPicker = isDark ? 'bg-neutral-700' : 'bg-neutral-200';

  const [selectedCompany, setSelectedCompany] = useState('CYBERLUX');
  const [onlyAuthorized, setOnlyAuthorized] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('VED');

  // Posición vertical del sheet
  const translateY = useSharedValue(modalHeight);

  // Mostrar/Ocultar
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20 });
    } else {
      translateY.value = withSpring(modalHeight, { damping: 20 });
    }
  }, [visible]);

  // Gesto solo para la dragbar
  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleApplyFilters = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle="overFullScreen" // ✅ Necesario para Android
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-[rgba(0,0,0,0.6)]">
        <Animated.View
          style={[sheetStyle, { height: modalHeight }]}
          className={`p-5 rounded-t-3xl ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
        >
          {/* Dragbar con gesto */}
          <GestureDetector gesture={dragGesture}>
            <View className='p-2 bg-primary'>
              <View className="w-16 h-1.5 bg-neutral-400 self-center rounded-full mb-4" />
            </View>
          </GestureDetector>

          {/* Contenido scrollable */}
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
              <Switch value={onlyAuthorized} onValueChange={setOnlyAuthorized} />
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
              className="bg-neutral-500 py-3 rounded-full mt-3 mb-4"
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
