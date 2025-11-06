import { useAuthStore } from "@/stores/useAuthStore";
import { pickFromCamera, pickFromGallery } from "@/utils/pickImage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { createDevolucion, getBySerial, getOrderByFactNumber } from "../services/ReturnReportService";
import { Articulo } from "../types/Articulo";
import { CreateDevolucion } from "../types/createDevolucion";
import { pickAndUploadImage } from "../utils/uploadImage";

export interface Client {
    code: string;
    name: string;
}

export interface ArtItem {
    value: string;
    label: string;
}

export interface BarcodeItem {
    co_art: string;
    codbarra: string;
}

export function useReturnReport() {


    const { userId, name } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);


    // Product data

    const [factNumber, setFactNumber] = useState("");
    const [barcode, setBarcode] = useState("");
    const [barcodeList, setBarcodeList] = useState<BarcodeItem[]>([]);
    const [serial, setSerial] = useState("");
    const [codeArt, setCodeArt] = useState("");
    const [artDes, setArtDes] = useState("");
    const [artList, setArtList] = useState<ArtItem[]>([]);


    // Customer Data
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);



    // DSeller data
    const [codeVen, setCodeVen] = useState(name ?? "");
    const [venDes, setVenDes] = useState(name ?? "");

    // Form Data
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [image, setImage] = useState<string>("");

    // UI
    const [showScanner, setShowScanner] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);
    const [isData, setIsData] = useState(false);
    const [isManual, setIsManual] = useState(false);
    const isFormComplete = () => (
        barcode && reason && comment && image && selectedClient && codeArt && artDes
    );
    


    const pickImage = async () => {
        const result = await pickFromGallery();
        if (result) setImage(result);
    };

    const handlePickFromCamera = async () => {
        const result = await pickFromCamera();
        if (result) setImage(result);
    };


    const handleSearchFactNum = async () => {
        if (factNumber.length < 1) {
            Alert.alert("Error", "Ingrese un número de factura válido.");
            return;
        }

        try {
            setLoadingData(true);

            const data = await getOrderByFactNumber(Number(factNumber));

            if (!data) {
                Alert.alert("Sin resultados", "No se encontró datos  con el número de factura.");
                setIsData(false);
                setIsManual(true);
                return;
            }

            setBarcode(data.codbarra || "");
            
            setCodeVen(data.codven || "");
            setVenDes(data.vendes || "");
            setSerial(data.serial || "");
            setSelectedClient({ code: data.codcli, name: data.clides })

            setBarcodeList(data.art.map((item: Articulo) => ({
                co_art: item.co_art,
                codbarra: item.codbarra
            })));


            const formattedArtList = (data.art as Articulo[]).map((item: Articulo) => ({
                value: item.co_art,
                label: `${item.co_art.trim()} ${item.art_des.trim()}`
            }));

            setArtList(formattedArtList);
            setIsData(true)


        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al obtener los datos.");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!codeArt) return;
        if (artList.length < 1) return
        setArtDes(artList.find(c => c.value === codeArt)?.label ?? '');
        setBarcode(barcodeList.find(b => b.co_art === codeArt)?.codbarra ?? '');
    }, [codeArt]);

    const handleSearchSerial = async () => {
        if (serial.length <= 3) {
            Alert.alert("Error", "Debe ingresar un serial válido.");
            return;
        }

        try {
            setLoadingData(true);

            const data = await getBySerial(serial);

            if (!data) {
                Alert.alert("Sin resultados", "No se encontró el producto con ese serial.");
                setIsData(false);
                setIsManual(true);
                return;
            }

            setBarcode(data.codbarra || "");
            setCodeArt(data.codart || "");
            setCodeVen(data.codven || "");
            setVenDes(data.vendes || "");
            setArtDes(data.artdes || "");
            setSerial(data.serial || "");
            setSelectedClient({ code: data.codcli, name: data.clides })
            setIsData(true)

        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al obtener los datos.");
        } finally {
            setLoadingData(false);
        }
    };


    const clearForm = () => {
        setBarcode("");
        setSerial("");
        setCodeArt("");
        setArtDes("");
        setReason("");
        setComment("");
        setImage("");
        setSelectedClient(null);
        setFactNumber("");
        setIsData(false)
        setIsManual(false);
    };
    const registerDefect = async () => {
        if (!isFormComplete()) {
            Alert.alert("Incomplete form", "Please fill in all required fields.");
            return false;
        }

        try {
            setLoading(true);
            const imageUrl = await pickAndUploadImage(image, userId);

            if (!imageUrl) {
                Alert.alert("Error", "Ocurrió un error al subir la imagen. Por favor, inténtelo de nuevo.");
                return false;
            }

            const devolucion: CreateDevolucion = {
                fecemis: new Date().toISOString(),
                estatus: "1",
                anulada: "0",
                cerrada: "0",
                codcli: selectedClient?.code.trim() || "",
                clides: selectedClient?.name || "",
                codven: codeVen.trim() || "",
                vendes: venDes,
                codart: codeArt,
                codbarra: barcode,
                artdes: artDes,
                serial1: serial,
                motivo: reason,
                obsvendedor: comment,
                registradopor: name || "Unknown",
                fecharegistro: new Date().toISOString(),
                imgart: imageUrl ?? undefined,
            };

           const success = await createDevolucion(devolucion);

            if (success) {
                Alert.alert("Success", "La devolución fue registrada exitosamente.");
                clearForm();
                return true;
            } else {
                Alert.alert("Error", "No se pudo registrar la devolución, por favor inténtelo de nuevo.");
                return false;
            }   
        } catch (err: any) {
            Alert.alert("Error", `No se pudo registrar la devolución: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // functions
        registerDefect,
        pickImage,
        handlePickFromCamera,
        handleSearchFactNum,
        handleSearchSerial,
        clearForm,

        // states
        loading,
        barcode, setBarcode,
        serial, setSerial,
        codeArt, setCodeArt,
        artDes, setArtDes,
        reason, setReason,
        comment, setComment,
        image, setImage,
        showScanner, setShowScanner,
        factNumber, setFactNumber,
        loadingData,
        isData,
        artList,
        isManual,

        // customers

        setClients,
        clients,
        selectedClient,
        setSelectedClient,
        showClientModal, setShowClientModal,

        // sell
        setCodeVen,
        setVenDes,
        codeVen,
        venDes,
    };
}
