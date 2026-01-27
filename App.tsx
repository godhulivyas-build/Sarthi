import React, { useState } from 'react';
import { AppScreen, UserRole, UserPreferences, WalletState } from './types';
import { LoginScreen } from './components/LoginScreen';
import { PreferenceScreen } from './components/PreferenceScreen';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // Store preferences and wallet states for all roles
  const [preferencesMap, setPreferencesMap] = useState<Partial<Record<UserRole, UserPreferences>>>({});
  const [walletMap, setWalletMap] = useState<Partial<Record<UserRole, WalletState>>>({});
  
  // Derived state for current active user data
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [wallet, setWallet] = useState<WalletState>({ balance: 0, transactions: [] });

  const getInitialWallet = (role: UserRole): WalletState => {
    // Return distinct mock initial states based on role to simulate a real backend
    switch (role) {
      case UserRole.FARMER:
        return {
          balance: 12500,
          transactions: [
            { id: 't1', date: '2023-10-24', description: 'Advance for Onion Load', amount: 5000, type: 'credit', category: 'payment', status: 'completed' },
            { id: 't2', date: '2023-10-18', description: 'Transport to Vashi', amount: 2200, type: 'debit', category: 'payment', status: 'completed' },
            { id: 't3', date: '2023-10-10', description: 'Govt Subsidy Credit', amount: 4000, type: 'credit', category: 'incentive', status: 'completed' },
          ]
        };
      case UserRole.FPO:
        return {
          balance: 850000,
          transactions: [
            { id: 'f1', date: '2023-10-25', description: 'Bulk Shipment Payment', amount: 125000, type: 'credit', category: 'payment', status: 'completed' },
            { id: 'f2', date: '2023-10-22', description: 'Logistics Fleet Advance', amount: 45000, type: 'debit', category: 'payment', status: 'pending' },
            { id: 'f3', date: '2023-10-20', description: 'Market Cess Fee', amount: 1200, type: 'debit', category: 'payment', status: 'completed' },
          ]
        };
      case UserRole.BUYER:
        return {
          balance: 45000,
          transactions: [
             { id: 'b1', date: '2023-10-24', description: 'Payment for Order #992', amount: 25000, type: 'debit', category: 'payment', status: 'completed' },
             { id: 'b2', date: '2023-10-20', description: 'Wallet Top-up', amount: 50000, type: 'credit', category: 'payment', status: 'completed' },
          ]
        };
      case UserRole.TRANSPORTER:
         return {
          balance: 28000,
          transactions: [
             { id: 'tr1', date: '2023-10-25', description: 'Trip Earnings (Nashik-Mumbai)', amount: 8500, type: 'credit', category: 'payout', status: 'completed' },
             { id: 'tr2', date: '2023-10-23', description: 'Fuel Advance deduction', amount: 2000, type: 'debit', category: 'payment', status: 'completed' },
             { id: 'tr3', date: '2023-10-21', description: 'Vehicle Maintenance', amount: 1500, type: 'debit', category: 'payment', status: 'completed' },
          ]
         };
      default:
        return { balance: 0, transactions: [] };
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
  };

  const handlePreferencesComplete = (prefs: UserPreferences) => {
    if (userRole) {
      setPreferencesMap(prev => ({ ...prev, [userRole]: prefs }));
      setPreferences(prefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleSkipPreferences = () => {
    // If skipped, we still save an empty preferences object so we know the user has "visited" 
    // and doesn't get forced back to the setup screen immediately on next login/switch.
    // The Dashboard will handle showing the "Complete Profile" prompt.
    const emptyPrefs: UserPreferences = { location: '', primaryCrop: '', loadSize: '', urgency: 'Normal' };
    if (userRole) {
      setPreferencesMap(prev => ({ ...prev, [userRole]: emptyPrefs }));
      setPreferences(emptyPrefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    }
  };

  const handleEditPreferences = () => {
    setCurrentScreen(AppScreen.PREFERENCES);
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    
    // 1. Handle Preferences
    const existingPrefs = preferencesMap[role];
    if (existingPrefs) {
      setPreferences(existingPrefs);
      setCurrentScreen(AppScreen.DASHBOARD);
    } else {
      setPreferences(null);
      setCurrentScreen(AppScreen.PREFERENCES);
    }

    // 2. Handle Wallet
    let activeWallet = walletMap[role];
    if (!activeWallet) {
      activeWallet = getInitialWallet(role);
      // Save this new initial wallet to map so it persists
      setWalletMap(prev => ({ ...prev, [role]: activeWallet }));
    }
    setWallet(activeWallet);
  };

  const handleLogout = () => {
    setUserRole(null);
    setPreferences(null);
    setWallet({ balance: 0, transactions: [] });
    setCurrentScreen(AppScreen.LOGIN);
  };

  return (
    <React.Fragment>
      {currentScreen === AppScreen.LOGIN && (
        <LoginScreen onRoleSelect={handleRoleSelect} />
      )}
      
      {currentScreen === AppScreen.PREFERENCES && userRole && (
        <PreferenceScreen 
          userRole={userRole} 
          initialPreferences={preferences}
          onComplete={handlePreferencesComplete} 
          onSwitchPersona={switchRole}
          onSkip={handleSkipPreferences}
        />
      )}
      
      {currentScreen === AppScreen.DASHBOARD && userRole && (
        <Dashboard 
          userRole={userRole} 
          userPreferences={preferences}
          wallet={wallet}
          onLogout={handleLogout} 
          onSwitchPersona={switchRole}
          onEditPreferences={handleEditPreferences}
        />
      )}
    </React.Fragment>
  );
};

export default App;