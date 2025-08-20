import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  sortDate: boolean;
  setSortDate: (value: boolean) => void;
  showStatus: boolean;
  setShowStatus: (value: boolean) => void;
  sortMount: boolean;
  setSortMount: (value: boolean) => void;
  mount: boolean;
  setMount: (value: boolean) => void;
}

export default function FastFilters({
  sortDate,
  setSortDate,
  showStatus,
  setShowStatus,
  sortMount,
  setSortMount,
  mount,
  setMount,
}: Props) {
  const { isDark } = useThemeStore();
  const iconColor = isDark ? 'grey' : 'grey';

  const toggleExpand = () => {
    setMount(!mount);
  };

  const renderButton = (
    label: string,
    active: boolean,
    icon: React.ComponentProps<typeof Ionicons>['name'],
    onPress: () => void,
    rotateIcon?: boolean
  ) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${label}`}
      className={`flex-row items-center px-4 py-2.5 rounded-full ${
        active ? 'bg-primary dark:bg-dark-primary' : 'bg-componentbg dark:bg-dark-componentbg'
      }`}
    >
      <Text
        className={`text-sm ${
          active ? 'text-white' : 'text-mutedForeground dark:text-dark-mutedForeground'
        }`}
      >
        {label}
      </Text>
      <Ionicons
        name={icon}
        size={rotateIcon ? 20 : 16}
        color={active ? 'white' : iconColor}
        style={{ marginLeft: 6 }}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-row gap-2">
      {renderButton('Por Revisar', showStatus, showStatus ? 'eye' : 'eye-off', () => setShowStatus(!showStatus))}
      {renderButton('Fecha', sortDate, sortDate ? 'arrow-down' : 'arrow-up', () => setSortDate(!sortDate))}
      {renderButton('Monto', sortMount, sortMount ? 'arrow-down' : 'arrow-up', () => setSortMount(!sortMount))}
      {renderButton('Filtrar Monto', mount, 'chevron-down', toggleExpand, true)}
    </View>
  );
}