import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';
import { downloadCsv, formatDate, formatDateTime, matchesSearch, todayStamp } from '../format';
import { useAdminResource } from '../useAdminResource';
import PageHeader from '../components/PageHeader';
import StateBlock from '../components/StateBlock';

const SubscribersPage = () => {
  const { refreshStats } = useOutletContext();
  const toast = useToast();
  const resource = useAdminResource('subscribers', () => adminApi.subscribers.list());
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const all = useMemo(() => resource.data ?? [], [resource.data]);
  const active = all.filter((s) => s.isActive);
  const list = useMemo(
    () => all.filter((s) => (showInactive || s.isActive) && matchesSearch(search, s.email, s.name)),
    [all, search, showInactive],
  );

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(active.map((s) => s.email).join(', '));
      toast(`${active.length} adrese copiate. Pune-le la BCC, nu la „Către”.`);
    } catch {
      toast('Copierea nu a funcționat în acest browser.', 'error');
    }
  };

  const exportCsv = () =>
    downloadCsv(
      `abonati-newsletter-${todayStamp()}.csv`,
      ['Email', 'Nume', 'Activ', 'Abonat la', 'Dezabonat la'],
      list.map((s) => [s.email, s.name, s.isActive ? 'da' : 'nu', formatDateTime(s.subscribedAt), s.unsubscribedAt ? formatDateTime(s.unsubscribedAt) : '']),
    );

  const remove = async (s) => {
    if (!window.confirm(`Ștergi definitiv adresa ${s.email} din baza de date? (ex. la o cerere GDPR de ștergere)`)) return;
    try {
      await adminApi.subscribers.remove(s.id);
      resource.setData((items) => items.filter((x) => x.id !== s.id));
      refreshStats();
      toast('Adresa a fost ștearsă.');
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Abonați newsletter"
        subtitle={resource.status === 'ready' ? `${active.length} activi · ${all.length - active.length} dezabonați` : 'Persoanele abonate din footer-ul site-ului.'}
      >
        <button type="button" className="adm-btn" onClick={copyEmails} disabled={active.length === 0}>⧉ Copiază adresele active</button>
        <button type="button" className="adm-btn" onClick={exportCsv} disabled={list.length === 0}>⬇ Export CSV</button>
      </PageHeader>

      <div className="adm-filters">
        <input type="search" className="adm-input adm-search" placeholder="Caută după email sau nume…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="adm-check">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          Arată și dezabonații
        </label>
      </div>

      <div className="adm-card adm-card-flush">
        <StateBlock
          status={resource.status}
          error={resource.error}
          onRetry={resource.reload}
          empty={resource.status === 'ready' && list.length === 0}
          emptyText="Niciun abonat."
        />
        {list.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nume</th>
                <th>Stare</th>
                <th>Abonat la</th>
                <th aria-label="Acțiuni" />
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td><a className="adm-link" href={`mailto:${s.email}`}>{s.email}</a></td>
                  <td>{s.name || <span className="adm-muted">—</span>}</td>
                  <td>
                    {s.isActive ? (
                      <span className="adm-tag adm-tag-ok">activ</span>
                    ) : (
                      <span className="adm-tag adm-tag-muted" title={`Dezabonat la ${formatDate(s.unsubscribedAt)}`}>dezabonat</span>
                    )}
                  </td>
                  <td>{formatDate(s.subscribedAt)}</td>
                  <td className="adm-row-actions">
                    <button type="button" className="adm-icon-btn adm-icon-danger" onClick={() => remove(s)} title="Șterge definitiv">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default SubscribersPage;
