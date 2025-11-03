import { useAuthStore } from "@/stores/useAuthStore";
import { pickFromCamera, pickFromGallery } from "@/utils/pickImage";
import { useState } from "react";
import { Alert } from "react-native";
import { getBySerial } from "../services/ReturnReportService";
import { pickAndUploadImage } from "../utils/uploadImage";

export function useReturnReport() {
    const { userId, name } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Product data
    const [factNumber, setFactNumber] = useState("");
    const [barcode, setBarcode] = useState("");
    const [serial, setSerial] = useState("");
    const [codeArt, setCodeArt] = useState("");
    const [artDes, setArtDes] = useState("");

    // Customer Data
    const [clients, setClients] = useState<{ code: string; name: string }[]>([]);
    const [selectedClient, setSelectedClient] = useState<{ code: string; name: string } | null>(null);

    // DSeller data
    const [codeVen, setCodeVen] = useState(name ?? "");
    const [venDes, setVenDes] = useState(name ?? "");

    // Form Data
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [image, setImage] = useState<string | null>(null);

    // UI
    const [showScanner, setShowScanner] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);


    // useEffect(() => {
    //     const fetchClients = async () => {
    //         const { data, error } = await supabase.from("clients").select("code, name");
    //         if (error) {
    //             console.log("Error obteniendo clientes:", error.message);
    //             return;
    //         }
    //         setClients(data ?? []);
    //     };
    //     fetchClients();
    // }, []);


    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         if (!barcode.trim()) return;
    //         setLoading(true);

    //         const { data, error } = await supabase
    //             .from("products")
    //             .select("code, description")
    //             .eq("barcode", barcode)
    //             .single();

    //         if (error) {
    //             Alert.alert("No encontrado", "No se encontró ningún artículo con ese código.");
    //             setCodeArt("");
    //             setArtDes("");
    //         } else if (data) {
    //             setCodeArt(data.code);
    //             setArtDes(data.description);
    //         }

    //         setLoading(false);
    //     };

    //     fetchProduct();
    // }, [barcode]);


    const pickImage = async () => {
        const result = await pickFromGallery();
        if (result) setImage(result);
    };

    const handlePickFromCamera = async () => {
        const result = await pickFromCamera();
        if (result) setImage(result);
    };


    const registerDefect = async () => {
        if (!barcode || !reason || !comment || !image || !selectedClient) {
            Alert.alert("Formulario incompleto", "Por favor completa todos los campos.");
            return false;
        }

        try {
            setLoading(true);
            const imageUrl = await pickAndUploadImage(image, userId);

            // // Supabase
            // const { error } = await supabase.from("returns").insert({
            //     barcode,
            //     serial,
            //     code_art: codeArt,
            //     art_des: artDes,
            //     reason,
            //     comment,
            //     image_url: imageUrl,
            //     code_cli: selectedClient.code,
            //     cli_des: selectedClient.name,
            //     code_ven: codeVen,
            //     ven_des: venDes,
            // });

            //if (error) throw error;

            Alert.alert("Éxito", "La devolución se registró correctamente.");
            clearForm();
            return true;
        } catch (err: any) {
            Alert.alert("Error", `No se pudo registrar la devolución: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSearchFactNum = () => {
        setSelectedClient({ code: '00001', name: 'Prueba' })
    };
    const handleSearchSerial = async () => {
        if (serial.length <= 3) {
            Alert.alert("Error", "Debes ingresar un número de serie válido.");
            return;
        }

        try {
            setLoadingData(true);

            const data = await getBySerial(serial); 

            if (!data) {
                Alert.alert("Sin resultados", "No se encontró el producto con ese serial.");
                return;
            }

            setBarcode(data.codbarra || "");
            setCodeArt(data.codart || "");
            setCodeVen(data.codven || "");
            setArtDes(data.artdes || "");
            setSerial(data.serial || "");
            setSelectedClient({ code: data.codcli, name: data.clides })
            

            // if (data.client) {
            //     setSelectedClient({
            //         code: data.client.code,
            //         name: data.client.name,
            //     });
            // }

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
        setImage(null);
        setSelectedClient(null);
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
