import BarcodeScanner from "@/components/camera/BarcodeScanner";
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
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import ArtsModal from "../components/ArtsModal";
import ClientModal from "../components/ClientModal";
import SerialInput from "../components/SerialInput";
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
    isManual,
    isFormComplete,
    handleManual,
    showArtModal,
    setShowArtModal,
  } = useReturnReport();

  const [startMethod, setStartMethod] = useState<"serial" | "fact">("serial");
  const isFormValid = isFormComplete();

  const toggleX = useSharedValue(startMethod === "serial" ? 0 : 1);
  useEffect(() => {
    toggleX.value = withTiming(startMethod === "serial" ? 0 : 1, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  }, [startMethod]);

  const { width } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value * ((width - 42) / 2) }],
  }));

  // ---------- FORM SECTION ANIMATION ----------
  const sectionProgress = useSharedValue(isData ? 1 : 0);
  const sectionProgressSearch = useSharedValue(isData ? 0 : 1);

  useEffect(() => {
    if (isData) {
      // in
      sectionProgress.value = withTiming(1, {
        duration: 450,
        easing: Easing.out(Easing.exp),
      });
    } else {
      sectionProgress.value = withDelay(
        150,
        withTiming(0, {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        })
      );
    }
  }, [isData]);

  const sectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sectionProgress.value,
    transform: [
      {
        translateY: interpolate(sectionProgress.value, [0, 1], [20, 0]),
      },
    ],
  }));
  const sectionAnimatedStyleSearch = useAnimatedStyle(() => ({
    opacity: sectionProgressSearch.value,
    transform: [
      {
        translateY: interpolate(sectionProgress.value, [0, 1], [5, 0]),
      },
    ],
  }));

  // ---------- TOGGLE SECTION ANIMATION ----------
  const toggleOpacity = useSharedValue(!isData ? 1 : 0);
  const toggleTranslateY = useSharedValue(!isData ? 0 : 20);

  useEffect(() => {
    if (!isData) {
      toggleOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
      toggleTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
    } else {
      toggleOpacity.value = withDelay(
        200,
        withTiming(0, {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        })
      );
      toggleTranslateY.value = withTiming(20, {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [isData]);

  const animatedStyleToggle = useAnimatedStyle(() => ({
    opacity: toggleOpacity.value,
    transform: [{ translateY: toggleTranslateY.value }],
  }));

  // ---------- ADD MANUAL BUTTON ANIMATION ----------
  const scale = useSharedValue(2);
  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, [isManual]);

  const animatedStyleAddManual = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ---------- IMAGE ANIMATION ----------
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.9);
  useEffect(() => {
    if (image) {
      imageOpacity.value = withTiming(1, { duration: 350 });
      imageScale.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.exp),
      });
    } else {
      imageOpacity.value = withTiming(0, { duration: 200 });
      imageScale.value = withTiming(0.9, { duration: 200 });
    }
  }, [image]);


  // ---------- SAVE BUTTON ANIMATION ----------
  const saveScale = useSharedValue(1);
  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  // ---------- ACTION BUTTON SCALE ----------
  const btnScale = useSharedValue(1);
  const btnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary">
      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl">
        <ScrollView
          contentContainerClassName="py-4 px-5 pb-44 gap-2"
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
                Registrar devolución
              </Text>
            </View>
            <Text className="text-sm text-mutedForeground dark:text-dark-mutedForeground mt-1">
              Completa los pasos para enviar el reporte
            </Text>
          </View>

          {!isData && !isManual && (
            <Animated.View
              style={animatedStyleToggle}
              className="relative flex-row bg-muted dark:bg-dark-muted rounded-full p-1 mb-1 overflow-hidden"
            >
              <Animated.View
                style={[animatedStyle]}
                className="absolute left-1 top-1 w-1/2 h-full bg-primary dark:bg-dark-primary rounded-full"
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
                    className="flex-1 py-1 rounded-xl items-center z-10"
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
            </Animated.View>
          )}

          {!isManual && (
            <Animated.View
              style={sectionAnimatedStyleSearch}
              className="gap-y-1 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs mb-2 "
            >
              {startMethod === "serial" && (
                <>
                  <SerialInput
                    serial={serial}
                    setSerial={setSerial}
                    setShowScanner={setShowScanner}
                    editable={isManual || !isData}
                  />
                  {!isData && (
                    <View className="mt-1">
                      <Animated.View style={btnAnimatedStyle}>
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Medium
                            );
                            handleSearchSerial();
                          }}
                          android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                          className="flex-row items-center justify-center py-3 px-5 rounded-xl border border-primary dark:border-dark-primary bg-transparent active:scale-95"
                        >
                          <Text className="text-primary dark:text-dark-primary font-semibold text-base">
                            Buscar producto
                          </Text>
                        </Pressable>
                      </Animated.View>
                    </View>
                  )}
                </>
              )}

              {startMethod === "fact" && (
                <View className="flex-row gap-2 items-center ">
                  <View className="flex-1">
                    <CustomTextInput
                      placeholder="Número de factura"
                      keyboardType="numeric"
                      value={factNumber}
                      onChangeText={setFactNumber}
                    />
                  </View>
                  <Animated.View style={btnAnimatedStyle}>
                    <Pressable
                      onPressIn={() => {
                        btnScale.value = withTiming(0.97, { duration: 80 });
                      }}
                      onPressOut={() => {
                        btnScale.value = withTiming(1, { duration: 120 });
                      }}
                      onPress={handleSearchFactNum}
                      className="bg-primary dark:bg-dark-primary py-3 px-5 rounded-xl active:scale-95"
                    >
                      <Text className="text-white font-semibold">Buscar</Text>
                    </Pressable>
                  </Animated.View>
                </View>
              )}
            </Animated.View>
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
              <Animated.View className="mt-1 gap-y-5">
                <Animated.View className="gap-y-1 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs">
                  <Text className="text-lg font-semibold mb-1 text-foreground dark:text-dark-foreground">
                    Información del artículo {isManual ? "(Manual)" : ""}
                  </Text>
                  {(startMethod === "fact" || isManual) && (
                    <View className="gap-2">
                      <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                        Artículo
                      </Text>

                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync();
                          setShowArtModal(true);
                        }}
                        className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl "
                      >
                        <Text className="text-foreground dark:text-dark-foreground">
                          {codeArt ? codeArt : "Seleccionar artículo..."}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={isDark ? "#fff" : "#333"}
                        />
                      </Pressable>
                      <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                        Serial
                      </Text>
                      <SerialInput
                        serial={serial}
                        setSerial={setSerial}
                        setShowScanner={setShowScanner}
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
                      editable={false}
                    />
                    <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
                      Código del artículo
                    </Text>

                    <CustomTextInput
                      placeholder="Código del artículo"
                      value={codeArt}
                      onChangeText={setCodeArt}
                      editable={false}
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
                      editable={false}
                    />
                  </View>
                </Animated.View>
                <Animated.View
                  style={sectionAnimatedStyle}
                  className="gap-y-1 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs"
                >
                  <Text className="text-lg font-semibold mb-2 text-foreground dark:text-dark-foreground">
                    Cliente
                  </Text>
                  {isManual ? (
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync();
                        setShowClientModal(true);
                      }}
                      className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl "
                    >
                      <Text className="text-foreground dark:text-dark-foreground">
                        {selectedClient
                          ? selectedClient.name
                          : "Seleccionar cliente..."}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDark ? "#fff" : "#333"}
                      />
                    </Pressable>
                  ) : (
                    <Text className="text-foreground dark:text-dark-foreground flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl ">
                      {selectedClient ? selectedClient.name : ""}
                    </Text>
                  )}
                </Animated.View>

                <Animated.View
                  style={sectionAnimatedStyle}
                  className="gap-y-2 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs"
                >
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
                </Animated.View>

                <View className="gap-y-1 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs">
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
                    <View className="h-48 rounded-2xl overflow-hidden border border-dotted border-gray-300 dark:border-gray-600">
                      <CustomImage img={image} />
                    </View>
                  )}
                </View>
              </Animated.View>

              <View className="mt-6">
                <Animated.View style={saveAnimatedStyle}>
                  <Pressable
                    onPressIn={() => {
                      saveScale.value = withTiming(0.98, { duration: 80 });
                    }}
                    onPressOut={() => {
                      saveScale.value = withTiming(1, { duration: 120 });
                    }}
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
                  </Pressable>
                </Animated.View>
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

          <BottomModal
            visible={showArtModal}
            onClose={() => setShowArtModal(false)}
          >
            <ArtsModal
              onClose={setShowArtModal}
              setCodeArt={setCodeArt}
              arts={artList}
            />
          </BottomModal>
          <BottomModal
            visible={showClientModal}
            onClose={() => setShowClientModal(false)}
          >
            <ClientModal
              onClose={setShowClientModal}
              setSelectedClient={setSelectedClient}
              clients={clients}
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
      {!isData && (
        <Animated.View
          style={[animatedStyleAddManual]}
          className="absolute bottom-28 right-4 z-99"
        >
          <TouchableOpacity
            onPress={() => handleManual()}
            className="bg-primary dark:bg-dark-primary p-4 rounded-full shadow-lg elevation-xl"
            accessibilityLabel="Cancelar"
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
