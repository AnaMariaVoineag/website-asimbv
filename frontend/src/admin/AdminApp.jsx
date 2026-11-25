import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { adminApi, forgetSession, onUnauthorized, readSession, storeSession } from './adminApi';
import { AdminAuthContext } from './contexts';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import ToastProvider from './components/ToastProvider';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import MessagesPage from './pages/MessagesPage';
import EventsListPage from './pages/EventsListPage';
import EventEditorPage from './pages/EventEditorPage';
import PartnersPage from './pages/PartnersPage';
import SubscribersPage from './pages/SubscribersPage';
import './admin.css';

// Keeps the dashboard out of search engines while it is open.
const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
};

const AdminApp = () => {
  const [session, setSession] = useState(readSession);

  useNoIndex();
  useDocumentTitle('Administrare · ASIMBv');

  const logout = useCallback(() => {
    forgetSession();
    setSession(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const next = await adminApi.login(email, password);
    storeSession(next);
    setSession(next);
  }, []);

  useEffect(() => onUnauthorized(logout), [logout]);

  const auth = useMemo(() => ({ email: session?.email, login, logout }), [session, login, logout]);

  return (
    <AdminAuthContext.Provider value={auth}>
      <ToastProvider>
        <div className="adm-root">
          {session ? (
            <Routes>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="mesaje" element={<MessagesPage />} />
                <Route path="evenimente" element={<EventsListPage />} />
                <Route path="evenimente/nou" element={<EventEditorPage />} />
                <Route path="evenimente/:id" element={<EventEditorPage />} />
                <Route path="parteneri" element={<PartnersPage />} />
                <Route path="abonati" element={<SubscribersPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          ) : (
            <LoginPage />
          )}
        </div>
      </ToastProvider>
    </AdminAuthContext.Provider>
  );
};

export default AdminApp;
