import { appColors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: () => void;
    onClean: () => void;
    children?: React.ReactNode;
    title?: string;

}

export default function FilterModal({ visible, onClose, onApply, onClean, children, title = 'Filtrar' }: FilterModalProps) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/50 justify-end">
                <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOutDown}
                    className="bg-background dark:bg-dark-background rounded-t-3xl p-5 max-h-[85%]"
                    style={{
                        paddingBottom: insets.bottom,
                    }}
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={appColors.mutedForeground} />
                        </TouchableOpacity>
                    </View>
                    {
                        children
                    }


                    {/* Buttons */}
                    <View className="flex-row gap-3 mt-3 pb-1">
                        <TouchableOpacity
                            className="flex-1 p-3 rounded-xl border border-muted"
                            onPress={() => {

                                onClean();
                            }}
                        >
                            <Text className="text-center text-foreground dark:text-dark-foreground font-semibold">
                                Limpiar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 p-3 rounded-xl bg-primary dark:bg-dark-primary"
                            onPress={() => {
                                onApply();
                                onClose();
                            }}
                        >
                            <Text className="text-center text-white font-semibold">
                                Aplicar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
