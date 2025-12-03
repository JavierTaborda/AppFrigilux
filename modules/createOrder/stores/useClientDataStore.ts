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