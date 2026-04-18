import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useV2Session } from '../state/v2Session';
import { useI18n } from '../i18n/I18nContext';
import { SaathiDidi } from './SaathiDidi';
import { CropDiscoveryView } from './dashboard/CropDiscoveryView';
import { BuyerOrdersView } from './dashboard/BuyerOrdersView';
import { LogisticsJobsView } from './dashboard/LogisticsJobsView';
import { WeatherWidget } from './dashboard/WeatherWidget';
import { MandiPricesPanel } from './dashboard/MandiPricesPanel';
import { GovAlertsPanel } from './dashboard/GovAlertsPanel';
import { FPONearbyView } from './dashboard/FPONearbyView';
import { WalletView } from './dashboard/WalletView';
import { TrackingView } from './dashboard/TrackingView';
import { LogisticsBookingMapFlow } from './v2/farmer/LogisticsBookingMapFlow';
import { ColdStorageDashboard } from './v2/cold/ColdStorageDashboard';
import { AppHeader } from './v2/ui/AppHeader';
import type { Shipment, UserPreferences, WalletState } from '../types';
import { loadPayments } from '../services/payments/mockPayment';
import { listPickupRequests } from '../services/mvpDataService';
import type { PickupRequest } from '../types';
import {
  Truck,
  Home,
  List,
  Package,
  Cloud,
  TrendingUp,
  Bell,
  Users,
  IndianRupee,
  Warehouse,
  MapPin,
} from 'lucide-react';

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

const NearbyBuyersMock: React.FC = () => {
  const { t } = useI18n();
  const rows = [
    { n: 'Vyapari Co-op', c: 'Soybean', p: '₹ 4,550/q' },
    { n: 'Mandi Agent Ravi', c: 'Wheat', p: '₹ 2,280/q' },
  ];
  return (
    <div className="p-4 pb-28 space-y-3">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Users className="text-green-600" />
        {t('farmer.nearbyBuyers')}
      </h2>
      {rows.map((x) => (
        <div key={x.n} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex justify-between items-center">
          <div>
            <p className="font-bold">{x.n}</p>
            <p className="text-sm text-gray-600">{x.c}</p>
          </div>
          <span className="font-extrabold text-green-700">{x.p}</span>
        </div>
      ))}
    </div>
  );
};

