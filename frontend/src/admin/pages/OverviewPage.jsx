import { Link, useOutletContext } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { formatRelative } from '../format';
import { useAdminResource } from '../useAdminResource';
import PageHeader from '../components/PageHeader';

const StatCard = ({ to, label, value, note, accent }) => (
  <Link to={to} className={`adm-stat ${accent ? 'adm-stat-accent' : ''}`}>
    <span className="adm-stat-label">{label}</span>
    <span className="adm-stat-value">{value ?? '–'}</span>
    {note && <span className="adm-stat-note">{note}</span>}
  </Link>
);

const OverviewPage = () => {
  const { stats } = useOutletContext();
  const unread = useAdminResource('overview-unread', () => adminApi.messages.list('unread'));
  const latest = (unread.data ?? []).slice(0, 5);

  return (
    <>
      <PageHeader title="Bun venit!" subtitle="O privire de ansamblu asupra site-ului ASIMBv.">
        <Link to="/admin/evenimente/nou" className="adm-btn adm-btn-primary">+ Eveniment nou</Link>
      </PageHeader>

      <div className="adm-stats">
        <StatCard
          to="/admin/mesaje"
          label="Mesaje necitite"
          value={stats?.unreadMessages}
          note={stats ? `${stats.inboxMessages} în inbox` : null}
          accent={stats?.unreadMessages > 0}
        />
        <StatCard to="/admin/evenimente" label="Evenimente" value={stats?.events} />
        <StatCard to="/admin/parteneri" label="Parteneri" value={stats?.partners} />
        <StatCard to="/admin/abonati" label="Abonați newsletter" value={stats?.activeSubscribers} note="activi" />
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Mesaje noi</h2>
          <Link to="/admin/mesaje" className="adm-link">Toate mesajele →</Link>
        </div>
        {unread.status === 'loading' && <p className="adm-muted">Se încarcă…</p>}
        {unread.status === 'error' && <p className="adm-muted">{unread.error.message}</p>}
        {unread.status === 'ready' && latest.length === 0 && (
          <p className="adm-muted">Niciun mesaj necitit. 🎉</p>
        )}
        <ul className="adm-mini-list">
          {latest.map((m) => (
            <li key={m.id}>
              <Link to={`/admin/mesaje?id=${m.id}`}>
                <span className="adm-dot" aria-hidden="true" />
                <strong>{m.name}</strong>
                <span className="adm-mini-subject">{m.subject}</span>
                <span className="adm-mini-snippet">{m.message}</span>
                <span className="adm-mini-time">{formatRelative(m.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default OverviewPage;
