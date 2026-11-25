import { useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';
import { matchesSearch, plural } from '../format';
import { useAdminResource } from '../useAdminResource';
import { getBuiltInEnglish } from '../../dictionaries/eventTranslations';
import { ROUTES } from '../../constants/routes';
import { assetUrl } from '../../utils/assetUrl';
import { parseRoDate } from '../../utils/events';
import PageHeader from '../components/PageHeader';
import StateBlock from '../components/StateBlock';
import { CATEGORY_LABELS } from '../options';

const EventsListPage = () => {
  const { refreshStats } = useOutletContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const resource = useAdminResource('events', () => adminApi.events.list());

  const events = useMemo(
    () => (resource.data ?? []).filter((e) => matchesSearch(search, e.title, e.titleEn, e.date, e.category)),
    [resource.data, search],
  );

  const remove = async (event) => {
    if (!window.confirm(`Ștergi evenimentul „${event.title}”? Dispare de pe site și nu poate fi recuperat.`)) return;
    try {
      await adminApi.events.remove(event.id);
      resource.setData((list) => list.filter((e) => e.id !== event.id));
      refreshStats();
      toast('Evenimentul a fost șters.');
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader title="Evenimente" subtitle="Tot ce apare pe paginile Evenimente și Acasă.">
        <Link to="/admin/evenimente/nou" className="adm-btn adm-btn-primary">+ Eveniment nou</Link>
      </PageHeader>

      <div className="adm-filters">
        <input
          type="search"
          className="adm-input adm-search"
          placeholder="Caută după titlu, dată, categorie…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="adm-card adm-card-flush">
        <StateBlock
          status={resource.status}
          error={resource.error}
          onRetry={resource.reload}
          empty={resource.status === 'ready' && events.length === 0}
          emptyText={search ? 'Niciun eveniment nu se potrivește.' : 'Încă nu există evenimente.'}
        />
        {events.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr>
                <th aria-label="Copertă" />
                <th>Eveniment</th>
                <th>Categorie</th>
                <th>Detalii</th>
                <th aria-label="Acțiuni" />
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const hasEnglish = Boolean(e.titleEn || getBuiltInEnglish(e.id));
                const dateKnown = parseRoDate(e.date) !== null;
                return (
                  <tr key={e.id} className="adm-row-click" onClick={() => navigate(`/admin/evenimente/${e.id}`)}>
                    <td className="adm-thumb-cell">
                      {e.cover ? <img src={assetUrl(e.cover)} alt="" className="adm-thumb" /> : <div className="adm-thumb adm-thumb-empty">—</div>}
                    </td>
                    <td>
                      <strong>{e.title}</strong>
                      <div className="adm-muted">
                        {e.date}
                        {!dateKnown && <span className="adm-tag adm-tag-warn" title="Data nu poate fi ordonată cronologic">dată nerecunoscută</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-pill adm-pill-${e.category.toLowerCase()}`}>{CATEGORY_LABELS[e.category] ?? e.category}</span>
                    </td>
                    <td>
                      <div className="adm-tags">
                        <span className={`adm-tag ${hasEnglish ? 'adm-tag-ok' : 'adm-tag-warn'}`}>{hasEnglish ? 'EN ✓' : 'fără EN'}</span>
                        <span className="adm-tag">{plural(e.imageCount, 'imagine', 'imagini')}</span>
                        {e.partnerCount > 0 && <span className="adm-tag">{plural(e.partnerCount, 'partener', 'parteneri')}</span>}
                        {e.hasForm && <span className="adm-tag">formular</span>}
                      </div>
                    </td>
                    <td className="adm-row-actions" onClick={(ev) => ev.stopPropagation()}>
                      <a
                        className="adm-icon-btn"
                        href={assetUrl(ROUTES.eventDetails(e.id))}
                        target="_blank"
                        rel="noreferrer"
                        title="Vezi pe site"
                      >
                        ↗
                      </a>
                      <Link className="adm-icon-btn" to={`/admin/evenimente/${e.id}`} title="Editează">✎</Link>
                      <button type="button" className="adm-icon-btn adm-icon-danger" onClick={() => remove(e)} title="Șterge">🗑</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default EventsListPage;
