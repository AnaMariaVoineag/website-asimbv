import { useEffect } from 'react';
import { FORMULAR_230_SCRIPT_ID, FORMULAR_230_SCRIPT_URL } from '../constants/tax';

// Injects the formular230.ro script that powers the "complete online" button, and removes it on unmount.
export const useFormular230Script = () => {
  useEffect(() => {
    if (!document.getElementById(FORMULAR_230_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = FORMULAR_230_SCRIPT_ID;
      script.src = FORMULAR_230_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
    return () => document.getElementById(FORMULAR_230_SCRIPT_ID)?.remove();
  }, []);
};
