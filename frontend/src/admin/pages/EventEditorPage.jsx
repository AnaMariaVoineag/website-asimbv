import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';
import { plural } from '../format';
import { useAdminResource } from '../useAdminResource';
import { CATEGORY_LABELS, LIMITS } from '../options';
import { getBuiltInEnglish, KNOWN_ROLES } from '../../dictionaries/eventTranslations';
import { ROUTES } from '../../constants/routes';
import { assetUrl } from '../../utils/assetUrl';
import { parseRoDate } from '../../utils/events';
import PageHeader from '../components/PageHeader';
import StateBlock from '../components/StateBlock';
import Field from '../components/Field';
import ImageListEditor from '../components/ImageListEditor';

const EMPTY = {
  title: '',
  titleEn: '',
  date: '',
  category: 'Social',
  description: '',
  descriptionEn: '',
  longDescription: '',
  longDescriptionEn: '',
  formUrl: '',
  images: [],
  partners: [], // [{ partnerId, name, logoUrl, role }]
};

const ROLE_SUGGESTIONS = [...new Set([...KNOWN_ROLES, 'Partenerii evenimentului', 'Sponsori'])];

// API event -> form. Missing English texts are pre-filled from the built-in translations,
// so saving once moves them into the database where they can be edited.
const toForm = (event) => {
  const builtIn = getBuiltInEnglish(event.id) ?? {};
  return {
    title: event.title ?? '',
    titleEn: event.titleEn || builtIn.title || '',
    date: event.date ?? '',
    category: event.category ?? 'Social',
    description: event.description ?? '',
    descriptionEn: event.descriptionEn || builtIn.description || '',
    longDescription: event.longDescription ?? '',
    longDescriptionEn: event.longDescriptionEn || builtIn.longDescription || '',
    formUrl: event.formUrl ?? '',
    images: event.images ?? [],
    partners: event.partners ?? [],
  };
};

const toPayload = (form) => ({
  ...form,
  partners: form.partners.map(({ partnerId, role }) => ({ partnerId, role })),
});

const validate = (form) => {
  if (!form.title.trim()) return 'Titlul (RO) este obligatoriu.';
  if (!form.date.trim()) return 'Data este obligatorie.';
  if (!form.description.trim()) return 'Descrierea scurtă (RO) este obligatorie.';
  if (form.description.length > LIMITS.description || form.descriptionEn.length > LIMITS.description)
    return `Descrierea scurtă poate avea cel mult ${LIMITS.description} de caractere.`;
  if (form.formUrl.trim() && !/^https?:\/\/\S+$/i.test(form.formUrl.trim()))
    return 'Linkul de înscriere trebuie să înceapă cu https://';
  if (form.partners.some((p) => !p.role.trim())) return 'Fiecare partener are nevoie de un rol.';
  return null;
};

const formatParsedDate = (text) => {
  const time = parseRoDate(text);
  return time === null ? null : new Date(time).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
};

