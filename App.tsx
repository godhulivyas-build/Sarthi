import React from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { useAppState } from './state/AppState';

const App: React.FC = () => {
  const { state } = useAppState();

  return (
    <React.Fragment>
      {state.currentScreen === 'landing' && <LandingPage />}
      {state.currentScreen === 'dashboard' && <Dashboard />}
    </React.Fragment>
  );
};

export default App;
