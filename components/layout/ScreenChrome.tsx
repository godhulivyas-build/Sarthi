import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

type ScreenChromeProps = {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
};

export const ScreenChrome: React.FC<ScreenChromeProps> = ({ children, onBack, title }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/80 to-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 px-2 py-3 flex items-center gap-2 shadow-sm safe-top">
        <div className="w-[4.5rem] shrink-0 flex justify-start">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-green-800 font-bold text-base active:bg-green-100"
              aria-label={t('back')}
            >
              ←
            </button>
          ) : (
            <span className="min-w-[44px]" aria-hidden />
          )}
        </div>
        {title ? (
          <h1 className="flex-1 text-center text-sm sm:text-base font-bold text-gray-900 truncate px-1">{title}</h1>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex items-center gap-1 shrink-0 w-[5.5rem] sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold border ${lang === 'hi' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
          >
            हिं
          </button>
          <button
            type="button"
            onClick={() => setLang('kn')}
            className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold border ${lang === 'kn' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
          >
            ಕನ್
          </button>
          <button
            type="button"
            onClick={() => setLang('te')}
            className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold border ${lang === 'te' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
          >
            తె
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-bold border ${lang === 'en' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
          >
            EN
          </button>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
};