const PartnersEditor = ({ value, onChange, allPartners }) => {
  const [toAdd, setToAdd] = useState('');
  const available = (allPartners ?? []).filter((p) => !value.some((v) => v.partnerId === p.id));

  const add = () => {
    const partner = available.find((p) => String(p.id) === toAdd);
    if (!partner) return;
    const lastRole = value.at(-1)?.role ?? '';
    onChange([...value, { partnerId: partner.id, name: partner.name, logoUrl: partner.logoUrl, role: lastRole }]);
    setToAdd('');
  };

  const update = (index, changes) => onChange(value.map((p, i) => (i === index ? { ...p, ...changes } : p)));
  const move = (index, delta) => {
    const copy = [...value];
    const [item] = copy.splice(index, 1);
    copy.splice(index + delta, 0, item);
    onChange(copy);
  };

  return (
    <div className="adm-partners-editor">
      {value.length === 0 && <p className="adm-muted">Niciun partener. Partenerii apar pe pagina evenimentului, grupați după rol.</p>}
      <datalist id="adm-role-suggestions">
        {ROLE_SUGGESTIONS.map((role) => <option key={role} value={role} />)}
      </datalist>
      <ul className="adm-partner-rows">
        {value.map((p, index) => (
          <li key={p.partnerId} className="adm-partner-row">
            <span className="adm-partner-logo">{p.logoUrl ? <img src={assetUrl(p.logoUrl)} alt="" /> : '—'}</span>
            <strong className="adm-partner-name">{p.name}</strong>
            <input
              className="adm-input"
              list="adm-role-suggestions"
              placeholder="Rol, ex. Organizat împreună cu"
              value={p.role}
              maxLength={LIMITS.role}
              onChange={(e) => update(index, { role: e.target.value })}
            />
            <span className="adm-row-actions">
              <button type="button" className="adm-icon-btn" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Mută în sus">↑</button>
              <button type="button" className="adm-icon-btn" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label="Mută în jos">↓</button>
              <button type="button" className="adm-icon-btn adm-icon-danger" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Elimină">×</button>
            </span>
          </li>
        ))}
      </ul>
      <div className="adm-inline-form">
        <select className="adm-input" value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
          <option value="">Alege un partener…</option>
          {available.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button type="button" className="adm-btn" onClick={add} disabled={!toAdd}>Adaugă</button>
        <Link to="/admin/parteneri" className="adm-link" target="_blank">Partener nou ↗</Link>
      </div>
      <p className="adm-field-hint">Rolurile din sugestii sunt traduse automat în engleză; un rol nou rămâne în română pe versiunea în engleză.</p>
    </div>
  );
};

// Loads the event, then mounts a fresh form for it (keyed by id, so switching events resets the form).
const EventEditorPage = () => {
  const { id } = useParams();
  const isNew = !id;
  const eventResource = useAdminResource(`event-${id ?? 'new'}`, () => (isNew ? Promise.resolve(null) : adminApi.events.get(id)));
  const partnersResource = useAdminResource('partners', () => adminApi.partners.list());

  if (!isNew && eventResource.status !== 'ready') {
    return (
      <>
        <PageHeader title="Editează eveniment" />
        <StateBlock status={eventResource.status} error={eventResource.error} onRetry={eventResource.reload} />
      </>
    );
  }

  return (
    <EventForm
      key={id ?? 'new'}
      id={id}
      initialForm={isNew ? EMPTY : toForm(eventResource.data)}
      allPartners={partnersResource.data}
    />
  );
};

const EventForm = ({ id, initialForm, allPartners }) => {
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshStats } = useOutletContext();

  const [form, setForm] = useState(initialForm);
  const [initial, setInitial] = useState(initialForm);
  const [lang, setLang] = useState('ro');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const set = (name) => (value) => {
    setError(null);
    setForm((f) => ({ ...f, [name]: typeof value === 'function' ? value(f[name]) : value }));
  };
  const bind = (name) => ({ value: form[name], onChange: (e) => set(name)(e.target.value) });

  const save = async (event) => {
    event.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = isNew
        ? await adminApi.events.create(toPayload(form))
        : await adminApi.events.update(id, toPayload(form));
      const next = toForm(saved);
      setForm(next);
      setInitial(next);
      refreshStats();
      toast(isNew ? 'Evenimentul a fost publicat.' : 'Modificările au fost salvate.');
      if (isNew) navigate(`/admin/evenimente/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Ștergi evenimentul „${form.title}”? Dispare de pe site și nu poate fi recuperat.`)) return;
    try {
      await adminApi.events.remove(id);
      refreshStats();
      toast('Evenimentul a fost șters.');
      navigate('/admin/evenimente');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const parsedDate = formatParsedDate(form.date);
  const en = lang === 'en';
  const suffix = en ? 'En' : '';

  return (
    <form onSubmit={save} className="adm-editor">
      <PageHeader
        title={isNew ? 'Eveniment nou' : 'Editează eveniment'}
        subtitle={isNew ? 'Completează detaliile; evenimentul apare pe site imediat după salvare.' : `#${id} · ${initial?.title}`}
      >
        <Link to="/admin/evenimente" className="adm-btn">← Înapoi</Link>
        {!isNew && (
          <a href={assetUrl(ROUTES.eventDetails(id))} target="_blank" rel="noreferrer" className="adm-btn">Vezi pe site ↗</a>
        )}
      </PageHeader>

      <div className="adm-editor-grid">
        <div className="adm-editor-main">
          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Texte</h2>
              <div className="adm-tabs adm-tabs-small" role="tablist">
                <button type="button" role="tab" aria-selected={!en} className={`adm-tab ${!en ? 'active' : ''}`} onClick={() => setLang('ro')}>Română</button>
                <button type="button" role="tab" aria-selected={en} className={`adm-tab ${en ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
              </div>
            </div>

            {en && (
              <p className="adm-field-hint adm-hint-box">
                Opțional. Câmpurile goale afișează textul în română pe versiunea în engleză a site-ului.
              </p>
            )}

            <Field label={en ? 'Title' : 'Titlu'} required={!en} count={form[`title${suffix}`].length} max={LIMITS.title}>
              <input className="adm-input adm-input-lg" maxLength={LIMITS.title} {...bind(`title${suffix}`)} placeholder={en ? form.title : 'ex. Workshop Git & GitHub'} />
            </Field>

            <Field
              label={en ? 'Short description' : 'Descriere scurtă'}
              required={!en}
              count={form[`description${suffix}`].length}
              max={LIMITS.description}
              hint="Apare pe cardul evenimentului. 1–2 propoziții."
            >
              <textarea className="adm-input" rows={3} {...bind(`description${suffix}`)} placeholder={en ? form.description : ''} />
            </Field>

            <Field
              label={en ? 'Full description' : 'Descriere completă'}
              count={form[`longDescription${suffix}`].length}
              max={LIMITS.longDescription}
              hint="Apare pe pagina evenimentului. Un rând liber începe un paragraf nou. Gol = se folosește descrierea scurtă."
            >
              <textarea className="adm-input" rows={12} {...bind(`longDescription${suffix}`)} placeholder={en ? form.longDescription : ''} />
            </Field>
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Galerie foto</h2>
              <span className="adm-muted">{plural(form.images.length, 'imagine', 'imagini')}</span>
            </div>
            <ImageListEditor images={form.images} onChange={set('images')} />
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Parteneri</h2>
            </div>
            <PartnersEditor value={form.partners} onChange={set('partners')} allPartners={allPartners} />
          </section>
        </div>

        <aside className="adm-editor-side">
          <section className="adm-card">
            <h2 className="adm-card-title">Detalii</h2>

            <Field
              label="Data"
              required
              hint={
                form.date.trim() ? (
                  parsedDate ? (
                    <span className="adm-ok">✓ Recunoscută: {parsedDate}</span>
                  ) : (
                    <span className="adm-warn">Data nu e recunoscută, deci evenimentul nu poate fi ordonat cronologic pe pagina principală. Folosește formatul „21 mai 2026” sau „21-24 mai 2026”.</span>
                  )
                ) : 'ex. „21 mai 2026”, „21-24 mai 2026” sau „Septembrie 2026”'
              }
            >
              <input className="adm-input" maxLength={LIMITS.date} {...bind('date')} placeholder="21 mai 2026" />
            </Field>

            <Field label="Categorie" required>
              <select className="adm-input" {...bind('category')}>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>

            <Field label="Link de înscriere" hint="Opțional, ex. un Google Form. Afișează butonul „Înscrie-te” pe pagina evenimentului.">
              <input className="adm-input" type="url" {...bind('formUrl')} placeholder="https://forms.gle/…" />
            </Field>
          </section>

          <section className="adm-card adm-save-card">
            {error && <div className="adm-alert adm-alert-error">{error}</div>}
            {dirty && !error && <p className="adm-muted">Ai modificări nesalvate.</p>}
            <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={saving || (!isNew && !dirty)}>
              {saving ? 'Se salvează…' : isNew ? 'Publică evenimentul' : 'Salvează modificările'}
            </button>
            {!isNew && (
              <button type="button" className="adm-btn adm-btn-danger adm-btn-block" onClick={remove}>Șterge evenimentul</button>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
};

export default EventEditorPage;
