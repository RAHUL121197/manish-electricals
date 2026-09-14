import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type LanguageCode = 'en' | 'gu' | 'hi';

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  gu: 'ગુજરાતી',
  hi: 'हिन्दी',
};

type Dictionary = Record<string, string>;

interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const STORAGE_KEY = 'me_language';
const FALLBACK_LANG: LanguageCode = 'en';
const VALID_LANGS = new Set<LanguageCode>(['en', 'gu', 'hi']);

// Load all locale JSON files eagerly so translations are available synchronously.
const localeModules = import.meta.glob<Record<string, unknown>>('../locales/*/*.json', { eager: true });

function buildDictionaries(): Record<LanguageCode, Dictionary> {
  const dicts = {
    en: {} as Dictionary,
    gu: {} as Dictionary,
    hi: {} as Dictionary,
  };

  for (const [path, contents] of Object.entries(localeModules)) {
    const match = path.match(/locales\/([a-z]+)\//);
    const lang = match ? (match[1] as LanguageCode) : null;
    if (!lang || !VALID_LANGS.has(lang)) continue;

    flattenInto(contents, dicts[lang], '');
  }

  return dicts;
}

/**
 * Flattens a nested JSON object into dot-notation keys:
 * { home: { title: "X" } } -> { "home.title": "X" }
 */
function flattenInto(node: unknown, out: Dictionary, prefix: string) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      flattenInto(value, out, prefix ? `${prefix}.${key}` : key);
    }
  } else if (typeof node === 'string') {
    out[prefix] = node;
  }
}

const DICTIONARIES = buildDictionaries();

function getInitialLang(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.has(stored as LanguageCode)) return stored as LanguageCode;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return FALLBACK_LANG;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: LanguageCode) => {
    if (!VALID_LANGS.has(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let text = DICTIONARIES[lang][key] ?? DICTIONARIES[FALLBACK_LANG][key] ?? key;
      if (vars) {
        text = text.replace(/\{(\w+)\}/g, (match, name: string) =>
          vars[name] !== undefined ? String(vars[name]) : match
        );
      }
      return text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}