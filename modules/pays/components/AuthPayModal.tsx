
import BottomModal from '@/components/ui/BottomModal';
import { appColors } from '@/utils/colors';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AuthPay } from '../types/AuthPay';

interface Props {
  visible: boolean;
  onClose: () => void;
  item?: AuthPay;
  onAuthorize: () => void;

}

export default function AuthPayModal({ visible, onClose, item, onAuthorize }: Props) {

   if (!item) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={appColors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <BottomModal visible={visible} onClose={onClose} heightPercentage={0.9}>
      {item && (
        <View className="p-4 gap-4">
          <Text className="text-lg font-bold text-black dark:text-white">
            Autorizar pago
          </Text>

          <Text className="text-gray-700 dark:text-gray-300">
            Beneficiario: {item.beneficiario}
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            Documento: {item.tipodocumento}-{item.numerodocumento}
          </Text>

          <Pressable
            onPress={onAuthorize}
            className="bg-green-600 rounded-lg px-4 py-2"
          >
            <Text className="text-center text-white font-semibold">Autorizar</Text>
          </Pressable>
        </View>
      )}
    </BottomModal>
  );
}