const PaymentsList: React.FC = () => {
  const { tV2 } = useI18n();
  const rows = loadPayments();
  return (
    <div className="p-4 pb-28 space-y-4">
      <h2 className="text-xl font-bold">{tV2('v2.payment.title')}</h2>
      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm">No payments yet.</p>
      ) : (
        rows.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border p-4 shadow-sm text-sm space-y-2">
            <p className="font-bold text-green-700">{tV2('v2.payment.success')}</p>
            <p className="text-xs text-gray-500">{p.orderId}</p>
            <p className="font-semibold">{tV2('v2.payment.split')}</p>
            <ul className="text-xs space-y-1">
              <li>
                Farmer: ₹{p.split.farmer}
              </li>
              <li>
                Logistics: ₹{p.split.logistics}
              </li>
              <li>
                {tV2('v2.payment.platformFee')}: ₹{p.split.platform}
              </li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { state, setCurrentDashboardView, logout, setCurrentScreen } = useAppState();
  const { session, clearSession } = useV2Session();
  const { t, tV2, lang } = useI18n();
  const navigate = useNavigate();
  const isHi = lang === 'hi';

  const prefs: UserPreferences = useMemo(
    () => ({
      location: session.addressLabel || '',
      primaryCrop: '',
      loadSize: '',
      urgency: 'Normal',
    }),
    [session.addressLabel]
  );

  const weatherLoc = prefs.location?.trim() || 'Indore';

  const [wallet, setWallet] = useState<WalletState>({
    balance: 3200,
    transactions: [
      {
        id: '1',
        date: '2026-04-10',
        description: 'Market incentive',
        amount: 500,
        type: 'credit',
        category: 'incentive',
        status: 'completed',
      },
    ],
  });
  const [shipments] = useState<Shipment[]>([]);
  const [jobsRefresh, setJobsRefresh] = useState(0);

  const role = state.userRole;
  const dv = state.currentDashboardView;

  if (!role || !dv) return null;

  const setView = (view: (typeof dv)['view']) => setCurrentDashboardView({ role, view } as typeof dv);

  const titleMap: Record<string, Record<string, string>> = {
    farmer: {
      home: t('dashboard.farmer'),
      book_vehicle: t('dashboard.book'),
      my_requests: t('dashboard.myRequests'),
      weather: isHi ? '🌤️ मौसम' : '🌤️ Weather',
      prices: isHi ? '📊 मंडी भाव' : '📊 Mandi Prices',
      alerts: isHi ? '🔔 सूचनाएं' : '🔔 Alerts',
      nearby_buyers: t('farmer.nearbyBuyers'),
      cold_nearby: t('fpo.title'),
      wallet: isHi ? 'वॉलेट' : 'Wallet',
      payments: tV2('v2.payment.title'),
      track: t('nav.track'),
    },
    logistics_partner: {
      home: t('dashboard.driver'),
      jobs: t('dashboard.showJobs'),
      my_trips: t('dashboard.myTrips'),
      earnings: tV2('v2.logistics.earnings'),
      wallet: isHi ? 'वॉलेट' : 'Wallet',
    },
    buyer: {
      home: t('dashboard.buyer'),
      browse: t('dashboard.browse'),
      orders: t('dashboard.myOrders'),
      wallet: isHi ? 'वॉलेट' : 'Wallet',
      payments: tV2('v2.payment.title'),
    },
    cold_storage_owner: {
      home: t('landing.roleCold'),
      slots: tV2('v2.cold.slots'),
      requests: tV2('v2.cold.requests'),
      earnings: tV2('v2.logistics.earnings'),
    },
  };
  const title = titleMap[role]?.[dv.view] ?? '';

  const onLogout = () => {
    clearSession();
    logout();
    navigate('/');
    setCurrentScreen('landing');
  };

  return (
    <div className="pb-24 relative">
      <AppHeader title={title} onLogout={onLogout} />

      <main className="max-w-3xl mx-auto">
        {role === 'farmer' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button type="button" onClick={() => setView('weather')} className="w-full text-left">
              <WeatherWidget location={weatherLoc} compact />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setView('book_vehicle')}
                className="min-h-[64px] rounded-2xl bg-[var(--saarthi-primary)] text-white font-bold text-sm flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <Truck className="w-5 h-5" />
                {t('dashboard.book')}
              </button>
              <button
                type="button"
                onClick={() => setView('my_requests')}
                className="min-h-[64px] rounded-2xl bg-white border-2 border-[var(--saarthi-primary-container)] text-[var(--saarthi-primary)] font-bold text-sm flex flex-col items-center justify-center gap-1"
              >
                <List className="w-5 h-5" />
                {t('dashboard.myRequests')}
              </button>
              <button
                type="button"
                onClick={() => setView('prices')}
                className="min-h-[64px] rounded-2xl bg-[var(--saarthi-surface-low)] border-2 border-[var(--saarthi-surface-high)] text-[var(--saarthi-on-surface)] font-bold text-sm flex flex-col items-center justify-center gap-1"
              >
                <TrendingUp className="w-5 h-5" />
                {isHi ? 'मंडी भाव' : 'Mandi'}
              </button>
              <button
                type="button"
                onClick={() => setView('alerts')}
                className="min-h-[64px] rounded-2xl bg-orange-50 border-2 border-[var(--saarthi-secondary-container)] text-[var(--saarthi-secondary)] font-bold text-sm flex flex-col items-center justify-center gap-1"
              >
                <Bell className="w-5 h-5" />
                {isHi ? 'सूचना' : 'Alerts'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setView('nearby_buyers')}
                className="min-h-[52px] rounded-2xl bg-white border text-sm font-bold text-gray-800"
              >
                {t('farmer.nearbyBuyers')}
              </button>
              <button
                type="button"
                onClick={() => setView('cold_nearby')}
                className="min-h-[52px] rounded-2xl bg-white border text-sm font-bold text-gray-800 flex items-center justify-center gap-1"
              >
                <Warehouse className="w-4 h-4" /> Cold
              </button>
              <button type="button" onClick={() => setView('wallet')} className="min-h-[52px] rounded-2xl bg-white border text-sm font-bold">
                {isHi ? 'वॉलेट' : 'Wallet'}
              </button>
              <button type="button" onClick={() => setView('payments')} className="min-h-[52px] rounded-2xl bg-white border text-sm font-bold flex items-center justify-center gap-1">
                <IndianRupee className="w-4 h-4" /> Pay
              </button>
            </div>
            <button type="button" onClick={() => setView('prices')} className="w-full text-left">
              <MandiPricesPanel compact />
            </button>
            <button type="button" onClick={() => setView('alerts')} className="w-full text-left">
              <GovAlertsPanel compact />
            </button>
          </div>
        )}
        {role === 'farmer' && dv.view === 'book_vehicle' && (
          <LogisticsBookingMapFlow preferences={prefs} onDone={() => setJobsRefresh((k) => k + 1)} />
        )}
        {role === 'farmer' && dv.view === 'my_requests' && <FarmerRequests />}
        {role === 'farmer' && dv.view === 'weather' && (
          <div className="p-4 pb-28 space-y-4">
            <WeatherWidget location={weatherLoc} />
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
        {role === 'farmer' && dv.view === 'nearby_buyers' && <NearbyBuyersMock />}
        {role === 'farmer' && dv.view === 'cold_nearby' && (
          <div className="p-4 pb-28">
            <FPONearbyView />
          </div>
        )}
        {role === 'farmer' && dv.view === 'wallet' && <WalletView wallet={wallet} />}
        {role === 'farmer' && dv.view === 'payments' && <PaymentsList />}
        {role === 'farmer' && dv.view === 'track' && (
          <div className="p-4 pb-28">
            <TrackingView activeShipments={shipments} />
          </div>
        )}

        {role === 'logistics_partner' && dv.view === 'home' && (
          <div className="p-4 space-y-3 pb-28">
            <button
              type="button"
              onClick={() => setView('jobs')}
              className="w-full min-h-[56px] rounded-2xl bg-[var(--saarthi-secondary-container)] text-white text-lg font-bold shadow-md"
            >
              {t('dashboard.showJobs')}
            </button>
            <button
              type="button"
              onClick={() => setView('my_trips')}
              className="w-full min-h-[56px] rounded-2xl bg-white border-2 border-[var(--saarthi-secondary)] text-[var(--saarthi-secondary)] text-lg font-bold"
            >
              {t('dashboard.myTrips')}
            </button>
            <button type="button" onClick={() => setView('earnings')} className="w-full min-h-[48px] rounded-2xl bg-white border font-bold">
              {tV2('v2.logistics.earnings')}
            </button>
            <button type="button" onClick={() => setView('wallet')} className="w-full min-h-[48px] rounded-2xl bg-white border font-bold">
              {isHi ? 'वॉलेट' : 'Wallet'}
            </button>
          </div>
        )}
        {role === 'logistics_partner' && dv.view === 'jobs' && (
          <LogisticsJobsView preferences={prefs} refreshKey={jobsRefresh} listMode="open" />
        )}
        {role === 'logistics_partner' && dv.view === 'my_trips' && (
          <LogisticsJobsView preferences={prefs} refreshKey={jobsRefresh} listMode="mine" />
        )}
        {role === 'logistics_partner' && dv.view === 'earnings' && (
          <div className="p-4 pb-28 space-y-3">
            <p className="text-lg font-bold">{tV2('v2.logistics.earnings')}</p>
            <div className="rounded-2xl bg-white border p-4">
              <p className="text-2xl font-extrabold text-[var(--saarthi-primary)]">₹ 8,200</p>
              <p className="text-xs text-gray-500 mt-1">This week (demo)</p>
            </div>
          </div>
        )}
        {role === 'logistics_partner' && dv.view === 'wallet' && <WalletView wallet={wallet} />}

        {role === 'buyer' && dv.view === 'home' && (
          <div className="p-4 space-y-3 pb-28">
            <button
              type="button"
              onClick={() => setView('browse')}
              className="w-full min-h-[56px] rounded-2xl bg-[var(--saarthi-primary-container)] text-white text-lg font-bold shadow-md"
            >
              {t('dashboard.browse')}
            </button>
            <button
              type="button"
              onClick={() => setView('orders')}
              className="w-full min-h-[56px] rounded-2xl bg-white border-2 border-[var(--saarthi-primary)] text-[var(--saarthi-primary)] text-lg font-bold"
            >
              {t('dashboard.myOrders')}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setView('wallet')} className="min-h-[48px] rounded-xl bg-white border font-bold text-sm">
                Wallet
              </button>
              <button type="button" onClick={() => setView('payments')} className="min-h-[48px] rounded-xl bg-white border font-bold text-sm">
                {tV2('v2.payment.title')}
              </button>
            </div>
          </div>
        )}
        {role === 'buyer' && dv.view === 'browse' && <CropDiscoveryView preferences={prefs} />}
        {role === 'buyer' && dv.view === 'orders' && <BuyerOrdersView preferences={prefs} />}
        {role === 'buyer' && dv.view === 'wallet' && <WalletView wallet={wallet} />}
        {role === 'buyer' && dv.view === 'payments' && <PaymentsList />}

        {role === 'cold_storage_owner' && <ColdStorageDashboard view={dv.view} />}
      </main>

      {(role === 'farmer' || role === 'logistics_partner') && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 safe-area-pb">
          <button type="button" onClick={() => setView('home')} className="flex flex-col items-center text-gray-600">
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.home')}</span>
          </button>
          {role === 'farmer' && (
            <>
              <button type="button" onClick={() => setView('prices')} className="flex flex-col items-center text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[10px]">{isHi ? 'भाव' : 'Prices'}</span>
              </button>
              <button type="button" onClick={() => setView('weather')} className="flex flex-col items-center text-gray-600">
                <Cloud className="w-4 h-4" />
                <span className="text-[10px]">{isHi ? 'मौसम' : 'Weather'}</span>
              </button>
              <button type="button" onClick={() => setView('track')} className="flex flex-col items-center text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px]">{t('nav.track')}</span>
              </button>
            </>
          )}
          {role === 'logistics_partner' && (
            <>
              <button type="button" onClick={() => setView('jobs')} className="flex flex-col items-center text-gray-600">
                <Truck className="w-5 h-5" />
                <span className="text-[10px]">{t('dashboard.showJobs')}</span>
              </button>
              <button type="button" onClick={() => setView('my_trips')} className="flex flex-col items-center text-gray-600">
                <List className="w-5 h-5" />
                <span className="text-[10px]">{t('dashboard.myTrips')}</span>
              </button>
            </>
          )}
        </nav>
      )}

      {role === 'buyer' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
          <button type="button" onClick={() => setView('home')} className="flex flex-col items-center text-gray-600">
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.home')}</span>
          </button>
          <button type="button" onClick={() => setView('browse')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.browse')}</span>
          </button>
          <button type="button" onClick={() => setView('orders')} className="flex flex-col items-center text-gray-600">
            <Package className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.myOrders')}</span>
          </button>
        </nav>
      )}

      {role === 'cold_storage_owner' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
          <button type="button" onClick={() => setView('home')} className="flex flex-col items-center text-gray-600">
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{t('dashboard.home')}</span>
          </button>
          <button type="button" onClick={() => setView('slots')} className="flex flex-col items-center text-gray-600">
            <Warehouse className="w-5 h-5" />
            <span className="text-[10px]">{tV2('v2.cold.slots')}</span>
          </button>
          <button type="button" onClick={() => setView('requests')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{tV2('v2.cold.requests')}</span>
          </button>
          <button type="button" onClick={() => setView('earnings')} className="flex flex-col items-center text-gray-600">
            <IndianRupee className="w-5 h-5" />
            <span className="text-[10px]">{tV2('v2.logistics.earnings')}</span>
          </button>
        </nav>
      )}

      <SaathiDidi />
    </div>
  );
};
