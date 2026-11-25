import { createContext, useContext } from 'react';

export const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);

export const ToastContext = createContext(() => {});
// toast(message, kind?) where kind is 'success' (default) | 'error'.
export const useToast = () => useContext(ToastContext);
