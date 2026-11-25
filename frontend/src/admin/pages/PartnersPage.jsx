import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';
import { matchesSearch } from '../format';
import { PARTNER_TYPE_LABELS } from '../options';
import { useAdminResource } from '../useAdminResource';
import { assetUrl } from '../../utils/assetUrl';
import ro from '../../dictionaries/ro';
import en from '../../dictionaries/en';
import PageHeader from '../components/PageHeader';
import StateBlock from '../components/StateBlock';
import Modal from '../components/Modal';
import Field from '../components/Field';
import ImageUploadButton from '../components/ImageUploadButton';

const EMPTY = { name: '', type: '', label: '', labelEn: '', displayOrder: 0, logoUrl: '', websiteUrl: '' };

// Text shown under the logo when no custom label is set (same as the public site).
const defaultLabel = (type, lang) => (type ? (lang === 'en' ? en : ro).partnersBar.types[type] : '');

const toForm = (p) => ({
  name: p.name,
  type: p.type ?? '',
  label: p.label ?? '',
  labelEn: p.labelEn ?? '',
  displayOrder: p.displayOrder,
  logoUrl: p.logoUrl ?? '',
  websiteUrl: p.websiteUrl ?? '',
});

const PartnerDialog = ({ partner, nextOrder, onClose, onSaved }) => {
  const [form, setForm] = useState(partner ? toForm(partner) : { ...EMPTY, displayOrder: nextOrder });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Numele este obligatoriu.');
      return;
    }
    if (form.websiteUrl.trim() && !/^https?:\/\/\S+$/i.test(form.websiteUrl.trim())) {
      setError('Site-ul trebuie să înceapă cu https://');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { ...form, type: form.type || null, displayOrder: Number(form.displayOrder) || 0 };
    try {
      const saved = partner ? await adminApi.partners.update(partner.id, payload) : await adminApi.partners.create(payload);
      onSaved(saved, !partner);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal
      title={partner ? `Editează: ${partner.name}` : 'Partener nou'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn" onClick={onClose}>Anulează</button>
          <button type="submit" form="adm-partner-form" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? 'Se salvează…' : 'Salvează'}
          </button>
        </>
      }
    >
      <form id="adm-partner-form" onSubmit={save} className="adm-form-stack">
        <Field label="Nume" required>
          <input className="adm-input" value={form.name} maxLength={150} onChange={(e) => set('name', e.target.value)} autoFocus />
        </Field>

        <Field label="Unde apare" hint="Orice tip în afară de „Doar pe paginile evenimentelor” îl afișează în bara de parteneri de deasupra footer-ului.">
          <select className="adm-input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {Object.entries(PARTNER_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>

        {form.type && (
          <div className="adm-form-row adm-form-row-top">
            <Field label="Eticheta sub logo (RO)" hint="Gol = eticheta implicită a tipului.">
              <input className="adm-input" maxLength={60} value={form.label} placeholder={defaultLabel(form.type, 'ro')} onChange={(e) => set('label', e.target.value)} />
            </Field>
            <Field label="Label (EN)">
              <input className="adm-input" maxLength={60} value={form.labelEn} placeholder={form.label || defaultLabel(form.type, 'en')} onChange={(e) => set('labelEn', e.target.value)} />
            </Field>
            <Field label="Ordine" className="adm-field-narrow" hint="Mai mic = mai în față">
              <input className="adm-input" type="number" value={form.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} />
            </Field>
          </div>
        )}

        <Field label="Logo" hint="PNG, JPG, WEBP sau GIF, ideal cu fundal transparent. Fără logo se afișează numele.">
          <div className="adm-logo-field">
            <span className="adm-logo-preview">
              {form.logoUrl ? <img src={assetUrl(form.logoUrl)} alt="" /> : <span className="adm-muted">fără logo</span>}
            </span>
            <div className="adm-form-stack">
              <ImageUploadButton folder="partners" label="Încarcă logo" onUploaded={(url) => set('logoUrl', url)} />
              <input className="adm-input" placeholder="/parteneri/logo.svg" value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} />
            </div>
          </div>
        </Field>

        <Field label="Site web">
          <input className="adm-input" type="url" placeholder="https://…" value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} />
        </Field>

        {error && <div className="adm-alert adm-alert-error">{error}</div>}
      </form>
    </Modal>
  );
};

