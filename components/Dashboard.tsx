import React from 'react';
import { useAppState } from '../state/AppState';
import { useI18n } from '../i18n/I18nContext';
import { SaathiDidi } from './SaathiDidi';
import { CropDiscoveryView } from './dashboard/CropDiscoveryView';
import { BuyerOrdersView } from './dashboard/BuyerOrdersView';
import { ProduceManageView } from './dashboard/ProduceManageView';
import { PickupRequestView } from './dashboard/PickupRequestView';
import { LogisticsJobsView } from './dashboard/LogisticsJobsView';
import { WeatherWidget } from './dashboard/WeatherWidget';
import { MandiPricesPanel } from './dashboard/MandiPricesPanel';
import { GovAlertsPanel } from './dashboard/GovAlertsPanel';
import { Truck, Home, List, Package, Cloud, TrendingUp, Bell } from 'lucide-react';
import { listPickupRequests } from '../services/mvpDataService';
import type { PickupRequest } from '../types';

const FarmerRequests: React.FC = () => {
  const { t } = useI18n();
  const [items, setItems] = React.useState<PickupRequest[]>([]);
  React.useEffect(() => {
    listPickupRequests().then(setItems);
  }, []);
  return (
    <div className="p-4 pb-28">
      <h2 className="text-xl font-bold">{t('dashboard.myRequests')}</h2>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500">{t('dashboard.noRequests')}</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="bg-white border rounded-xl p-4">
              <p className="font-bold">{r.farmerName}</p>
              <p className="text-sm text-gray-600">
                {r.pickupLocation} → {r.dropLocation}
              </p>
              <span className="inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full bg-gray-100">{r.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { state, setCurrentDashboardView, logout, setCurrentScreen } = useAppState();
  const { t } = useI18n();

  const role = state.userRole;
  const dv = state.currentDashboardView;

  if (!role || !dv) return null;

  const setView = (view: any) => setCurrentDashboardView({ role, view } as any);

  const isHi = (useI18n()).lang === 'hi';
  const titleMap: Record<string, Record<string, string>> = {
    farmer: {
      home: t('dashboard.farmer'),
      book_vehicle: t('dashboard.book'),
      my_requests: t('dashboard.myRequests'),
      weather: isHi ? '🌤️ मौसम' : '🌤️ Weather',
      prices: isHi ? '📊 मंडी भाव' : '📊 Mandi Prices',
      alerts: isHi ? '🔔 सूचनाएं' : '🔔 Alerts',
    },
    transporter: { home: t('dashboard.driver'), jobs: t('dashboard.showJobs'), my_trips: t('dashboard.myTrips') },
    buyer: { home: t('dashboard.buyer'), browse: t('dashboard.browse'), orders: t('dashboard.myOrders') },
  };
  const title = titleMap[role]?.[dv.view] ?? '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Sarthi Setu" className="w-6 h-6 rounded" />
          <span className="font-bold text-lg">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            setCurrentScreen('landing');
          }}
          className="text-red-600 font-bold text-sm"
        >
          {t('profile.logout')}
        </button>
      </header>

      <main className="max-w-3xl mx-auto">
        {role === 'farmer' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            {/* Weather compact */}
            <button type="button" onClick={() => setView('weather')} className="w-full text-left">
              <WeatherWidget location="Indore" compact />
            </button>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setView('book_vehicle')} className="min-h-[64px] rounded-2xl bg-green-600 text-white font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow">
                <Truck className="w-5 h-5" />
                {t('dashboard.book')}
              </button>
              <button onClick={() => setView('my_requests')} className="min-h-[64px] rounded-2xl bg-white border-2 border-green-200 text-green-800 font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow">
                <List className="w-5 h-5" />
                {t('dashboard.myRequests')}
              </button>
              <button onClick={() => setView('prices')} className="min-h-[64px] rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow">
                <TrendingUp className="w-5 h-5" />
                {isHi ? 'मंडी भाव' : 'Mandi Prices'}
              </button>
              <button onClick={() => setView('alerts')} className="min-h-[64px] rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md transition-shadow">
                <Bell className="w-5 h-5" />
                {isHi ? 'सूचनाएं' : 'Alerts'}
              </button>
            </div>

            {/* Mandi prices compact */}
            <button type="button" onClick={() => setView('prices')} className="w-full text-left">
              <MandiPricesPanel compact />
            </button>

            {/* Alerts compact */}
            <button type="button" onClick={() => setView('alerts')} className="w-full text-left">
              <GovAlertsPanel compact />
            </button>
          </div>
        )}
        {role === 'farmer' && dv.view === 'book_vehicle' && <PickupRequestView preferences={null} />}
        {role === 'farmer' && dv.view === 'my_requests' && <FarmerRequests />}
        {role === 'farmer' && dv.view === 'weather' && (
          <div className="p-4 pb-28 space-y-4">
            <WeatherWidget location="Indore" />
          </div>
        )}
        {role === 'farmer' && dv.view === 'prices' && (
          <div className="p-4 pb-28 space-y-4">
            <MandiPricesPanel />
          </div>
        )}
        {role === 'farmer' && dv.view === 'alerts' && (
          <div className="p-4 pb-28 space-y-4">
            <GovAlertsPanel />
          </div>
        )}

        {role === 'transporter' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button onClick={() => setView('jobs')} className="w-full min-h-[56px] rounded-2xl bg-orange-600 text-white text-lg font-bold">
              {t('dashboard.showJobs')}
            </button>
            <button onClick={() => setView('my_trips')} className="w-full min-h-[56px] rounded-2xl bg-white border-2 text-orange-700 text-lg font-bold">
              {t('dashboard.myTrips')}
            </button>
          </div>
        )}
        {role === 'transporter' && dv.view === 'jobs' && <LogisticsJobsView preferences={null} />}
        {role === 'transporter' && dv.view === 'my_trips' && <LogisticsJobsView preferences={null} />}

        {role === 'buyer' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button onClick={() => setView('browse')} className="w-full min-h-[56px] rounded-2xl bg-purple-600 text-white text-lg font-bold">
              {t('dashboard.browse')}
            </button>
            <button onClick={() => setView('orders')} className="w-full min-h-[56px] rounded-2xl bg-white border-2 text-purple-700 text-lg font-bold">
              {t('dashboard.myOrders')}
            </button>
          </div>
        )}
        {role === 'buyer' && dv.view === 'browse' && <CropDiscoveryView preferences={null} />}
        {role === 'buyer' && dv.view === 'orders' && <BuyerOrdersView preferences={null} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <button type="button" onClick={() => setView('home')} className="flex flex-col items-center text-gray-600">
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t('dashboard.home')}</span>
        </button>
        {role === 'farmer' && (
          <button type="button" onClick={() => setView('prices')} className="flex flex-col items-center text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px]">{isHi ? 'भाव' : 'Prices'}</span>
          </button>
        )}
        {role === 'farmer' && (
          <button type="button" onClick={() => setView('weather')} className="flex flex-col items-center text-gray-600">
            <Cloud className="w-4 h-4" />
            <span className="text-[10px]">{isHi ? 'मौसम' : 'Weather'}</span>
          </button>
        )}
        {role === 'farmer' && (
          <button type="button" onClick={() => setView('alerts')} className="flex flex-col items-center text-gray-600">
            <Bell className="w-4 h-4" />
            <span className="text-[10px]">{isHi ? 'सूचना' : 'Alerts'}</span>
          </button>
        )}
        {role === 'transporter' && (
          <button type="button" onClick={() => setView('jobs')} className="flex flex-col items-center text-gray-600">
            <Truck className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.showJobs')}</span>
          </button>
        )}
        {role === 'transporter' && (
          <button type="button" onClick={() => setView('my_trips')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.myTrips')}</span>
          </button>
        )}
        {role === 'buyer' && (
          <button type="button" onClick={() => setView('browse')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.browse')}</span>
          </button>
        )}
        {role === 'buyer' && (
          <button type="button" onClick={() => setView('orders')} className="flex flex-col items-center text-gray-600">
            <Package className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.myOrders')}</span>
          </button>
        )}
      </nav>

      <SaathiDidi />
    </div>
  );
};
