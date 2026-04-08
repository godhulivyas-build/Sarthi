import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { AppScreen, SaarthiDashboardView, SaarthiScreen, SaarthiUserRole, UserRole } from '../types';
import { translations, type Lang, type TranslationKey } from '../i18n/translations';

export type AppState = {
  userRole: SaarthiUserRole | null;
  lang: Lang;
  currentScreen: SaarthiScreen;
  currentDashboardView: SaarthiDashboardView | null;
};

export type AppAction =
  | { type: 'SET_ROLE'; role: SaarthiUserRole | null }
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'SET_SCREEN'; screen: SaarthiScreen }
  | { type: 'SET_DASHBOARD_VIEW'; view: SaarthiDashboardView | null }
  | { type: 'LOGOUT' }
  | { type: 'SYNC_ROLE_ENUM_TO_STRING' };

const initialState: AppState = {
  userRole: null,
  lang: 'hi',
  currentScreen: 'landing',
  currentDashboardView: null,
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.role,
        currentDashboardView: action.role
          ? ({ role: action.role, view: 'home' } as SaarthiDashboardView)
          : null,
      };
    case 'SET_LANG':
      return { ...state, lang: action.lang };
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };
    case 'SET_DASHBOARD_VIEW':
      return { ...state, currentDashboardView: action.view };
    case 'LOGOUT':
      return { ...state, userRole: null, currentScreen: 'landing', currentDashboardView: null };
    case 'SYNC_ROLE_ENUM_TO_STRING': {
      // Back-compat helper while refactoring: if some code still dispatches enum roles,
      // keep state coherent by mapping known labels.
      const mapped =
        state.userRole ??
        null;
      return { ...state, userRole: mapped };
    }
    default:
      return state;
  }
};

type AppStateContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  t: (key: TranslationKey) => string;
  setLang: (lang: Lang) => void;
  setUserRole: (role: SaarthiUserRole | null) => void;
  setCurrentScreen: (screen: SaarthiScreen) => void;
  setCurrentDashboardView: (view: SaarthiDashboardView | null) => void;
  logout: () => void;
  // Convenience mappers for existing enum-based UI during transition
  setUserRoleFromEnum: (role: UserRole) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const t = useCallback(
    (key: TranslationKey) => {
      const row = translations[state.lang][key];
      return row ?? translations.en[key] ?? key;
    },
    [state.lang]
  );

  const setLang = useCallback((lang: Lang) => dispatch({ type: 'SET_LANG', lang }), []);
  const setUserRole = useCallback((role: SaarthiUserRole | null) => dispatch({ type: 'SET_ROLE', role }), []);
  const setCurrentScreen = useCallback((screen: SaarthiScreen) => dispatch({ type: 'SET_SCREEN', screen }), []);
  const setCurrentDashboardView = useCallback(
    (view: SaarthiDashboardView | null) => dispatch({ type: 'SET_DASHBOARD_VIEW', view }),
    []
  );
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const setUserRoleFromEnum = useCallback(
    (role: UserRole) => {
      const mapped: SaarthiUserRole =
        role === UserRole.FARMER ? 'farmer' : role === UserRole.TRANSPORTER ? 'transporter' : 'buyer';
      dispatch({ type: 'SET_ROLE', role: mapped });
    },
    []
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      t,
      setLang,
      setUserRole,
      setUserRoleFromEnum,
      setCurrentScreen,
      setCurrentDashboardView,
      logout,
    }),
    [state, t, setLang, setUserRole, setUserRoleFromEnum, setCurrentScreen, setCurrentDashboardView, logout]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateContextValue => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};

