import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ro from './ro';
import en from './en';

// eslint-disable-next-line react-refresh/only-export-components
export const LANGUAGES = ['ro', 'en'];
const DICTIONARIES = { ro, en };
const STORAGE_KEY = 'asimbv-lang';
const LOCALES = { ro: 'ro-RO', en: 'en-GB' };

const readStoredLang = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(stored) ? stored : 'ro';
  } catch {
    return 'ro';
  }
};

// "a.b.c" -> dictionary.a.b.c, or undefined when any step is missing.
const lookup = (dictionary, key) =>
  key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dictionary);

// Replaces {name} placeholders with values from `vars`.
const interpolate = (text, vars) =>
  typeof text === 'string' && vars
    ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match))
    : text;

// "plain **bold** plain" -> ["plain ", <strong>bold</strong>, " plain"]
const renderRich = (text) =>
  String(text)
    .split('**')
    .map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part));

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private window); the choice just won't survive a reload.
    }
  }, []);

  const value = useMemo(() => {
    // Falls back to Romanian, then to the key itself, so a missing English string never shows blank.
    const raw = (key) => lookup(DICTIONARIES[lang], key) ?? lookup(ro, key) ?? key;
    return {
      lang,
      setLang,
      locale: LOCALES[lang],
      t: (key, vars) => interpolate(raw(key), vars),
      // Same as t, but turns **bold** markers into <strong>.
      rich: (key, vars) => renderRich(interpolate(raw(key), vars)),
      // Returns the raw value, for arrays and objects (lists of items).
      list: (key) => {
        const value = raw(key);
        return Array.isArray(value) ? value : [];
      },
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
};
