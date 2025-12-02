// { "cli_des": "ZIAD ANTONIO SALAH ORTEGA (SALAH INVERSIONES ZIJA, F.P)                                             ", "co_cli": "00869     ", "co_zon": "0018  ", "dir_ent2": "CR 4 ESQUINA DE LA CALLE 19 CASA NRO S/N SECTOR LEONARDO RUIZ PINEDA SANTA BARBARA BARINAS", "direc1": "CR 4 ESQUINA DE LA CALLE 19 CASA NRO S/N SECTOR LEONARDO RUIZ PINEDA SANTA BARBARA BARINAS", "direc2": " " }

// store/clientsStore.js
import { Client } from "@/types/clients";
import { create } from "zustand";

export const useClientsStore = create<{
    clients: Client[];
    dataClients: any[];
    setClients: (clients: Client[]) => void;
    clearClients: () => void;
    setDataClients: () => void;
}>((set) => ({
    clients: [],
    dataClients: [],
    setClients: (clients) => set({ clients }),
    clearClients: () => set({ clients: [] }),
    setDataClients: () => set({ dataClients: [] }),
}));