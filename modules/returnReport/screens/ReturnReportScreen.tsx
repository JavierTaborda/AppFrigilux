import BarcodeScanner from "@/components/camera/BarcodeScanner";
import CustomPicker from "@/components/inputs/CustomPicker";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import CustomImage from "@/components/ui/CustomImagen";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import { emojis } from "@/utils/emojis";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useReturnReport } from "../hooks/useReturnReport";

export default function ProductDefectScreen() {
  const { isDark } = useThemeStore();

  const {
    registerDefect,
    loading,
    loadingData,
    pickImage,
    handlePickFromCamera,
    barcode,
    setBarcode,
    serial,
    setSerial,
    codeArt,
    artDes,
    reason,
    setReason,
    comment,
    setComment,
    image,
    showScanner,
    setShowScanner,
    clients,
    selectedClient,
    setSelectedClient,
    showClientModal,
    setShowClientModal,
    codeVen,
    venDes,
    setCodeArt,
    setArtDes,
    setCodeVen,
    setVenDes,
    factNumber,
    setFactNumber,
    handleSearchFactNum,
    handleSearchSerial,
    clearForm,
    isData,
    artList,
  } = useReturnReport();

  const [startMethod, setStartMethod] = useState<"serial" | "fact">("serial");
  const [scanCode, setScanCode] = useState<string>();

  const isFormValid = barcode && reason && comment && image && selectedClient;

  const toggleX = useSharedValue(startMethod === "serial" ? 0 : 1);

  useEffect(() => {
    toggleX.value = withTiming(startMethod === "serial" ? 0 : 1, {
      duration: 250,
    });
  }, [startMethod]);

  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value * ((width - 40) / 2) }],
  }));

  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary">
      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl">
        <ScrollView
          contentContainerClassName="p-5 pb-44 gap-2"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
                Registrar devolución
              </Text>
            </View>
            <Text className="text-sm text-mutedForeground dark:text-dark-mutedForeground mt-1">
              Completa los pasos para enviar el reporte
            </Text>

            {/* <View className="h-2 mt-3 bg-muted dark:bg-dark-muted rounded-full overflow-hidden">
              <View
                className={`h-2 rounded-full ${
                  isData
                    ? "w-4/5 bg-primary dark:bg-dark-primary"
                    : "w-1/3 bg-primary/50 dark:bg-dark-primary/50"
                }`}
              />
            </View> */}
          </View>
          {!isData && (
            <View className="relative flex-row bg-muted dark:bg-dark-muted rounded-2xl p-1 mb-1 overflow-hidden">
              <Animated.View
                style={[animatedStyle]}
                className="absolute left-1 top-1 w-1/2 h-full bg-primary dark:bg-dark-primary rounded-xl"
              />

              {[
                { key: "serial", label: `${emojis.package} Serial` },
                { key: "fact", label: `${emojis.search} Factura` },
              ].map(({ key, label }) => {
                const active = startMethod === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setStartMethod(key as "serial" | "fact");
                    }}
                    className="flex-1 py-3 rounded-xl items-center z-10"
                  >
                    <Text
                      className={`font-semibold text-base ${
                        active
                          ? "text-white"
                          : "text-foreground dark:text-dark-foreground"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {startMethod === "serial" && (
            <>
              <View className="flex-row gap-2 items-center">
                <View className="flex-1">
                  <CustomTextInput
                    placeholder="Serial"
                    value={serial}
                    onChangeText={setSerial}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowScanner(true)}
                  className="bg-primary dark:bg-dark-primary py-3.5 px-4 rounded-xl active:scale-95"
                >
                  <Text className="text-white text-base font-semibold">
                    {emojis.camera2}
                  </Text>
                </TouchableOpacity>
              </View>
              {!isData && (
                <View className="mt-1">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSearchSerial();
                    }}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-center py-3 px-5 rounded-xl border border-primary dark:border-dark-primary bg-transparent active:scale-95"
                  >
                    <Text className="text-primary dark:text-dark-primary font-semibold text-base">
                      Buscar producto
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {startMethod === "fact" && (
            <View className="flex-row gap-2 items-center mb-3">
              <View className="flex-1">
                <CustomTextInput
                  placeholder="Número de factura"
                  keyboardType="numeric"
                  value={factNumber}
                  onChangeText={setFactNumber}
                />
              </View>
              <TouchableOpacity
                onPress={handleSearchFactNum}
                className="bg-primary dark:bg-dark-primary py-3 px-5 rounded-xl active:scale-95"
              >
                <Text className="text-white font-semibold">Buscar</Text>
              </TouchableOpacity>
            </View>
          )}

          {loadingData && (
            <View className="flex-row items-center justify-center gap-2 mt-10 w-full">
              <ActivityIndicator
                color={
                  isDark
                    ? appColors.dark.primary.DEFAULT
                    : appColors.primary.DEFAULT
                }
              />
              <Text className="text-mutedForeground dark:text-dark-mutedForeground text-center">
                Buscando datos...
              </Text>
            </View>
          )}

          {isData && (
            <>
              <View className=" gap-y-4">
                <View className="gap-y-2">
                  <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
                    Información del artículo
                  </Text>
                  {startMethod === "fact" && (
                    <View className="gap-2">
                      <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                        Artículo
                      </Text>
                      <CustomPicker
                        selectedValue={codeArt}
                        onValueChange={setCodeArt}
                        items={artList}
                        placeholder="Seleccione un artículo"
                        error={
                          !codeArt ? "Este campo es obligatorio" : undefined
                        }
                      />
                      <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                        Serial
                      </Text>
                      <CustomTextInput
                        placeholder="Serial"
                        value={serial}
                        onChangeText={setSerial}
                      />
                    </View>
                  )}
                  <View className="gap-2">
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Código de barra
                    </Text>
                    <CustomTextInput
                      placeholder="Código de barras"
                      value={barcode}
                      onChangeText={setBarcode}
                    />
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Código del artículo
                    </Text>

                    <CustomTextInput
                      placeholder="Código del artículo"
                      value={codeArt}
                      onChangeText={setCodeArt}
                    />
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Descripción del artículo
                    </Text>
                    <CustomTextInput
                      placeholder="Descripción del artículo"
                      value={artDes}
                      onChangeText={setArtDes}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
                    Cliente
                  </Text>
                  <View className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl ">
                    <Text className="text-foreground dark:text-dark-foreground">
                      {selectedClient
                        ? selectedClient.name
                        : "Seleccionar cliente..."}
                    </Text>
                  </View>
                </View>
                <View className="gap-y-2">
                  <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
                    Detalles de la devolución
                  </Text>
                  <View className="gap-2">
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Motivo
                    </Text>
                    <CustomTextInput
                      placeholder="Motivo"
                      value={reason}
                      onChangeText={setReason}
                    />
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Comentario
                    </Text>
                    <CustomTextInput
                      placeholder="Comentario"
                      value={comment}
                      onChangeText={setComment}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
                    Imagen del defecto
                  </Text>
                  <View className="flex-row gap-3 mb-3">
                    <TouchableOpacity
                      onPress={pickImage}
                      className="flex-1 border border-primary dark:border-dark-primary py-3 rounded-xl active:scale-95"
                    >
                      <Text className="text-center text-primary dark:text-dark-primary font-bold">
                        {emojis.roll} Galería
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePickFromCamera}
                      className="flex-1 border border-secondary dark:border-dark-secondary py-3 rounded-xl active:scale-95"
                    >
                      <Text className="text-center text-secondary dark:text-dark-secondary font-bold">
                        {emojis.camera} Cámara
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {image && (
                    <View className="h-48 rounded-2xl overflow-hidden shadow-sm">
                      <CustomImage img={image} />
                    </View>
                  )}
                </View>
              </View>

              <View className="mt-6">
                <TouchableOpacity
                  onPress={async () => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    await registerDefect();
                  }}
                  disabled={!isFormValid || loading}
                  style={{
                    backgroundColor: isFormValid
                      ? !isDark
                        ? appColors.primary.DEFAULT
                        : appColors.dark.primary.DEFAULT
                      : "#ccc",
                  }}
                  className={`py-4 rounded-xl items-center justify-center `}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold text-lg">
                      Guardar devolución
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          <BottomModal
            visible={showScanner}
            onClose={() => setShowScanner(false)}
          >
            <BarcodeScanner
              onScanned={(code) => {
                setSerial(code);
                setShowScanner(false);
              }}
            />
          </BottomModal>
        </ScrollView>
      </View>
      {isData && (
        <TouchableOpacity
          onPress={() => clearForm()}
          className="bg-error dark:bg-dark-error p-4 rounded-full shadow-lg absolute bottom-28 left-4 z-50 elevation-xl"
          accessibilityLabel="Cancelar"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
