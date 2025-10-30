import BarcodeScanner from "@/components/camera/BarcodeScanner";
import CustomTextInput from "@/components/inputs/CustomTextInput";
import BottomModal from "@/components/ui/BottomModal";
import CustomImage from "@/components/ui/CustomImagen";
import { emojis } from "@/utils/emojis";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useReturnReport } from "../hooks/useReturnReport";

export default function ProductDefectScreen() {
  const {
    registerDefect,
    loading,
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
  } = useReturnReport();

  const isData = selectedClient != null;

  const handleSearchFactNum = () => {
    
  };

  const isFormValid = barcode && reason && comment && image && selectedClient;

  return (
    <ScrollView contentContainerClassName="p-5 pb-36 bg-background dark:bg-dark-background gap-3">
      <Text className="text-2xl font-bold mb-3 text-foreground dark:text-dark-foreground">
        Registrar Devolución
      </Text>

      <Text className="text-xl font-semibold text-foreground dark:text-dark-foreground">
        Información del artículo
      </Text>
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
          className="bg-primary dark:bg-dark-primary py-3 px-3 rounded-xl active:scale-95"
        >
          <Text className="text-center text-lg text-white font-semibold">
            {emojis.camera} Escanear
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-2 items-center">
        <View className="flex-1">
          <CustomTextInput
            placeholder="Número de factura"
            keyboardType="numeric"
            value={factNumber}
            onChangeText={setFactNumber}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleSearchFactNum()}
          className="bg-primary dark:bg-dark-primary py-3 px-5 rounded-xl active:scale-95"
        >
          <Text className="text-center text-lg text-white font-semibold">
            {emojis.search} Buscar
          </Text>
        </TouchableOpacity>
      </View>

      {isData && (
        <>
          <CustomTextInput
            placeholder="Código de barras"
            value={barcode}
            onChangeText={setBarcode}
          />

          <CustomTextInput
            placeholder="Código del artículo"
            value={codeArt}
            onChangeText={setCodeArt}
          />
          <CustomTextInput
            placeholder="Descripción del artículo"
            value={artDes}
            onChangeText={setArtDes}
          />

          <Text className="text-xl font-semibold mt-6  text-foreground dark:text-dark-foreground">
            Cliente
          </Text>

          <TouchableOpacity
            onPress={() => setShowClientModal(true)}
            className="p-4 border border-muted rounded-xl"
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {selectedClient ? selectedClient.name : "Seleccionar cliente..."}
            </Text>
          </TouchableOpacity>

          <Text className="text-xl font-semibold mt-6  text-foreground dark:text-dark-foreground">
            Vendedor
          </Text>
          <CustomTextInput
            placeholder="Código vendedor"
            value={codeVen}
            onChangeText={setCodeVen}
          />
          <CustomTextInput
            placeholder="Nombre vendedor"
            value={venDes}
            onChangeText={setVenDes}
          />

          <Text className="text-xl font-semibold mt-6  text-foreground dark:text-dark-foreground">
            Detalles de la devolución
          </Text>

          <CustomTextInput
            placeholder="Motivo"
            value={reason}
            onChangeText={setReason}
          />
          <CustomTextInput
            placeholder="Comentario"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          <Text className="text-xl font-semibold mt-6 text-foreground dark:text-dark-foreground">
            Imagen del defecto
          </Text>
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={pickImage}
              className="flex-1 bg-primary py-3 rounded-xl active:opacity-80"
            >
              <Text className="text-center text-white font-medium">
                Galería
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickFromCamera}
              className="flex-1 bg-secondary py-3 rounded-xl active:opacity-80"
            >
              <Text className="text-center text-white font-medium">Cámara</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {image && (
        <View className="h-48 rounded-xl overflow-hidden mb-5">
          <CustomImage img={image} />
        </View>
      )}

      {/* GUARDAR */}
      <TouchableOpacity
        onPress={registerDefect}
        disabled={!isFormValid || loading}
        className={`py-4 rounded-xl ${
          isFormValid ? "bg-primary active:scale-95" : "bg-gray-400"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white font-semibold text-lg">
            Guardar devolución
          </Text>
        )}
      </TouchableOpacity>

      {/* MODAL DE ESCANEO */}
      <BottomModal visible={showScanner} onClose={() => setShowScanner(false)}>
        <BarcodeScanner
          onScanned={(code) => {
            setBarcode(code);
            setShowScanner(false);
          }}
        />
      </BottomModal>

      {/* MODAL DE CLIENTES */}
      <BottomModal
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
      >
        <Text className="text-lg font-semibold mb-3 text-center">
          Seleccionar cliente
        </Text>
        {clients.map((cli) => (
          <TouchableOpacity
            key={cli.code}
            onPress={() => {
              setSelectedClient(cli);
              setShowClientModal(false);
            }}
            className="py-3 border-b border-muted"
          >
            <Text className="text-center">{cli.name}</Text>
          </TouchableOpacity>
        ))}
      </BottomModal>
    </ScrollView>
  );
}
