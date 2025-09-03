import { authenticateWithBiometrics } from "@/utils/biometricAuth";
import { getSessionStatus } from "@/utils/sessionStatus";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface AuthProviderState {
  showSplash: boolean;
  hasAuthenticated: boolean;
  initializeApp: () => Promise<void>;
  setShowSplash: (show: boolean) => void;
}

export const useAuthProviderStore = create<AuthProviderState>((set) => ({
  showSplash: true,
  hasAuthenticated: false,

  initializeApp: async () => {
    try {

     
      await useAuthStore.getState().initializeAuth();
      const { session, manualLogin, signOutSoft, setManualLogin } = useAuthStore.getState();

      // Si no hay sesión activa, salimos rápido
      if (!session) {
        set({ showSplash: false });
        await signOutSoft();
        return;
      }

      // Solo intentamos biometría si hay sesión y login no manual
      if (session && !manualLogin) {
        const loginStatus = await getSessionStatus();

        if (loginStatus === "active") {
          let biometricSuccess = false;


          try {
            const result = await authenticateWithBiometrics();
            biometricSuccess = result === true;
          } catch (err) {
            alert(err)
            //console.log("Biometric authentication failed:", err);
          }

          if (!biometricSuccess) {
            //console.log("Autenticación biométrica fallida, cerrando sesión...");
            set({ showSplash: false });
            await signOutSoft();
            return;
          }

          set({ hasAuthenticated: true });
        }
      }

      // Reset login manual 
      setManualLogin(false);
      set({ showSplash: false });
    } catch (err) {
      console.log("Error en initializeApp:", err);
      // alway hide the splash
      set({ showSplash: false });
    }
  },

  setShowSplash: (show: boolean) => set({ showSplash: show }),
}));
