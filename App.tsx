import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { OnboardingWizard } from './components/v2/onboarding/OnboardingWizard';
import { RequireSession } from './components/v2/layout/RequireSession';
import { V2AppShell } from './components/v2/layout/V2AppShell';
import { useAppState } from './state/AppState';

const DashboardRouteSync: React.FC = () => {
  const { setCurrentScreen } = useAppState();
  useEffect(() => {
    setCurrentScreen('dashboard');
  }, [setCurrentScreen]);
  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <V2AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route
          path="/app"
          element={
            <RequireSession>
              <DashboardRouteSync />
            </RequireSession>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </V2AppShell>
  );
};

export default App;
