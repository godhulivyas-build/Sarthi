import { useAppState } from '../state/AppState';
import type { Lang, TranslationKey } from './translations';

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

export const useI18n = (): I18nContextValue => {
  const { state, setLang, t } = useAppState();
  return { lang: state.lang, setLang, t };
};