const PartnersPage = () => {
  const { refreshStats } = useOutletContext();
  const toast = useToast();
  const resource = useAdminResource('partners', () => adminApi.partners.list());
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | partner

  const partners = useMemo(
    () => (resource.data ?? []).filter((p) => matchesSearch(search, p.name, p.websiteUrl, PARTNER_TYPE_LABELS[p.type ?? ''])),
    [resource.data, search],
  );
  const nextOrder = Math.max(0, ...(resource.data ?? []).map((p) => p.displayOrder)) + 1;

  const onSaved = (saved, created) => {
    resource.setData((list) => {
      const rest = (list ?? []).filter((p) => p.id !== saved.id);
      return [...rest, saved].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
    });
    setEditing(null);
    refreshStats();
    toast(created ? 'Partenerul a fost adăugat.' : 'Partenerul a fost actualizat.');
  };

  const remove = async (p) => {
    const where = p.eventCount > 0 ? ` Va fi scos și de pe ${p.eventCount} pagini de evenimente.` : '';
    if (!window.confirm(`Ștergi partenerul „${p.name}”?${where}`)) return;
    try {
      await adminApi.partners.remove(p.id);
      resource.setData((list) => list.filter((x) => x.id !== p.id));
      refreshStats();
      toast('Partenerul a fost șters.');
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  return (
    <>
      <PageHeader title="Parteneri" subtitle="Bara de parteneri de deasupra footer-ului și partenerii de pe paginile evenimentelor.">
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>+ Partener nou</button>
      </PageHeader>

      <div className="adm-filters">
        <input type="search" className="adm-input adm-search" placeholder="Caută partener…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="adm-card adm-card-flush">
        <StateBlock
          status={resource.status}
          error={resource.error}
          onRetry={resource.reload}
          empty={resource.status === 'ready' && partners.length === 0}
          emptyText="Niciun partener."
        />
        {partners.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr>
                <th aria-label="Logo" />
                <th>Nume</th>
                <th>Unde apare</th>
                <th>Ordine</th>
                <th>Evenimente</th>
                <th aria-label="Acțiuni" />
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} className="adm-row-click" onClick={() => setEditing(p)}>
                  <td className="adm-thumb-cell">
                    <span className="adm-logo-preview adm-logo-small">
                      {p.logoUrl ? <img src={assetUrl(p.logoUrl)} alt="" /> : '—'}
                    </span>
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.websiteUrl && <div className="adm-muted adm-ellipsis">{p.websiteUrl.replace(/^https?:\/\//, '')}</div>}
                  </td>
                  <td>
                    <span className={`adm-tag ${p.type ? '' : 'adm-tag-muted'}`}>{PARTNER_TYPE_LABELS[p.type ?? '']}</span>
                    {p.type && <div className="adm-muted adm-small">„{p.label || defaultLabel(p.type, 'ro')}”</div>}
                  </td>
                  <td>{p.type ? p.displayOrder : '—'}</td>
                  <td>{p.eventCount || '—'}</td>
                  <td className="adm-row-actions" onClick={(ev) => ev.stopPropagation()}>
                    <button type="button" className="adm-icon-btn" onClick={() => setEditing(p)} title="Editează">✎</button>
                    <button type="button" className="adm-icon-btn adm-icon-danger" onClick={() => remove(p)} title="Șterge">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <PartnerDialog
          partner={editing === 'new' ? null : editing}
          nextOrder={nextOrder}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </>
  );
};

export default PartnersPage;
