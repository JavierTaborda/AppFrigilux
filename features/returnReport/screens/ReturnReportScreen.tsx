import BarcodeScanner from "@/components/camera/BarcodeScanner";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import CustomImage from "@/components/ui/CustomImagen";
import { useThemeStore } from "@/stores/useThemeStore";
import { appTheme } from "@/utils/appTheme";
import { imageURL } from "@/utils/imageURL";
import { safeHaptic } from "@/utils/safeHaptics";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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
import ClientModal from "../../../components/inputs/ClientModal";
import ArtsModal from "../components/ArtsModal";
import MotiveModal from "../components/MotiveModal";
import SerialInput from "../components/SerialInput";
import ToggleSelector from "../components/ToggleSelector";
import { useReturnReport } from "../hooks/useReturnReport";

// Constants for better maintainability
const ANIMATION_CONFIG = {
  duration: 350,
  easing: Easing.out(Easing.exp),
} as const;

export default function ProductDefectScreen() {
  const { isDark } = useThemeStore();
  const { width } = useWindowDimensions();

  // Custom hook state
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
    quantity,
    setQuantity,
    images,
    showScanner,
    setShowScanner,
    clients,
    selectedClient,
    setSelectedClient,
    showClientModal,
    setShowClientModal,
    showMotiveModal,
    setShowMotiveModal,
    codeVen,
    venDes,
    setCodeArt,
    setArtDes,
    setCodeVen,
    setVenDes,
    factNumber,
    setFactNumber,
    prednum,
    setPrednum,
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
    motives,
    setImages,
  } = useReturnReport();

  const [startMethod, setStartMethod] = useState<"serial" | "fact">("serial");
  const isFormValid = useMemo(() => isFormComplete(), [isFormComplete]);

  // Memoized values
  const isDarkPrimary = useMemo(
    () => (isDark ? appTheme.dark.primary.DEFAULT : appTheme.primary.DEFAULT),
    [isDark],
  );

  // Animation values
  const toggleX = useSharedValue(startMethod === "serial" ? 0 : 1);
  const sectionProgress = useSharedValue(isData ? 1 : 0);
  const sectionProgressSearch = useSharedValue(isData ? 0 : 1);
  const toggleOpacity = useSharedValue(!isData ? 1 : 0);
  const toggleTranslateY = useSharedValue(!isData ? 0 : 20);
  const scale = useSharedValue(2);
  const imageOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.9);
  const saveScale = useSharedValue(1);
  const btnScale = useSharedValue(1);

  // Toggle animation
  useEffect(() => {
    toggleX.value = withTiming(
      startMethod === "serial" ? 0 : 1,
      ANIMATION_CONFIG,
    );
  }, [startMethod, toggleX]);

  // Section animations
  useEffect(() => {
    if (isData) {
      sectionProgress.value = withTiming(1, ANIMATION_CONFIG);
      sectionProgressSearch.value = withTiming(1, ANIMATION_CONFIG);
    } else {
      sectionProgress.value = withDelay(150, withTiming(0, { duration: 300 }));
      sectionProgressSearch.value = withTiming(1, ANIMATION_CONFIG);
    }
  }, [isData]);

  // Toggle fade animation
  useEffect(() => {
    if (!isData) {
      toggleOpacity.value = withTiming(1, ANIMATION_CONFIG);
      toggleTranslateY.value = withTiming(0, ANIMATION_CONFIG);
    } else {
      toggleOpacity.value = withDelay(200, withTiming(0, { duration: 250 }));
      toggleTranslateY.value = withTiming(20, { duration: 250 });
    }
  }, [isData, toggleOpacity, toggleTranslateY]);

  // Manual button animation
  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
  }, [isManual]);

  // Image animation
  useEffect(() => {
    if (images) {
      imageOpacity.value = withTiming(1, { duration: 350 });
      imageScale.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.exp),
      });
    } else {
      imageOpacity.value = withTiming(0, { duration: 200 });
      imageScale.value = withTiming(0.9, { duration: 200 });
    }
  }, [images]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value * ((width - 42) / 2) }],
  }));

  const sectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sectionProgress.value,
    transform: [
      { translateY: interpolate(sectionProgress.value, [0, 1], [20, 0]) },
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

  const animatedStyleToggle = useAnimatedStyle(() => ({
    opacity: toggleOpacity.value,
    transform: [{ translateY: toggleTranslateY.value }],
  }));

  const animatedStyleAddManual = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const btnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  // Handlers
  const handleSearchPress = useCallback(() => {
    safeHaptic("medium");
    handleSearchSerial();
  }, [handleSearchSerial]);

  const handleSavePress = useCallback(async () => {
    safeHaptic("success");
    await registerDefect();
  }, [registerDefect]);

  const handleManualPress = useCallback(() => {
    safeHaptic("success");
    handleManual();
  }, [handleManual]);

  const handleClearPress = useCallback(() => {
    safeHaptic("warning");
    clearForm();
  }, [clearForm]);

  const handleArtSelectPress = useCallback(() => {
    setShowArtModal(true);
  }, []);

  const handleClientSelectPress = useCallback(() => {
    setShowClientModal(true);
  }, []);
  const handleMotiveSelectPress = useCallback(() => {
    setShowMotiveModal(true);
  }, []);

  const handleManualFactNumberChange = useCallback(
    (value: string) => {
      setFactNumber(value.replace(/\D/g, ""));
    },
    [setFactNumber],
  );

  const handleManualPrednumChange = useCallback(
    (value: string) => {
      const numericValue = value.replace(/\D/g, "");
      setPrednum(numericValue ? Number(numericValue) : null);
    },
    [setPrednum],
  );

  const handleQuantityChange = useCallback(
    (value: string) => {
      const numericValue = value.replace(/\D/g, "");

      if (!numericValue) {
        setQuantity(1);
        return;
      }

      const parsedValue = Number(numericValue);
      setQuantity(parsedValue > 0 ? parsedValue : 1);
    },
    [setQuantity],
  );

  const handleQuantityBlur = useCallback(() => {
    if (!quantity || quantity < 1) {
      setQuantity(1);
    }
  }, [quantity, setQuantity]);

  const handleQuantityDecrease = useCallback(() => {
    safeHaptic("light");
    setQuantity(Math.max(1, (quantity ?? 1) - 1));
  }, [quantity, setQuantity]);

  const handleQuantityIncrease = useCallback(() => {
    safeHaptic("light");
    setQuantity((quantity ?? 0) + 1);
  }, [quantity, setQuantity]);

  // Render helpers
  const renderHeader = () => (
    <View className="mb-2 rounded-2xl bg-componentbg dark:bg-dark-componentbg p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-full bg-primary/15 dark:bg-dark-primary/20 items-center justify-center">
            <Ionicons
              name="bag-handle-outline"
              size={18}
              color={isDark ? "#fff" : appTheme.primary.DEFAULT}
            />
          </View>
          <Text className="text-2xl font-extrabold text-foreground dark:text-dark-foreground">
            Registrar devolución
          </Text>
        </View>
      </View>
    </View>
  );

  const renderToggleSelector = () =>
    !isData &&
    !isManual && (
      <>
        <ToggleSelector
          startMethod={startMethod}
          setStartMethod={setStartMethod}
          animatedStyle={animatedStyle}
          animatedStyleToggle={animatedStyleToggle}
        />
        <View className="" />
      </>
    );

  const renderSearchSection = () =>
    !isManual && (
      <Animated.View
        style={sectionAnimatedStyleSearch}
        className="gap-y-2 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs mb-2 border border-gray-200/70 dark:border-gray-700"
      >
        {startMethod === "serial" ? (
          <>
            <Text className="text-xs uppercase tracking-wide text-mutedForeground dark:text-dark-mutedForeground font-semibold">
              Buscar por serial
            </Text>
            <SerialInput
              serial={serial}
              setSerial={setSerial}
              setShowScanner={setShowScanner}
              editable={!isData}
            />
            {!isData && (
              <View className="mt-1">
                <Animated.View style={btnAnimatedStyle}>
                  <Pressable
                    onPress={handleSearchPress}
                    android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                    className="flex-row items-center justify-center py-3 px-5 rounded-full bg-primary dark:bg-dark-primary"
                  >
                    <Ionicons name="search" size={16} color="#fff" />
                    <Text className="text-white font-semibold text-base ml-2">
                      Buscar serial despachado
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>
            )}
          </>
        ) : (
          <>
            <Text className="text-xs uppercase tracking-wide text-mutedForeground dark:text-dark-mutedForeground font-semibold">
              Buscar por factura
            </Text>
            <View className="flex-row gap-2 items-center">
              <View className="flex-1">
                <CustomTextInput
                  placeholder="Número de factura"
                  keyboardType="numeric"
                  value={factNumber}
                  onChangeText={handleManualFactNumberChange}
                />
              </View>
              <Animated.View style={btnAnimatedStyle}>
                <Pressable
                  onPress={handleSearchFactNum}
                  disabled={loadingData || !factNumber.trim()}
                  className="bg-primary dark:bg-dark-primary py-3 px-5 rounded-full flex-row items-center"
                >
                  {loadingData ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="search" size={16} color="#fff" />
                      <Text className="text-white font-semibold ml-1">
                        Buscar
                      </Text>
                    </>
                  )}
                </Pressable>
              </Animated.View>
            </View>
          </>
        )}
      </Animated.View>
    );

  const renderLoading = () =>
    loadingData && (
      <View className="flex-row items-center justify-center gap-2 mt-10 w-full">
        <ActivityIndicator color={isDarkPrimary} />
        <Text className="text-mutedForeground dark:text-dark-mutedForeground text-center">
          Buscando datos...
        </Text>
      </View>
    );

  const renderProductInfo = () => (
    <Animated.View className="gap-y-2 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs border border-gray-200/70 dark:border-gray-700">
      <Text className="text-xs uppercase tracking-wide text-mutedForeground dark:text-dark-mutedForeground font-semibold">
        Producto y cliente
      </Text>
      {startMethod === "fact" || isManual ? (
        <View className="gap-2">
          <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
            Serial
          </Text>
          <SerialInput
            serial={serial}
            setSerial={setSerial}
            setShowScanner={setShowScanner}
          />
          <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
            Artículo
          </Text>
          <Pressable
            onPress={handleArtSelectPress}
            className="flex-row items-center justify-between px-4 py-3.5   border rounded-xl bg-transparent dark:bg-dark-componentbg border-gray-300 dark:border-gray-600"
          >
            {codeArt && (
              <View className="w-12 h-12 rounded-lg bg-bgimages overflow-hidden">
                <CustomImage img={`${imageURL}${codeArt.trim()}.webp`} />
              </View>
            )}
            <Text className="text-foreground dark:text-dark-foreground flex-1 ml-3">
              {codeArt && artDes
                ? `${codeArt.trim()} - ${artDes.trim()} - ${barcode.trim()}`
                : "Seleccionar artículo..."}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#fff" : "#333"}
            />
          </Pressable>
        </View>
      ) : (
        <>
          <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
            Artículo
          </Text>
          <View
            className="flex-row items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 
               bg-transparent dark:bg-dark-componentbg"
          >
            {codeArt ? (
              <View className="w-20 h-20 rounded-lg bg-bgimages overflow-hidden">
                <CustomImage img={`${imageURL}${codeArt.trim()}.webp`} />
              </View>
            ) : (
              <View className="w-20 h-20 rounded-lg bg-bgimages items-center justify-center">
                <Ionicons name="image-outline" size={28} color="#999" />
              </View>
            )}

            {/* Texto */}
            <View className="flex-1 ml-4">
              <Text className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                {codeArt && artDes && barcode
                  ? `${codeArt.trim()} - ${artDes.trim()} - ${barcode.trim()}`
                  : "Seleccionar artículo..."}
              </Text>
            </View>
          </View>
        </>
      )}
      <View>
        <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
          Cantidad
        </Text>
      </View>
      <View className="gap-2 py-1 w-full rounded-xl  ">
        <View className="mt-1 rounded-2xl bg-background/30 dark:bg-dark-background border border-gray-300 dark:border-gray-600 px-2 py-1.5 flex-row items-center">
          <Pressable
            onPress={handleQuantityDecrease}
            className="w-12 h-12 rounded-xl bg-white dark:bg-dark-componentbg items-center justify-center"
            accessibilityLabel="Disminuir cantidad"
            accessibilityRole="button"
          >
            <Ionicons
              name="remove"
              size={22}
              color={(quantity ?? 1) <= 1 ? "#999" : isDark ? "#fff" : "#333"}
            />
          </Pressable>

          <View className="flex-1 items-center justify-center">
            <TextInput
              value={String(Math.max(1, quantity ?? 1))}
              onChangeText={handleQuantityChange}
              onBlur={handleQuantityBlur}
              keyboardType="numeric"
              placeholder="1"
              className="text-2xl font-semibold  text-foreground dark:text-dark-foreground min-w-[80px] text-center"
            />
          </View>

          <Pressable
            onPress={handleQuantityIncrease}
            className="w-12 h-12 rounded-xl bg-primary dark:bg-dark-primary items-center justify-center"
            accessibilityLabel="Aumentar cantidad"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
        Cliente
      </Text>
      {isManual ? (
        <>
          <Pressable
            onPress={handleClientSelectPress}
            className="flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl"
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {selectedClient
                ? `${selectedClient.co_cli.trim()} - ${selectedClient.cli_des.trim()}`
                : "Seleccionar cliente..."}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#fff" : "#333"}
            />
          </Pressable>
          <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
            Número de factura
          </Text>
          <CustomTextInput
            placeholder="Ingrese el número de factura"
            keyboardType="numeric"
            value={factNumber}
            onChangeText={handleManualFactNumberChange}
          />

          <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
            Número de predespacho
          </Text>
          <CustomTextInput
            placeholder="Ingrese el número de predespacho"
            keyboardType="numeric"
            value={prednum?.toString() ?? ""}
            onChangeText={handleManualPrednumChange}
          />
        </>
      ) : (
        <Text className="text-foreground dark:text-dark-foreground flex-row items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-xl">
          {selectedClient
            ? `${selectedClient.co_cli.trim()} - ${selectedClient.cli_des.trim()}`
            : ""}
        </Text>
      )}
    </Animated.View>
  );

  const renderReturnDetails = () => (
    <Animated.View
      style={sectionAnimatedStyle}
      className="gap-y-2 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs border border-gray-200/70 dark:border-gray-700"
    >
      <View className="gap-2">
        <Text className="text-xs uppercase tracking-wide text-mutedForeground dark:text-dark-mutedForeground font-semibold">
          Detalles de la devolución
        </Text>
        <Text className="text-md font-medium text-foreground dark:text-dark-foreground">
          Motivo
        </Text>
        <Pressable
          onPress={handleMotiveSelectPress}
          className="flex-row items-center justify-between px-4 py-3.5   border rounded-xl bg-transparent dark:bg-dark-componentbg border-gray-300 dark:border-gray-600"
        >
          <Text className="text-foreground dark:text-dark-foreground">
            {reason ? `${reason}` : "Seleccionar motivo..."}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#fff" : "#333"}
          />
        </Pressable>
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
  );
  const renderImageSection = () => (
    <View className="gap-y-2 bg-componentbg dark:bg-dark-componentbg p-4 rounded-2xl shadow-xs border border-gray-200/70 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
          Imágenes
        </Text>

        {images.length > 0 && (
          <Text className="text-sm text-mutedForeground">
            {images.length}/5 imágenes
          </Text>
        )}
      </View>

      {/* BOTONES */}
      <View className="flex-row gap-3 mb-2">
        <Pressable
          onPress={pickImage}
          className="flex-1 border border-primary py-3 rounded-full bg-primary/10 dark:bg-dark-primary/10"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="images-outline"
              size={20}
              color={isDark ? "#fff" : appTheme.primary.DEFAULT}
            />
            <Text className="ml-2 font-semibold text-primary dark:text-dark-primary">
              Galería
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handlePickFromCamera}
          className="flex-1 border border-primary py-3 rounded-full bg-primary dark:bg-dark-primary"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="camera" size={20} color="#fff" />
            <Text className="ml-2 font-semibold text-white">Cámara</Text>
          </View>
        </Pressable>
      </View>

      {images.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {images.map((img, index) => (
            <Animated.View
              key={index}
              style={imageAnimatedStyle}
              className="w-[31%] aspect-square rounded-xl overflow-hidden"
            >
              <CustomImage img={img} />

              <Pressable
                onPress={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
              >
                <Ionicons name="close" size={14} color="#fff" />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}

      {/* EMPTY STATE */}
      {images.length === 0 && (
        <View className="h-32 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
          <Ionicons name="image-outline" size={28} color="#999" />
          <Text className="text-mutedForeground mt-1">
            No hay imágenes seleccionadas
          </Text>
        </View>
      )}
    </View>
  );

  const renderSaveButton = () => (
    <View className="mt-6 mb-4">
      <Animated.View style={saveAnimatedStyle}>
        <Pressable
          onPress={handleSavePress}
          disabled={!isFormValid || loading}
          style={{
            backgroundColor: isFormValid ? isDarkPrimary : "#ccc",
          }}
          className="py-4 rounded-full items-center justify-center flex-row"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text className="text-white font-semibold text-lg ml-2">
                Registrar devolución
              </Text>
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );

  const renderModals = () => (
    <>
      <BottomModal visible={showScanner} onClose={() => setShowScanner(false)}>
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
      <BottomModal
        visible={showMotiveModal}
        onClose={() => setShowMotiveModal(false)}
        heightPercentage={0.55}
      >
        <MotiveModal
          onClose={setShowMotiveModal}
          setSelectedMotive={setReason}
          selectedMotive={reason}
          motives={motives}
        />
      </BottomModal>
    </>
  );

  const renderFloatingButtons = () => (
    <>
      {isData && (
        <Pressable
          onPress={handleClearPress}
          className="bg-error dark:bg-dark-error p-4 rounded-full shadow-lg absolute bottom-32 left-4 z-50 elevation-xl"
          accessibilityLabel="Cancelar"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color="white" />
        </Pressable>
      )}

      {!isData && (
        <Animated.View
          style={animatedStyleAddManual}
          className="absolute bottom-32 right-4 z-99"
        >
          <Pressable
            onPress={handleManualPress}
            className="bg-primary dark:bg-dark-primary p-4 rounded-full shadow-lg elevation-xl"
            accessibilityLabel="Agregar manualmente"
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </Pressable>
        </Animated.View>
      )}
    </>
  );

  return (
    <View className="flex-1 bg-primary dark:bg-dark-primary">
      <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl">
        <ScrollView
          contentContainerClassName="py-4 px-5 pb-44 gap-1"
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}
          {renderToggleSelector()}
          {renderSearchSection()}
          {renderLoading()}

          {isData && (
            <Animated.View className="mt-1 gap-y-5">
              {renderProductInfo()}
              {renderReturnDetails()}
              {renderImageSection()}
              {renderSaveButton()}
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {renderModals()}
      {renderFloatingButtons()}
    </View>
  );
}
