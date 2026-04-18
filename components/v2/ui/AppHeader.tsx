import React from 'react';
import { useI18n } from '../../../i18n/I18nContext';

type LangCode = 'hi' | 'en' | 'kn' | 'te';

const LANG_OPTS: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिं' },
  { code: 'kn', label: 'ಕ' },
  { code: 'te', label: 'తె' },
  { code: 'en', label: 'EN' },
];

type Props = {
  title: string;
  onLogout: () => void;
  /** Optional small logo path */
  logoSrc?: string;
};

export const AppHeader: React.FC<Props> = ({ title, onLogout, logoSrc = '/images/logo.png' }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 saarthi-glass-panel px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img src={logoSrc} alt="" className="w-8 h-8 rounded-lg shrink-0 ring-1 ring-[var(--saarthi-outline-soft)]" />
        <span className="font-extrabold text-sm sm:text-base truncate saarthi-headline text-[var(--saarthi-on-background)]">{title}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {LANG_OPTS.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`min-h-[36px] min-w-[36px] rounded-xl text-[11px] font-extrabold border transition-colors ${
              lang === code
                ? 'bg-[var(--saarthi-primary)] text-white border-[var(--saarthi-primary)] shadow-sm'
                : 'bg-white/80 text-[var(--saarthi-on-surface-variant)] border-[var(--saarthi-outline-soft)] hover:border-[var(--saarthi-primary)]'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="text-red-600 font-bold text-xs sm:text-sm px-2 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          {t('profile.logout')}
        </button>
      </div>
    </header>
  );
};
