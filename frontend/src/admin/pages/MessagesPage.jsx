import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { adminApi } from '../adminApi';
import { useToast } from '../contexts';
import { downloadCsv, formatDateTime, formatRelative, matchesSearch, todayStamp } from '../format';
import { useAdminResource } from '../useAdminResource';
import PageHeader from '../components/PageHeader';
import StateBlock from '../components/StateBlock';

const TABS = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'unread', label: 'Necitite' },
  { id: 'archived', label: 'Arhivă' },
  { id: 'all', label: 'Toate' },
];

// Whether a message still belongs in the current tab after a change (e.g. archived from the inbox).
// The open message stays on screen either way; it just leaves the list.
const belongsTo = (tab, m) =>
  tab === 'all' ||
  (tab === 'inbox' && !m.isArchived) ||
  (tab === 'unread' && !m.isArchived && !m.isRead) ||
  (tab === 'archived' && m.isArchived);

const replyLink = (m) => {
  const quoted = m.message.split('\n').map((line) => `> ${line}`).join('\n');
  const body = `Bună, ${m.name},\n\n\n\n—\nEchipa ASIMBv\n\n${quoted}`;
  return `mailto:${encodeURIComponent(m.email).replace('%40', '@')}?subject=${encodeURIComponent(`Re: ${m.subject}`)}&body=${encodeURIComponent(body)}`;
};

const MessageDetail = ({ message, onChange, onDelete }) => {
  const [notes, setNotes] = useState(message.notes ?? '');
  const [saving, setSaving] = useState(false);
  const dirty = (message.notes ?? '') !== notes;

  const saveNotes = async () => {
    setSaving(true);
    await onChange({ notes }, 'Notițele au fost salvate.');
    setSaving(false);
  };

  return (
    <article className="adm-message-detail">
      <header>
        <span className="adm-pill">{message.subject}</span>
        <h2>{message.name}</h2>
        <p className="adm-muted">
          <a href={`mailto:${message.email}`} className="adm-link">{message.email}</a> · {formatDateTime(message.createdAt)}
        </p>
      </header>

      <div className="adm-message-body">{message.message}</div>

      <div className="adm-toolbar">
        <a className="adm-btn adm-btn-primary" href={replyLink(message)}>↩ Răspunde pe email</a>
        <button type="button" className="adm-btn" onClick={() => onChange({ isRead: !message.isRead })}>
          {message.isRead ? 'Marchează necitit' : 'Marchează citit'}
        </button>
        <button
          type="button"
          className="adm-btn"
          onClick={() =>
            onChange({ isArchived: !message.isArchived }, message.isArchived ? 'Mutat în inbox.' : 'Mesaj arhivat.')
          }
        >
          {message.isArchived ? 'Mută în inbox' : 'Arhivează'}
        </button>
        <button type="button" className="adm-btn adm-btn-danger" onClick={onDelete}>Șterge</button>
      </div>

      <div className="adm-notes">
        <label className="adm-field">
          <span className="adm-field-label">Notițe interne (nu sunt trimise nimănui)</span>
          <textarea
            className="adm-input"
            rows={3}
            maxLength={2000}
            value={notes}
            placeholder="ex. Răspuns de Maria pe 12 nov; așteptăm confirmarea sponsorului."
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        {dirty && (
          <button type="button" className="adm-btn" onClick={saveNotes} disabled={saving}>
            {saving ? 'Se salvează…' : 'Salvează notițele'}
          </button>
        )}
      </div>
    </article>
  );
};

