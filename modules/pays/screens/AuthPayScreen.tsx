import SearchBar from '@/components/ui/SearchBar';
import TitleText from '@/components/ui/TitleText';
import { useThemeStore } from '@/stores/useThemeStore';
import {
    FlatList,
    View
} from 'react-native';
import AuthPayCard from '../components/AuthPayCard';

const data = [
    {
        "Empresa": "CYBERLUX",
        "Área gasto": "CONTABILIDAD",
        "Documento tipo": "FACT - 196",
        "Documento número": "FACT - 196",
        "Beneficiario": "MAQUINAS FISCALES",
        "Descripción": "HOMOLOGACIÓN IMAO FISCAL COLEGIO...",
        "Fecha emisión": "30 may. 2024",
        "Fecha vencimiento": "30 may. 2024",
        "Total documento": 660.00,
        "Total saldo": 660.00,
        "Tasa documento": 36.45,
        "Moneda proveedor": "DOLARES",
        "Monto autorizado": 660.00,
        "Tasa autorizada": 36.45,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "jimaplica"
    },
    {
        "Empresa": "EMDOM II",
        "Área gasto": "LEGALES",
        "Documento tipo": "FACT - 158",
        "Documento número": "FACT - 158",
        "Beneficiario": "REDU ADQUIRIDO TRABAJO DE TIENDA...",
        "Descripción": "REDU ADQUIRIDO TRABAJO DE TIENDA...",
        "Fecha emisión": "6 may. 2024",
        "Fecha vencimiento": "6 may. 2024",
        "Total documento": 9.320,
        "Total saldo": 9.320,
        "Tasa documento": 51.35,
        "Moneda proveedor": "BOLIVARES",
        "Monto autorizado": 9.320,
        "Tasa autorizada": 51.35,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "legalas"
    },
    {
        "Empresa": "AVANTI BY FRIGILUX",
        "Área gasto": "PATROCINIO",
        "Documento tipo": "Deuda",
        "Documento número": "FACT - 2467",
        "Beneficiario": "UCVFC",
        "Descripción": "PATROCINIO MES ABRIL 2025",
        "Fecha emisión": "1 feb. 2024",
        "Fecha vencimiento": "1 feb. 2024",
        "Total documento": 10.000,
        "Total saldo": 10.000,
        "Tasa documento": 66.79,
        "Moneda proveedor": "DOLARES",
        "Monto autorizado": 10.000,
        "Tasa autorizada": 66.79,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "mtfigueroa"
    },
    {
        "Empresa": "AVANTI BY FRIGILUX",
        "Área gasto": "MEDIOS",
        "Documento tipo": "Deuda",
        "Documento número": "FACT - 2489",
        "Beneficiario": "SACHERAS NACIONALES...",
        "Descripción": "CONTRATOS MES ABRIL...",
        "Fecha emisión": "18 jun. 2024",
        "Fecha vencimiento": "18 jun. 2024",
        "Total documento": 2.200,
        "Total saldo": 2.200,
        "Tasa documento": 66.79,
        "Moneda proveedor": "DOLARES",
        "Monto autorizado": 2.200,
        "Tasa autorizada": 66.79,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "mtfigueroa"
    },
    {
        "Empresa": "AVANTI BY FRIGILUX",
        "Área gasto": "PATROCINIO",
        "Documento tipo": "Deuda",
        "Documento número": "FACT - 2488",
        "Beneficiario": "ESTADIO MONUMENTAL SIMÓN BOLÍVAR",
        "Descripción": "SEGUIMIENTO DE LAS MEJORAS...",
        "Fecha emisión": "1 may. 2024",
        "Fecha vencimiento": "1 may. 2024",
        "Total documento": 50000.00,
        "Total saldo": 50000.00,
        "Tasa documento": 66.79,
        "Moneda proveedor": "DOLARES",
        "Monto autorizado": 50000.00,
        "Tasa autorizada": 66.79,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "mtfigueroa"
    },
    {
        "Empresa": "AVANTI BY FRIGILUX",
        "Área gasto": "MERCADEO",
        "Documento tipo": "Presupuesto",
        "Documento número": "APM-748",
        "Beneficiario": "ALEJANDRA JOSÉ CONEJ...",
        "Descripción": "FOTOS SESIÓN + IMAGEN DE PORTADAS...",
        "Fecha emisión": "14 feb. 2025",
        "Fecha vencimiento": "24 abr. 2025",
        "Total documento": 400.00,
        "Total saldo": 400.00,
        "Tasa documento": 60.02,
        "Moneda proveedor": "BOLIVARES",
        "Monto autorizado": 400.00,
        "Tasa autorizada": 60.02,
        "Autorizado pagar con": "Dólares EMDOM II",
        "Registrado por": "mtfigueroa"
    }
]
    ;

export default function AuthorizationScreen() {
    const { theme } = useThemeStore();

    const totalAutorizadoVED = data
        .filter((d) => d["Moneda proveedor"] === "BOLIVARES")
        .reduce((acc, item) => acc + item["Monto autorizado"], 0);

    const totalAutorizadoUSD = data
        .filter((d) => d["Moneda proveedor"] === "DOLARES")
        .reduce((acc, item) => acc + item["Monto autorizado"], 0);

    return (
        <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
            {/* HEADER */}
            <TitleText 
                title={`${data.length} Documentos`}
                subtitle={`Total autorizado: ${totalAutorizadoVED.toLocaleString()} VED / ${totalAutorizadoUSD.toLocaleString()} $`}
            />

            {/* Blank Container */}
            <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
                {/* Search */}
                <SearchBar />
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => `${item["Documento número"]}-${index}`}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => <AuthPayCard item={item} />}
                />
            </View>
        </View>
    );
}