import { useAuthStore } from "@/stores/useAuthStore";
import { useOverlayStore } from "@/stores/useSuccessOverlayStore";
import { ClientData } from "@/types/clients";
import { pickFromCamera, pickFromGallery } from "@/utils/pickImage";
import { useEffect, useReducer, type SetStateAction } from "react";
import { Alert } from "react-native";
import { ReturnBySerialDto } from "../interfaces/returnbyserialDTO";
import { createDevolucion, getArts, getBySerial, getClients, getMotives, getOrderByFactNumber } from "../services/ReturnReportService";
import { Articulo } from "../types/Articulo";
import { CreateDevolucion } from "../types/createDevolucion";
import { BarcodeItem } from "../types/Items";
import { Motive } from "../types/motives";
import { deleteImage, uploadMultipleImages } from "../utils/uploadImage";

function getErrorMessage(err: unknown): string {
    if (!err) return 'Unknown error';
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    try { return JSON.stringify(err); } catch { return String(err); }
}

const MAX_IMAGES = 5;
export function useReturnReport() {


    const { userId, name } = useAuthStore();
    // Group related state using reducers to avoid many useState calls
    type ProductState = {
        factNumber: string;
        barcode: string;
        barcodeList: BarcodeItem[];
        serial: string;
        codeArt: string;
        artDes: string;
        zondes: string;
        codzon: string;
        artList: Articulo[];
        motives: Motive[];
        factNum: string | null;
        prednum: number | null;
        pednum: number | null;
        fedespacho: string | null;
        codeVen: string;
        venDes: string;
    };

    const initialProductState: ProductState = {
        factNumber: "",
        barcode: "",
        barcodeList: [],
        serial: "",
        codeArt: "",
        artDes: "",
        zondes: "",
        codzon: "",
        artList: [],
        motives: [],
        factNum: null,
        prednum: null,
        pednum: null,
        fedespacho: null,
        codeVen: "",
        venDes: "",
    };

    function productReducer(state: ProductState, action: { type: string; payload?: any }): ProductState {
        switch (action.type) {
            case 'SET_FACTNUMBER': return { ...state, factNumber: action.payload };
            case 'SET_BARCODE': return { ...state, barcode: action.payload };
            case 'SET_BARCODE_LIST': return { ...state, barcodeList: action.payload };
            case 'SET_SERIAL': return { ...state, serial: action.payload };
            case 'SET_CODE_ART': return { ...state, codeArt: action.payload };
            case 'SET_ART_DES': return { ...state, artDes: action.payload };
            case 'SET_ZONDES': return { ...state, zondes: action.payload };
            case 'SET_ART_LIST': return { ...state, artList: action.payload };
            case 'SET_MOTIVES': return { ...state, motives: action.payload };
            case 'SET_FACTNUM': return { ...state, factNum: action.payload };
            case 'SET_PREDNUM': return { ...state, prednum: action.payload };
            case 'SET_PEDNUM': return { ...state, pednum: action.payload };
            case 'SET_FEDESPACHO': return { ...state, fedespacho: action.payload };
            case 'SET_CODEVEN': return { ...state, codeVen: action.payload };
            case 'SET_VENDES': return { ...state, venDes: action.payload };
            case 'SET_CODZON': return { ...state, codzon: action.payload };
            case 'RESET_PRODUCT': return initialProductState;
            default: return state;
        }
    }

    type CustomerState = { clients: ClientData[]; selectedClient: ClientData | null };
    const initialCustomerState: CustomerState = { clients: [], selectedClient: null };
    function customerReducer(state: CustomerState, action: { type: string; payload?: any }): CustomerState {
        switch (action.type) {
            case 'SET_CLIENTS': return { ...state, clients: action.payload };
            case 'SET_SELECTED_CLIENT': return { ...state, selectedClient: action.payload };
            case 'RESET_CUSTOMER': return initialCustomerState;
            default: return state;
        }
    }

    type FormState = { reason: string; comment: string; images: string[] };
    const initialFormState: FormState = { reason: '', comment: '', images: [] };
    function formReducer(state: FormState, action: { type: string; payload?: any }): FormState {
        switch (action.type) {
            case 'SET_REASON': return { ...state, reason: action.payload };
            case 'SET_COMMENT': return { ...state, comment: action.payload };
            case 'SET_IMAGES': return { ...state, images: action.payload };
            case 'RESET_FORM': return initialFormState;
            default: return state;
        }
    }

    type UIState = {
        loading: boolean;
        loadingData: boolean;
        showScanner: boolean;
        showClientModal: boolean;
        showArtModal: boolean;
        showMotiveModal: boolean;
        isData: boolean;
        isManual: boolean;
    };
    const initialUiState: UIState = {
        loading: false,
        loadingData: false,
        showScanner: false,
        showClientModal: false,
        showArtModal: false,
        showMotiveModal: false,
        isData: false,
        isManual: false,
    };
    function uiReducer(state: UIState, action: { type: string; payload?: any }): UIState {
        switch (action.type) {
            case 'SET_LOADING': return { ...state, loading: action.payload };
            case 'SET_LOADING_DATA': return { ...state, loadingData: action.payload };
            case 'SET_SHOW_SCANNER': return { ...state, showScanner: action.payload };
            case 'SET_SHOW_CLIENT_MODAL': return { ...state, showClientModal: action.payload };
            case 'SET_SHOW_ART_MODAL': return { ...state, showArtModal: action.payload };
            case 'SET_SHOW_MOTIVE_MODAL': return { ...state, showMotiveModal: action.payload };
            case 'SET_IS_DATA': return { ...state, isData: action.payload };
            case 'SET_IS_MANUAL': return { ...state, isManual: action.payload };
            case 'RESET_UI': return initialUiState;
            default: return state;
        }
    }

    const [productState, dispatchProduct] = useReducer(productReducer, initialProductState);
    const [customerState, dispatchCustomer] = useReducer(customerReducer, initialCustomerState);
    const [formState, dispatchForm] = useReducer(formReducer, initialFormState);
    const [uiState, dispatchUi] = useReducer(uiReducer, initialUiState);

    // setter wrappers to keep existing hook API (so callers don't need changes)
    const setLoading = (v: boolean) => dispatchUi({ type: 'SET_LOADING', payload: v });
    const setLoadingData = (v: boolean) => dispatchUi({ type: 'SET_LOADING_DATA', payload: v });

    const setFactNumber = (v: string) => dispatchProduct({ type: 'SET_FACTNUMBER', payload: v });
    const setBarcode = (v: string) => dispatchProduct({ type: 'SET_BARCODE', payload: v });
    const setBarcodeList = (v: BarcodeItem[]) => dispatchProduct({ type: 'SET_BARCODE_LIST', payload: v });
    const setSerial = (v: string) => dispatchProduct({ type: 'SET_SERIAL', payload: v });
    const setCodeArt = (v: string) => dispatchProduct({ type: 'SET_CODE_ART', payload: v });
    const setArtDes = (v: string) => dispatchProduct({ type: 'SET_ART_DES', payload: v });
    const setZondes = (v: string) => dispatchProduct({ type: 'SET_ZONDES', payload: v });
    const setCodzon = (v: string) => dispatchProduct({ type: 'SET_CODZON', payload: v });
    const setArtList = (v: Articulo[]) => dispatchProduct({ type: 'SET_ART_LIST', payload: v });
    const setMotives = (v: Motive[]) => dispatchProduct({ type: 'SET_MOTIVES', payload: v });
    const setFactNum = (v: string | null) => dispatchProduct({ type: 'SET_FACTNUM', payload: v });
    const setPrednum = (v: number | null) => dispatchProduct({ type: 'SET_PREDNUM', payload: v });
    const setPednum = (v: number | null) => dispatchProduct({ type: 'SET_PEDNUM', payload: v });
    const setFedespacho = (v: string | null) => dispatchProduct({ type: 'SET_FEDESPACHO', payload: v });
    const setCodeVen = (v: string) => dispatchProduct({ type: 'SET_CODEVEN', payload: v });
    const setVenDes = (v: string) => dispatchProduct({ type: 'SET_VENDES', payload: v });

    const setClients = (v: ClientData[]) => dispatchCustomer({ type: 'SET_CLIENTS', payload: v });
    const setSelectedClient = (v: ClientData | null) => dispatchCustomer({ type: 'SET_SELECTED_CLIENT', payload: v });

    const setReason = (v: string) => dispatchForm({ type: 'SET_REASON', payload: v });
    const setComment = (v: string) => dispatchForm({ type: 'SET_COMMENT', payload: v });
    // Accept either an array or an updater callback like React's setState
    const setImages = (v: SetStateAction<string[]>) => {
        if (typeof v === 'function') {
            const updater = v as (prev: string[]) => string[];
            dispatchForm({ type: 'SET_IMAGES', payload: updater(formState.images) });
        } else {
            dispatchForm({ type: 'SET_IMAGES', payload: v });
        }
    };

    const setShowScanner = (v: boolean) => dispatchUi({ type: 'SET_SHOW_SCANNER', payload: v });
    const setShowClientModal = (v: boolean) => dispatchUi({ type: 'SET_SHOW_CLIENT_MODAL', payload: v });
    const setShowArtModal = (v: boolean) => dispatchUi({ type: 'SET_SHOW_ART_MODAL', payload: v });
    const setShowMotiveModal = (v: boolean) => dispatchUi({ type: 'SET_SHOW_MOTIVE_MODAL', payload: v });
    const setIsData = (v: boolean) => dispatchUi({ type: 'SET_IS_DATA', payload: v });
    const setIsManual = (v: boolean) => dispatchUi({ type: 'SET_IS_MANUAL', payload: v });

    // destructure for easy use in logic
    const {
        factNumber,
        barcode,
        barcodeList,
        serial,
        codeArt,
        artDes,
        zondes,
        codzon,
        artList,
        motives,
        factNum,
        prednum,
        pednum,
        fedespacho,
        codeVen,
        venDes,
    } = productState;

    const { reason, comment, images } = formState;
    const { clients, selectedClient } = customerState;
    const { loading, loadingData, showScanner, showClientModal, showArtModal, showMotiveModal, isData, isManual } = uiState;
    const isFormComplete = () => (
        reason && selectedClient && codeArt && artDes
    );
    const overlay = useOverlayStore();




    const pickImage = async () => {
        const result = await pickFromGallery();
        if (!result) return;

        const newImages = Array.isArray(result) ? result : [result];
        const combined = [...images, ...newImages];

        if (combined.length > MAX_IMAGES) {
            Alert.alert(`Máximo ${MAX_IMAGES} imágenes`);
        }

        setImages(combined.slice(0, MAX_IMAGES));
    };

    const handlePickFromCamera = async () => {
        if (images.length >= MAX_IMAGES) {
            Alert.alert(`Máximo ${MAX_IMAGES} imágenes`);
            return;
        }

        const result = await pickFromCamera();
        if (!result) return;

        setImages([...images, result].slice(0, MAX_IMAGES));
    };

    const handleSearchFactNum = async () => {
        if (factNumber.length < 1) {
            Alert.alert("Error", "Ingrese un número de factura válido.");
            return;
        }

        try {
            setLoadingData(true);

            const [rawData, motives] = await Promise.all([getOrderByFactNumber(Number(factNumber)), getMotives()]);
            setMotives(motives)

            if (!rawData) {
                Alert.alert("Sin resultados", "No se encontró datos  con el número de factura.");
                setIsData(false);
                return;
            }

            const raw: any = rawData;
            const artArray: Articulo[] = raw.art || [];

            const dto: ReturnBySerialDto = {
                fact_num: raw.fact_num ?? 0,
                fecemis: raw.fec_emis ?? raw.fecemis ?? null,
                
                codcli: raw.codcli ?? '',
                clides: raw.clides ?? '',
                codven: raw.codven ?? '',
                vendes: raw.vendes ?? '',
                codart: artArray[0]?.co_art ?? '',
                artdes: artArray[0]?.art_des ?? '',
                codbarra: raw.codbarra ?? '',
                serial: raw.serial ?? '',
                rif: raw.rif ?? '',
                telefonos: raw.telefonos ?? '',
                email: raw.email ?? '',
                dir_ent2: raw.dir_ent2 ?? '',
                prednum: raw.prednum ?? null,
                pednum: raw.pednum ?? null,
                zondes: raw.zondes ?? raw.zon_des ?? raw.zone?.zondes ?? raw.zone?.zon_des ?? '',
                fecdesp: raw.fecdesp ?? null,
                codzon: raw.codzon ?? '',
            };

            setBarcode(dto.codbarra);
            setCodeVen(dto.codven);
            setVenDes(dto.vendes);
            setSerial(dto.serial);
            setZondes(dto.zondes);
            setCodzon(dto.codzon || '');

            setSelectedClient({
                co_cli: dto.codcli,
                cli_des: dto.clides,
                rif: dto.rif || "",
                telefonos: dto.telefonos || "",
                email: dto.email || ""
            });

            setBarcodeList(artArray.map((item: Articulo) => ({ co_art: item.co_art, codbarra: item.codbarra })));
            setArtList(artArray);
            setIsData(true)


        } catch (error: unknown) {
            const message = getErrorMessage(error);
            console.error("Error obteniendo datos por número de factura:", message, error);
            Alert.alert("Error", `Ocurrió un error al obtener los datos: ${message}`);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (!codeArt) return;
        if (artList.length < 1) return

        setArtDes(artList.find(c => c.co_art === codeArt)?.art_des ?? '');
        setBarcode(barcodeList.find(b => b.co_art === codeArt)?.codbarra ?? '');
    }, [codeArt]);

    const handleSearchSerial = async () => {
        if (serial.length <= 3) {
            Alert.alert("Error", "Debe ingresar un serial válido.");
            return;
        }

        try {
            setLoadingData(true);

            const [rawData, motives] = await Promise.all([getBySerial(serial), getMotives()]);
            setMotives(motives)

            if (!rawData) {
                Alert.alert("Sin resultados", "No se encontró el producto con ese serial.");
                clearForm();
                return;
            }
           

            const raw: any = rawData;

            const dto: ReturnBySerialDto = {
                fact_num: raw.fact_num ?? 0,
                fecemis: raw.fecemis ?? null,
                codcli: raw.codcli ?? '',
                clides: raw.clides ?? '',
                codven: raw.codven ?? '',
                vendes: raw.vendes ?? '',
                codart: raw.codart ?? raw.cod_art ?? '',
                artdes: raw.artdes ?? raw.art_des ?? '',
                codbarra: raw.codbarra ?? '',
                serial: raw.serial ?? '',
                rif: raw.rif ?? '',
                telefonos: raw.telefonos ?? '',
                email: raw.email ?? '',
                dir_ent2: raw.dir_ent2 ?? '',
                prednum: raw.prednum ?? null,
                pednum: raw.pednum ?? null,
                zondes: raw.zondes ?? '',
                fecdesp: raw.fecdesp ?? null,
                codzon: raw.codzon ?? ''
            };

            setBarcode(dto.codbarra);
            setCodeArt(dto.codart);
            setCodeVen(dto.codven);
            setVenDes(dto.vendes);
            setArtDes(dto.artdes);
            setSerial(dto.serial);
            setPednum( Number(dto.pednum) || null);
            setPrednum( Number(dto.prednum) || null);
            setFedespacho(dto.fecdesp ? String(dto.fecdesp) : null);
            setZondes(dto.zondes);
            setCodzon(dto.codzon || '');

            setSelectedClient({
                co_cli: dto.codcli,
                cli_des: dto.clides,
                rif: dto.rif || "",
                telefonos: dto.telefonos || "",
                dir_ent2: dto.dir_ent2 || "",
                email: dto.email || ""
            });

            setIsData(true)

        } catch (error: unknown) {
            const message = getErrorMessage(error);
            console.error("Error obteniendo datos por serial:", message, error);
            Alert.alert("Error", `Ocurrió un error al obtener los datos: ${message}`);
        } finally {
            setLoadingData(false);
        }
    };


    const clearForm = () => {
        // Reset all grouped state to their initial values so the hook is ready for new data
        dispatchProduct({ type: 'RESET_PRODUCT' });
        dispatchCustomer({ type: 'RESET_CUSTOMER' });
        dispatchForm({ type: 'RESET_FORM' });
        dispatchUi({ type: 'RESET_UI' });
    };
    const handleManual = async () => {
        try {
            setLoadingData(true);
            clearForm();

            const [clients, arts, motives] = await Promise.all([getClients(), getArts(), getMotives()]);

            if (!clients || !arts || !motives) {
                throw new Error("No se pudieron cargar los datos necesarios");
            }

            setClients(clients);
            setArtList(arts);
            setMotives(motives);

            setBarcodeList(arts.map((item: Articulo) => ({
                co_art: item.co_art,
                codbarra: item.codbarra
            })));

            setIsManual(true);
            setIsData(true);
        } catch (error) {
            // Asegura que clearForm siempre se ejecute en caso de error
            clearForm();
            overlay.show("warning", {
                title: `Error al cargar datos`,
                subtitle: `No se pudieron cargar los datos necesarios para el registro manual, por favor inténtelo de nuevo.`,
            });
        } finally {
            setLoadingData(false);
        }
    };
    const registerDefect = async () => {
        if (!isFormComplete()) {
            Alert.alert("Datos sin llenar", "Por favor, verifique los campos.");
            return false;
        }
        if (images.length > MAX_IMAGES) {
            Alert.alert(`Solo puedes subir máximo ${MAX_IMAGES} imágenes`);
            return false;
        }
        let uploadedUrls: string[] = [];
        let uploadedPaths: string[] = [];

        try {
            setLoading(true);

            if (images.length > 0) {
                const result = await uploadMultipleImages(images, userId, serial);

                uploadedUrls = result.uploadedUrls;
                uploadedPaths = result.uploadedPaths;
            }

            const devolucion: CreateDevolucion = {
                fecharegistro: new Date().toISOString(),
                estatus: "1",
                anulada: "0",
                cerrada: "0",
                codcli: selectedClient?.co_cli.trim() || "",
                clides: selectedClient?.cli_des || "",
                registradopor: name?.trim() || '',
                codart: codeArt,
                codbarra: barcode,
                artdes: artDes,
                serial1: serial,
                motivo: reason,
                obsregistro: comment,     
                factnum: Number(factNumber) || Number(prednum) || 0,
                owneruser: 1,
                rif: selectedClient?.rif || '',
                telefono: selectedClient?.telefonos || '',
                dirretiro: selectedClient?.dir_ent2 || '',

                dtdevolucion: {
                    devonum: 0,
                    prednum: prednum || 0,
                    codven: codeVen.trim() || '',
                    vendes: venDes,
                    codzon: codzon.trim() || '',
                    enviorevision: "0",
                    enviotecnico: "0",
                    envioalmacen: "0",
                    fechadespacho:fedespacho ,
                    pednum: pednum || 0, 
                    zondes: zondes.trim() || '',
                    
                    ftdevolucion: {
                        devonum: '',
                        namefoto1: uploadedUrls[0] || '',
                        namefoto2: uploadedUrls[1] || '',
                        namefoto3: uploadedUrls[2] || '',
                        namefoto4: uploadedUrls[3] || '',
                        namefoto5: uploadedUrls[4] || '',
                        namefoto6: uploadedUrls[5] || '',
                        namefoto7: uploadedUrls[6] || '',
                        namefoto8: uploadedUrls[7] || '',
                        namefoto9: uploadedUrls[8] || '',
                        namefoto10: uploadedUrls[9] || '',
                        namefoto11: uploadedUrls[10] || '',
                        namefoto12: uploadedUrls[11] || '',
                        namefoto13: uploadedUrls[12] || '',
                        namefoto14: uploadedUrls[13] || '',
                        namefoto15: uploadedUrls[14] || '',
                    },
                }
            };
            
            const success = await createDevolucion(devolucion);

            if (success) {
                overlay.show("success", {
                    title: `Devolución registrada`,
                    subtitle: `La devolución fue registrada exitosamente.`,
                });

                clearForm();
                
                return true;
            } else {
              
                for (const path of uploadedPaths) {
                    await deleteImage(path);
                }

                overlay.show("error", {
                    title: `Error al registrar`,
                    subtitle: `No se pudo registrar la devolución, por favor inténtelo de nuevo.`,
                });
                //Alert.alert("Error", "No se pudo registrar la devolución.");
                return false;
            }
        } catch (err: any) {
           
            const errorMessage = err.response?.data?.message || "Error inesperado en el servidor";
            overlay.show("error", {
                title: `Error al registrar`,
                subtitle: `No se pudo registrar la devolución: ${errorMessage}`,
            });

            for (const path of uploadedPaths) {
                try { await deleteImage(path); } catch (e) { console.error('Error deleting image', e); }
            }

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
        handleManual,

        // states
        loading,
        barcode, setBarcode,
        serial, setSerial,
        codeArt, setCodeArt,
        artDes, setArtDes,
        codzon, setCodzon,
        reason, setReason,
        comment, setComment,
        images, setImages,
        showScanner, setShowScanner,
        factNumber, setFactNumber,
        loadingData,
        isData,
        artList,
        isManual,
        isFormComplete,
        showArtModal, setShowArtModal,
        motives,

        // customers

        setClients,
        clients,
        selectedClient,
        setSelectedClient,
        showClientModal, setShowClientModal,
        showMotiveModal, setShowMotiveModal,

        // sell
        setCodeVen,
        setVenDes,
        codeVen,
        venDes,
    };
}