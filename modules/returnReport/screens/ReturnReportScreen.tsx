import BarcodeScanner from "@/components/camera/BarcodeScanner";
import BottomModal from "@/components/ui/BottomModal";
import CustomImage from "@/components/ui/CustomImagen";
import { appColors } from "@/utils/colors";
import { emojis } from "@/utils/emojis";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function ProductDefectScreen() {
  const [barcode, setBarcode] = useState("");
  const [reason, setReason] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    //console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <ScrollView className="flex-1 bg-background pb-16">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-semibold mb-4">Registrar Defecto</Text>
        <View className="flex-row items-center gap-2">
          <View
            className={`flex-1 border rounded-xl px-4 dark:text-white bg-transparent dark:bg-dark-componentbg border-gray-300 dark:border-gray-600`}
          >
            <TextInput
              className="flex-1 p-4 text-black dark:text-white"
              placeholder="Código"
              value={barcode}
              placeholderTextColor={appColors.placeholdercolor}
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={setBarcode}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowScanner(true)}
            className="bg-primary dark:bg-dark-primary p-3 rounded-lg"
          >
            <Text className="text-white">{emojis.camera}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View
            className={`flex-row items-center border rounded-xl px-4 dark:text-white bg-transparent dark:bg-dark-componentbg border-gray-300 dark:border-gray-600`}
          >
            <TextInput
              className="flex-1 p-4 text-black dark:text-white"
              placeholder="Motivo..."
              value={reason}
              placeholderTextColor={appColors.placeholdercolor}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setReason}
            />
          </View>
        </View>
        <View>
          <View
            className={`flex-row items-center border rounded-xl px-4 dark:text-white bg-transparent dark:bg-dark-componentbg border-gray-300 dark:border-gray-600`}
          >
            <TextInput
              className="flex-1 p-4 text-black dark:text-white"
              placeholder="Comentario..."
              value={reason}
              placeholderTextColor={appColors.placeholdercolor}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setReason}
            />
          </View>
        </View>
        <View className="rounded-3xl">
        
          <Text
            className="p-2 bg-primary dark:bg-dark-primary font-medium text-white text-center rounded-xl"
            onPress={pickImage}
          >
            Seleccionar una imagen
          </Text>
          {image && (
            <View className="pt-2 w-40 h-40 rounded-xl bg-bgimages dark:bg-gray-800 justify-center items-center overflow-hidden mr-4 shadow-sm">
              <CustomImage img={image} />
            </View>
          )}
        </View>
        <View className="pt-3">
            <Text
            className="px-2 py-4 bg-primary dark:bg-dark-primary font-medium text-xl text-white text-center rounded-xl"
         
          > Guardar</Text>
        </View>

      </View>
      <BottomModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        heightPercentage={0.85}
      >
        <BarcodeScanner
          onScanned={(code) => {
            setBarcode(code);
            setShowScanner(false);
          }}
        />
      </BottomModal>
    </ScrollView>
  );
}
