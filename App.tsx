import React, { useState } from 'react';
import { AppScreen, UserRole, UserPreferences } from './types';
import { LandingPage } from './components/LandingPage';
import { PreferenceScreen } from './components/PreferenceScreen';
import { Dashboard } from './components/Dashboard';
import { FloatingAssistant } from './components/FloatingAssistant';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LANDING);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const [preferencesMap, setPreferencesMap] = useState<Partial<Record<UserRole, UserPreferences>>>({});

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const handlePreferencesComplete = (prefs: UserPreferences) => {
    if (userRole) {
      setPreferencesMap((prev) => ({ ...prev, [userRole]: prefs }));
      setPreferences(prefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleSkipPreferences = () => {
    const emptyPrefs: UserPreferences = { location: '', primaryCrop: '', loadSize: '', urgency: 'Normal' };
    if (userRole) {
      setPreferencesMap((prev) => ({ ...prev, [userRole]: emptyPrefs }));
      setPreferences(emptyPrefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleEditPreferences = () => {
    setCurrentScreen(AppScreen.PREFERENCES);
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    const existingPrefs = preferencesMap[role];
    if (existingPrefs) {
      setPreferences(existingPrefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    } else {
      setPreferences(null);
      setCurrentScreen(AppScreen.PREFERENCES);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setPreferences(null);
    setCurrentScreen(AppScreen.LANDING);
  };

  const handleLandingContinue = (role: UserRole) => {
    setUserRole(role);
    const existingPrefs = preferencesMap[role];
    if (existingPrefs) {
      setPreferences(existingPrefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    } else {
      setPreferences(null);
      setCurrentScreen(AppScreen.PREFERENCES);
    }
  };

  const handleBackFromPreferences = () => {
    setUserRole(null);
    setPreferences(null);
    setCurrentScreen(AppScreen.LANDING);
  };

  return (
    <React.Fragment>
      {currentScreen === AppScreen.LANDING && <LandingPage onContinueAs={handleLandingContinue} />}

      {currentScreen === AppScreen.PREFERENCES && userRole && (
        <>
          <PreferenceScreen
            userRole={userRole}
            initialPreferences={preferences}
            onComplete={handlePreferencesComplete}
            onSwitchPersona={switchRole}
            onSkip={handleSkipPreferences}
            onBack={handleBackFromPreferences}
          />
          <FloatingAssistant />
        </>
      )}

      {currentScreen === AppScreen.DASHBOARD && userRole && (
        <Dashboard
          userRole={userRole}
          userPreferences={preferences}
          onLogout={handleLogout}
          onSwitchPersona={switchRole}
          onEditPreferences={handleEditPreferences}
        />
      )}
    </React.Fragment>
  );
};

export default App;
