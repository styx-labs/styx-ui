import { useEffect } from "react";
import { User } from "firebase/auth";
import { setAuthUser } from "@/api";

interface ExtendedWindow extends Window {
  currentUser?: User | null;
}
declare const window: ExtendedWindow;

export function useAuthSetup(user: User | null) {
  useEffect(() => {
    const handleAuthChange = async () => {
      if (user) {
        const token = await user.getIdToken();
        // Store user reference for token refresh
        window.currentUser = user;
        // Set token in API service
        setAuthUser(user).catch((error) => {
          console.error("Error setting auth token:", error);
        });
        // Notify extension
        document.dispatchEvent(
          new CustomEvent("styxAuthUpdate", {
            detail: { token },
          })
        );
      } else {
        delete window.currentUser;
        setAuthUser(null);
        // Notify extension of logout
        document.dispatchEvent(
          new CustomEvent("styxAuthUpdate", {
            detail: { token: null },
          })
        );
      }
    };

    handleAuthChange();
  }, [user]);
}