const MessagesPage = () => {
  const { refreshStats } = useOutletContext();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('inbox');
  const [search, setSearch] = useState('');
  const resource = useAdminResource(`messages-${tab}`, () => adminApi.messages.list(tab));
  const { setData } = resource;

  const selectedId = Number(searchParams.get('id')) || null;
  const messages = useMemo(
    () =>
      (resource.data ?? []).filter(
        (m) => belongsTo(tab, m) && matchesSearch(search, m.name, m.email, m.subject, m.message, m.notes),
      ),
    [resource.data, search, tab],
  );
  const selected = (resource.data ?? []).find((m) => m.id === selectedId) ?? null;

  const select = (id) => setSearchParams(id ? { id: String(id) } : {});

  const update = async (id, changes, successMessage) => {
    try {
      const updated = await adminApi.messages.update(id, changes);
      setData((list) => (list ?? []).map((m) => (m.id === id ? updated : m)));
      if (successMessage) toast(successMessage);
      refreshStats();
      return updated;
    } catch (error) {
      toast(error.message, 'error');
      return null;
    }
  };

  // Opening an unread message marks it as read.
  useEffect(() => {
    if (!selected || selected.isRead) return;
    adminApi.messages
      .update(selected.id, { isRead: true })
      .then((updated) => {
        setData((list) => (list ?? []).map((m) => (m.id === updated.id ? updated : m)));
        refreshStats();
      })
      .catch(() => {});
    // Only when a different message is opened, not on every list refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const remove = async (m) => {
    if (!window.confirm(`Ștergi definitiv mesajul de la ${m.name}? Acțiunea nu poate fi anulată.`)) return;
    try {
      await adminApi.messages.remove(m.id);
      setData((list) => (list ?? []).filter((x) => x.id !== m.id));
      select(null);
      refreshStats();
      toast('Mesajul a fost șters.');
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  const exportCsv = () =>
    downloadCsv(
      `mesaje-contact-${tab}-${todayStamp()}.csv`,
      ['Data', 'Nume', 'Email', 'Subiect', 'Mesaj', 'Citit', 'Arhivat', 'Notițe'],
      messages.map((m) => [
        formatDateTime(m.createdAt), m.name, m.email, m.subject, m.message,
        m.isRead ? 'da' : 'nu', m.isArchived ? 'da' : 'nu', m.notes ?? '',
      ]),
    );

  return (
    <>
      <PageHeader title="Mesaje de contact" subtitle="Mesajele trimise prin formularul de pe pagina Contact.">
        <button type="button" className="adm-btn" onClick={exportCsv} disabled={messages.length === 0}>
          ⬇ Export CSV
        </button>
      </PageHeader>

      <div className="adm-filters">
        <div className="adm-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`adm-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => {
                setTab(t.id);
                select(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="adm-input adm-search"
          placeholder="Caută după nume, email, subiect, text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={`adm-split ${selected ? 'has-selection' : ''}`}>
        <div className="adm-card adm-list-pane">
          <StateBlock
            status={resource.status}
            error={resource.error}
            onRetry={resource.reload}
            empty={resource.status === 'ready' && messages.length === 0}
            emptyText={search ? 'Niciun mesaj nu se potrivește căutării.' : 'Niciun mesaj aici.'}
          />
          <ul className="adm-message-list">
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`adm-message-row ${m.id === selectedId ? 'active' : ''} ${m.isRead ? '' : 'unread'}`}
                  onClick={() => select(m.id)}
                >
                  <span className="adm-message-row-top">
                    {!m.isRead && <span className="adm-dot" aria-label="necitit" />}
                    <strong>{m.name}</strong>
                    <span className="adm-mini-time">{formatRelative(m.createdAt)}</span>
                  </span>
                  <span className="adm-message-row-subject">
                    {m.subject}
                    {m.isArchived && tab === 'all' && <span className="adm-tag">arhivat</span>}
                    {m.notes && <span className="adm-tag">notițe</span>}
                  </span>
                  <span className="adm-message-row-snippet">{m.message}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="adm-card adm-detail-pane">
          {selected ? (
            <>
              <button type="button" className="adm-btn adm-back-btn" onClick={() => select(null)}>← Înapoi la listă</button>
              <MessageDetail
                key={selected.id}
                message={selected}
                onChange={(changes, msg) => update(selected.id, changes, msg)}
                onDelete={() => remove(selected)}
              />
            </>
          ) : (
            <div className="adm-state">Selectează un mesaj din listă.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
