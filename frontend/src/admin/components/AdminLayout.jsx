import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/logo_asimbv_circle.png';
import { adminApi } from '../adminApi';
import { useAdminAuth } from '../contexts';
import { useAdminResource } from '../useAdminResource';

const NAV = [
  { to: '/admin', label: 'Prezentare', icon: '◧', end: true },
  { to: '/admin/mesaje', label: 'Mesaje', icon: '✉', badge: 'unreadMessages' },
  { to: '/admin/evenimente', label: 'Evenimente', icon: '◷' },
  { to: '/admin/parteneri', label: 'Parteneri', icon: '◈' },
  { to: '/admin/abonati', label: 'Newsletter', icon: '✦' },
];

const AdminLayout = () => {
  const { email, logout } = useAdminAuth();
  const { pathname } = useLocation();
  const stats = useAdminResource('stats', () => adminApi.stats());
  const { reload } = stats;

  // Counts (e.g. the unread badge) follow along as the admin moves between pages.
  useEffect(() => {
    reload();
  }, [pathname, reload]);

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <Link to="/admin" className="adm-brand">
          <img src={logo} alt="" />
          <span>
            ASIMBv
            <small>Administrare</small>
          </span>
        </Link>

        <nav className="adm-nav">
          {NAV.map((item) => {
            const count = item.badge ? stats.data?.[item.badge] : 0;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="adm-nav-link">
                <span className="adm-nav-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {count > 0 && <span className="adm-badge">{count}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          {email && <span className="adm-account" title={email}>{email}</span>}
          <a href={import.meta.env.BASE_URL} target="_blank" rel="noreferrer" className="adm-nav-link">
            <span className="adm-nav-icon" aria-hidden="true">↗</span>
            <span>Vezi site-ul</span>
          </a>
          <button type="button" className="adm-nav-link adm-logout" onClick={logout}>
            <span className="adm-nav-icon" aria-hidden="true">⏻</span>
            <span>Deconectare</span>
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <Outlet context={{ stats: stats.data, refreshStats: reload }} />
      </main>
    </div>
  );
};

export default AdminLayout;
